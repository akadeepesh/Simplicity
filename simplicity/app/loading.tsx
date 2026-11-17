import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading">
      <Image src="/leaves.png" alt="" width={36} height={36} className="animate-pulse opacity-70" />
    </div>
  );
}
