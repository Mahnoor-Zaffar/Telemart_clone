import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  return (
    <div className="container-main max-w-3xl py-12">
      <h1 className="text-heading-xl mb-4">{t('title')}</h1>
      <p className="mb-4 text-[var(--nike-mute)]">{t('intro')}</p>
      <p className="mb-4 text-sm leading-relaxed">{t('mission')}</p>
      <p className="text-sm leading-relaxed text-[var(--nike-ash)]">{t('stack')}</p>
    </div>
  );
}
