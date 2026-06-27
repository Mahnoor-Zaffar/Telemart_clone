import { Skeleton } from '@/components/ui/card';

export function AccountListSkeleton() {
  return (
    <div className="container-main py-8">
      <Skeleton className="mb-6 h-10 w-48" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full max-w-3xl" />
        ))}
      </div>
    </div>
  );
}
