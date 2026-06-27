import { Skeleton } from '@/components/ui/card';

export function PlpPageSkeleton() {
  return (
    <div className="flex gap-8">
      <aside className="hidden w-64 shrink-0 space-y-6 lg:block">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-16 w-full" />
      </aside>
      <div className="min-w-0 flex-1">
        <Skeleton className="mb-4 h-10 w-48" />
        <Skeleton className="mb-6 h-6 w-32" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
