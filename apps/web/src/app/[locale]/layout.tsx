import { Bebas_Neue, Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { TrustBar } from '@/components/layout/trust-bar';
import { UtilityBar } from '@/components/layout/utility-bar';
import { CartSync } from '@/components/cart/cart-sync';
import { Toaster } from '@/components/ui/toast';
import { serverFetch } from '@/lib/api';
import type { CategoryTree } from '@telemart/types';
import '../globals.css';

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

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
  const categories = await serverFetch<CategoryTree[]>('/catalog/categories', 3600, []);

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${bebas.variable} ${inter.variable} font-sans`}
    >
      <body className="flex min-h-screen flex-col bg-[var(--nike-canvas)] text-[var(--nike-ink)] antialiased">
        <NextIntlClientProvider messages={messages}>
          <CartSync />
          <UtilityBar />
          <Header categories={categories} />
          <TrustBar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
