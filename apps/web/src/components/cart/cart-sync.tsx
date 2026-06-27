'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/lib/store';

/** Syncs cart from Redis on app load — server is source of truth. */
export function CartSync() {
  const fetchCart = useCartStore((s) => s.fetchCart);
  const initialized = useCartStore((s) => s.initialized);

  useEffect(() => {
    if (!initialized) {
      void fetchCart();
    }
  }, [fetchCart, initialized]);

  return null;
}
