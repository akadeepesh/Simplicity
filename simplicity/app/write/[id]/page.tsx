import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { WriteForm } from "@/components/editor/write-form";
import { getEditableWriting } from "@/lib/queries/writings";
import { requirePageViewer } from "@/lib/session";

export const metadata: Metadata = { title: "Edit", robots: { index: false } };

export default async function EditWritingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await requirePageViewer(`/write/${id}`);
  if (!z.uuid().safeParse(id).success) notFound();
  const w = await getEditableWriting(id, viewer.id);
  if (!w) notFound();

  return (
    <WriteForm
      key={w.id}
      initial={{
        id: w.id,
        type: w.type,
        form: w.form,
        title: w.title ?? "",
        subtitle: w.subtitle ?? "",
        content: w.content,
        tags: w.tags.map((t) => t.name),
        status: w.status,
        slug: w.slug,
      }}
    />
  );
}
