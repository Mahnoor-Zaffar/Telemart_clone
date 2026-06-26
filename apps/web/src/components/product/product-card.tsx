import Image from 'next/image';
import Link from 'next/link';
import type { ProductCard as ProductCardType } from '@telemart/types';
import { formatPrice, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ProductCardProps {
  product: ProductCardType;
  locale: string;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <Link href={`/${locale}/product/${product.slug}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width:768px) 50vw, 25vw"
          />
          {discount > 0 && <Badge variant="accent" className="absolute left-2 top-2">-{discount}%</Badge>}
          {product.isFlashDeal && <Badge variant="accent" className="absolute right-2 top-2">Flash</Badge>}
          {product.ptaStatus === 'APPROVED' && (
            <Badge variant="success" className="absolute bottom-2 left-2">PTA</Badge>
          )}
        </div>
        <CardContent className="space-y-2">
          {product.brand && <p className="text-xs text-muted">{product.brand}</p>}
          <h3 className="line-clamp-2 text-sm font-medium leading-snug">{product.title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>
          <p className={cn('text-xs', product.inStock ? 'text-success' : 'text-accent')}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
