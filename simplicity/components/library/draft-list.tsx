"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RelativeTime } from "@/components/ui/relative-time";
import { PenLine, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteDrafts } from "@/lib/actions/writing";
import { TYPE_MAP } from "@/lib/writing-types";
import type { WritingType } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";

type Draft = {
  id: string;
  type: WritingType;
  title: string | null;
  excerpt: string;
  wordCount: number;
  updatedAt: Date;
};

export function DraftList({ drafts }: { drafts: Draft[] }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  if (!drafts.length) {
    return (
      <div className="rounded-2xl border border-dashed py-16 text-center">
        <p className="font-display text-xl">No drafts</p>
        <p className="mt-2 text-sm text-muted-foreground">Unfinished pieces wait for you here.</p>
        <Button asChild className="mt-6">
          <Link href="/write">
            <PenLine /> Start something
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <ul className="divide-y rounded-2xl border bg-card">
      {drafts.map((d) => (
        <li key={d.id} className="group flex items-center gap-4 p-4 sm:p-5">
          <Link href={`/write/${d.id}`} className="min-w-0 flex-1">
            <div className="text-[10.5px] font-semibold tracking-[0.16em] text-brand uppercase">
              {TYPE_MAP[d.type].label}
            </div>
            <div className="mt-1 truncate font-display text-lg group-hover:text-brand">
              {d.title || d.excerpt.split("\n")[0] || "Untitled"}
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              {d.wordCount} words · edited <RelativeTime date={d.updatedAt} />
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Delete draft"
            disabled={pending}
            className="text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive focus-visible:opacity-100"
            onClick={() =>
              startTransition(async () => {
                if (!window.confirm("Delete this draft?")) return;
                const res = await deleteDrafts([d.id]);
                if (!res.ok) return void toast.error(res.error);
                router.refresh();
              })
            }
          >
            <Trash2 />
          </Button>
        </li>
      ))}
    </ul>
  );
}
