"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Compass, Feather, Search } from "lucide-react";
import { quickSearch } from "@/lib/actions/search";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { WRITING_TYPES } from "@/lib/writing-types";

type Results = Awaited<ReturnType<typeof quickSearch>>;

export function SearchCommand() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Results>({ writings: [], authors: [] });
  const [pending, startTransition] = React.useTransition();

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !isTyping(e))) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    const term = query.trim();
    if (term.length < 2) return;
    const t = setTimeout(() => {
      startTransition(async () => setResults(await quickSearch(term)));
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  const hasQuery = query.trim().length >= 2;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="hidden w-52 justify-between text-muted-foreground md:inline-flex"
      >
        <span className="flex items-center gap-2">
          <Search /> Search…
        </span>
        <kbd className="rounded border bg-muted px-1.5 font-mono text-[10px]">⌘K</kbd>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Search"
        onClick={() => setOpen(true)}
      >
        <Search />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="top-[20%] translate-y-0 overflow-hidden p-0" showClose={false}>
          <DialogTitle className="sr-only">Search</DialogTitle>
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search poems, stories, authors…"
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              {hasQuery && !pending && !results.writings.length && !results.authors.length ? (
                <CommandEmpty>Nothing found for “{query}”.</CommandEmpty>
              ) : null}
              {hasQuery ? (
                <>
                  {results.writings.length ? (
                    <CommandGroup heading="Writings">
                      {results.writings.map((w) => (
                        <CommandItem key={w.slug} value={`w-${w.slug}`} onSelect={() => go(`/w/${w.slug}`)}>
                          <Feather />
                          <div className="min-w-0">
                            <div className="truncate font-medium">{w.title || w.excerpt}</div>
                            <div className="truncate text-xs text-muted-foreground">
                              {w.type} · {w.author}
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ) : null}
                  {results.authors.length ? (
                    <CommandGroup heading="Authors">
                      {results.authors.map((a) => (
                        <CommandItem key={a.id} value={`a-${a.id}`} onSelect={() => go(`/@${a.username}`)}>
                          <UserAvatar user={a} className="size-6" />
                          <span>{a.name}</span>
                          <span className="text-xs text-muted-foreground">@{a.username}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ) : null}
                  <CommandGroup>
                    <CommandItem value="all" onSelect={() => go(`/explore?q=${encodeURIComponent(query.trim())}`)}>
                      <Search /> See all results for “{query.trim()}”
                    </CommandItem>
                  </CommandGroup>
                </>
              ) : (
                <CommandGroup heading="Browse">
                  {WRITING_TYPES.map((t) => (
                    <CommandItem key={t.value} value={t.value} onSelect={() => go(`/explore?type=${t.value}`)}>
                      <Compass />
                      <span>{t.label}</span>
                      <span className="text-xs text-muted-foreground">{t.tagline}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}

function isTyping(e: KeyboardEvent) {
  const el = e.target as HTMLElement | null;
  return !!el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));
}
