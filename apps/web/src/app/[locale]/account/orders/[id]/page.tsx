'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { apiFetch } from '@/lib/api';
import { formatPrice, getAuthToken } from '@/lib/utils';
import { toast } from '@/components/ui/toast';
import type { OrderDetail } from '@telemart/types';

export default function OrderDetailPage() {
  const t = useTranslations('orderDetail');
  const tc = useTranslations('common');
  const { id } = useParams<{ locale: string; id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);

  useEffect(() => {
    if (id) {
      apiFetch<OrderDetail>(`/orders/${id}`, { token: getAuthToken() })
        .then(setOrder)
        .catch(() => toast(t('loadError'), 'error'));
    }
  }, [id, t]);

  if (!order) return <div className="container-main py-8">{tc('loading')}</div>;

  return (
    <div className="container-main py-8">
      <h1 className="text-heading-xl mb-4">{t('title', { number: order.orderNumber })}</h1>
      <p className="mb-6 capitalize text-[var(--nike-mute)]">{t('status')}: {order.status.toLowerCase()}</p>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.productId} className="flex justify-between border border-[var(--nike-hairline-soft)] p-3 text-sm">
              <span>{item.title} x{item.quantity}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2 border border-[var(--nike-hairline-soft)] p-4 text-sm">
          <p><strong>{t('payment')}:</strong> {order.paymentMethod}</p>
          <p><strong>{t('subtotal')}:</strong> {formatPrice(order.subtotal)}</p>
          <p><strong>{t('shipping')}:</strong> {formatPrice(order.shippingFee)}</p>
          {order.codFee > 0 && <p><strong>{t('codFee')}:</strong> {formatPrice(order.codFee)}</p>}
          <p className="text-lg font-bold">{t('total')}: {formatPrice(order.total)}</p>
        </div>
      </div>
    </div>
  );
}
