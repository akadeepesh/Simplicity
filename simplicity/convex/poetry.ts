import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

export const getPoetry = query({
  args: {},
  async handler(ctx) {
    return {
      viewer: (await ctx.auth.getUserIdentity()) ?? null,
      poetries: await ctx.db.query("poetry").order("desc").collect(),
    };
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
    const poetry = await ctx.db.get(args.id);
    return poetry;
  },
});

export const deletePoetry = mutation({
  args: { id: v.id("poetry") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
