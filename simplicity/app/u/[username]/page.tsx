import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { CalendarDays, FolderOpen, Link2, Settings } from "lucide-react";
import { FollowButton } from "@/components/profile/follow-button";
import { Starfield } from "@/components/site/starfield";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FeedList } from "@/components/writing/feed-list";
import { getCollections, getFollowList, getProfile } from "@/lib/queries/social";
import { getFeed, type FeedParams } from "@/lib/queries/writings";
import { getViewer } from "@/lib/session";
import { cn, compactNumber } from "@/lib/utils";

type Props = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ tab?: string }>;
};

const TABS = [
  { value: "writings", label: "Writings" },
  { value: "likes", label: "Loved" },
  { value: "collections", label: "Collections" },
  { value: "followers", label: "Followers" },
  { value: "following", label: "Following" },
] as const;

type Tab = (typeof TABS)[number]["value"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const p = await getProfile(decodeURIComponent(username));
  if (!p) return { title: "Not found" };
  return {
    title: `${p.name} (@${p.username})`,
    description: p.bio ?? `Writings by ${p.name} on Simplicity.`,
  };
}

export default async function ProfilePage({ params, searchParams }: Props) {
  const [{ username }, { tab: rawTab }] = await Promise.all([params, searchParams]);
  const viewer = await getViewer();
  const profile = await getProfile(decodeURIComponent(username), viewer?.id);
  if (!profile) notFound();

  const tab: Tab = TABS.some((t) => t.value === rawTab) ? (rawTab as Tab) : "writings";
  const isMe = viewer?.id === profile.id;
  const base = `/@${profile.username}`;

  return (
    <div>
      <section className="relative overflow-hidden border-b">
        <Starfield />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 py-14 text-center sm:px-6">
          <UserAvatar user={profile} className="size-24 text-2xl ring-4 ring-background" />
          <div>
            <h1 className="font-display text-4xl tracking-tight">{profile.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">@{profile.username}</p>
          </div>
          {profile.bio ? (
            <p className="max-w-xl font-serif text-lg text-balance text-foreground/85">{profile.bio}</p>
          ) : null}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {profile.website ? (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1.5 hover:text-brand"
              >
                <Link2 className="size-4" />
                {profile.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </a>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" /> Joined {format(new Date(profile.createdAt), "MMMM yyyy")}
            </span>
          </div>
          <div className="flex gap-8 text-sm">
            <Stat label="writings" value={profile.writings} />
            <Link href={`${base}?tab=followers`} className="hover:text-brand">
              <Stat label="followers" value={profile.followers} />
            </Link>
            <Link href={`${base}?tab=following`} className="hover:text-brand">
              <Stat label="following" value={profile.following} />
            </Link>
          </div>
          {isMe ? (
            <Button asChild variant="outline" size="sm">
              <Link href="/settings">
                <Settings /> Edit profile
              </Link>
            </Button>
          ) : (
            <FollowButton userId={profile.id} initialFollowing={profile.isFollowing} />
          )}
        </div>
      </section>

      <nav className="sticky top-16 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl gap-1 overflow-x-auto px-4 [scrollbar-width:none] sm:px-6">
          {TABS.map((t) => (
            <Link
              key={t.value}
              href={t.value === "writings" ? base : `${base}?tab=${t.value}`}
              scroll={false}
              className={cn(
                "shrink-0 border-b-2 border-transparent px-3 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground",
                tab === t.value && "border-brand text-foreground",
              )}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6">
        {tab === "writings" || tab === "likes" ? (
          <ProfileFeed
            params={tab === "writings" ? { authorId: profile.id } : { likedBy: profile.id }}
            viewerId={viewer?.id}
            empty={
              tab === "writings"
                ? isMe
                  ? "You haven't published anything yet."
                  : `${profile.name} hasn't published anything yet.`
                : "No loved writings yet."
            }
          />
        ) : tab === "collections" ? (
          <CollectionsGrid userId={profile.id} includePrivate={isMe} />
        ) : (
          <PeopleList userId={profile.id} kind={tab} />
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span>
      <span className="font-display text-lg text-foreground tabular-nums">{compactNumber(value)}</span>{" "}
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}

async function ProfileFeed({
  params,
  viewerId,
  empty,
}: {
  params: FeedParams;
  viewerId?: string;
  empty: string;
}) {
  const feed = await getFeed(params, viewerId);
  return (
    <FeedList
      initial={feed}
      params={params}
      empty={<p className="py-16 text-center font-serif text-muted-foreground italic">{empty}</p>}
    />
  );
}

async function CollectionsGrid({ userId, includePrivate }: { userId: string; includePrivate: boolean }) {
  const collections = await getCollections(userId, { includePrivate });
  if (!collections.length) {
    return <p className="py-16 text-center font-serif text-muted-foreground italic">No collections yet.</p>;
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
            {!c.isPublic ? <span className="rounded-full bg-secondary px-2">Private</span> : null}
          </div>
          <h3 className="mt-2 font-display text-xl group-hover:text-brand">{c.name}</h3>
          {c.description ? <p className="mt-1 text-sm text-muted-foreground">{c.description}</p> : null}
        </Link>
      ))}
    </div>
  );
}

async function PeopleList({ userId, kind }: { userId: string; kind: "followers" | "following" }) {
  const people = await getFollowList(userId, kind);
  if (!people.length) {
    return (
      <p className="py-16 text-center font-serif text-muted-foreground italic">
        {kind === "followers" ? "No followers yet." : "Not following anyone yet."}
      </p>
    );
  }
  return (
    <ul className="divide-y rounded-2xl border bg-card">
      {people.map((p) => (
        <li key={p.id}>
          <Link href={`/@${p.username}`} className="flex items-center gap-4 p-4 hover:bg-accent/50">
            <UserAvatar user={p} className="size-11" />
            <div className="min-w-0">
              <div className="font-medium">{p.name}</div>
              <div className="truncate text-sm text-muted-foreground">{p.bio ?? `@${p.username}`}</div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
