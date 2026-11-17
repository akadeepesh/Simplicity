import { Skeleton } from "@/components/ui/skeleton";
import { FeedSkeleton } from "@/components/writing/feed-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 pt-16 sm:px-6">
      <div className="space-y-4">
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-16 w-full max-w-xl" />
        <Skeleton className="h-6 w-full max-w-md" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>
      <FeedSkeleton />
    </div>
  );
}
