"use client";
import * as React from "react";
import { Bookmark, Check, Heart, Link2, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
import { toggleBookmark, toggleLike } from "@/lib/actions/engagement";
import { useRequireAuth } from "@/components/site/viewer-context";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { cn, compactNumber } from "@/lib/utils";

export function LikeButton({
  writingId,
  initialLiked,
  initialCount,
  size = "sm",
}: {
  writingId: string;
  initialLiked: boolean;
  initialCount: number;
  size?: "sm" | "lg";
}) {
  const requireAuth = useRequireAuth();
  const [state, setState] = React.useState({ liked: initialLiked, count: initialCount });
  const [burst, setBurst] = React.useState(0);

  async function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!requireAuth()) return;
    const prev = state;
    const liked = !prev.liked;
    setState({ liked, count: prev.count + (liked ? 1 : -1) });
    if (liked) setBurst((b) => b + 1);
    const res = await toggleLike(writingId);
    if (!res.ok) {
      setState(prev);
      toast.error(res.error);
    }
  }

  const iconSize = size === "lg" ? "size-5" : "size-4";

  return (
    <Tooltip content={state.liked ? "You loved this" : "Love this"}>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={state.liked}
        aria-label={state.liked ? "Unlike" : "Like"}
        className={cn(
          "group/like relative z-10 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-muted-foreground transition-colors hover:bg-heart/10 hover:text-heart active:scale-95",
          state.liked && "text-heart",
          size === "lg" && "px-3 py-2 text-[15px]",
        )}
      >
        <span className="relative inline-grid place-items-center">
          <Heart
            key={burst}
            className={cn(
              iconSize,
              "transition-transform duration-200 group-hover/like:scale-115",
              state.liked && "fill-current",
              burst > 0 && state.liked && "animate-heart-pop",
            )}
          />
          {burst > 0 && state.liked ? <LikeBurst key={`b${burst}`} /> : null}
        </span>
        {state.count > 0 ? (
          <span
            key={state.count}
            className="animate-in fade-in slide-in-from-bottom-1 text-[13px] tabular-nums duration-200"
          >
            {compactNumber(state.count)}
          </span>
        ) : null}
      </button>
    </Tooltip>
  );
}

const SPARKS = [0, 60, 120, 180, 240, 300];

/** A one-shot ring and sparks around the heart. */
function LikeBurst() {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 motion-reduce:hidden">
      <span className="like-ring absolute inset-0 rounded-full border-2 border-heart" />
      {SPARKS.map((a) => (
        <span
          key={a}
          className="like-spark absolute top-1/2 left-1/2 size-1 rounded-full bg-heart"
          style={{ "--a": `${a}deg` } as React.CSSProperties}
        />
      ))}
    </span>
  );
}

export function BookmarkButton({
  writingId,
  initialBookmarked,
  size = "sm",
}: {
  writingId: string;
  initialBookmarked: boolean;
  size?: "sm" | "lg";
}) {
  const requireAuth = useRequireAuth();
  const [saved, setSaved] = React.useState(initialBookmarked);

  async function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!requireAuth()) return;
    setSaved(!saved);
    const res = await toggleBookmark(writingId);
    if (!res.ok) {
      setSaved(saved);
      toast.error(res.error);
    } else {
      toast(res.data.bookmarked ? "Saved to your library" : "Removed from library");
    }
  }

  return (
    <Tooltip content={saved ? "Saved" : "Save for later"}>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={saved}
        aria-label={saved ? "Remove bookmark" : "Bookmark"}
        className={cn(
          "group/save relative z-10 inline-flex items-center rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-brand/10 hover:text-brand active:scale-95",
          saved && "text-brand",
          size === "lg" && "p-2.5",
        )}
      >
        <Bookmark
          key={String(saved)}
          className={cn(
            size === "lg" ? "size-5" : "size-4",
            "transition-transform duration-200 group-hover/save:-translate-y-0.5",
            saved && "animate-heart-pop fill-current",
          )}
        />
      </button>
    </Tooltip>
  );
}

export function CommentCount({
  count,
  href,
  size = "sm",
}: {
  count: number;
  href: string;
  size?: "sm" | "lg";
}) {
  const label = count ? `${count} ${count === 1 ? "response" : "responses"}` : "Write a response";
  return (
    <Tooltip content={count ? label : "Be the first to respond"}>
      <a
        href={href}
        aria-label={label}
        className={cn(
          "group/comment relative z-10 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-muted-foreground transition-colors hover:bg-brand/10 hover:text-brand active:scale-95",
          size === "lg" && "px-3 py-2 text-[15px]",
        )}
      >
        <MessageCircle
          className={cn(
            size === "lg" ? "size-5" : "size-4",
            "transition-transform duration-200 group-hover/comment:-rotate-12 group-hover/comment:scale-110",
          )}
        />
        {count > 0 ? <span className="text-[13px] tabular-nums">{compactNumber(count)}</span> : null}
      </a>
    </Tooltip>
  );
}

export function ShareButton({ url, title, text }: { url: string; title: string; text?: string }) {
  const [copied, setCopied] = React.useState(false);
  const canShare = useCanShare();

  async function onClick() {
    const full = new URL(url, window.location.origin).toString();
    if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
      try {
        await navigator.share({ url: full, title, text });
        return;
      } catch {
        /* fall back to copy */
      }
    }
    await navigator.clipboard.writeText(full);
    setCopied(true);
    toast.success("Link copied");
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Button variant="outline" size="sm" onClick={onClick}>
      {copied ? <Check /> : canShare ? <Share2 /> : <Link2 />}
      Share
    </Button>
  );
}

const noopSubscribe = () => () => {};

/** False during SSR and hydration, then the real value, so both renders match. */
function useCanShare() {
  return React.useSyncExternalStore(
    noopSubscribe,
    () => "share" in navigator,
    () => false,
  );
}
