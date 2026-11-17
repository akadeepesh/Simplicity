import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 pt-20">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-12 w-2/3" />
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="mt-10 w-full max-w-md space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-5" style={{ width: `${60 + ((i * 37) % 40)}%` }} />
        ))}
      </div>
    </div>
  );
}
