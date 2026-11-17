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

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={state.liked}
      aria-label={state.liked ? "Unlike" : "Like"}
      className={cn(
        "relative z-10 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-muted-foreground transition-colors hover:bg-heart/10 hover:text-heart",
        state.liked && "text-heart",
        size === "lg" && "px-3 py-2 text-[15px]",
      )}
    >
      <Heart
        key={burst}
        className={cn(
          size === "lg" ? "size-5" : "size-4",
          state.liked && "fill-current",
          burst > 0 && state.liked && "animate-in zoom-in-50 duration-300",
        )}
      />
      <span className="tabular-nums text-[13px]">{compactNumber(state.count)}</span>
    </button>
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
          "relative z-10 inline-flex items-center rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-brand/10 hover:text-brand",
          saved && "text-brand",
          size === "lg" && "p-2.5",
        )}
      >
        <Bookmark className={cn(size === "lg" ? "size-5" : "size-4", saved && "fill-current")} />
      </button>
    </Tooltip>
  );
}

export function CommentCount({ count, href }: { count: number; href?: string }) {
  const inner = (
    <>
      <MessageCircle className="size-4" />
      <span className="tabular-nums text-[13px]">{compactNumber(count)}</span>
    </>
  );
  const cls =
    "relative z-10 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";
  return href ? (
    <a href={href} className={cls} aria-label={`${count} comments`}>
      {inner}
    </a>
  ) : (
    <span className={cls}>{inner}</span>
  );
}

export function ShareButton({ url, title, text }: { url: string; title: string; text?: string }) {
  const [copied, setCopied] = React.useState(false);

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
      {copied ? <Check /> : navigatorShareIcon()}
      Share
    </Button>
  );
}

function navigatorShareIcon() {
  return typeof navigator !== "undefined" && "share" in navigator ? <Share2 /> : <Link2 />;
}
