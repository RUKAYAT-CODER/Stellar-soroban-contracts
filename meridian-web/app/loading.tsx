import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoadingSkeleton() {
  return (
    <div className="w-full space-y-12 p-6 md:p-12">
      {/* Skeleton Hero Layout Structure */}
      <div className="space-y-4 max-w-3xl">
        <Skeleton className="h-10 w-3/4 md:w-1/2" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
      </div>

      {/* 3 Section Cards Layout Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-border p-6 space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}