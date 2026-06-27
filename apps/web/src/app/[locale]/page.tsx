import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { serverFetch } from '@/lib/api';
import { ProductCard } from '@/components/product/product-card';
import type { ProductCard as ProductCardType, CategoryTree, FlashDeal } from '@telemart/types';
import { FlashDealStrip } from '@/components/home/flash-deal-strip';
import { CategoryGrid } from '@/components/home/category-grid';
import { PromoCarousel } from '@/components/home/promo-carousel';
import { siteMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return siteMetadata({
    title: 'Telemart Clone',
    description: t('homeDescription'),
    path: `/${locale}`,
  });
}

function SectionHeader({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="text-heading-xl">{title}</h2>
      {href && linkLabel && (
        <Link href={href} className="text-caption-md shrink-0 hover:underline underline-offset-4">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tp = await getTranslations('product');

  const [featured, weekly, under999, flashDeals, categories, brands] = await Promise.all([
    serverFetch<ProductCardType[]>('/catalog/featured', 60, []),
    serverFetch<ProductCardType[]>('/catalog/weekly-deals', 60, []),
    serverFetch<ProductCardType[]>('/catalog/under-999', 60, []),
    serverFetch<FlashDeal[]>('/flash-deals', 60, []),
    serverFetch<CategoryTree[]>('/catalog/categories', 60, []),
    serverFetch<Array<{ name: string; count: number }>>('/catalog/brands', 60, []),
  ]);

  const promoSlides = [
    {
      id: 'hero',
      title: t('promo.heroTitle'),
      subtitle: t('promo.heroSubtitle'),
      cta: t('shopNow'),
      href: '/mobiles/smartphones',
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=600&fit=crop&q=80',
    },
    {
      id: 'flash',
      title: t('promo.flashTitle'),
      subtitle: t('promo.flashSubtitle'),
      cta: t('viewAll'),
      href: '/deals/flash',
      imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=1200&h=600&fit=crop&q=80',
    },
    {
      id: 'preowned',
      title: t('promo.preOwnedTitle'),
      subtitle: t('promo.preOwnedSubtitle'),
      cta: t('shopNow'),
      href: '/pre-owned/used-phones',
      imageUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&h=600&fit=crop&q=80',
    },
  ];

  return (
    <div>
      <PromoCarousel slides={promoSlides} locale={locale} />

      {flashDeals.length > 0 && (
        <section className="container-main section-gap py-12">
          <SectionHeader
            title={t('flashDeals')}
            href={`/${locale}/deals/flash`}
            linkLabel={t('viewAll')}
          />
          <FlashDealStrip
            deals={flashDeals}
            locale={locale}
            inStockLabel={tp('inStock')}
            outOfStockLabel={tp('outOfStock')}
          />
        </section>
      )}

      <section className="container-main section-gap py-12">
        <SectionHeader title={t('shopByCategory')} />
        <CategoryGrid categories={categories} locale={locale} />
      </section>

      <section className="container-main section-gap py-12">
        <SectionHeader title={t('bestSellers')} />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} inStockLabel={tp('inStock')} outOfStockLabel={tp('outOfStock')} />
          ))}
        </div>
      </section>

      <section className="bg-[var(--nike-soft-cloud)] py-12">
        <div className="container-main">
          <SectionHeader title={t('weeklyDeals')} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {weekly.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} inStockLabel={tp('inStock')} outOfStockLabel={tp('outOfStock')} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-main section-gap py-12">
        <SectionHeader title={t('shopByBrand')} />
        <div className="flex flex-wrap gap-3">
          {brands.slice(0, 12).map((b) => (
            <Link
              key={b.name}
              href={`/${locale}/search?q=${encodeURIComponent(b.name)}`}
              className="nike-filter-chip hover:border-[var(--nike-ink)]"
            >
              {b.name} ({b.count})
            </Link>
          ))}
        </div>
      </section>

      <section className="container-main section-gap pb-16 pt-12">
        <SectionHeader title={t('under999')} />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {under999.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} inStockLabel={tp('inStock')} outOfStockLabel={tp('outOfStock')} />
          ))}
        </div>
      </section>
    </div>
  );
}
