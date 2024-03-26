import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const LikePoetry = mutation({
  args: {
    poetryId: v.id("poetry"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to mutation");
    }
    const userId = identity.subject;
    await ctx.db.insert("likes", {
      poetryId: args.poetryId,
      userId: userId,
    });
  },
});

export const LikesData = query({
  async handler(ctx) {
    return ctx.db.query("likes").collect();
  },
});

export const unlikePoetry = mutation({
  args: {
    poetryId: v.id("poetry"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to mutation");
    }

    const userId = identity.subject;

    const like = await ctx.db
      .query("likes")
      .filter((q) => q.eq(q.field("poetryId"), args.poetryId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .unique();

    if (like) {
      await ctx.db.delete(like._id);
    }
  },
});

export const DeleteAllLikesByPoetryId = mutation({
  args: {
    poetryId: v.id("poetry"),
  },
  async handler(ctx, args) {
    let like = await ctx.db
      .query("likes")
      .filter((q) => q.eq(q.field("poetryId"), args.poetryId))
      .first();

    while (like) {
      await ctx.db.delete(like._id);
      like = await ctx.db
        .query("likes")
        .filter((q) => q.eq(q.field("poetryId"), args.poetryId))
        .first();
    }
  },
});
