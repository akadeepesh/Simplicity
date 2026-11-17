import { Skeleton } from "@/components/ui/skeleton";
import { FeedSkeleton } from "@/components/writing/feed-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pt-10 sm:px-6 md:pt-14">
      <Skeleton className="h-12 w-72" />
      <Skeleton className="h-14 w-full rounded-2xl" />
      <FeedSkeleton />
    </div>
  );
}
