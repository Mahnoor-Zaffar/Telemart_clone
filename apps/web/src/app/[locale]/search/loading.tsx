import { ProductGridSkeleton } from '@/components/skeleton/product-grid-skeleton';
import { Skeleton } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="container-main py-8">
      <Skeleton className="mb-6 h-10 w-72" />
      <ProductGridSkeleton count={8} />
    </div>
  );
}
