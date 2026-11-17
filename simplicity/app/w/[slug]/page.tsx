import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ImageDown, PenLine } from "lucide-react";
import { getComments, isFollowing } from "@/lib/queries/social";
import { getMoreFromAuthor, getWritingBySlug } from "@/lib/queries/writings";
import { getViewer } from "@/lib/session";
import { getFormLabel, TYPE_MAP } from "@/lib/writing-types";
import { cn } from "@/lib/utils";
import { FollowButton } from "@/components/profile/follow-button";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CollectionPicker } from "@/components/writing/collection-picker";
import { Comments } from "@/components/writing/comments";
import { BookmarkButton, LikeButton, ShareButton } from "@/components/writing/engagement";
import { OwnerMenu } from "@/components/writing/owner-menu";
import { ReadingProgress } from "@/components/writing/reading-progress";
import { ReaderSettings } from "@/components/writing/reader-settings";
import { ReportDialog } from "@/components/writing/report-dialog";
import { TypeKicker } from "@/components/writing/writing-card";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const viewer = await getViewer();
  const w = await getWritingBySlug(slug, viewer?.id);
  if (!w) return { title: "Not found" };
  const title = w.title ?? `${getFormLabel(w.type, w.form) ?? TYPE_MAP[w.type].label} by ${w.author.name}`;
  return {
    title,
    description: w.excerpt.slice(0, 160),
    authors: [{ name: w.author.name }],
    openGraph: { type: "article", title, description: w.excerpt.slice(0, 160) },
    robots: w.status === "published" ? undefined : { index: false },
  };
}

export default async function WritingPage({ params }: Props) {
  const { slug } = await params;
  const viewer = await getViewer();
  const w = await getWritingBySlug(slug, viewer?.id);
  if (!w) notFound();

  const def = TYPE_MAP[w.type];
  const isOwner = viewer?.id === w.author.id;
  const [comments, more, following] = await Promise.all([
    getComments(w.id),
    getMoreFromAuthor(w.author.id, w.id),
    isFollowing(viewer?.id, w.author.id),
  ]);
  const published = w.status === "published";

  return (
    <>
      <ReadingProgress />
      {!published ? (
        <div className="border-b bg-amber-500/10 py-2 text-center text-sm">
          This is a draft preview. Only you can see it.{" "}
          <Link href={`/write/${w.id}`} className="underline underline-offset-4">
            Keep editing
          </Link>
        </div>
      ) : null}
      <article className="mx-auto max-w-3xl px-4 pt-12 pb-10 sm:px-6 md:pt-20">
        <header className={cn("space-y-5", def.layout !== "prose" && "text-center")}>
          <TypeKicker
            type={w.type}
            form={w.form}
            minutes={w.readingMinutes}
            className={def.layout !== "prose" ? "justify-center" : undefined}
          />
          {w.title ? (
            <h1 className="font-display text-4xl leading-[1.1] tracking-tight text-balance md:text-6xl">{w.title}</h1>
          ) : null}
          {w.subtitle ? (
            <p className="font-serif text-xl text-muted-foreground italic md:text-2xl">{w.subtitle}</p>
          ) : null}
          <div className={cn("flex items-center gap-3 pt-2", def.layout !== "prose" && "justify-center")}>
            <Link href={`/@${w.author.username}`} className="flex items-center gap-3 hover:text-brand">
              <UserAvatar user={w.author} className="size-10" />
              <div className="text-left">
                <div className="text-sm font-medium">{w.author.name}</div>
                <div className="text-xs text-muted-foreground">
                  {w.publishedAt ? format(new Date(w.publishedAt), "MMM d, yyyy") : "Unpublished"}
                  {def.layout === "prose" ? ` · ${w.wordCount.toLocaleString()} words` : null}
                </div>
              </div>
            </Link>
            {!isOwner ? <FollowButton userId={w.author.id} initialFollowing={following} size="sm" /> : null}
          </div>
        </header>

        <Separator className="mx-auto my-10 max-w-24 bg-brand/40" />

        <div
          className={cn(
            "writing-body",
            def.layout === "verse" && "writing-verse mx-auto w-fit max-w-full",
            def.layout === "prose" && "writing-prose",
            def.layout === "card" && "writing-card text-center",
          )}
          dangerouslySetInnerHTML={{ __html: w.content }}
        />

        {w.tags.length ? (
          <div className={cn("mt-12 flex flex-wrap gap-2", def.layout !== "prose" && "justify-center")}>
            {w.tags.map((t) => (
              <Link
                key={t.slug}
                href={`/explore?tag=${t.slug}`}
                className="rounded-full bg-secondary px-3 py-1 text-xs transition-colors hover:bg-brand/15 hover:text-brand"
              >
                #{t.name}
              </Link>
            ))}
          </div>
        ) : null}

        {published ? (
          <div className="sticky bottom-20 z-30 mx-auto mt-12 flex w-fit flex-wrap items-center justify-center gap-1 rounded-full border bg-background/85 p-1.5 shadow-lg backdrop-blur md:bottom-6">
            <LikeButton writingId={w.id} initialLiked={w.liked} initialCount={w.likeCount} size="lg" />
            <a
              href="#comments"
              className="rounded-full px-3 py-2 text-[15px] text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {w.commentCount} {w.commentCount === 1 ? "response" : "responses"}
            </a>
            <BookmarkButton writingId={w.id} initialBookmarked={w.bookmarked} size="lg" />
            <Separator orientation="vertical" className="mx-1 h-6" />
            <CollectionPicker writingId={w.id} />
            <ShareButton url={`/w/${w.slug}`} title={w.title ?? "Simplicity"} />
            <ReaderSettings />
            <Button asChild variant="ghost" size="icon-sm" aria-label="Download share image">
              <a href={`/w/${w.slug}/opengraph-image`} download={`${w.slug}.png`}>
                <ImageDown />
              </a>
            </Button>
            {isOwner ? <OwnerMenu id={w.id} published={published} /> : <ReportDialog writingId={w.id} />}
          </div>
        ) : isOwner ? (
          <div className="mt-12 flex justify-center">
            <Button asChild>
              <Link href={`/write/${w.id}`}>
                <PenLine /> Continue editing
              </Link>
            </Button>
          </div>
        ) : null}
      </article>

      {w.authorBio ? (
        <section className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="flex flex-col items-start gap-4 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center">
            <UserAvatar user={w.author} className="size-14" />
            <div className="flex-1">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Written by</p>
              <Link href={`/@${w.author.username}`} className="font-display text-xl hover:text-brand">
                {w.author.name}
              </Link>
              <p className="mt-1 font-serif text-muted-foreground">{w.authorBio}</p>
            </div>
          </div>
        </section>
      ) : null}

      {published ? (
        <div className="mx-auto max-w-3xl px-4 pt-14 sm:px-6">
          <Comments writingId={w.id} writingAuthorId={w.author.id} comments={comments} />
        </div>
      ) : null}

      {more.length ? (
        <section className="mx-auto max-w-5xl px-4 pt-20 sm:px-6">
          <h2 className="mb-6 font-display text-2xl">More from {w.author.name}</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {more.map((m) => (
              <Link
                key={m.id}
                href={`/w/${m.slug}`}
                className="group rounded-2xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-brand/30"
              >
                <TypeKicker type={m.type} form={m.form} />
                {m.title ? <h3 className="mt-2 font-display text-lg group-hover:text-brand">{m.title}</h3> : null}
                <p className="mt-2 line-clamp-4 font-serif text-[15px] whitespace-pre-line text-muted-foreground">
                  {m.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
