import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Starfield } from "@/components/site/starfield";
import { Sidebar } from "@/components/site/sidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FeedList } from "@/components/writing/feed-list";
import { SortTabs, TypeChips } from "@/components/writing/feed-filters";
import { getFeed, getSpotlight, getTypeCounts, type FeedParams, type FeedSort } from "@/lib/queries/writings";
import { getViewer } from "@/lib/session";
import { getTypeDef } from "@/lib/writing-types";

type SP = Promise<{ type?: string; sort?: string }>;

export default async function HomePage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const viewer = await getViewer();

  const type = getTypeDef(sp.type)?.value;
  const following = sp.sort === "following" && !!viewer;
  const sort: FeedSort = sp.sort === "trending" || sp.sort === "top" ? sp.sort : "latest";
  const params: FeedParams = { type, sort, following };

  const [feed, spotlight, counts] = await Promise.all([
    getFeed(params, viewer?.id),
    getSpotlight(),
    getTypeCounts(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden border-b">
        <Starfield />
        <div className="paper-grain pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.2fr_1fr]">
          <div className="animate-fade-up">
            <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-brand uppercase">
              Poetry · Stories · Essays · Micro
            </p>
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-balance md:text-7xl">
              Where words <em className="text-brand not-italic [font-style:italic]">bloom.</em>
            </h1>
            <p className="mt-6 max-w-lg font-serif text-lg text-muted-foreground md:text-xl">
              A quiet corner of the internet to read slowly, write honestly and keep the lines that stay
              with you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={viewer ? "/write" : "/sign-up"}>
                  Start writing <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/explore">Explore writings</Link>
              </Button>
            </div>
          </div>
          {spotlight ? (
            <Link
              href={`/w/${spotlight.slug}`}
              className="group relative hidden rounded-3xl border bg-card/70 p-8 shadow-xl shadow-black/[0.04] backdrop-blur transition hover:-rotate-[0.5deg] hover:shadow-2xl lg:block animate-fade-up [animation-delay:120ms]"
            >
              <span className="text-[10.5px] font-semibold tracking-[0.18em] text-brand uppercase">
                In the spotlight
              </span>
              {spotlight.title ? <h2 className="mt-3 font-display text-2xl">{spotlight.title}</h2> : null}
              <p className="mt-4 line-clamp-[9] font-serif text-lg leading-relaxed whitespace-pre-line italic">
                {spotlight.excerpt}
              </p>
              <p className="mt-6 text-sm text-muted-foreground">— {spotlight.authorName}</p>
            </Link>
          ) : null}
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-10 sm:px-6 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TypeChips counts={counts} />
            <SortTabs signedIn={!!viewer} />
          </div>
          {type ? (
            <p className="font-serif text-muted-foreground italic">{getTypeDef(type)?.tagline}</p>
          ) : null}
          <FeedList
            initial={feed}
            params={params}
            empty={
              following ? (
                <EmptyFollowing />
              ) : undefined
            }
          />
        </div>
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <Sidebar viewerId={viewer?.id} />
        </Suspense>
      </div>
    </>
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
