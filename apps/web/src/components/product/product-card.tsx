import Link from 'next/link';
import type { ProductCard as ProductCardType } from '@telemart/types';
import { formatPrice, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ProductImage } from '@/components/product/product-image';

interface ProductCardProps {
  product: ProductCardType;
  locale: string;
  inStockLabel: string;
  outOfStockLabel: string;
}

export function ProductCard({ product, locale, inStockLabel, outOfStockLabel }: ProductCardProps) {
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <Link href={`/${locale}/product/${product.slug}`} className="group block">
      <article className="bg-[var(--nike-canvas)]">
        <div className="relative aspect-square overflow-hidden nike-product-image-bg">
          <ProductImage
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width:768px) 50vw, 25vw"
          />
          {product.isFlashDeal && (
            <Badge variant="promo" className="absolute left-2 top-2">
              Flash
            </Badge>
          )}
          {product.ptaStatus === 'APPROVED' && (
            <Badge variant="promo" className="absolute bottom-2 left-2">
              PTA
            </Badge>
          )}
        </div>
        <div className="mt-2 space-y-1">
          {product.brand && (
            <p className="text-caption-sm text-[var(--nike-mute)]">{product.brand}</p>
          )}
          <h3 className="text-body-strong line-clamp-2 text-sm leading-snug">{product.title}</h3>
          <div className="flex flex-wrap items-baseline gap-2 pt-1">
            {product.compareAtPrice && discount > 0 ? (
              <>
                <span className="text-body-strong text-[var(--nike-sale)]">
                  {formatPrice(product.price)}
                </span>
                <span className="text-caption-sm text-[var(--nike-mute)] line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
                <Badge variant="sale">-{discount}%</Badge>
              </>
            ) : (
              <span className="text-body-strong">{formatPrice(product.price)}</span>
            )}
          </div>
          <p className={cn('text-caption-sm', product.inStock ? 'text-[var(--nike-success)]' : 'text-[var(--nike-sale)]')}>
            {product.inStock ? inStockLabel : outOfStockLabel}
          </p>
        </div>
      </article>
    </Link>
  );
}
