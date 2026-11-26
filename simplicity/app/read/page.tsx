import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeedList } from "@/components/writing/feed-list";
import { SortTabs, TypeChips } from "@/components/writing/feed-filters";
import { getFeed, getTypeCounts, type FeedParams, type FeedSort } from "@/lib/queries/writings";
import { getViewer } from "@/lib/session";
import { getTypeDef } from "@/lib/writing-types";

type SP = Promise<{ type?: string; sort?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const def = getTypeDef((await searchParams).type);
  return def ? { title: def.plural, description: def.tagline } : { title: "Read" };
}

export default async function ReadPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const viewer = await getViewer();

  const def = getTypeDef(sp.type);
  const following = sp.sort === "following" && !!viewer;
  const sort: FeedSort =
    sp.sort === "trending" || sp.sort === "top" || (sp.sort === "foryou" && viewer) ? sp.sort : "latest";
  const params: FeedParams = { type: def?.value, sort, following };

  const [feed, counts] = await Promise.all([getFeed(params, viewer?.id), getTypeCounts()]);

  const heading = def ? def.plural : following ? "From writers you follow" : "Something to read";
  const tagline = def?.tagline ?? (following ? "New work from the voices you keep." : "Slow down. Pick a piece. Stay a while.");

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6">
      <header className="pt-10 pb-6 text-center md:pt-14">
        <p className="text-xs font-semibold tracking-[0.2em] text-brand uppercase">Read</p>
        <h1 className="mt-3 font-display text-4xl tracking-tight text-balance md:text-5xl">{heading}</h1>
        <p className="mt-3 font-serif text-lg text-muted-foreground italic">{tagline}</p>
      </header>

      <div className="sticky top-16 z-30 -mx-4 bg-background/85 px-4 py-3 backdrop-blur-lg supports-[backdrop-filter]:bg-background/70 sm:-mx-6 sm:px-6">
        <div className="flex flex-col items-center gap-3">
          <TypeChips counts={counts} className="w-full sm:justify-center" />
          <SortTabs signedIn={!!viewer} className="max-w-full overflow-x-auto [scrollbar-width:none]" />
        </div>
      </div>

      <div className="pt-6">
        <FeedList
          initial={feed}
          params={params}
          layout="list"
          empty={following ? <EmptyFollowing /> : undefined}
        />
      </div>
    </div>
  );
}

function EmptyFollowing() {
  return (
    <div className="rounded-2xl border border-dashed p-12 text-center">
      <p className="font-display text-xl">Your following feed is quiet</p>
      <p className="mt-2 text-sm text-muted-foreground">Follow a few writers and their new work lands here.</p>
      <Button asChild variant="outline" className="mt-6">
        <Link href="/explore">Find writers</Link>
      </Button>
    </div>
  );
}
