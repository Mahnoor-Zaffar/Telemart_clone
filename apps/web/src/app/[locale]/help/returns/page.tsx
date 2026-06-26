import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';

export default async function ReturnsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('returns');

  const items = [t('eligibility'), t('process'), t('preOwned')];

  return (
    <div className="container-main max-w-3xl py-12">
      <h1 className="text-heading-xl mb-4">{t('title')}</h1>
      <p className="mb-8 text-[var(--nike-mute)]">{t('intro')}</p>
      <ul className="list-disc space-y-4 pl-5 text-sm leading-relaxed text-[var(--nike-ash)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
