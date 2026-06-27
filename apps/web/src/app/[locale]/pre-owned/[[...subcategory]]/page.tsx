import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { serverFetch, emptyPaginated } from '@/lib/api';
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
  const t = await getTranslations('preOwned');
  const tp = await getTranslations('product');

  const query = subcategory
    ? `subcategory=${subcategory}&condition=PRE_OWNED`
    : 'category=pre-owned&condition=PRE_OWNED';

  const data = await serverFetch<PaginatedResponse<ProductCardType>>(`/catalog/products?${query}`, 60, emptyPaginated());

  const subs = [
    { slug: 'used-phones', label: t('usedPhones') },
    { slug: 'used-laptops', label: t('usedLaptops') },
  ];

  return (
    <div className="container-main py-8">
      <h1 className="text-heading-xl mb-2">{t('title')}</h1>
      <p className="mb-6 text-[var(--nike-mute)]">{t('subtitle')}</p>
      <div className="mb-6 flex gap-2">
        {subs.map(({ slug, label }) => (
          <a
            key={slug}
            href={`/${locale}/pre-owned/${slug}`}
            className={subcategory === slug ? 'nike-filter-chip-active nike-filter-chip' : 'nike-filter-chip'}
          >
            {label}
          </a>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {data.items.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            locale={locale}
            inStockLabel={tp('inStock')}
            outOfStockLabel={tp('outOfStock')}
          />
        ))}
      </div>
    </div>
  );
}
