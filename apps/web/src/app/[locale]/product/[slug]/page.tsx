import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { serverFetch } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { AddToCartButton } from '@/components/product/add-to-cart-button';
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
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
            <Image src={product.imageUrl} alt={product.title} fill className="object-cover" priority />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.slice(0, 4).map((img, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded border">
                <Image src={img} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {product.brand && <p className="text-muted">{product.brand}</p>}
          <h1 className="text-2xl font-bold md:text-3xl">{product.title}</h1>
          <div className="flex flex-wrap gap-2">
            {product.ptaStatus === 'APPROVED' && <Badge variant="success">{t('ptaApproved')}</Badge>}
            {product.ptaStatus === 'NON_PTA' && <Badge variant="outline">{t('nonPta')}</Badge>}
            {product.condition === 'PRE_OWNED' && product.preOwnedReport && (
              <Badge variant="outline">Grade {product.preOwnedReport.grade}</Badge>
            )}
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-muted line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>
          <p className={product.inStock ? 'text-success' : 'text-accent'}>
            {product.inStock ? t('inStock') : t('outOfStock')} ({product.stock} available)
          </p>
          <div className="rounded-lg border border-border bg-secondary/30 p-4 text-sm space-y-1">
            <p>{t('deliveryEta')}</p>
            <p>{product.condition === 'PRE_OWNED' ? t('preOwnedWarranty') : t('warranty')}</p>
          </div>
          <AddToCartButton productId={product.id} disabled={!product.inStock} />
          <div>
            <h2 className="mb-3 text-lg font-semibold">{t('specifications')}</h2>
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(product.specs).map(([key, val]) => (
                  <tr key={key} className="border-b border-border">
                    <td className="py-2 capitalize text-muted">{key}</td>
                    <td className="py-2 font-medium">{String(val)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {reviews.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold">{t('reviews')}</h2>
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{r.userName}</span>
                  <span className="text-yellow-500">{'★'.repeat(r.rating)}</span>
                </div>
                <p className="mt-2 text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
