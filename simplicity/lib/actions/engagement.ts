"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { bookmark, comment, follow, like, report, reportReason, writing } from "@/lib/db/schema";
import { requireViewer } from "@/lib/session";
import { commentSchema } from "@/lib/validation";
import { fail, type ActionResult } from "./result";

const uuid = z.uuid();

async function assertPublished(writingId: string) {
  const [row] = await db
    .select({ status: writing.status, authorId: writing.authorId })
    .from(writing)
    .where(eq(writing.id, uuid.parse(writingId)))
    .limit(1);
  if (!row || row.status !== "published") throw new Error("This writing isn't available.");
  return row;
}

export async function toggleLike(writingId: string): Promise<ActionResult<{ liked: boolean }>> {
  try {
    const viewer = await requireViewer();
    await assertPublished(writingId);
    const removed = await db
      .delete(like)
      .where(and(eq(like.userId, viewer.id), eq(like.writingId, writingId)))
      .returning();
    if (removed.length) return { ok: true, data: { liked: false } };
    await db.insert(like).values({ userId: viewer.id, writingId }).onConflictDoNothing();
    return { ok: true, data: { liked: true } };
  } catch (e) {
    return fail(e);
  }
}

export async function toggleBookmark(
  writingId: string,
): Promise<ActionResult<{ bookmarked: boolean }>> {
  try {
    const viewer = await requireViewer();
    await assertPublished(writingId);
    const removed = await db
      .delete(bookmark)
      .where(and(eq(bookmark.userId, viewer.id), eq(bookmark.writingId, writingId)))
      .returning();
    if (removed.length) {
      revalidatePath("/library");
      return { ok: true, data: { bookmarked: false } };
    }
    await db.insert(bookmark).values({ userId: viewer.id, writingId }).onConflictDoNothing();
    revalidatePath("/library");
    return { ok: true, data: { bookmarked: true } };
  } catch (e) {
    return fail(e);
  }
}

export async function toggleFollow(userId: string): Promise<ActionResult<{ following: boolean }>> {
  try {
    const viewer = await requireViewer();
    if (viewer.id === userId) throw new Error("You can't follow yourself.");
    const removed = await db
      .delete(follow)
      .where(and(eq(follow.followerId, viewer.id), eq(follow.followingId, userId)))
      .returning();
    if (removed.length) return { ok: true, data: { following: false } };
    await db
      .insert(follow)
      .values({ followerId: viewer.id, followingId: userId })
      .onConflictDoNothing();
    return { ok: true, data: { following: true } };
  } catch (e) {
    return fail(e);
  }
}

export async function addComment(
  raw: z.input<typeof commentSchema>,
  path: string,
): Promise<ActionResult> {
  try {
    const viewer = await requireViewer();
    if (!viewer.username) throw new Error("Pick a username first.");
    const input = commentSchema.parse(raw);
    await assertPublished(input.writingId);

    let parentId: string | null = null;
    if (input.parentId) {
      const [parent] = await db
        .select({ writingId: comment.writingId, parentId: comment.parentId })
        .from(comment)
        .where(eq(comment.id, input.parentId))
        .limit(1);
      if (!parent || parent.writingId !== input.writingId) throw new Error("Reply target missing.");
      // One level of threading: replies to replies attach to the top-level comment.
      parentId = parent.parentId ?? input.parentId;
    }

    await db.insert(comment).values({
      writingId: input.writingId,
      authorId: viewer.id,
      parentId,
      body: input.body,
    });
    revalidatePath(path);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteComment(id: string, path: string): Promise<ActionResult> {
  try {
    const viewer = await requireViewer();
    const [row] = await db
      .select({ authorId: comment.authorId, writingAuthor: writing.authorId })
      .from(comment)
      .innerJoin(writing, eq(writing.id, comment.writingId))
      .where(eq(comment.id, uuid.parse(id)))
      .limit(1);
    // Comment authors and the writing's author can remove a comment.
    if (!row || (row.authorId !== viewer.id && row.writingAuthor !== viewer.id)) {
      throw new Error("Not allowed.");
    }
    await db.delete(comment).where(eq(comment.parentId, id));
    await db.delete(comment).where(eq(comment.id, id));
    revalidatePath(path);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

const reportInput = z.object({
  writingId: z.uuid().optional(),
  commentId: z.uuid().optional(),
  reason: z.enum(reportReason.enumValues),
  details: z.string().trim().max(1000).optional(),
});

export async function submitReport(raw: z.input<typeof reportInput>): Promise<ActionResult> {
  try {
    const viewer = await requireViewer();
    const input = reportInput.parse(raw);
    if (!input.writingId && !input.commentId) throw new Error("Nothing to report.");
    await db
      .insert(report)
      .values({ ...input, reporterId: viewer.id })
      .onConflictDoNothing();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}
