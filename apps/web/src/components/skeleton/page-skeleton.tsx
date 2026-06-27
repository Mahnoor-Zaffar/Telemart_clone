import { Skeleton } from '@/components/ui/card';

/** Generic page shell — used for cart, checkout, account, search, etc. */
export function PageSkeleton() {
  return (
    <div className="container-main py-8">
      <Skeleton className="mb-8 h-10 w-64" />
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full max-w-2xl" />
      </div>
    </div>
  );
}
