'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { formatPrice, getAuthToken } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';
import type { OrderSummary } from '@telemart/types';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export default function OrdersPage() {
  const t = useTranslations('account');
  const te = useTranslations('empty');
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState<OrderSummary[]>([]);

  useEffect(() => {
    if (!user && !getAuthToken()) {
      router.push(`/${locale}/account/login?redirect=/${locale}/account/orders`);
      return;
    }
    apiFetch<OrderSummary[]>('/orders', { token: getAuthToken() })
      .then(setOrders)
      .catch(() => {});
  }, [user, locale, router]);

  return (
    <div className="container-main py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-heading-xl">{t('orders')}</h1>
        <div className="flex gap-2">
          <Link href={`/${locale}/account/wishlist`}><Button variant="outline" size="sm">{t('wishlist')}</Button></Link>
          <Link href={`/${locale}/account/profile`}><Button variant="outline" size="sm">{t('profile')}</Button></Link>
        </div>
      </div>
      {orders.length === 0 ? (
        <EmptyState
          title={te('ordersTitle')}
          description={te('ordersBody')}
          actionLabel={te('shopNow')}
          actionHref={`/${locale}/mobiles/smartphones`}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link key={o.id} href={`/${locale}/account/orders/${o.id}`} className="block border border-[var(--nike-hairline-soft)] p-4 hover:bg-[var(--nike-soft-cloud)]">
              <div className="flex justify-between">
                <div>
                  <p className="text-body-strong">{o.orderNumber}</p>
                  <p className="text-caption-sm text-[var(--nike-mute)]">{new Date(o.createdAt).toLocaleDateString()} · {o.itemCount} items</p>
                </div>
                <div className="text-right">
                  <p className="text-body-strong">{formatPrice(o.total)}</p>
                  <p className="text-caption-sm capitalize">{o.status.toLowerCase()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
