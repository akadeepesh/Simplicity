import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Bookmark, BookOpen, PenLine } from "lucide-react";
import { Starfield } from "@/components/site/starfield";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { WritingCard } from "@/components/writing/writing-card";
import { getSuggestedAuthors } from "@/lib/queries/social";
import { getFeed, getSpotlight, getTypeCounts } from "@/lib/queries/writings";
import { getViewer } from "@/lib/session";
import { WRITING_TYPES } from "@/lib/writing-types";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Read slowly",
    body: "A centered, distraction-free column. Pick your font, size and spacing; verse keeps its line breaks.",
  },
  {
    icon: PenLine,
    title: "Write freely",
    body: "A calm editor with drafts, from haiku and ghazals to essays and six-word stories.",
  },
  {
    icon: Bookmark,
    title: "Keep what stays",
    body: "Like, bookmark and gather pieces into collections. Follow the voices you return to.",
  },
];

export default async function LandingPage() {
  if (await getViewer()) redirect("/read");

  const [spotlight, counts, top, authors] = await Promise.all([
    getSpotlight(),
    getTypeCounts(),
    getFeed({ sort: "top" }),
    getSuggestedAuthors(null, 6),
  ]);
  const picks = top.items.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <Starfield />
        <div className="paper-grain pointer-events-none absolute inset-0 opacity-60" />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 size-[42rem] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl"
        />
        <Image
          src="/leaves.png"
          alt=""
          aria-hidden
          width={520}
          height={520}
          priority
          className="pointer-events-none absolute -right-32 -bottom-40 hidden animate-drift opacity-[0.07] motion-reduce:animate-none md:block dark:opacity-[0.1]"
        />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 pt-20 pb-16 text-center sm:px-6 md:pt-28 md:pb-24">
          <p className="animate-fade-up text-xs font-semibold tracking-[0.2em] text-brand uppercase">
            Poetry · Stories · Essays · Micro
          </p>
          <h1 className="mt-5 animate-fade-up font-display text-5xl leading-[1.05] tracking-tight text-balance [animation-delay:60ms] md:text-7xl">
            Where words <em className="text-brand">bloom.</em>
          </h1>
          <p className="mt-6 max-w-xl animate-fade-up font-serif text-lg text-muted-foreground [animation-delay:120ms] md:text-xl">
            A quiet corner of the internet to read slowly, write honestly and keep the lines that stay with you.
          </p>
          <div className="mt-9 flex animate-fade-up flex-wrap justify-center gap-3 [animation-delay:180ms]">
            <Button asChild size="lg">
              <Link href="/read">
                Start reading <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/sign-up">
                <PenLine /> Share your writing
              </Link>
            </Button>
          </div>
          <p className="mt-5 animate-fade-up text-sm text-muted-foreground [animation-delay:240ms]">
            Already a member?{" "}
            <Link href="/sign-in" className="text-foreground underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>

          {spotlight ? (
            <Link
              href={`/w/${spotlight.slug}`}
              className="group relative mt-16 w-full max-w-lg animate-fade-up text-left [animation-delay:320ms]"
            >
              <span aria-hidden className="absolute inset-0 -rotate-3 rounded-3xl border bg-card/50" />
              <span aria-hidden className="absolute inset-0 rotate-2 rounded-3xl border bg-card/70" />
              <span className="relative block rounded-3xl border bg-card p-8 shadow-xl shadow-black/[0.05] transition duration-500 group-hover:-translate-y-1 group-hover:shadow-2xl">
                <span className="text-[10.5px] font-semibold tracking-[0.18em] text-brand uppercase">
                  In the spotlight
                </span>
                {spotlight.title ? (
                  <span className="mt-3 block font-display text-2xl">{spotlight.title}</span>
                ) : null}
                <span className="mt-4 line-clamp-[7] block font-serif text-lg leading-relaxed whitespace-pre-line italic">
                  {spotlight.excerpt}
                </span>
                <span className="mt-6 block text-sm text-muted-foreground">— {spotlight.authorName}</span>
              </span>
            </Link>
          ) : null}
        </div>
      </section>

      {/* Types */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <SectionHeading kicker="Four shapes" title="Every kind of writing has a home" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WRITING_TYPES.map((t) => (
            <Link
              key={t.value}
              href={`/read?type=${t.value}`}
              className="group flex flex-col rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_8px_30px_-12px] hover:shadow-brand/15"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-2xl">{t.label}</h3>
                {counts[t.value] ? (
                  <span className="text-xs text-muted-foreground tabular-nums">{counts[t.value]}</span>
                ) : null}
              </div>
              <p className="mt-2 font-serif text-muted-foreground italic">{t.tagline}</p>
              <p className="mt-6 text-xs text-muted-foreground">
                {t.forms
                  .slice(0, 3)
                  .map((f) => f.label)
                  .join(" · ")}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm text-brand">
                Read {t.plural.toLowerCase()}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Picks */}
      {picks.length ? (
        <section className="border-y bg-secondary/40">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
            <SectionHeading kicker="Most loved" title="A few pieces to begin with" />
            <div className="mt-12 grid items-start gap-5 md:grid-cols-3">
              {picks.map((w) => (
                <WritingCard key={w.id} w={w} />
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/read">
                  Keep reading <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <SectionHeading kicker="Made for words" title="Nothing loud. Just the page." />
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-brand/10 text-brand">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-5 font-display text-xl">{f.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Voices */}
      {authors.length ? (
        <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 md:pb-28">
          <SectionHeading kicker="Voices" title="Writers you'll find here" />
          <ul className="mt-10 flex flex-wrap justify-center gap-3">
            {authors.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/@${a.username}`}
                  className="flex items-center gap-3 rounded-full border bg-card py-1.5 pr-4 pl-1.5 transition-colors hover:border-brand/30 hover:text-brand"
                >
                  <UserAvatar user={a} className="size-8" />
                  <span className="text-sm font-medium">{a.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {a.writings} {a.writings === 1 ? "piece" : "pieces"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-brand/15 via-card to-card px-6 py-16 text-center md:py-20">
          <Image
            src="/leaves.png"
            alt=""
            aria-hidden
            width={64}
            height={64}
            className="mx-auto mb-6 opacity-90"
          />
          <h2 className="font-display text-3xl tracking-tight text-balance md:text-5xl">
            Your first line is waiting.
          </h2>
          <p className="mx-auto mt-4 max-w-md font-serif text-lg text-muted-foreground italic">
            Free, forever. Post a poem, a story, a single thought, and find the people who read it.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="brand">
              <Link href="/sign-up">Create your account</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-semibold tracking-[0.2em] text-brand uppercase">{kicker}</p>
      <h2 className="mt-3 font-display text-3xl tracking-tight text-balance md:text-4xl">{title}</h2>
    </div>
  );
}
