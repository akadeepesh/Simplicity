import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Lock } from "lucide-react";
import { z } from "zod";
import {
  CollectionOwnerActions,
  RemoveFromCollection,
} from "@/components/library/collection-owner-actions";
import { UserAvatar } from "@/components/ui/avatar";
import { ShareButton } from "@/components/writing/engagement";
import { TypeKicker } from "@/components/writing/writing-card";
import { getCollection } from "@/lib/queries/social";
import { getViewer } from "@/lib/session";

type Props = { params: Promise<{ id: string }> };

async function load(id: string) {
  if (!z.uuid().safeParse(id).success) return null;
  const viewer = await getViewer();
  const c = await getCollection(id, viewer?.id);
  return c ? { c, viewer } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const res = await load((await params).id);
  if (!res) return { title: "Not found" };
  return {
    title: `${res.c.name} — a collection by ${res.c.owner.name}`,
    description: res.c.description ?? undefined,
    robots: res.c.isPublic ? undefined : { index: false },
  };
}

export default async function CollectionPage({ params }: Props) {
  const res = await load((await params).id);
  if (!res) notFound();
  const { c, viewer } = res;
  const isOwner = viewer?.id === c.userId;

  return (
    <div className="mx-auto max-w-3xl px-4 pt-12 sm:px-6 md:pt-16">
      <header className="space-y-4 border-b pb-8">
        <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-brand uppercase">
          Collection {!c.isPublic ? <Lock className="size-3" /> : null}
        </p>
        <h1 className="font-display text-4xl tracking-tight md:text-5xl">{c.name}</h1>
        {c.description ? <p className="font-serif text-lg text-muted-foreground italic">{c.description}</p> : null}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <Link href={`/@${c.owner.username}`} className="flex items-center gap-2 text-sm hover:text-brand">
            <UserAvatar user={c.owner} className="size-7" />
            Curated by {c.owner.name} · {c.items.length} {c.items.length === 1 ? "piece" : "pieces"}
          </Link>
          <div className="flex gap-2">
            {c.isPublic ? <ShareButton url={`/c/${c.id}`} title={c.name} /> : null}
            {isOwner ? (
              <CollectionOwnerActions
                id={c.id}
                initial={{ name: c.name, description: c.description ?? "", isPublic: c.isPublic }}
              />
            ) : null}
          </div>
        </div>
      </header>

      {c.items.length ? (
        <ol className="divide-y">
          {c.items.map((w, i) => (
            <li key={w.id} className="group relative flex gap-5 py-7">
              <span className="font-display text-2xl text-muted-foreground/50 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <TypeKicker type={w.type} form={w.form} minutes={w.readingMinutes} />
                {w.title ? <h2 className="mt-2 font-display text-2xl group-hover:text-brand">{w.title}</h2> : null}
                <p className="mt-2 line-clamp-4 font-serif text-[16.5px] whitespace-pre-line text-foreground/80">
                  {w.excerpt}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">— {w.authorName}</p>
                <Link href={`/w/${w.slug}`} className="absolute inset-0" aria-label={w.title ?? "Read"} />
              </div>
              {isOwner ? <RemoveFromCollection collectionId={c.id} writingId={w.id} /> : null}
            </li>
          ))}
        </ol>
      ) : (
        <p className="py-16 text-center font-serif text-muted-foreground italic">This collection is empty.</p>
      )}
    </div>
  );
}
