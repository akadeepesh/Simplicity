"use client";
import "./globals.css";
import { useEffect } from "react";

/** Last-resort fallback for errors thrown by the root layout itself. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 text-center text-foreground">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/leaves.png" alt="" width={48} height={48} className="mb-6" />
        <h1 className="font-serif text-3xl">Something went quiet</h1>
        <p className="mt-3 max-w-sm font-serif text-lg text-muted-foreground italic">
          We couldn&apos;t load Simplicity just now. Please try again in a moment.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground"
        >
          Try again
        </button>
        {error.digest ? <p className="mt-10 font-mono text-xs text-muted-foreground">Ref {error.digest}</p> : null}
      </body>
    </html>
  );
}
