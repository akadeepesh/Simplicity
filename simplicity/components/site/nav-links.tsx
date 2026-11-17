"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Read" },
  { href: "/explore", label: "Explore" },
  { href: "/library", label: "Library" },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="ml-4 hidden items-center gap-1 md:flex">
      {LINKS.map((l) => {
        const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
              active && "bg-secondary text-foreground",
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t bg-background/90 py-2 backdrop-blur md:hidden">
      {[...LINKS, { href: "/write", label: "Write" }].map((l) => {
        const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "rounded-full px-4 py-1.5 text-[13px] text-muted-foreground",
              active && "bg-secondary text-foreground",
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
