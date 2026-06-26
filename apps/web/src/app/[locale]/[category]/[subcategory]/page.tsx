import { setRequestLocale } from 'next-intl/server';
import { serverFetch } from '@/lib/api';
import { ProductCard } from '@/components/product/product-card';
import type { ProductCard as ProductCardType, PaginatedResponse } from '@telemart/types';

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

  const query = new URLSearchParams({ category, subcategory });
  if (sp.sort) query.set('sort', sp.sort);
  if (sp.brand) query.set('brand', sp.brand);
  if (sp.minPrice) query.set('minPrice', sp.minPrice);
  if (sp.maxPrice) query.set('maxPrice', sp.maxPrice);
  if (sp.page) query.set('page', sp.page);

  const data = await serverFetch<PaginatedResponse<ProductCardType>>(
    `/catalog/products?${query.toString()}`,
  );

  return (
    <div className="container-main py-8">
      <h1 className="mb-6 text-2xl font-bold capitalize">
        {subcategory.replace(/-/g, ' ')}
      </h1>
      <div className="mb-6 flex flex-wrap gap-2">
        {['price_asc', 'price_desc', 'newest', 'popular', 'rating'].map((sort) => (
          <a
            key={sort}
            href={`?sort=${sort}`}
            className={`rounded-full border px-3 py-1 text-sm ${sp.sort === sort ? 'border-primary bg-primary/10 text-primary' : 'border-border'}`}
          >
            {sort.replace('_', ' ')}
          </a>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {data.items.map((p) => (
          <ProductCard key={p.id} product={p} locale={locale} />
        ))}
      </div>
      {data.totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: data.totalPages }, (_, i) => i + 1).slice(0, 5).map((p) => (
            <a
              key={p}
              href={`?page=${p}${sp.sort ? `&sort=${sp.sort}` : ''}`}
              className={`rounded border px-3 py-1 text-sm ${data.page === p ? 'border-primary bg-primary text-white' : ''}`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
