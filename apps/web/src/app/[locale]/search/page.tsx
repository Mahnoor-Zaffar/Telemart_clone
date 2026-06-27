import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { serverFetch } from '@/lib/api';
import { ProductCard } from '@/components/product/product-card';
import { EmptyState } from '@/components/ui/empty-state';
import type { SearchResult } from '@telemart/types';

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { locale } = await params;
  const { q = '', page = '1' } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('search');
  const te = await getTranslations('empty');
  const tp = await getTranslations('product');

  const data = q
    ? await serverFetch<SearchResult>(`/search?q=${encodeURIComponent(q)}&page=${page}`)
    : { products: [], facets: { brands: [], priceRanges: [], ptaStatus: [], conditions: [] }, total: 0, page: 1, query: q };

  return (
    <div className="container-main py-8">
      <h1 className="text-heading-xl mb-2">{t('title')}</h1>
      {q && <p className="mb-6 text-[var(--nike-mute)]">{t('results', { count: data.total, query: q })}</p>}
      <div className="grid gap-8 lg:grid-cols-4">
        <aside className="space-y-4">
          <h3 className="text-body-strong">{t('brands')}</h3>
          {data.facets.brands.slice(0, 10).map((b) => (
            <a key={b.name} href={`?q=${encodeURIComponent(b.name)}`} className="block text-sm text-[var(--nike-mute)] hover:text-[var(--nike-ink)]">
              {b.name} ({b.count})
            </a>
          ))}
        </aside>
        <div className="lg:col-span-3">
          {data.products.length === 0 ? (
            <EmptyState
              title={te('searchTitle')}
              description={te('searchBody')}
              actionLabel={te('shopNow')}
              actionHref={`/${locale}/mobiles/smartphones`}
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {data.products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  locale={locale}
                  inStockLabel={tp('inStock')}
                  outOfStockLabel={tp('outOfStock')}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
