'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';

export default function CartPage() {
  const t = useTranslations('cart');
  const { locale } = useParams<{ locale: string }>();
  const { items, fetchCart, updateQuantity, removeItem, loading } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  if (loading && items.length === 0) {
    return <div className="container-main py-16 text-center">{t('empty')}</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container-main py-16 text-center">
        <p className="mb-4 text-lg">{t('empty')}</p>
        <Link href={`/${locale}`}>
          <Button>{t('continueShopping')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      <h1 className="mb-8 text-2xl font-bold">{t('title')}</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 rounded-lg border bg-card p-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-secondary">
                <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <Link href={`/${locale}/product/${item.slug}`} className="font-medium hover:text-primary">
                  {item.title}
                </Link>
                <p className="text-primary font-bold">{formatPrice(item.price)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    className="rounded border px-2 py-0.5"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="rounded border px-2 py-0.5"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button
                    className="ml-auto text-sm text-accent"
                    onClick={() => removeItem(item.productId)}
                  >
                    {t('remove')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border bg-card p-6 h-fit">
          <p className="flex justify-between text-lg">
            <span>{t('subtotal')}</span>
            <span className="font-bold">{formatPrice(subtotal)}</span>
          </p>
          <Link href={`/${locale}/checkout`} className="mt-4 block">
            <Button className="w-full" size="lg">{t('checkout')}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
