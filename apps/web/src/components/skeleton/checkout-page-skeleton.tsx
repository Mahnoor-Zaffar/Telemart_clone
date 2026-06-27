import { Skeleton } from '@/components/ui/card';

export function CheckoutPageSkeleton() {
  return (
    <div className="container-main py-8">
      <Skeleton className="mb-8 h-10 w-56" />
      <div className="mb-8 flex gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24" />
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
