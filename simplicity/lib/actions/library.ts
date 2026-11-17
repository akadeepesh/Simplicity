"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { collection, collectionItem } from "@/lib/db/schema";
import { requireViewer } from "@/lib/session";
import { collectionSchema } from "@/lib/validation";
import { fail, type ActionResult } from "./result";

async function ownCollection(id: string, viewerId: string) {
  const [row] = await db
    .select({ id: collection.id })
    .from(collection)
    .where(and(eq(collection.id, z.uuid().parse(id)), eq(collection.userId, viewerId)))
    .limit(1);
  if (!row) throw new Error("Collection not found.");
}

export async function createCollection(
  raw: z.input<typeof collectionSchema>,
  withWritingId?: string,
): Promise<ActionResult<{ id: string }>> {
  try {
    const viewer = await requireViewer();
    const input = collectionSchema.parse(raw);
    const [row] = await db
      .insert(collection)
      .values({
        userId: viewer.id,
        name: input.name,
        description: input.description || null,
        isPublic: input.isPublic,
      })
      .returning({ id: collection.id });
    if (withWritingId) {
      await db
        .insert(collectionItem)
        .values({ collectionId: row!.id, writingId: z.uuid().parse(withWritingId) })
        .onConflictDoNothing();
    }
    revalidatePath("/library");
    return { ok: true, data: { id: row!.id } };
  } catch (e) {
    return fail(e);
  }
}

export async function updateCollection(
  id: string,
  raw: z.input<typeof collectionSchema>,
): Promise<ActionResult> {
  try {
    const viewer = await requireViewer();
    await ownCollection(id, viewer.id);
    const input = collectionSchema.parse(raw);
    await db
      .update(collection)
      .set({ name: input.name, description: input.description || null, isPublic: input.isPublic })
      .where(eq(collection.id, id));
    revalidatePath(`/c/${id}`);
    revalidatePath("/library");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteCollection(id: string): Promise<ActionResult> {
  try {
    const viewer = await requireViewer();
    await ownCollection(id, viewer.id);
    await db.delete(collection).where(eq(collection.id, id));
    revalidatePath("/library");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function toggleCollectionItem(
  collectionId: string,
  writingId: string,
): Promise<ActionResult<{ added: boolean }>> {
  try {
    const viewer = await requireViewer();
    await ownCollection(collectionId, viewer.id);
    const wid = z.uuid().parse(writingId);
    const removed = await db
      .delete(collectionItem)
      .where(and(eq(collectionItem.collectionId, collectionId), eq(collectionItem.writingId, wid)))
      .returning();
    if (!removed.length) {
      await db.insert(collectionItem).values({ collectionId, writingId: wid }).onConflictDoNothing();
    }
    await db
      .update(collection)
      .set({ updatedAt: new Date() })
      .where(eq(collection.id, collectionId));
    revalidatePath(`/c/${collectionId}`);
    return { ok: true, data: { added: !removed.length } };
  } catch (e) {
    return fail(e);
  }
}
