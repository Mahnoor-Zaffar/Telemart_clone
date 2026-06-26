'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="container-main py-16 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const { locale } = useParams<{ locale: string }>();
  const orderNumber = searchParams.get('order');

  return (
    <div className="container-main py-16 text-center">
      <div className="mx-auto max-w-md rounded-lg border bg-card p-8">
        <div className="mb-4 text-5xl">✓</div>
        <h1 className="mb-2 text-2xl font-bold text-success">Order Placed!</h1>
        {orderNumber && <p className="mb-4 text-muted">Order #{orderNumber}</p>}
        <p className="mb-6 text-sm">You will receive a confirmation email shortly.</p>
        <Link href={`/${locale}/account/orders`}>
          <Button>View Orders</Button>
        </Link>
      </div>
    </div>
  );
}
