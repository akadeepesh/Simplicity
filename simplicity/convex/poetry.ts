import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const poetry = mutation({
  args: {
    username: v.string(),
    title: v.string(),
    description: v.string(),
    content: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.insert("poetry", {
      username: args.username,
      title: args.title,
      description: args.description,
      content: args.content,
    });
  },
});
