import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const LikedBy = mutation({
  args: {
    userId: v.string(),
    pizzaId: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.insert("liked", {
      userId: args.userId,
      pizzaId: args.pizzaId,
    });
  },
});

// export const getUserCartItems = query({
//   args: {
//     userId: v.string(),
//   },
//   async handler(ctx, args) {
//     return ctx.db
//       .query("cart")
//       .filter((q) => q.eq(q.field("userId"), args.userId))
//       .collect();
//   },
// });

// export const updateTask = mutation({
//   args: { id: v.id("cart"), quantity: v.number() },
//   handler: async (ctx, args) => {
//     await ctx.db.patch(args.id, { quantity: args.quantity });
//   },
// });

// export const deleteTask = mutation({
//   args: { id: v.id("cart") },
//   handler: async (ctx, args) => {
//     await ctx.db.delete(args.id);
//   },
// });
