'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store';
import { useState } from 'react';

export function AddToCartButton({ productId, disabled }: { productId: string; disabled?: boolean }) {
  const t = useTranslations('product');
  const addItem = useCartStore((s) => s.addItem);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleAdd() {
    setLoading(true);
    try {
      await addItem(productId);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      size="lg"
      className="w-full sm:w-auto"
      disabled={disabled || loading}
      onClick={handleAdd}
      data-testid="add-to-cart"
    >
      {added ? 'Added!' : t('addToCart')}
    </Button>
  );
}
