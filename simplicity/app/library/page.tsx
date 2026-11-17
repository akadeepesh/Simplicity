import type { Metadata } from "next";
import Link from "next/link";
import { FolderOpen, Lock } from "lucide-react";
import { DraftList } from "@/components/library/draft-list";
import { CollectionDialog } from "@/components/library/new-collection-button";
import { FeedList } from "@/components/writing/feed-list";
import { getCollections } from "@/lib/queries/social";
import { getDrafts, getFeed } from "@/lib/queries/writings";
import { requirePageViewer } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Library", robots: { index: false } };

const TABS = [
  { value: "saved", label: "Saved" },
  { value: "collections", label: "Collections" },
  { value: "drafts", label: "Drafts" },
] as const;

export default async function LibraryPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const viewer = await requirePageViewer("/library");
  const { tab: raw } = await searchParams;
  const tab = TABS.find((t) => t.value === raw)?.value ?? "saved";

  return (
    <div className="mx-auto max-w-4xl px-4 pt-10 sm:px-6 md:pt-14">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-brand uppercase">Your library</p>
          <h1 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">Kept close</h1>
        </div>
        {tab === "collections" ? <CollectionDialog /> : null}
      </header>
      <nav className="mb-8 inline-flex rounded-full border bg-card/60 p-1 text-sm">
        {TABS.map((t) => (
          <Link
            key={t.value}
            href={t.value === "saved" ? "/library" : `/library?tab=${t.value}`}
            className={cn(
              "rounded-full px-4 py-1.5 text-muted-foreground transition-colors hover:text-foreground",
              tab === t.value && "bg-secondary text-foreground shadow-sm",
            )}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {tab === "saved" ? <Saved viewerId={viewer.id} /> : null}
      {tab === "collections" ? <Collections viewerId={viewer.id} /> : null}
      {tab === "drafts" ? <DraftList drafts={await getDrafts(viewer.id)} /> : null}
    </div>
  );
}

async function Saved({ viewerId }: { viewerId: string }) {
  const params = { bookmarkedBy: viewerId };
  const feed = await getFeed(params, viewerId);
  return (
    <FeedList
      initial={feed}
      params={params}
      layout="list"
      empty={
        <div className="rounded-2xl border border-dashed py-16 text-center">
          <p className="font-display text-xl">Nothing saved yet</p>
          <p className="mt-2 text-sm text-muted-foreground">Tap the bookmark on any piece to keep it here.</p>
        </div>
      }
    />
  );
}

async function Collections({ viewerId }: { viewerId: string }) {
  const collections = await getCollections(viewerId, { includePrivate: true });
  if (!collections.length) {
    return (
      <div className="rounded-2xl border border-dashed py-16 text-center">
        <p className="font-display text-xl">No collections yet</p>
        <p className="mt-2 text-sm text-muted-foreground">Group writings into reading lists you can share.</p>
      </div>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {collections.map((c) => (
        <Link
          key={c.id}
          href={`/c/${c.id}`}
          className="group rounded-2xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-brand/30"
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FolderOpen className="size-4" /> {c.count} {c.count === 1 ? "piece" : "pieces"}
            {!c.isPublic ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2">
                <Lock className="size-3" /> Private
              </span>
            ) : null}
          </div>
          <h3 className="mt-2 font-display text-xl group-hover:text-brand">{c.name}</h3>
          {c.description ? <p className="mt-1 text-sm text-muted-foreground">{c.description}</p> : null}
        </Link>
      ))}
    </div>
  );
}
