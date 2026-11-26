import Image from "next/image";
import { cn } from "@/lib/utils";

/** The leaves mark turning in place. */
export function LeafLoader({
  size = 40,
  label = "Loading",
  className,
}: {
  size?: number;
  label?: string;
  className?: string;
}) {
  return (
    <span role="status" aria-label={label} className={cn("inline-grid shrink-0 place-items-center", className)}>
      <Image
        src="/leaves.png"
        alt=""
        width={size}
        height={size}
        className="animate-leaf-spin motion-reduce:animate-pulse"
      />
    </span>
  );
}
