"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { WRITING_TYPES } from "@/lib/writing-types";
import { cn } from "@/lib/utils";

const SORTS = [
  { value: "latest", label: "Latest" },
  { value: "trending", label: "Trending" },
  { value: "top", label: "Most loved" },
  { value: "following", label: "Following" },
];

function useHref() {
  const pathname = usePathname();
  const sp = useSearchParams();
  return (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    }
    next.delete("page");
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };
}

export function TypeChips({ counts }: { counts?: Partial<Record<string, number>> }) {
  const sp = useSearchParams();
  const href = useHref();
  const active = sp.get("type") ?? "";
  const items = [{ value: "", label: "Everything" }, ...WRITING_TYPES.map((t) => ({ value: t.value, label: t.label }))];
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0">
      {items.map((t) => (
        <Link
          key={t.value}
          href={href({ type: t.value || null, form: null })}
          scroll={false}
          className={cn(
            "shrink-0 rounded-full border px-4 py-1.5 text-sm transition-all",
            active === t.value
              ? "border-primary bg-primary text-primary-foreground"
              : "bg-card/60 text-muted-foreground hover:border-foreground/30 hover:text-foreground",
          )}
        >
          {t.label}
          {t.value && counts?.[t.value] ? (
            <span className="ml-1.5 text-xs opacity-60 tabular-nums">{counts[t.value]}</span>
          ) : null}
        </Link>
      ))}
    </div>
  );
}

export function FormChips() {
  const sp = useSearchParams();
  const href = useHref();
  const type = WRITING_TYPES.find((t) => t.value === sp.get("type"));
  if (!type) return null;
  const active = sp.get("form") ?? "";
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
      {[{ value: "", label: `All ${type.plural.toLowerCase()}` }, ...type.forms].map((f) => (
        <Link
          key={f.value}
          href={href({ form: f.value || null })}
          scroll={false}
          className={cn(
            "border-b border-transparent pb-0.5 text-muted-foreground transition-colors hover:text-foreground",
            active === f.value && "border-brand text-foreground",
          )}
        >
          {f.label}
        </Link>
      ))}
    </div>
  );
}

export function SortTabs({ signedIn }: { signedIn: boolean }) {
  const sp = useSearchParams();
  const href = useHref();
  const active = sp.get("sort") ?? "latest";
  return (
    <div className="inline-flex rounded-full border bg-card/60 p-1 text-sm">
      {SORTS.filter((s) => signedIn || s.value !== "following").map((s) => (
        <Link
          key={s.value}
          href={href({ sort: s.value === "latest" ? null : s.value })}
          scroll={false}
          className={cn(
            "rounded-full px-3 py-1 text-muted-foreground transition-colors hover:text-foreground",
            active === s.value && "bg-secondary text-foreground shadow-sm",
          )}
        >
          {s.label}
        </Link>
      ))}
    </div>
  );
}
