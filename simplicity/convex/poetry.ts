import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const AddPoetry = mutation({
  args: {
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError(
        "Unauthenticated User Are Not Allowed For This Operation"
      );
    }
    await ctx.db.insert("poetry", {
      username: identity?.nickname || "",
      description: args.description,
      content: args.content,
    });
  },
});

export const getPoetry = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("poetry")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const updatePoetry = mutation({
  args: {
    id: v.id("poetry"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description,
      content: args.content,
    });
  },
});

export const getPoetryById = query({
  args: {
    id: v.id("poetry"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError(
        "Unauthenticated User Are Not Allowed For This Operation"
      );
    }
    return {
      viewer: identity,
      poetry: await ctx.db.get(args.id),
    };
  },
});

export const getViewerPoetries = query({
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError(
        "Unauthenticated User Are Not Allowed For This Operation"
      );
    }
    return {
      viewer: identity,
      poetries: await ctx.db
        .query("poetry")
        .filter((q) => q.eq(q.field("username"), identity?.nickname))
        .order("desc")
        .collect(),
    };
  },
});

export const deletePoetry = mutation({
  args: { id: v.id("poetry") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getLikedPoetries = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError(
        "Unauthenticated User Are Not Allowed For This Operation"
      );
    }
    const userId = identity.subject;

    const likes = await ctx.db
      .query("likes")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .collect();

    const likedPoetries = [];
    for (const like of likes) {
      const poetry = await ctx.db
        .query("poetry")
        .filter((q) => q.eq(q.field("_id"), like.poetryId))
        .unique();
      likedPoetries.push(poetry);
    }

    return likedPoetries;
  },
});
