import { z } from "zod";

export const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,24}$/;

export const RESERVED_USERNAMES = new Set([
  "admin",
  "api",
  "explore",
  "library",
  "settings",
  "sign-in",
  "sign-up",
  "onboarding",
  "simplicity",
  "write",
  "w",
  "guidelines",
  "about",
  "support",
]);

export const usernameSchema = z
  .string()
  .trim()
  .regex(USERNAME_PATTERN, "3–24 letters, numbers or underscores")
  .refine((v) => !RESERVED_USERNAMES.has(v.toLowerCase()), "That name is reserved");

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60),
  bio: z.string().trim().max(280).optional().default(""),
  website: z
    .string()
    .trim()
    .max(200)
    .optional()
    .default("")
    .refine((v) => !v || /^https?:\/\/\S+$/.test(v), "Must start with http(s)://"),
});

export const commentSchema = z.object({
  writingId: z.uuid(),
  parentId: z.uuid().optional().nullable(),
  body: z.string().trim().min(1, "Say something").max(2000),
});

export const collectionSchema = z.object({
  name: z.string().trim().min(1, "Name it").max(60),
  description: z.string().trim().max(200).optional().default(""),
  isPublic: z.boolean().default(true),
});
