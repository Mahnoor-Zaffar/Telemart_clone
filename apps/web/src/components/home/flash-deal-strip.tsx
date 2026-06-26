'use client';

import type { FlashDeal } from '@telemart/types';
import { ProductCard } from '@/components/product/product-card';
import { useEffect, useState } from 'react';

function Countdown({ endsAt }: { endsAt: string }) {
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    const tick = () => {
      const diff = new Date(endsAt).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining('Ended');
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${h}h ${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  return <span className="font-mono text-sm text-accent">{remaining}</span>;
}

export function FlashDealStrip({ deals, locale }: { deals: FlashDeal[]; locale: string }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {deals.map((deal) => (
        <div key={deal.id} className="relative">
          <ProductCard product={deal.product} locale={locale} />
          <div className="absolute bottom-16 left-2 rounded bg-accent px-2 py-0.5 text-xs text-white">
            -{deal.discountPercent}%
          </div>
          <div className="mt-1 text-center">
            <Countdown endsAt={deal.endsAt} />
          </div>
        </div>
      ))}
    </div>
  );
}
