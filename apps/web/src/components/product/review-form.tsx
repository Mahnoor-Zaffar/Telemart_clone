'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import { getAuthToken } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';
import { toast } from '@/components/ui/toast';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { Review } from '@telemart/types';

export function ReviewForm({
  productId,
  onSubmitted,
}: {
  productId: string;
  onSubmitted: (review: Review) => void;
}) {
  const t = useTranslations('product');
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user && !getAuthToken()) {
      router.push(`/${locale}/account/login`);
      return;
    }
    setLoading(true);
    try {
      const review = await apiFetch<Review>(`/reviews/product/${productId}`, {
        method: 'POST',
        token: getAuthToken(),
        body: JSON.stringify({ rating, comment }),
      });
      toast(t('reviewSubmitted'), 'success');
      setComment('');
      onSubmitted(review);
    } catch {
      toast(t('reviewError'), 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-lg border border-[var(--nike-hairline-soft)] p-4">
      <h3 className="text-body-strong">{t('writeReview')}</h3>
      <div className="flex items-center gap-2">
        <label className="text-caption-sm">{t('rating')}</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="rounded-[24px] border border-[var(--nike-hairline-soft)] bg-[var(--nike-soft-cloud)] px-3 py-1"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{n} ★</option>
          ))}
        </select>
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={t('reviewPlaceholder')}
        required
        rows={3}
        className="w-full rounded-[24px] border border-[var(--nike-hairline-soft)] bg-[var(--nike-soft-cloud)] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--nike-ink)]"
      />
      <Button type="submit" disabled={loading}>{t('submitReview')}</Button>
    </form>
  );
}
