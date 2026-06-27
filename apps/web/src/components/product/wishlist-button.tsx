'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { getAuthToken } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';
import { toast } from '@/components/ui/toast';
import { useRouter, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import type { ProductCard } from '@telemart/types';

export function WishlistButton({ productId }: { productId: string }) {
  const t = useTranslations('product');
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!user && !token) {
      setChecked(true);
      return;
    }
    apiFetch<ProductCard[]>('/wishlist', { token })
      .then((items) => setActive(items.some((i) => i.id === productId)))
      .catch(() => {})
      .finally(() => setChecked(true));
  }, [user, productId]);

  async function toggle() {
    if (!user && !getAuthToken()) {
      router.push(`/${locale}/account/login`);
      return;
    }
    setLoading(true);
    try {
      if (active) {
        await apiFetch(`/wishlist/${productId}`, { method: 'DELETE', token: getAuthToken() });
        setActive(false);
        toast(t('removedFromWishlist'), 'default');
      } else {
        await apiFetch(`/wishlist/${productId}`, {
          method: 'POST',
          token: getAuthToken(),
        });
        setActive(true);
        toast(t('addedToWishlist'), 'success');
      }
    } catch {
      toast(t('wishlistError'), 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading || !checked}
      className={cn(
        'flex h-12 w-12 items-center justify-center rounded-full border border-[var(--nike-hairline)] transition-colors',
        active ? 'bg-[var(--nike-ink)] text-white' : 'hover:bg-[var(--nike-soft-cloud)]',
        !checked && 'opacity-60',
      )}
      aria-label={t('addToWishlist')}
      aria-pressed={active}
    >
      <Heart className={cn('h-5 w-5', active && 'fill-current')} />
    </button>
  );
}
