import type { Metadata } from "next";
import Link from "next/link";
import { X } from "lucide-react";
import { FeedList } from "@/components/writing/feed-list";
import { FormChips, SortTabs, TypeChips } from "@/components/writing/feed-filters";
import { SearchInput } from "@/components/writing/search-input";
import { getFeed, getPopularTags, getTypeCounts, type FeedParams, type FeedSort } from "@/lib/queries/writings";
import { getViewer } from "@/lib/session";
import { getTypeDef } from "@/lib/writing-types";
import { slugify } from "@/lib/utils";

type SP = Promise<{ q?: string; type?: string; form?: string; tag?: string; sort?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const sp = await searchParams;
  const def = getTypeDef(sp.type);
  if (sp.tag) return { title: `#${sp.tag}` };
  if (def) return { title: def.label, description: def.tagline };
  return { title: "Explore" };
}

export default async function ExplorePage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const viewer = await getViewer();
  const def = getTypeDef(sp.type);
  const form = def?.forms.find((f) => f.value === sp.form)?.value;
  const tag = sp.tag ? slugify(sp.tag) : undefined;
  const q = sp.q?.trim().slice(0, 100) || undefined;
  const following = sp.sort === "following" && !!viewer;
  const sort: FeedSort = sp.sort === "trending" || sp.sort === "top" ? sp.sort : "latest";

  const params: FeedParams = { type: def?.value, form, tag, q, sort, following };
  const [feed, tags, counts] = await Promise.all([
    getFeed(params, viewer?.id),
    getPopularTags(30),
    getTypeCounts(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 md:pt-14">
      <header className="mb-8 max-w-2xl space-y-3">
        <p className="text-xs font-semibold tracking-[0.2em] text-brand uppercase">Explore</p>
        <h1 className="font-display text-4xl tracking-tight md:text-5xl">
          {tag ? `#${tag}` : def ? def.plural : "Find something to read"}
        </h1>
        <p className="font-serif text-lg text-muted-foreground italic">
          {def?.tagline ?? "Search by a word you remember, a feeling, or a writer."}
        </p>
      </header>

      <div className="space-y-5">
        <SearchInput />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <TypeChips counts={counts} />
          <SortTabs signedIn={!!viewer} />
        </div>
        <FormChips />
        {tag ? (
          <Link
            href={`/explore${def ? `?type=${def.value}` : ""}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand/12 px-3 py-1 text-sm text-brand"
          >
            #{tag} <X className="size-3.5" />
          </Link>
        ) : null}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_240px]">
        <div className="min-w-0">
          {q ? (
            <p className="mb-4 text-sm text-muted-foreground">
              Results for <span className="text-foreground">“{q}”</span>
            </p>
          ) : null}
          <FeedList
            initial={feed}
            params={params}
            empty={
              <div className="rounded-2xl border border-dashed py-20 text-center">
                <p className="font-display text-xl">No matches</p>
                <p className="mt-2 text-sm text-muted-foreground">Try fewer words, or another type.</p>
              </div>
            }
          />
        </div>
        {tags.length ? (
          <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
            <h3 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <Link
                  key={t.slug}
                  href={`/explore?tag=${t.slug}`}
                  className={
                    "rounded-full px-3 py-1 text-xs transition-colors " +
                    (t.slug === tag
                      ? "bg-brand text-brand-foreground"
                      : "bg-secondary hover:bg-brand/15 hover:text-brand")
                  }
                >
                  #{t.name} <span className="opacity-50">{t.count}</span>
                </Link>
              ))}
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
