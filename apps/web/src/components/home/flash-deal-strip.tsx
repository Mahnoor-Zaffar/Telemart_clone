import type { FlashDeal } from '@telemart/types';
import { ProductCard } from '@/components/product/product-card';
import { FlashDealCountdown } from '@/components/home/flash-deal-countdown';

interface FlashDealStripProps {
  deals: FlashDeal[];
  locale: string;
  inStockLabel: string;
  outOfStockLabel: string;
}

export function FlashDealStrip({ deals, locale, inStockLabel, outOfStockLabel }: FlashDealStripProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {deals.map((deal) => (
        <div key={deal.id} className="relative">
          <ProductCard
            product={deal.product}
            locale={locale}
            inStockLabel={inStockLabel}
            outOfStockLabel={outOfStockLabel}
          />
          <div className="absolute left-2 top-2 rounded-[30px] bg-[var(--nike-sale)] px-2 py-0.5 text-xs font-medium text-white">
            -{deal.discountPercent}%
          </div>
          <div className="mt-1 text-center">
            <FlashDealCountdown endsAt={deal.endsAt} />
          </div>
        </div>
      ))}
    </div>
  );
}
