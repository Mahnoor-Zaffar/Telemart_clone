import { Skeleton } from '@/components/ui/card';

export function ProductDetailSkeleton() {
  return (
    <div className="container-main py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-4/5" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24 rounded-[30px]" />
            <Skeleton className="h-6 w-20 rounded-[30px]" />
          </div>
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-12 w-full max-w-xs rounded-[30px]" />
          <div className="space-y-2 pt-4">
            <Skeleton className="h-6 w-36" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
