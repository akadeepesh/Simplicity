import { Skeleton } from "@/components/ui/skeleton";
import { FeedSkeleton } from "@/components/writing/feed-skeleton";

export default function Loading() {
  return (
    <div>
      <div className="flex flex-col items-center gap-4 border-b py-14">
        <Skeleton className="size-24 rounded-full" />
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-80" />
      </div>
      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6">
        <FeedSkeleton />
      </div>
    </div>
  );
}
