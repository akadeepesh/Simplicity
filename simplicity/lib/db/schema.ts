import { relations, sql, type SQL } from "drizzle-orm";
import {
  boolean,
  customType,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

const tsvector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});

const createdAt = () =>
  timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());

/* ------------------------------------------------------------------ */
/* Auth (Better Auth)                                                  */
/* ------------------------------------------------------------------ */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  username: text("username").unique(),
  displayUsername: text("display_username"),
  bio: text("bio"),
  website: text("website"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("session_user_idx").on(t.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("account_user_idx").on(t.userId)],
);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

/* ------------------------------------------------------------------ */
/* Writings                                                            */
/* ------------------------------------------------------------------ */

export const writingType = pgEnum("writing_type", [
  "poetry",
  "story",
  "essay",
  "micro",
]);

export const writingStatus = pgEnum("writing_status", ["draft", "published"]);

export const writing = pgTable(
  "writing",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: writingType("type").notNull().default("poetry"),
    form: text("form"),
    title: text("title"),
    subtitle: text("subtitle"),
    content: text("content").notNull().default(""),
    plainText: text("plain_text").notNull().default(""),
    excerpt: text("excerpt").notNull().default(""),
    slug: text("slug").notNull().unique(),
    status: writingStatus("status").notNull().default("draft"),
    wordCount: integer("word_count").notNull().default(0),
    readingMinutes: integer("reading_minutes").notNull().default(1),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    search: tsvector("search").generatedAlwaysAs(
      (): SQL =>
        sql`setweight(to_tsvector('english', coalesce(${writing.title}, '')), 'A') || setweight(to_tsvector('english', coalesce(${writing.subtitle}, '')), 'B') || setweight(to_tsvector('english', ${writing.plainText}), 'C')`,
    ),
  },
  (t) => [
    index("writing_author_idx").on(t.authorId, t.status),
    index("writing_feed_idx").on(t.status, t.publishedAt),
    index("writing_type_idx").on(t.type, t.form),
    index("writing_search_idx").using("gin", t.search),
  ],
);

export const tag = pgTable("tag", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const writingTag = pgTable(
  "writing_tag",
  {
    writingId: uuid("writing_id")
      .notNull()
      .references(() => writing.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.writingId, t.tagId] }),
    index("writing_tag_tag_idx").on(t.tagId),
  ],
);

/* ------------------------------------------------------------------ */
/* Social                                                              */
/* ------------------------------------------------------------------ */

export const like = pgTable(
  "like",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    writingId: uuid("writing_id")
      .notNull()
      .references(() => writing.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.writingId] }),
    index("like_writing_idx").on(t.writingId, t.createdAt),
  ],
);

export const bookmark = pgTable(
  "bookmark",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    writingId: uuid("writing_id")
      .notNull()
      .references(() => writing.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.writingId] })],
);

export const collection = pgTable(
  "collection",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    isPublic: boolean("is_public").notNull().default(true),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("collection_user_idx").on(t.userId)],
);

export const collectionItem = pgTable(
  "collection_item",
  {
    collectionId: uuid("collection_id")
      .notNull()
      .references(() => collection.id, { onDelete: "cascade" }),
    writingId: uuid("writing_id")
      .notNull()
      .references(() => writing.id, { onDelete: "cascade" }),
    addedAt: timestamp("added_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.collectionId, t.writingId] })],
);

export const comment = pgTable(
  "comment",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    writingId: uuid("writing_id")
      .notNull()
      .references(() => writing.id, { onDelete: "cascade" }),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    parentId: uuid("parent_id"),
    body: text("body").notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    index("comment_writing_idx").on(t.writingId, t.createdAt),
    index("comment_parent_idx").on(t.parentId),
  ],
);

export const follow = pgTable(
  "follow",
  {
    followerId: text("follower_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    followingId: text("following_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
  },
  (t) => [
    primaryKey({ columns: [t.followerId, t.followingId] }),
    index("follow_following_idx").on(t.followingId),
  ],
);

export const reportReason = pgEnum("report_reason", [
  "spam",
  "plagiarism",
  "harassment",
  "explicit",
  "other",
]);

export const report = pgTable(
  "report",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reporterId: text("reporter_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    writingId: uuid("writing_id").references(() => writing.id, {
      onDelete: "cascade",
    }),
    commentId: uuid("comment_id").references(() => comment.id, {
      onDelete: "cascade",
    }),
    reason: reportReason("reason").notNull(),
    details: text("details"),
    resolved: boolean("resolved").notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex("report_unique_writing_idx")
      .on(t.reporterId, t.writingId)
      .where(sql`${t.writingId} is not null`),
  ],
);

/* ------------------------------------------------------------------ */
/* Relations                                                           */
/* ------------------------------------------------------------------ */

export const userRelations = relations(user, ({ many }) => ({
  writings: many(writing),
}));

export const writingRelations = relations(writing, ({ one, many }) => ({
  author: one(user, { fields: [writing.authorId], references: [user.id] }),
  tags: many(writingTag),
}));

export const writingTagRelations = relations(writingTag, ({ one }) => ({
  writing: one(writing, {
    fields: [writingTag.writingId],
    references: [writing.id],
  }),
  tag: one(tag, { fields: [writingTag.tagId], references: [tag.id] }),
}));

export type User = typeof user.$inferSelect;
export type Writing = typeof writing.$inferSelect;
export type WritingType = (typeof writingType.enumValues)[number];
export type ReportReason = (typeof reportReason.enumValues)[number];
