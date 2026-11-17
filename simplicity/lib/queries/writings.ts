import "server-only";
import { and, desc, eq, exists, ilike, inArray, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  bookmark,
  comment,
  follow,
  like,
  tag,
  user,
  writing,
  writingTag,
  type WritingType,
} from "@/lib/db/schema";

export const PAGE_SIZE = 12;

export type FeedSort = "latest" | "trending" | "top" | "foryou";

export type FeedParams = {
  sort?: FeedSort;
  type?: WritingType;
  form?: string;
  tag?: string;
  authorId?: string;
  following?: boolean;
  likedBy?: string;
  bookmarkedBy?: string;
  q?: string;
  page?: number;
};

/** Freshness-weighted recent likes. */
const trendingScore = sql`((select count(*) from ${like} where ${like.writingId} = ${writing.id} and ${like.createdAt} > now() - interval '14 days') + 1) / power(extract(epoch from (now() - ${writing.publishedAt})) / 3600 + 2, 0.8)`;

const likeCount = sql<number>`(select count(*)::int from ${like} where ${like.writingId} = ${writing.id})`;
const commentCount = sql<number>`(select count(*)::int from ${comment} where ${comment.writingId} = ${writing.id})`;

function viewerFlags(viewerId: string | null | undefined) {
  if (!viewerId) {
    return { liked: sql<boolean>`false`, bookmarked: sql<boolean>`false` };
  }
  return {
    liked: sql<boolean>`exists(select 1 from ${like} where ${like.writingId} = ${writing.id} and ${like.userId} = ${viewerId})`,
    bookmarked: sql<boolean>`exists(select 1 from ${bookmark} where ${bookmark.writingId} = ${writing.id} and ${bookmark.userId} = ${viewerId})`,
  };
}

const cardColumns = (viewerId?: string | null) => ({
  id: writing.id,
  slug: writing.slug,
  type: writing.type,
  form: writing.form,
  title: writing.title,
  subtitle: writing.subtitle,
  excerpt: writing.excerpt,
  wordCount: writing.wordCount,
  readingMinutes: writing.readingMinutes,
  publishedAt: writing.publishedAt,
  author: {
    id: user.id,
    name: user.name,
    username: user.username,
    image: user.image,
  },
  likeCount,
  commentCount,
  ...viewerFlags(viewerId),
});

export type WritingCard = Awaited<ReturnType<typeof getFeed>>["items"][number];

export async function getFeed(params: FeedParams, viewerId?: string | null) {
  const page = Math.max(0, params.page ?? 0);
  const where: SQL[] = [eq(writing.status, "published")];

  if (params.type) where.push(eq(writing.type, params.type));
  if (params.form) where.push(eq(writing.form, params.form));
  if (params.authorId) where.push(eq(writing.authorId, params.authorId));

  if (params.tag) {
    where.push(
      exists(
        db
          .select({ one: sql`1` })
          .from(writingTag)
          .innerJoin(tag, eq(tag.id, writingTag.tagId))
          .where(and(eq(writingTag.writingId, writing.id), eq(tag.slug, params.tag))),
      ),
    );
  }

  if (params.following && viewerId) {
    where.push(
      inArray(
        writing.authorId,
        db
          .select({ id: follow.followingId })
          .from(follow)
          .where(eq(follow.followerId, viewerId)),
      ),
    );
  }

  if (params.sort === "foryou" && viewerId) {
    where.push(sql`${writing.authorId} <> ${viewerId}`);
  }

  if (params.likedBy) {
    where.push(
      sql`exists(select 1 from ${like} where ${like.writingId} = ${writing.id} and ${like.userId} = ${params.likedBy})`,
    );
  }

  if (params.bookmarkedBy) {
    where.push(
      sql`exists(select 1 from ${bookmark} where ${bookmark.writingId} = ${writing.id} and ${bookmark.userId} = ${params.bookmarkedBy})`,
    );
  }

  const q = params.q?.trim();
  let rank: SQL | undefined;
  if (q) {
    const tsq = sql`websearch_to_tsquery('english', ${q})`;
    where.push(
      or(
        sql`${writing.search} @@ ${tsq}`,
        ilike(writing.title, `%${escapeLike(q)}%`),
        ilike(user.username, `%${escapeLike(q)}%`),
        ilike(user.name, `%${escapeLike(q)}%`),
      )!,
    );
    rank = sql`ts_rank(${writing.search}, ${tsq})`;
  }

  const order: SQL[] = [];
  if (rank) order.push(desc(rank));
  switch (params.sort) {
    case "top":
      order.push(desc(likeCount));
      break;
    case "foryou":
      order.push(desc(sql`(${affinity(viewerId)} + 1) * ${trendingScore}`));
      break;
    case "trending":
      order.push(
        desc(
          sql`((select count(*) from ${like} where ${like.writingId} = ${writing.id} and ${like.createdAt} > now() - interval '14 days') + 1) / power(extract(epoch from (now() - ${writing.publishedAt})) / 3600 + 2, 0.8)`,
        ),
      );
      break;
  }
  order.push(desc(writing.publishedAt));

  const rows = await db
    .select(cardColumns(viewerId))
    .from(writing)
    .innerJoin(user, eq(user.id, writing.authorId))
    .where(and(...where))
    .orderBy(...order)
    .limit(PAGE_SIZE + 1)
    .offset(page * PAGE_SIZE);

  return {
    items: rows.slice(0, PAGE_SIZE),
    nextPage: rows.length > PAGE_SIZE ? page + 1 : null,
  };
}

/**
 * How close a writing is to the viewer's taste: followed author (+3), shared tags with
 * writings they loved (+1 each), and a type they tend to love (+1).
 */
function affinity(viewerId: string | null | undefined): SQL {
  if (!viewerId) return sql`0`;
  return sql`(
    (case when exists(select 1 from ${follow} where ${follow.followerId} = ${viewerId} and ${follow.followingId} = ${writing.authorId}) then 3 else 0 end)
    + (select count(*) from ${writingTag} wt where wt.writing_id = ${writing.id} and wt.tag_id in (
        select wt2.tag_id from ${like} l join ${writingTag} wt2 on wt2.writing_id = l.writing_id where l.user_id = ${viewerId}))
    + (case when ${writing.type} in (
        select w3.type from ${like} l3 join ${writing} w3 on w3.id = l3.writing_id where l3.user_id = ${viewerId}) then 1 else 0 end)
  )`;
}

function escapeLike(s: string) {
  return s.replace(/[\\%_]/g, (c) => `\\${c}`);
}

export async function getWritingBySlug(slug: string, viewerId?: string | null) {
  const [row] = await db
    .select({
      ...cardColumns(viewerId),
      content: writing.content,
      status: writing.status,
      updatedAt: writing.updatedAt,
      authorBio: user.bio,
    })
    .from(writing)
    .innerJoin(user, eq(user.id, writing.authorId))
    .where(eq(writing.slug, slug))
    .limit(1);

  if (!row) return null;
  if (row.status !== "published" && row.author.id !== viewerId) return null;

  const tags = await getTagsFor(row.id);
  return { ...row, tags };
}

export type FullWriting = NonNullable<Awaited<ReturnType<typeof getWritingBySlug>>>;

export async function getTagsFor(writingId: string) {
  return db
    .select({ name: tag.name, slug: tag.slug })
    .from(writingTag)
    .innerJoin(tag, eq(tag.id, writingTag.tagId))
    .where(eq(writingTag.writingId, writingId))
    .orderBy(tag.name);
}

/** For the editor: only the owner may load. */
export async function getEditableWriting(id: string, viewerId: string) {
  const [row] = await db
    .select()
    .from(writing)
    .where(and(eq(writing.id, id), eq(writing.authorId, viewerId)))
    .limit(1);
  if (!row) return null;
  const tags = await getTagsFor(row.id);
  return { ...row, tags };
}

export async function getMoreFromAuthor(authorId: string, excludeId: string) {
  return db
    .select({
      id: writing.id,
      slug: writing.slug,
      type: writing.type,
      form: writing.form,
      title: writing.title,
      excerpt: writing.excerpt,
      publishedAt: writing.publishedAt,
    })
    .from(writing)
    .where(
      and(
        eq(writing.authorId, authorId),
        eq(writing.status, "published"),
        sql`${writing.id} <> ${excludeId}`,
      ),
    )
    .orderBy(desc(writing.publishedAt))
    .limit(3);
}

export async function getDrafts(viewerId: string) {
  return db
    .select({
      id: writing.id,
      type: writing.type,
      title: writing.title,
      excerpt: writing.excerpt,
      wordCount: writing.wordCount,
      updatedAt: writing.updatedAt,
    })
    .from(writing)
    .where(and(eq(writing.authorId, viewerId), eq(writing.status, "draft")))
    .orderBy(desc(writing.updatedAt));
}

export async function getPopularTags(limit = 24) {
  return db
    .select({
      name: tag.name,
      slug: tag.slug,
      count: sql<number>`count(*)::int`,
    })
    .from(tag)
    .innerJoin(writingTag, eq(writingTag.tagId, tag.id))
    .innerJoin(writing, eq(writing.id, writingTag.writingId))
    .where(eq(writing.status, "published"))
    .groupBy(tag.id)
    .orderBy(desc(sql`count(*)`), tag.name)
    .limit(limit);
}

export async function getTypeCounts() {
  const rows = await db
    .select({ type: writing.type, count: sql<number>`count(*)::int` })
    .from(writing)
    .where(eq(writing.status, "published"))
    .groupBy(writing.type);
  return Object.fromEntries(rows.map((r) => [r.type, r.count])) as Partial<
    Record<WritingType, number>
  >;
}

/** A single short piece for the homepage hero. */
export async function getSpotlight() {
  const [row] = await db
    .select({
      slug: writing.slug,
      type: writing.type,
      title: writing.title,
      excerpt: writing.excerpt,
      authorName: user.name,
      username: user.username,
    })
    .from(writing)
    .innerJoin(user, eq(user.id, writing.authorId))
    .where(
      and(
        eq(writing.status, "published"),
        sql`${writing.wordCount} between 4 and 80`,
        inArray(writing.type, ["poetry", "micro"]),
      ),
    )
    .orderBy(desc(likeCount), desc(writing.publishedAt))
    .limit(1);
  return row ?? null;
}
