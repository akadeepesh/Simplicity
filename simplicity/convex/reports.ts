import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const ReportPoetry = mutation({
  args: {
    poetryId: v.id("poetry"),
    topic: v.string(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to mutation");
    }
    const userId = identity.subject;
    await ctx.db.insert("reports", {
      poetryId: args.poetryId,
      userId: userId,
      topic: args.topic,
      reason: args.reason,
    });
  },
});
