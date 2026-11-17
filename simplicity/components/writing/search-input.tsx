"use client";
import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";

export function SearchInput({ placeholder = "Search titles, lines, writers…" }: { placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [value, setValue] = React.useState(sp.get("q") ?? "");
  const [pending, startTransition] = React.useTransition();

  const commit = React.useCallback(
    (q: string) => {
      const next = new URLSearchParams(sp.toString());
      if (q.trim()) next.set("q", q.trim());
      else next.delete("q");
      startTransition(() => router.replace(`${pathname}?${next.toString()}`, { scroll: false }));
    },
    [pathname, router, sp],
  );

  React.useEffect(() => {
    if (value === (sp.get("q") ?? "")) return;
    const t = setTimeout(() => commit(value), 350);
    return () => clearTimeout(t);
  }, [value, sp, commit]);

  return (
    <div className="relative">
      <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="h-14 w-full rounded-2xl border bg-card pr-12 pl-12 font-serif text-lg shadow-sm outline-none placeholder:text-muted-foreground focus-visible:border-brand/60 focus-visible:ring-[3px] focus-visible:ring-ring"
        aria-label="Search"
      />
      <span className="absolute top-1/2 right-4 -translate-y-1/2">
        {pending ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ) : value ? (
          <button
            aria-label="Clear search"
            onClick={() => setValue("")}
            className="rounded-full p-1 text-muted-foreground hover:bg-accent"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </span>
    </div>
  );
}
