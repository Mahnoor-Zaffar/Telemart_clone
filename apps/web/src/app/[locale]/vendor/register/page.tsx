'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { PAKISTAN_CITIES } from '@telemart/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';

export default function VendorRegisterPage() {
  const t = useTranslations('vendor');
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const [form, setForm] = useState({
    businessName: '', email: '', phone: '', cnic: '', address: '', city: PAKISTAN_CITIES[0] as string, description: '', password: '', fullName: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch('/vendors/register', { method: 'POST', body: JSON.stringify(form) });
      setSuccess(true);
    } catch (err) {
      toast(err instanceof Error ? err.message : t('registerFailed'), 'error');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="container-main py-16 text-center">
        <h1 className="text-heading-xl mb-4 text-[var(--nike-success)]">{t('successTitle')}</h1>
        <p className="text-[var(--nike-mute)]">{t('successBody')}</p>
        <Button className="mt-6" onClick={() => router.push(`/${locale}`)}>{t('backHome')}</Button>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      <h1 className="text-heading-xl mb-2">{t('title')}</h1>
      <p className="mb-8 text-[var(--nike-mute)]">{t('subtitle')}</p>
      <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-4 border border-[var(--nike-hairline-soft)] p-6">
        <Input placeholder={t('businessName')} value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} required />
        <Input placeholder={t('fullName')} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
        <Input type="email" placeholder={t('email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <Input placeholder={t('phone')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        <Input placeholder={t('cnic')} value={form.cnic} onChange={(e) => setForm({ ...form, cnic: e.target.value })} required />
        <select className="flex h-10 w-full rounded-[24px] border border-[var(--nike-hairline-soft)] bg-[var(--nike-soft-cloud)] px-3 text-sm" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
          {PAKISTAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <Input placeholder={t('address')} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
        <Input placeholder={t('password')} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <textarea
          className="w-full rounded-[24px] border border-[var(--nike-hairline-soft)] bg-[var(--nike-soft-cloud)] p-3 text-sm"
          placeholder={t('about')}
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <Button type="submit" className="w-full" disabled={loading}>{t('submit')}</Button>
      </form>
    </div>
  );
}
