import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { serverFetch } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { AddToCartButton } from '@/components/product/add-to-cart-button';
import { WishlistButton } from '@/components/product/wishlist-button';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductReviewsSection } from '@/components/product/product-reviews-section';
import type { ProductDetail, Review } from '@telemart/types';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('product');

  let product: ProductDetail;
  let reviews: Review[] = [];
  try {
    product = await serverFetch<ProductDetail>(`/catalog/products/${slug}`, 300);
    reviews = await serverFetch<Review[]>(`/reviews/product/${product.id}`, 300);
  } catch {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images,
    description: product.description,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'PKR',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="container-main py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery images={product.images.length ? product.images : [product.imageUrl]} title={product.title} />
        <div className="space-y-4">
          {product.brand && <p className="text-caption-md text-[var(--nike-mute)]">{product.brand}</p>}
          <h1 className="text-heading-xl">{product.title}</h1>
          <div className="flex flex-wrap gap-2">
            {product.ptaStatus === 'APPROVED' && <Badge variant="success">{t('ptaApproved')}</Badge>}
            {product.ptaStatus === 'NON_PTA' && <Badge variant="outline">{t('nonPta')}</Badge>}
            {product.condition === 'PRE_OWNED' && product.preOwnedReport && (
              <Badge variant="outline">Grade {product.preOwnedReport.grade}</Badge>
            )}
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-heading-xl text-[var(--nike-ink)]">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-caption-md text-[var(--nike-mute)] line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          <p className={product.inStock ? 'text-[var(--nike-success)]' : 'text-[var(--nike-sale)]'}>
            {product.inStock ? t('inStock') : t('outOfStock')} ({product.stock} available)
          </p>
          <div className="rounded-lg border border-[var(--nike-hairline-soft)] bg-[var(--nike-soft-cloud)] p-4 text-sm space-y-1">
            <p>{t('deliveryEta')}</p>
            <p>{product.condition === 'PRE_OWNED' ? t('preOwnedWarranty') : t('warranty')}</p>
          </div>
          <div className="flex gap-3">
            <AddToCartButton productId={product.id} disabled={!product.inStock} />
            <WishlistButton productId={product.id} />
          </div>
          <div>
            <h2 className="text-body-strong mb-3">{t('specifications')}</h2>
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(product.specs).map(([key, val]) => (
                  <tr key={key} className="border-b border-[var(--nike-hairline-soft)]">
                    <td className="py-2 capitalize text-[var(--nike-mute)]">{key}</td>
                    <td className="py-2 font-medium">{String(val)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ProductReviewsSection
        productId={product.id}
        initialReviews={reviews}
        labels={{ reviews: t('reviews'), noReviews: t('noReviews') }}
      />
    </div>
  );
}
