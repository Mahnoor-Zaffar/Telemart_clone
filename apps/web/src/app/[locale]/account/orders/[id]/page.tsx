'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { formatPrice, getAuthToken } from '@/lib/utils';
import type { OrderDetail } from '@telemart/types';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { locale, id } = useParams<{ locale: string; id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);

  useEffect(() => {
    if (id) {
      apiFetch<OrderDetail>(`/orders/${id}`, { token: getAuthToken() }).then(setOrder).catch(() => {});
    }
  }, [id]);

  if (!order) return <div className="container-main py-8">Loading...</div>;

  return (
    <div className="container-main py-8">
      <h1 className="mb-4 text-2xl font-bold">Order {order.orderNumber}</h1>
      <p className="mb-6 capitalize text-muted">Status: {order.status.toLowerCase()}</p>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.productId} className="flex justify-between rounded border p-3 text-sm">
              <span>{item.title} x{item.quantity}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="rounded-lg border p-4 text-sm space-y-2">
          <p><strong>Payment:</strong> {order.paymentMethod}</p>
          <p><strong>Subtotal:</strong> {formatPrice(order.subtotal)}</p>
          <p><strong>Shipping:</strong> {formatPrice(order.shippingFee)}</p>
          {order.codFee > 0 && <p><strong>COD Fee:</strong> {formatPrice(order.codFee)}</p>}
          <p className="text-lg font-bold text-primary">Total: {formatPrice(order.total)}</p>
        </div>
      </div>
    </div>
  );
}
