'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import Link from 'next/link';
import { ProductImage } from '@/components/product/product-image';
import { useCartStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { CartPageSkeleton } from '@/components/skeleton/cart-page-skeleton';
import { useParams } from 'next/navigation';

export default function CartPage() {
  const t = useTranslations('cart');
  const te = useTranslations('empty');
  const { locale } = useParams<{ locale: string }>();
  const { items, fetchCart, updateQuantity, removeItem, loading } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  if (loading && items.length === 0) {
    return <CartPageSkeleton />;
  }

  if (items.length === 0) {
    return (
      <div className="container-main">
        <EmptyState
          title={te('cartTitle')}
          description={te('cartBody')}
          actionLabel={te('shopNow')}
          actionHref={`/${locale}/mobiles/smartphones`}
        />
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      <h1 className="text-heading-xl mb-8">{t('title')}</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 border border-[var(--nike-hairline-soft)] p-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden nike-product-image-bg">
                <ProductImage src={item.imageUrl} alt={item.title} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <Link href={`/${locale}/product/${item.slug}`} className="text-body-strong hover:underline">
                  {item.title}
                </Link>
                <p className="text-body-strong">{formatPrice(item.price)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button type="button" className="nike-filter-chip px-3 py-0" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button type="button" className="nike-filter-chip px-3 py-0" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                  <button type="button" className="ml-auto text-sm text-[var(--nike-sale)]" onClick={() => removeItem(item.productId)}>
                    {t('remove')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="h-fit border border-[var(--nike-hairline-soft)] p-6">
          <p className="flex justify-between text-lg">
            <span>{t('subtotal')}</span>
            <span className="text-body-strong">{formatPrice(subtotal)}</span>
          </p>
          <Link href={`/${locale}/checkout`} className="mt-4 block">
            <Button className="w-full" size="lg">{t('checkout')}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
