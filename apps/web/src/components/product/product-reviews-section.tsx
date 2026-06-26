'use client';

import { useState } from 'react';
import { ReviewForm } from '@/components/product/review-form';
import type { Review } from '@telemart/types';

export function ProductReviewsSection({
  productId,
  initialReviews,
  labels,
}: {
  productId: string;
  initialReviews: Review[];
  labels: {
    reviews: string;
    noReviews: string;
  };
}) {
  const [reviews, setReviews] = useState(initialReviews);

  return (
    <section className="mt-12">
      <h2 className="text-heading-lg mb-4">{labels.reviews}</h2>
      <ReviewForm productId={productId} onSubmitted={(r) => setReviews((prev) => [r, ...prev])} />
      <div className="mt-6 space-y-4">
        {reviews.length === 0 ? (
          <p className="text-[var(--nike-mute)]">{labels.noReviews}</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="rounded-lg border border-[var(--nike-hairline-soft)] p-4">
              <div className="flex items-center gap-2">
                <span className="text-body-strong">{r.userName}</span>
                <span className="text-[var(--nike-sale)]">{'★'.repeat(r.rating)}</span>
              </div>
              <p className="mt-2 text-sm">{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
