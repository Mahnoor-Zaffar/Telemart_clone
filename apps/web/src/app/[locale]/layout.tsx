import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { TrustBar } from '@/components/layout/trust-bar';
import '../globals.css';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'en' | 'ur')) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === 'ur' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body className="flex min-h-screen flex-col antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <TrustBar />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
