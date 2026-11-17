import { Skeleton } from "@/components/ui/skeleton";

export function FeedSkeleton() {
  return (
    <div className="columns-1 gap-5 md:columns-2 [&>*]:mb-5">
      {[220, 300, 180, 260].map((h, i) => (
        <div key={i} className="break-inside-avoid space-y-4 rounded-2xl border p-6">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton style={{ height: h - 120 }} className="w-full" />
          <div className="flex items-center gap-2">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
