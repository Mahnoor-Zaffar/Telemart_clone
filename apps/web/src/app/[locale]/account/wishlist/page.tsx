'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { apiFetch } from '@/lib/api';
import { getAuthToken } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';
import { ProductCardClient } from '@/components/product/product-card-client';
import { EmptyState } from '@/components/ui/empty-state';
import { AccountListSkeleton } from '@/components/skeleton/account-list-skeleton';
import type { ProductCard } from '@telemart/types';

export default function WishlistPage() {
  const t = useTranslations('account');
  const te = useTranslations('empty');
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [items, setItems] = useState<ProductCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user && !getAuthToken()) {
      router.push(`/${locale}/account/login`);
      return;
    }
    setLoading(true);
    apiFetch<ProductCard[]>('/wishlist', { token: getAuthToken() })
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [user, locale, router]);

  if (loading) return <AccountListSkeleton />;

  return (
    <div className="container-main py-8">
      <h1 className="text-heading-xl mb-6">{t('wishlist')}</h1>
      {items.length === 0 ? (
        <EmptyState
          title={te('wishlistTitle')}
          description={te('wishlistBody')}
          actionLabel={te('shopNow')}
          actionHref={`/${locale}/mobiles/smartphones`}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((p) => <ProductCardClient key={p.id} product={p} locale={locale} />)}
        </div>
      )}
    </div>
  );
}
