import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community guidelines",
  description: "How we keep Simplicity a kind, honest place for writers and readers.",
};

const RULES = [
  {
    title: "Share your own words",
    body: "Post only what you wrote. Quoting others is fine inside a piece when credited, but passing off someone else's work as yours is not.",
  },
  {
    title: "Be kind in responses",
    body: "Critique the writing, never the writer. Disagreement is welcome; cruelty, harassment and hate are not.",
  },
  {
    title: "Mind the reader",
    body: "Difficult subjects belong in literature. Gratuitously explicit or violent content does not. When in doubt, add context in the subtitle or tags.",
  },
  {
    title: "No spam or promotion",
    body: "Don't post the same piece repeatedly, flood the feed, or use writings as ads.",
  },
  {
    title: "Respect privacy",
    body: "Don't share anyone's personal information without their consent.",
  },
  {
    title: "Report, don't retaliate",
    body: "If something breaks these guidelines, use Report. Reports are private and reviewed by a human.",
  },
];

export default function GuidelinesPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-12 sm:px-6 md:pt-20">
      <p className="text-xs font-semibold tracking-[0.2em] text-brand uppercase">Community</p>
      <h1 className="mt-2 font-display text-5xl tracking-tight">Guidelines</h1>
      <p className="mt-5 font-serif text-xl text-muted-foreground italic">
        Simplicity works because people feel safe enough to be honest here. These few rules keep it that way.
      </p>
      <ol className="mt-12 space-y-10">
        {RULES.map((r, i) => (
          <li key={r.title} className="flex gap-6">
            <span className="font-display text-3xl text-brand/60 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h2 className="font-display text-2xl">{r.title}</h2>
              <p className="mt-2 font-serif text-lg leading-relaxed text-foreground/85">{r.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-16 border-t pt-8 text-sm text-muted-foreground">
        Content that breaks these guidelines may be removed, and repeat violations can lead to account suspension.
      </p>
    </div>
  );
}
