'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { getAuthToken } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';
import { toast } from '@/components/ui/toast';
import { useRouter, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export function WishlistButton({ productId }: { productId: string }) {
  const t = useTranslations('product');
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);

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
      disabled={loading}
      className={cn(
        'flex h-12 w-12 items-center justify-center rounded-full border border-[var(--nike-hairline)] transition-colors',
        active ? 'bg-[var(--nike-ink)] text-white' : 'hover:bg-[var(--nike-soft-cloud)]',
      )}
      aria-label={t('addToWishlist')}
    >
      <Heart className={cn('h-5 w-5', active && 'fill-current')} />
    </button>
  );
}
