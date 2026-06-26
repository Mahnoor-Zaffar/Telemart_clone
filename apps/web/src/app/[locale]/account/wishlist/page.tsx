'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { getAuthToken } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';
import type { ProductCard } from '@telemart/types';
import { ProductCard as ProductCardComponent } from '@/components/product/product-card';

export default function WishlistPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [items, setItems] = useState<ProductCard[]>([]);

  useEffect(() => {
    if (!user && !getAuthToken()) {
      router.push(`/${locale}/account/login`);
      return;
    }
    apiFetch<ProductCard[]>('/wishlist', { token: getAuthToken() }).then(setItems).catch(() => {});
  }, [user, locale, router]);

  return (
    <div className="container-main py-8">
      <h1 className="mb-6 text-2xl font-bold">Wishlist</h1>
      {items.length === 0 ? (
        <p className="text-muted">No items in wishlist.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((p) => <ProductCardComponent key={p.id} product={p} locale={locale} />)}
        </div>
      )}
    </div>
  );
}
