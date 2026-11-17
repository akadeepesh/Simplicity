import Link from "next/link";
import { Starfield } from "@/components/site/starfield";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
      <Starfield />
      <p className="relative font-display text-8xl text-brand/40">404</p>
      <h1 className="relative mt-4 font-display text-3xl">This page drifted away</h1>
      <p className="relative mt-3 max-w-sm font-serif text-lg text-muted-foreground italic">
        Like a line you almost remember. It may have been moved, unpublished, or never written.
      </p>
      <div className="relative mt-8 flex gap-3">
        <Button asChild>
          <Link href="/">Back to reading</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/explore">Explore</Link>
        </Button>
      </div>
    </div>
  );
}
