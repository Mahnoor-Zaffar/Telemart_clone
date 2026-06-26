'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import { formatPrice, getAuthToken, getCartId } from '@/lib/utils';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PAKISTAN_CITIES, COD_FEE, FREE_SHIPPING_THRESHOLD, PaymentMethod } from '@telemart/types';

const STEPS = ['shipping', 'payment', 'review'] as const;

export default function CheckoutPage() {
  const t = useTranslations('checkout');
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const items = useCartStore((s) => s.items);

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: '', phone: '', email: '', city: PAKISTAN_CITIES[0] as string, area: '', streetAddress: '', landmark: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);
  const [bnplInstallments, setBnplInstallments] = useState<4 | 6>(4);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 250;
  const codFee = paymentMethod === PaymentMethod.COD ? COD_FEE : 0;
  const total = subtotal + shippingFee + codFee;
  const bnplPerMonth = paymentMethod === PaymentMethod.BNPL ? Math.ceil(total / bnplInstallments) : 0;

  async function placeOrder() {
    setLoading(true);
    try {
      const result = await apiFetch<{ orderNumber: string; redirectUrl?: string }>('/orders', {
        method: 'POST',
        cartId: getCartId(),
        token: getAuthToken(),
        body: JSON.stringify({
          shippingAddress: address,
          paymentMethod,
          guestEmail: address.email || undefined,
          bnplInstallments: paymentMethod === PaymentMethod.BNPL ? bnplInstallments : undefined,
        }),
      });
      router.push(`/${locale}/checkout/success?order=${result.orderNumber}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Order failed');
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-main py-16 text-center">
        <p>Cart is empty</p>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      <h1 className="mb-8 text-2xl font-bold">{t('title')}</h1>
      <div className="mb-8 flex gap-4">
        {STEPS.map((s, i) => (
          <div key={s} className={`flex items-center gap-2 ${i <= step ? 'text-primary' : 'text-muted'}`}>
            <span className={`flex h-8 w-8 items-center justify-center rounded-full border ${i <= step ? 'border-primary bg-primary text-white' : ''}`}>
              {i + 1}
            </span>
            <span className="hidden sm:inline">{t(s)}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {step === 0 && (
            <div className="space-y-4 rounded-lg border bg-card p-6">
              <h2 className="font-semibold">{t('shipping')}</h2>
              <Input placeholder={t('fullName')} value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
              <Input placeholder={t('phone')} value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
              <Input placeholder={t('email')} type="email" value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} />
              <select
                className="flex h-10 w-full rounded-md border border-border bg-card px-3 text-sm"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
              >
                {PAKISTAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <Input placeholder={t('area')} value={address.area} onChange={(e) => setAddress({ ...address, area: e.target.value })} />
              <Input placeholder={t('address')} value={address.streetAddress} onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })} />
              <Input placeholder={t('landmark')} value={address.landmark} onChange={(e) => setAddress({ ...address, landmark: e.target.value })} />
              <Button onClick={() => setStep(1)} disabled={!address.fullName || !address.phone || !address.streetAddress}>
                Continue
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 rounded-lg border bg-card p-6">
              <h2 className="font-semibold">{t('payment')}</h2>
              {[
                { method: PaymentMethod.COD, label: t('cod') },
                { method: PaymentMethod.CARD, label: t('card') },
                { method: PaymentMethod.JAZZCASH, label: t('jazzcash') },
                { method: PaymentMethod.EASYPAISA, label: t('easypaisa') },
                { method: PaymentMethod.BNPL, label: t('bnpl') },
              ].map(({ method, label }) => (
                <label key={method} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${paymentMethod === method ? 'border-primary bg-primary/5' : ''}`}>
                  <input type="radio" name="payment" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                  <span>{label}</span>
                  {method === PaymentMethod.COD && <span className="ml-auto text-sm text-muted">+{formatPrice(COD_FEE)}</span>}
                </label>
              ))}
              {paymentMethod === PaymentMethod.BNPL && (
                <div className="rounded-lg bg-secondary p-4">
                  <p className="mb-2 text-sm">Pay in installments:</p>
                  <div className="flex gap-4">
                    {[4, 6].map((n) => (
                      <button
                        key={n}
                        onClick={() => setBnplInstallments(n as 4 | 6)}
                        className={`rounded border px-4 py-2 text-sm ${bnplInstallments === n ? 'border-primary bg-primary/10' : ''}`}
                      >
                        {n}x {formatPrice(Math.ceil(total / n))}/mo
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                <Button onClick={() => setStep(2)}>Continue</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 rounded-lg border bg-card p-6">
              <h2 className="font-semibold">{t('review')}</h2>
              <div className="text-sm space-y-1">
                <p><strong>{address.fullName}</strong> — {address.phone}</p>
                <p>{address.streetAddress}, {address.area}, {address.city}</p>
                {address.landmark && <p>Landmark: {address.landmark}</p>}
                <p className="mt-2">Payment: {paymentMethod}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={placeOrder} disabled={loading}>
                  {loading ? 'Processing...' : t('placeOrder')}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-lg border bg-card p-6 h-fit sticky top-24">
          <h3 className="mb-4 font-semibold">{t('orderSummary')}</h3>
          {items.map((i) => (
            <div key={i.productId} className="flex justify-between text-sm py-1">
              <span className="line-clamp-1 flex-1">{i.title} x{i.quantity}</span>
              <span>{formatPrice(i.price * i.quantity)}</span>
            </div>
          ))}
          <hr className="my-3" />
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span>{t('shippingFee')}</span><span>{formatPrice(shippingFee)}</span></div>
            {codFee > 0 && <div className="flex justify-between"><span>{t('codFee')}</span><span>{formatPrice(codFee)}</span></div>}
            {paymentMethod === PaymentMethod.BNPL && (
              <div className="flex justify-between text-primary"><span>BNPL ({bnplInstallments}x)</span><span>{formatPrice(bnplPerMonth)}/mo</span></div>
            )}
          </div>
          <div className="mt-3 flex justify-between text-lg font-bold">
            <span>{t('total')}</span>
            <span className="text-primary">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
