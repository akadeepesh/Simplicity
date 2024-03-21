import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { ConvexError } from "convex/values";

export const AddPoetry = mutation({
  args: {
    username: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.string(),
  },
  async handler(ctx, args) {
    function validateUsername(username: string) {
      if (username === "Invalid User") {
        throw new ConvexError("Invalid User");
      }
    }
    validateUsername(args.username);
    await ctx.db.insert("poetry", {
      username: args.username,
      title: args.title,
      description: args.description,
      content: args.content,
    });
  },
});
