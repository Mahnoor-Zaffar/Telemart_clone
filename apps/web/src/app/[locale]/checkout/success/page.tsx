'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="container-main py-16 text-center">...</div>}>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const t = useTranslations('checkoutSuccess');
  const searchParams = useSearchParams();
  const { locale } = useParams<{ locale: string }>();
  const orderNumber = searchParams.get('order');

  return (
    <div className="container-main py-16 text-center">
      <div className="mx-auto max-w-md border border-[var(--nike-hairline-soft)] p-8">
        <div className="mb-4 text-5xl text-[var(--nike-success)]">✓</div>
        <h1 className="text-heading-xl mb-2 text-[var(--nike-success)]">{t('title')}</h1>
        {orderNumber && <p className="mb-4 text-[var(--nike-mute)]">{t('orderNumber', { number: orderNumber })}</p>}
        <p className="mb-6 text-sm">{t('confirmation')}</p>
        <Link href={`/${locale}/account/orders`}>
          <Button>{t('viewOrders')}</Button>
        </Link>
      </div>
    </div>
  );
}
