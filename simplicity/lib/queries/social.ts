import "server-only";
import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  collection,
  collectionItem,
  comment,
  follow,
  user,
  writing,
} from "@/lib/db/schema";

export async function getProfile(username: string, viewerId?: string | null) {
  const [row] = await db
    .select({
      id: user.id,
      name: user.name,
      username: user.username,
      image: user.image,
      bio: user.bio,
      website: user.website,
      createdAt: user.createdAt,
      followers: sql<number>`(select count(*)::int from ${follow} where ${follow.followingId} = ${user.id})`,
      following: sql<number>`(select count(*)::int from ${follow} where ${follow.followerId} = ${user.id})`,
      writings: sql<number>`(select count(*)::int from ${writing} where ${writing.authorId} = ${user.id} and ${writing.status} = 'published')`,
      isFollowing: viewerId
        ? sql<boolean>`exists(select 1 from ${follow} where ${follow.followingId} = ${user.id} and ${follow.followerId} = ${viewerId})`
        : sql<boolean>`false`,
    })
    .from(user)
    .where(eq(user.username, username.toLowerCase()))
    .limit(1);
  return row ?? null;
}

export type Profile = NonNullable<Awaited<ReturnType<typeof getProfile>>>;

export async function getFollowList(userId: string, kind: "followers" | "following") {
  const join =
    kind === "followers"
      ? eq(user.id, follow.followerId)
      : eq(user.id, follow.followingId);
  const where =
    kind === "followers" ? eq(follow.followingId, userId) : eq(follow.followerId, userId);
  return db
    .select({ id: user.id, name: user.name, username: user.username, image: user.image, bio: user.bio })
    .from(follow)
    .innerJoin(user, join)
    .where(where)
    .orderBy(desc(follow.createdAt))
    .limit(100);
}

export async function getComments(writingId: string) {
  return db
    .select({
      id: comment.id,
      body: comment.body,
      parentId: comment.parentId,
      createdAt: comment.createdAt,
      author: { id: user.id, name: user.name, username: user.username, image: user.image },
    })
    .from(comment)
    .innerJoin(user, eq(user.id, comment.authorId))
    .where(eq(comment.writingId, writingId))
    .orderBy(asc(comment.createdAt));
}

export type CommentRow = Awaited<ReturnType<typeof getComments>>[number];

export async function getCollections(userId: string, opts: { includePrivate: boolean }) {
  return db
    .select({
      id: collection.id,
      name: collection.name,
      description: collection.description,
      isPublic: collection.isPublic,
      updatedAt: collection.updatedAt,
      count: sql<number>`(select count(*)::int from ${collectionItem} where ${collectionItem.collectionId} = ${collection.id})`,
    })
    .from(collection)
    .where(
      opts.includePrivate
        ? eq(collection.userId, userId)
        : and(eq(collection.userId, userId), eq(collection.isPublic, true)),
    )
    .orderBy(desc(collection.updatedAt));
}

/** Collections of the viewer with a flag for whether a writing is in each. */
export async function getCollectionsFor(viewerId: string, writingId: string) {
  return db
    .select({
      id: collection.id,
      name: collection.name,
      contains: sql<boolean>`exists(select 1 from ${collectionItem} where ${collectionItem.collectionId} = ${collection.id} and ${collectionItem.writingId} = ${writingId})`,
    })
    .from(collection)
    .where(eq(collection.userId, viewerId))
    .orderBy(desc(collection.updatedAt));
}

export async function getCollection(id: string, viewerId?: string | null) {
  const [row] = await db
    .select({
      id: collection.id,
      name: collection.name,
      description: collection.description,
      isPublic: collection.isPublic,
      userId: collection.userId,
      owner: { name: user.name, username: user.username, image: user.image },
    })
    .from(collection)
    .innerJoin(user, eq(user.id, collection.userId))
    .where(eq(collection.id, id))
    .limit(1);
  if (!row) return null;
  if (!row.isPublic && row.userId !== viewerId) return null;

  const items = await db
    .select({
      id: writing.id,
      slug: writing.slug,
      type: writing.type,
      form: writing.form,
      title: writing.title,
      excerpt: writing.excerpt,
      readingMinutes: writing.readingMinutes,
      authorName: user.name,
      username: user.username,
    })
    .from(collectionItem)
    .innerJoin(writing, eq(writing.id, collectionItem.writingId))
    .innerJoin(user, eq(user.id, writing.authorId))
    .where(and(eq(collectionItem.collectionId, id), eq(writing.status, "published")))
    .orderBy(desc(collectionItem.addedAt));

  return { ...row, items };
}

export async function searchAuthors(q: string, limit = 5) {
  const term = `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
  return db
    .select({ id: user.id, name: user.name, username: user.username, image: user.image })
    .from(user)
    .where(and(sql`${user.username} is not null`, or(ilike(user.username, term), ilike(user.name, term))))
    .limit(limit);
}

export async function getSuggestedAuthors(viewerId?: string | null, limit = 4) {
  return db
    .select({
      id: user.id,
      name: user.name,
      username: user.username,
      image: user.image,
      bio: user.bio,
      writings: sql<number>`count(${writing.id})::int`,
    })
    .from(user)
    .innerJoin(writing, and(eq(writing.authorId, user.id), eq(writing.status, "published")))
    .where(
      viewerId
        ? sql`${user.id} <> ${viewerId} and not exists(select 1 from ${follow} where ${follow.followerId} = ${viewerId} and ${follow.followingId} = ${user.id})`
        : undefined,
    )
    .groupBy(user.id)
    .orderBy(desc(sql`count(${writing.id})`))
    .limit(limit);
}
