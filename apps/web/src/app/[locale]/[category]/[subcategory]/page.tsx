import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { serverFetch, emptyPaginated } from '@/lib/api';
import { ProductCard } from '@/components/product/product-card';
import { PlpFilters } from '@/components/catalog/plp-filters';
import { PlpSortBar } from '@/components/catalog/plp-sort-bar';
import { PlpNavigationProvider, PlpResultsShell } from '@/components/catalog/plp-navigation';
import { PlpPageSkeleton } from '@/components/skeleton/plp-page-skeleton';
import type { ProductCard as ProductCardType, PaginatedResponse } from '@telemart/types';

async function CategoryContent({
  locale,
  category,
  subcategory,
  searchParams,
  brands,
}: {
  locale: string;
  category: string;
  subcategory: string;
  searchParams: Record<string, string | undefined>;
  brands: Array<{ name: string; count: number }>;
}) {
  const t = await getTranslations('catalog');
  const tp = await getTranslations('product');
  const query = new URLSearchParams({ category, subcategory });
  if (searchParams.sort) query.set('sort', searchParams.sort);
  if (searchParams.brand) query.set('brand', searchParams.brand);
  if (searchParams.minPrice) query.set('minPrice', searchParams.minPrice);
  if (searchParams.maxPrice) query.set('maxPrice', searchParams.maxPrice);
  if (searchParams.ptaStatus) query.set('ptaStatus', searchParams.ptaStatus);
  if (searchParams.page) query.set('page', searchParams.page);

  const data = await serverFetch<PaginatedResponse<ProductCardType>>(
    `/catalog/products?${query.toString()}`,
    60,
    emptyPaginated(),
  );

  return (
    <div className="flex gap-8">
      <PlpFilters locale={locale} category={category} subcategory={subcategory} brands={brands} />
      <PlpResultsShell>
        <h1 className="text-heading-xl mb-2 capitalize">{subcategory.replace(/-/g, ' ')}</h1>
        <PlpSortBar locale={locale} category={category} subcategory={subcategory} total={data.total} />
        {data.items.length === 0 ? (
          <p className="py-12 text-center text-[var(--nike-mute)]">{t('noResults')}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {data.items.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} inStockLabel={tp('inStock')} outOfStockLabel={tp('outOfStock')} />
            ))}
          </div>
        )}
        {data.totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: Math.min(data.totalPages, 5) }, (_, i) => i + 1).map((p) => {
              const params = new URLSearchParams();
              if (searchParams.sort) params.set('sort', searchParams.sort);
              if (searchParams.brand) params.set('brand', searchParams.brand);
              if (searchParams.minPrice) params.set('minPrice', searchParams.minPrice);
              if (searchParams.maxPrice) params.set('maxPrice', searchParams.maxPrice);
              if (searchParams.ptaStatus) params.set('ptaStatus', searchParams.ptaStatus);
              params.set('page', String(p));
              return (
                <a
                  key={p}
                  href={`?${params.toString()}`}
                  className={
                    data.page === p
                      ? 'nike-filter-chip-active nike-filter-chip'
                      : 'nike-filter-chip'
                  }
                >
                  {p}
                </a>
              );
            })}
          </div>
        )}
      </PlpResultsShell>
    </div>
  );
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; category: string; subcategory: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { locale, category, subcategory } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);

  const brands = await serverFetch<Array<{ name: string; count: number }>>(
    `/catalog/brands?subcategory=${subcategory}`,
    60,
    [],
  );

  return (
    <div className="container-main py-8">
      <PlpNavigationProvider>
        <Suspense fallback={<PlpPageSkeleton />}>
          <CategoryContent
            locale={locale}
            category={category}
            subcategory={subcategory}
            searchParams={sp}
            brands={brands}
          />
        </Suspense>
      </PlpNavigationProvider>
    </div>
  );
}
