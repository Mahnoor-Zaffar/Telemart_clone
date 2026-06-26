import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { serverFetch } from '@/lib/api';
import { FlashDealStrip } from '@/components/home/flash-deal-strip';
import type { FlashDeal } from '@telemart/types';

export default async function FlashDealsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const deals = await serverFetch<FlashDeal[]>('/flash-deals');

  return (
    <div className="container-main py-8">
      <h1 className="mb-2 text-3xl font-bold text-accent">{t('flashDeals')}</h1>
      <p className="mb-8 text-muted">Limited time offers — grab them before they&apos;re gone!</p>
      {deals.length > 0 ? (
        <FlashDealStrip deals={deals} locale={locale} />
      ) : (
        <p>No active flash deals right now. Check back soon!</p>
      )}
    </div>
  );
}
