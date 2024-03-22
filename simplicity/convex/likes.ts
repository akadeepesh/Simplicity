import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const LikePoetry = mutation({
  args: {
    poetryId: v.id("poetry"),
    userId: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.insert("likes", {
      poetryId: args.poetryId,
      userId: args.userId,
    });
  },
});

export const NumberOfLikes = query({
  args: {},
  async handler(ctx, args) {
    return ctx.db.query("likes").collect();
  },
});

export const UnlikePoetry = mutation({
  args: {
    poetryId: v.id("poetry"),
    userId: v.string(),
  },
  async handler(ctx, args) {
    const like = await ctx.db
      .query("likes")
      .filter(
        (q) =>
          q.eq(q.field("poetryId"), args.poetryId) &&
          q.eq(q.field("userId"), args.userId)
      )
      .first();

    if (like) {
      await ctx.db.delete(like._id);
    }
  },
});
