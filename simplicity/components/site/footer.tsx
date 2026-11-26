import Link from "next/link";
import { WRITING_TYPES } from "@/lib/writing-types";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t pb-24 md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs font-serif text-[15px] text-muted-foreground italic">
            A quiet place for words. Poems, stories, essays and the small lines in between.
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <h4 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Read</h4>
          <ul className="space-y-2">
            {WRITING_TYPES.map((t) => (
              <li key={t.value}>
                <Link className="hover:text-brand" href={`/read?type=${t.value}`}>
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3 text-sm">
          <h4 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Community</h4>
          <ul className="space-y-2">
            <li>
              <Link className="hover:text-brand" href="/write">Write</Link>
            </li>
            <li>
              <Link className="hover:text-brand" href="/guidelines">Guidelines</Link>
            </li>
            <li>
              <a className="hover:text-brand" href="https://github.com/akadeepesh/Simplicity" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
        <span>© {new Date().getFullYear()} Simplicity</span>
        <span>
          Built by{" "}
          <a href="https://akadeepesh.com?ref=simplicity" className="underline-offset-4 hover:underline" target="_blank" rel="noreferrer">
            Deepesh Kumar
          </a>
        </span>
      </div>
    </footer>
  );
}
