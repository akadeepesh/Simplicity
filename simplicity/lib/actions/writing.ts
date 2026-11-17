"use server";

import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { tag, writing, writingTag, writingType } from "@/lib/db/schema";
import { deriveContent } from "@/lib/content";
import { requireViewer } from "@/lib/session";
import { randomSuffix, slugify } from "@/lib/utils";
import { isValidForm, MICRO_MAX_CHARS, TYPE_MAP } from "@/lib/writing-types";
import { fail, type ActionResult } from "./result";

const writingInput = z.object({
  id: z.uuid().optional(),
  type: z.enum(writingType.enumValues),
  form: z.string().max(40).optional().nullable(),
  title: z.string().trim().max(140).optional().default(""),
  subtitle: z.string().trim().max(240).optional().default(""),
  content: z.string().max(200_000),
  tags: z.array(z.string().trim().min(1).max(32)).max(5).default([]),
  publish: z.boolean().default(false),
});

export type WritingInput = z.input<typeof writingInput>;

function normalizeTag(name: string) {
  const clean = name.replace(/^#/, "").trim().replace(/\s+/g, " ");
  return { name: clean.toLowerCase(), slug: slugify(clean) };
}

async function setTags(writingId: string, names: string[]) {
  const unique = new Map<string, { name: string; slug: string }>();
  for (const n of names) {
    const t = normalizeTag(n);
    if (t.slug) unique.set(t.slug, t);
  }
  await db.delete(writingTag).where(eq(writingTag.writingId, writingId));
  if (unique.size === 0) return;

  const rows = await db
    .insert(tag)
    .values([...unique.values()])
    .onConflictDoUpdate({ target: tag.slug, set: { slug: tag.slug } })
    .returning({ id: tag.id });

  await db
    .insert(writingTag)
    .values(rows.map((r) => ({ writingId, tagId: r.id })))
    .onConflictDoNothing();
}

export async function saveWriting(
  raw: WritingInput,
): Promise<ActionResult<{ id: string; slug: string; status: "draft" | "published" }>> {
  try {
    const viewer = await requireViewer();
    if (!viewer.username) throw new Error("Pick a username before writing.");
    const input = writingInput.parse(raw);
    const def = TYPE_MAP[input.type];

    if (!isValidForm(input.type, input.form)) throw new Error("Unknown form for this type.");

    const derived = deriveContent(input.content);
    if (input.publish) {
      if (!derived.plainText) throw new Error("Write something before publishing.");
      if (def.titleRequired && !input.title) throw new Error(`${def.label} need a title.`);
      if (input.type === "micro" && derived.plainText.length > MICRO_MAX_CHARS) {
        throw new Error(`Micro pieces are limited to ${MICRO_MAX_CHARS} characters.`);
      }
    }

    const values = {
      type: input.type,
      form: input.form || null,
      title: input.title || null,
      subtitle: input.subtitle || null,
      ...derived,
    };

    let id = input.id;
    let slug: string;
    let status: "draft" | "published";

    if (id) {
      const [existing] = await db
        .select({ authorId: writing.authorId, status: writing.status, slug: writing.slug, publishedAt: writing.publishedAt })
        .from(writing)
        .where(eq(writing.id, id))
        .limit(1);
      if (!existing || existing.authorId !== viewer.id) throw new Error("Not found.");

      status = input.publish ? "published" : existing.status;
      slug = existing.slug;
      await db
        .update(writing)
        .set({
          ...values,
          status,
          publishedAt: status === "published" ? (existing.publishedAt ?? new Date()) : null,
        })
        .where(eq(writing.id, id));
    } else {
      status = input.publish ? "published" : "draft";
      const base = slugify(input.title || derived.plainText.split(/\s+/).slice(0, 6).join(" ")) || input.type;
      slug = `${base}-${randomSuffix(5)}`;
      const [row] = await db
        .insert(writing)
        .values({
          ...values,
          authorId: viewer.id,
          slug,
          status,
          publishedAt: status === "published" ? new Date() : null,
        })
        .returning({ id: writing.id });
      id = row!.id;
    }

    await setTags(id, input.tags);

    if (status === "published") {
      revalidatePath("/");
      revalidatePath(`/w/${slug}`);
      revalidatePath(`/@${viewer.username}`);
    }
    return { ok: true, data: { id, slug, status } };
  } catch (e) {
    return fail(e);
  }
}

export async function unpublishWriting(id: string): Promise<ActionResult> {
  try {
    const viewer = await requireViewer();
    const res = await db
      .update(writing)
      .set({ status: "draft", publishedAt: null })
      .where(and(eq(writing.id, id), eq(writing.authorId, viewer.id)))
      .returning({ slug: writing.slug });
    if (!res.length) throw new Error("Not found.");
    revalidatePath("/");
    revalidatePath(`/w/${res[0]!.slug}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteWriting(id: string): Promise<ActionResult> {
  try {
    const viewer = await requireViewer();
    const res = await db
      .delete(writing)
      .where(and(eq(writing.id, id), eq(writing.authorId, viewer.id)))
      .returning({ slug: writing.slug });
    if (!res.length) throw new Error("Not found.");
    revalidatePath("/");
    revalidatePath("/library");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteDrafts(ids: string[]): Promise<ActionResult> {
  try {
    const viewer = await requireViewer();
    if (!ids.length) return { ok: true };
    await db
      .delete(writing)
      .where(
        and(inArray(writing.id, ids), eq(writing.authorId, viewer.id), eq(writing.status, "draft")),
      );
    revalidatePath("/library");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}
