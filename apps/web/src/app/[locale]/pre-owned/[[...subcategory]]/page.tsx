import { setRequestLocale } from 'next-intl/server';
import { serverFetch } from '@/lib/api';
import { ProductCard } from '@/components/product/product-card';
import type { ProductCard as ProductCardType, PaginatedResponse } from '@telemart/types';

export default async function PreOwnedPage({
  params,
}: {
  params: Promise<{ locale: string; subcategory?: string[] }>;
}) {
  const { locale, subcategory: subcategoryParts } = await params;
  const subcategory = subcategoryParts?.[0];
  setRequestLocale(locale);

  const query = subcategory
    ? `subcategory=${subcategory}&condition=PRE_OWNED`
    : 'category=pre-owned&condition=PRE_OWNED';

  const data = await serverFetch<PaginatedResponse<ProductCardType>>(`/catalog/products?${query}`);

  return (
    <div className="container-main py-8">
      <h1 className="mb-2 text-2xl font-bold">Certified Pre-Owned</h1>
      <p className="mb-6 text-muted">30-day warranty · Quality inspected · Graded A/B/C</p>
      <div className="mb-6 flex gap-2">
        {['used-phones', 'used-laptops'].map((sub) => (
          <a
            key={sub}
            href={`/${locale}/pre-owned/${sub}`}
            className={`rounded-full border px-4 py-1 text-sm capitalize ${subcategory === sub ? 'border-primary bg-primary/10' : ''}`}
          >
            {sub.replace(/-/g, ' ')}
          </a>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {data.items.map((p) => <ProductCard key={p.id} product={p} locale={locale} />)}
      </div>
    </div>
  );
}
