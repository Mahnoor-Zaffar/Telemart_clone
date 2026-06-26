import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { serverFetch } from '@/lib/api';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import type { ProductCard as ProductCardType, CategoryTree, FlashDeal } from '@telemart/types';
import { FlashDealStrip } from '@/components/home/flash-deal-strip';
import { CategoryGrid } from '@/components/home/category-grid';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');

  const [featured, weekly, under999, flashDeals, categories, brands] = await Promise.all([
    serverFetch<ProductCardType[]>('/catalog/featured'),
    serverFetch<ProductCardType[]>('/catalog/weekly-deals'),
    serverFetch<ProductCardType[]>('/catalog/under-999'),
    serverFetch<FlashDeal[]>('/flash-deals'),
    serverFetch<CategoryTree[]>('/catalog/categories'),
    serverFetch<Array<{ name: string; count: number }>>('/catalog/brands'),
  ]);

  return (
    <div>
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container-main flex flex-col items-start gap-4 py-16 md:py-24">
          <h1 className="max-w-2xl text-3xl font-bold md:text-5xl">{t('heroTitle')}</h1>
          <p className="max-w-xl text-lg text-blue-100">{t('heroSubtitle')}</p>
          <Link href={`/${locale}/mobiles/smartphones`}>
            <Button size="lg" className="bg-white text-primary hover:bg-blue-50">
              {t('shopNow')}
            </Button>
          </Link>
        </div>
      </section>

      {flashDeals.length > 0 && (
        <section className="container-main py-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">{t('flashDeals')}</h2>
            <Link href={`/${locale}/deals/flash`} className="text-sm text-primary hover:underline">
              {t('viewAll')}
            </Link>
          </div>
          <FlashDealStrip deals={flashDeals} locale={locale} />
        </section>
      )}

      <section className="container-main py-8">
        <h2 className="mb-6 text-2xl font-bold">{t('shopByCategory')}</h2>
        <CategoryGrid categories={categories} locale={locale} />
      </section>

      <section className="container-main py-8">
        <h2 className="mb-6 text-2xl font-bold">{t('bestSellers')}</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      </section>

      <section className="bg-secondary/50 py-8">
        <div className="container-main">
          <h2 className="mb-6 text-2xl font-bold">{t('weeklyDeals')}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {weekly.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-main py-8">
        <h2 className="mb-6 text-2xl font-bold">{t('shopByBrand')}</h2>
        <div className="flex flex-wrap gap-3">
          {brands.slice(0, 12).map((b) => (
            <Link
              key={b.name}
              href={`/${locale}/search?q=${encodeURIComponent(b.name)}`}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm hover:border-primary hover:text-primary"
            >
              {b.name} ({b.count})
            </Link>
          ))}
        </div>
      </section>

      <section className="container-main py-8">
        <h2 className="mb-6 text-2xl font-bold">{t('under999')}</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {under999.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}
