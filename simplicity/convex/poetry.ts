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
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    return {
      viewer: identity,
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
    const identity = await ctx.auth.getUserIdentity();
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
      throw new Error("Unauthenticated call to query");
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

// export const getLikedPoems = query({
//   args: {},
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) {
//       throw new Error("Unauthenticated call to query");
//     }
//     // You may need to adjust "by_user" based on your actual index name
//     const likedPoetryIds = await ctx.db.query("likes")
//                             .withIndex("by_user", q => q.eq("userId", identity.nickname))
//                             .collect();

//     const likedPoetries = await Promise.all(
//       likedPoetryIds.map( async (like) => {
//         const poetry = await ctx.db.query("poetry").get(like.poetryId); // adjust "poetryId" based on your actual field name
//         return poetry;
//       })
//     );

//     return likedPoetries;
//   }
// });

// export const getLikedPoems = query({
//   args: {},
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) {
//       throw new Error("Unauthenticated call to query");
//     }
//     const userId = identity.subject;
//     const likes = await ctx.db
//       .query("likes")
//       .filter((q) => q.eq(q.field("userId"), userId))
//       .collect();
//     const poetryIds = likes.map((like) => like.poetryId);
//     return ctx.db.query("poetry").filter((q) => q.eq(poetry._id ,poetryIds)).collect();
//   },
// });
