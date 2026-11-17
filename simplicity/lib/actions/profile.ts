"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { requireViewer } from "@/lib/session";
import { profileSchema, usernameSchema } from "@/lib/validation";
import { fail, type ActionResult } from "./result";

export async function isUsernameAvailable(name: string): Promise<boolean> {
  const parsed = usernameSchema.safeParse(name);
  if (!parsed.success) return false;
  const viewer = await requireViewer().catch(() => null);
  const [taken] = await db
    .select({ id: user.id })
    .from(user)
    .where(
      viewer
        ? and(eq(user.username, parsed.data.toLowerCase()), ne(user.id, viewer.id))
        : eq(user.username, parsed.data.toLowerCase()),
    )
    .limit(1);
  return !taken;
}

export async function setUsername(name: string): Promise<ActionResult<{ username: string }>> {
  try {
    const viewer = await requireViewer();
    const username = usernameSchema.parse(name);
    if (!(await isUsernameAvailable(username))) throw new Error("That username is taken.");
    await db
      .update(user)
      .set({ username: username.toLowerCase(), displayUsername: username })
      .where(eq(user.id, viewer.id));
    revalidatePath("/", "layout");
    return { ok: true, data: { username: username.toLowerCase() } };
  } catch (e) {
    return fail(e);
  }
}

export async function updateProfile(raw: z.input<typeof profileSchema>): Promise<ActionResult> {
  try {
    const viewer = await requireViewer();
    const input = profileSchema.parse(raw);
    await db
      .update(user)
      .set({ name: input.name, bio: input.bio || null, website: input.website || null })
      .where(eq(user.id, viewer.id));
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}
