import { Skeleton } from '@/components/ui/card';
import { ProductGridSkeleton } from '@/components/skeleton/product-grid-skeleton';

export default function Loading() {
  return (
    <div className="container-main py-8">
      <Skeleton className="mb-6 h-8 w-48" />
      <div className="mb-6 flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-[30px]" />
        ))}
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  );
}
