import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-2", className)} aria-label="Simplicity home">
      <Image
        src="/leaves.png"
        alt=""
        width={26}
        height={26}
        priority
        className="transition-transform duration-500 group-hover:rotate-[-12deg]"
      />
      <span className="font-display text-[1.35rem] leading-none tracking-tight">Simplicity</span>
    </Link>
  );
}
