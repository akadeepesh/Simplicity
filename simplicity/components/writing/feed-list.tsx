"use client";
import * as React from "react";
import { Feather, Loader2 } from "lucide-react";
import { loadFeedPage } from "@/lib/actions/feed";
import type { FeedParams, WritingCard as Card } from "@/lib/queries/writings";
import { cn } from "@/lib/utils";
import { WritingCard } from "./writing-card";

export function FeedList({
  initial,
  params,
  layout = "masonry",
  empty,
}: {
  initial: { items: Card[]; nextPage: number | null };
  params: FeedParams;
  layout?: "masonry" | "list";
  empty?: React.ReactNode;
}) {
  const [items, setItems] = React.useState(initial.items);
  const [nextPage, setNextPage] = React.useState(initial.nextPage);
  const [loading, setLoading] = React.useState(false);
  const sentinel = React.useRef<HTMLDivElement>(null);

  // Reset when the server sends a new first page (filters changed).
  const key = JSON.stringify(params);
  const [prevKey, setPrevKey] = React.useState(key);
  if (key !== prevKey) {
    setPrevKey(key);
    setItems(initial.items);
    setNextPage(initial.nextPage);
  }

  const loadMore = React.useCallback(async () => {
    if (loading || nextPage === null) return;
    setLoading(true);
    try {
      const res = await loadFeedPage({ ...params, page: nextPage });
      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...res.items.filter((i) => !seen.has(i.id))];
      });
      setNextPage(res.nextPage);
    } finally {
      setLoading(false);
    }
  }, [loading, nextPage, params]);

  React.useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) void loadMore();
    }, { rootMargin: "600px" });
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  if (!items.length) {
    return (
      <>
        {empty ?? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-20 text-center">
            <Feather className="size-6 text-muted-foreground" />
            <p className="font-display text-xl">Nothing here yet</p>
            <p className="text-sm text-muted-foreground">Be the first to write something.</p>
          </div>
        )}
      </>
    );
  }

  return (
    <div>
      <div
        className={cn(
          layout === "masonry"
            ? "columns-1 gap-5 md:columns-2 [&>*]:mb-5 [&>*]:break-inside-avoid"
            : "flex flex-col gap-5",
        )}
      >
        {items.map((w, i) => (
          <WritingCard
            key={w.id}
            w={w}
            className="animate-fade-up"
            style={{ animationDelay: `${Math.min(i % 12, 8) * 40}ms` }}
          />
        ))}
      </div>
      <div ref={sentinel} className="flex h-16 items-center justify-center">
        {loading ? <Loader2 className="size-5 animate-spin text-muted-foreground" /> : null}
        {nextPage === null && items.length > 6 ? (
          <span className="font-serif text-sm text-muted-foreground italic">— fin —</span>
        ) : null}
      </div>
    </div>
  );
}
