import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import type { WritingCard as Card } from "@/lib/queries/writings";
import { getFormLabel, TYPE_MAP } from "@/lib/writing-types";
import { UserAvatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { BookmarkButton, CommentCount, LikeButton } from "./engagement";

export function TypeKicker({
  type,
  form,
  minutes,
  className,
}: {
  type: Card["type"];
  form: string | null;
  minutes?: number;
  className?: string;
}) {
  const def = TYPE_MAP[type];
  const formLabel = getFormLabel(type, form);
  return (
    <div className={cn("flex items-center gap-2 text-[10.5px] font-semibold tracking-[0.16em] uppercase", className)}>
      <span className="text-brand">{formLabel ?? def.label}</span>
      {minutes && def.layout === "prose" ? (
        <>
          <span className="text-muted-foreground/60">·</span>
          <span className="text-muted-foreground">{minutes} min read</span>
        </>
      ) : null}
    </div>
  );
}

export function WritingCard({
  w,
  className,
  style,
}: {
  w: Card;
  className?: string;
  style?: React.CSSProperties;
}) {
  const def = TYPE_MAP[w.type];
  const href = `/w/${w.slug}`;

  return (
    <article
      style={style}
      className={cn(
        "group relative flex flex-col gap-4 rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_8px_30px_-12px] hover:shadow-brand/15",
        def.layout === "card" && "bg-gradient-to-br from-card to-secondary/60",
        className,
      )}
    >
      <TypeKicker type={w.type} form={w.form} minutes={w.readingMinutes} />

      {def.layout === "card" ? (
        <blockquote className="font-display text-[1.45rem] leading-snug text-balance">
          <span className="text-brand/70">“</span>
          {w.excerpt}
          <span className="text-brand/70">”</span>
        </blockquote>
      ) : (
        <div className="space-y-2">
          {w.title ? (
            <h3 className="font-display text-[1.45rem] leading-tight tracking-tight text-balance">{w.title}</h3>
          ) : null}
          {w.subtitle && def.layout === "prose" ? (
            <p className="font-serif text-[15px] text-muted-foreground italic">{w.subtitle}</p>
          ) : null}
          <p
            className={cn(
              "font-serif text-[16.5px] text-foreground/85",
              def.layout === "verse" ? "line-clamp-[8] leading-[1.75] whitespace-pre-line" : "line-clamp-3 leading-relaxed",
            )}
          >
            {w.excerpt}
          </p>
        </div>
      )}

      <Link href={href} className="absolute inset-0 rounded-2xl" aria-label={w.title ?? "Read"} />

      <footer className="mt-auto flex items-center gap-3 pt-2">
        <Link
          href={`/@${w.author.username}`}
          className="relative z-10 flex min-w-0 items-center gap-2 text-sm hover:text-brand"
        >
          <UserAvatar user={w.author} className="size-6" />
          <span className="truncate">{w.author.name}</span>
        </Link>
        {w.publishedAt ? (
          <time
            dateTime={new Date(w.publishedAt).toISOString()}
            className="shrink-0 text-xs text-muted-foreground"
          >
            {formatDistanceToNowStrict(new Date(w.publishedAt), { addSuffix: true })}
          </time>
        ) : null}
        <div className="ml-auto flex items-center">
          <LikeButton writingId={w.id} initialLiked={w.liked} initialCount={w.likeCount} />
          <CommentCount count={w.commentCount} href={`${href}#comments`} />
          <BookmarkButton writingId={w.id} initialBookmarked={w.bookmarked} />
        </div>
      </footer>
    </article>
  );
}
