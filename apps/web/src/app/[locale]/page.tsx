import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { serverFetch } from '@/lib/api';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import type { ProductCard as ProductCardType, CategoryTree, FlashDeal } from '@telemart/types';
import { FlashDealStrip } from '@/components/home/flash-deal-strip';
import { CategoryGrid } from '@/components/home/category-grid';
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

  return (
    <div>
      <section className="relative bg-[var(--nike-ink)] text-[var(--nike-on-primary)]">
        <div className="container-main flex min-h-[420px] flex-col justify-end gap-6 py-16 md:min-h-[520px] md:py-24">
          <h1 className="text-display-campaign max-w-4xl">{t('heroTitle')}</h1>
          <p className="max-w-xl text-caption-md text-[var(--nike-stone)] md:text-base">{t('heroSubtitle')}</p>
          <div>
            <Link href={`/${locale}/mobiles/smartphones`}>
              <Button variant="outline-on-image" size="lg">
                {t('shopNow')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

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
