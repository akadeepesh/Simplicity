import Link from "next/link";
import { PenLine } from "lucide-react";
import { getViewer } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavLinks } from "./nav-links";
import { SearchCommand } from "./search-command";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { UsernameNudge } from "./username-nudge";

export async function Header() {
  const viewer = await getViewer();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Logo />
        <NavLinks />
        <div className="ml-auto flex items-center gap-1.5">
          <SearchCommand />
          <ThemeToggle />
          {viewer ? (
            <>
              <Button asChild variant="brand" size="sm" className="ml-1">
                <Link href="/write">
                  <PenLine /> <span className="hidden sm:inline">Write</span>
                </Link>
              </Button>
              <div className="ml-1.5">
                <UserMenu user={viewer} />
              </div>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">Start writing</Link>
              </Button>
            </>
          )}
        </div>
      </div>
      {viewer && !viewer.username ? <UsernameNudge /> : null}
    </header>
  );
}
