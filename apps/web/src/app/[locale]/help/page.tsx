import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';

export default async function HelpPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('help');

  const sections = [
    { title: t('ordersTitle'), body: t('ordersBody') },
    { title: t('paymentTitle'), body: t('paymentBody') },
    { title: t('contactTitle'), body: t('contactBody') },
  ];

  return (
    <div className="container-main max-w-3xl py-12">
      <h1 className="text-heading-xl mb-4">{t('title')}</h1>
      <p className="mb-8 text-[var(--nike-mute)]">{t('intro')}</p>
      <div className="space-y-8">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-body-strong mb-2">{s.title}</h2>
            <p className="text-sm leading-relaxed text-[var(--nike-ash)]">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
