import { LeafLoader } from "@/components/site/leaf-loader";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LeafLoader />
    </div>
  );
}
