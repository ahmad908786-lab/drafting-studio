import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="border-b border-border bg-primary py-14">
        <div className="container-page">
          <Skeleton className="h-4 w-40 bg-white/10" />
          <Skeleton className="mt-4 h-10 w-2/3 bg-white/10" />
          <Skeleton className="mt-3 h-5 w-1/2 bg-white/10" />
        </div>
      </div>
      <div className="container-page py-10">
        <Skeleton className="mb-6 h-5 w-28" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-border">
              <Skeleton className="aspect-[3/2] w-full rounded-none" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
