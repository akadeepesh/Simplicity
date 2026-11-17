import type { Metadata } from "next";
import { WriteForm } from "@/components/editor/write-form";
import { requirePageViewer } from "@/lib/session";
import { getTypeDef } from "@/lib/writing-types";

export const metadata: Metadata = { title: "Write", robots: { index: false } };

export default async function NewWritingPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  await requirePageViewer("/write");
  const { type } = await searchParams;
  return (
    <WriteForm
      initial={{
        type: getTypeDef(type)?.value ?? "poetry",
        form: null,
        title: "",
        subtitle: "",
        content: "",
        tags: [],
        status: "draft",
      }}
    />
  );
}
