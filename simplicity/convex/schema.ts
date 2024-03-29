import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  poetry: defineTable({
    username: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.string(),
  }),

  likes: defineTable({
    userId: v.string(),
    poetryId: v.id("poetry"),
  }).index("byUserId", ["userId"]),
});
