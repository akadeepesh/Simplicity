import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const AddPoetry = mutation({
  args: {
    username: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.string(),
    likes: v.number(),
  },
  async handler(ctx, args) {
    await ctx.db.insert("poetry", {
      username: args.username,
      title: args.title,
      description: args.description,
      content: args.content,
      likes: args.likes,
    });
  },
});

export const getPoetry = query({
  args: {},
  async handler(ctx) {
    return {
      viewer: (await ctx.auth.getUserIdentity()) ?? null,
      poetries: await ctx.db.query("poetry").order("desc").collect(),
    };
  },
});

export const likePoetry = mutation({
  args: {
    id: v.id("poetry"),
    likes: v.number(),
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.id, { likes: args.likes });
  },
});
