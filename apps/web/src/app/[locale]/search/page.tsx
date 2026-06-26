import { setRequestLocale } from 'next-intl/server';
import { serverFetch } from '@/lib/api';
import { ProductCard } from '@/components/product/product-card';
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

  const data = q
    ? await serverFetch<SearchResult>(`/search?q=${encodeURIComponent(q)}&page=${page}`)
    : { products: [], facets: { brands: [], priceRanges: [], ptaStatus: [], conditions: [] }, total: 0, page: 1, query: q };

  return (
    <div className="container-main py-8">
      <h1 className="mb-2 text-2xl font-bold">Search Results</h1>
      {q && <p className="mb-6 text-muted">{data.total} results for &quot;{q}&quot;</p>}
      <div className="grid gap-8 lg:grid-cols-4">
        <aside className="space-y-4">
          <h3 className="font-semibold">Brands</h3>
          {data.facets.brands.slice(0, 10).map((b) => (
            <a key={b.name} href={`?q=${encodeURIComponent(b.name)}`} className="block text-sm text-muted hover:text-primary">
              {b.name} ({b.count})
            </a>
          ))}
        </aside>
        <div className="lg:col-span-3">
          {data.products.length === 0 ? (
            <p className="text-muted">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {data.products.map((p) => <ProductCard key={p.id} product={p} locale={locale} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
