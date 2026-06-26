import { Skeleton } from '@/components/ui/card';
import { ProductGridSkeleton } from './product-grid-skeleton';

export function HomePageSkeleton() {
  return (
    <div>
      <section className="bg-[var(--nike-ink)]">
        <div className="container-main flex min-h-[420px] flex-col justify-end gap-6 py-16 md:min-h-[520px] md:py-24">
          <Skeleton className="h-24 w-full max-w-3xl bg-[var(--nike-charcoal)]" />
          <Skeleton className="h-5 w-full max-w-xl bg-[var(--nike-charcoal)]" />
          <Skeleton className="h-14 w-40 rounded-[30px] bg-[var(--nike-charcoal)]" />
        </div>
      </section>

      <section className="container-main py-12">
        <Skeleton className="mb-6 h-8 w-48" />
        <ProductGridSkeleton count={4} />
      </section>

      <section className="container-main py-12">
        <Skeleton className="mb-6 h-8 w-56" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <Skeleton className="h-20 w-20 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </section>

      <section className="container-main py-12">
        <Skeleton className="mb-6 h-8 w-40" />
        <ProductGridSkeleton count={4} />
      </section>
    </div>
  );
}
