"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AtSign } from "lucide-react";

/** Shown to signed-in people who skipped choosing a username (e.g. after Google sign-in). */
export function UsernameNudge() {
  const pathname = usePathname();
  if (pathname.startsWith("/onboarding")) return null;
  return (
    <div className="border-b bg-brand/10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-sm sm:px-6">
        <AtSign className="size-4 text-brand" />
        <span>Pick a username to publish, comment and get your own page.</span>
        <Link
          href={`/onboarding?next=${encodeURIComponent(pathname)}`}
          className="font-medium text-brand underline-offset-4 hover:underline"
        >
          Choose one
        </Link>
      </div>
    </div>
  );
}
