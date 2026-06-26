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

export default function OrdersPage() {
  const t = useTranslations('account');
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
        <h1 className="text-2xl font-bold">{t('orders')}</h1>
        <div className="flex gap-2">
          <Link href={`/${locale}/account/wishlist`}><Button variant="outline" size="sm">{t('wishlist')}</Button></Link>
          <Link href={`/${locale}/account/profile`}><Button variant="outline" size="sm">{t('profile')}</Button></Link>
        </div>
      </div>
      {orders.length === 0 ? (
        <p className="text-muted">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link key={o.id} href={`/${locale}/account/orders/${o.id}`} className="block rounded-lg border bg-card p-4 hover:shadow-sm">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{o.orderNumber}</p>
                  <p className="text-sm text-muted">{new Date(o.createdAt).toLocaleDateString()} · {o.itemCount} items</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{formatPrice(o.total)}</p>
                  <p className="text-sm capitalize">{o.status.toLowerCase()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
