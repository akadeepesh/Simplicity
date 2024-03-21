import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const AddPoetry = mutation({
  args: {
    username: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
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
