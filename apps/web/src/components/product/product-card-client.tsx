'use client';

import { useTranslations } from 'next-intl';
import type { ProductCard as ProductCardType } from '@telemart/types';
import { ProductCard } from '@/components/product/product-card';

/** Client wrapper for pages that cannot pass server-fetched i18n labels. */
export function ProductCardClient({
  product,
  locale,
}: {
  product: ProductCardType;
  locale: string;
}) {
  const t = useTranslations('product');
  return (
    <ProductCard
      product={product}
      locale={locale}
      inStockLabel={t('inStock')}
      outOfStockLabel={t('outOfStock')}
    />
  );
}
