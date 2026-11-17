import Link from "next/link";
import { PenLine } from "lucide-react";
import { getSuggestedAuthors } from "@/lib/queries/social";
import { getPopularTags } from "@/lib/queries/writings";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FollowButton } from "@/components/profile/follow-button";

export async function Sidebar({ viewerId }: { viewerId?: string | null }) {
  const [authors, tags] = await Promise.all([getSuggestedAuthors(viewerId), getPopularTags(16)]);
  return (
    <aside className="space-y-8 lg:sticky lg:top-24">
      <section className="rounded-2xl border bg-gradient-to-br from-brand/10 via-card to-card p-5">
        <h3 className="font-display text-lg">Have something to say?</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          A poem, a story, a single line. Every voice belongs here.
        </p>
        <Button asChild variant="brand" size="sm" className="mt-4">
          <Link href="/write">
            <PenLine /> Start writing
          </Link>
        </Button>
      </section>

      {authors.length ? (
        <section className="space-y-3">
          <h3 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Voices to follow</h3>
          <ul className="space-y-3">
            {authors.map((a) => (
              <li key={a.id} className="flex items-center gap-3">
                <Link href={`/@${a.username}`} className="flex min-w-0 flex-1 items-center gap-3 hover:text-brand">
                  <UserAvatar user={a} className="size-9" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{a.name}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {a.writings} {a.writings === 1 ? "piece" : "pieces"}
                    </div>
                  </div>
                </Link>
                {viewerId ? <FollowButton userId={a.id} initialFollowing={false} size="sm" /> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tags.length ? (
        <section className="space-y-3">
          <h3 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Popular tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <Link
                key={t.slug}
                href={`/explore?tag=${t.slug}`}
                className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground transition-colors hover:bg-brand/15 hover:text-brand"
              >
                #{t.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </aside>
  );
}
