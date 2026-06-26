'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { setAuthTokens } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function RegisterPage() {
  const t = useTranslations('nav');
  const ta = useTranslations('auth');
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [form, setForm] = useState({ email: '', password: '', fullName: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const tokens = await apiFetch<{ accessToken: string; refreshToken: string }>(
        '/auth/register',
        { method: 'POST', body: JSON.stringify(form) },
      );
      setAuthTokens(tokens.accessToken, tokens.refreshToken);
      const profile = await apiFetch<{ id: string; email: string; fullName: string; role: string }>(
        '/auth/me',
        { token: tokens.accessToken },
      );
      setUser(profile);
      router.push(`/${locale}/account/orders`);
    } catch (err) {
      setError(err instanceof Error ? err.message : ta('registerFailed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-main flex min-h-[60vh] items-center justify-center py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded-lg border bg-card p-8">
        <h1 className="text-2xl font-bold">{t('register')}</h1>
        {error && <p className="text-sm text-accent">{error}</p>}
        <Input placeholder={ta('fullName')} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
        <Input type="email" placeholder={ta('email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <Input placeholder={ta('phone')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input type="password" placeholder={ta('password')} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <Button type="submit" className="w-full" disabled={loading}>{t('register')}</Button>
        <p className="text-center text-sm">
          {ta('haveAccount')}{' '}
          <Link href={`/${locale}/account/login`} className="text-primary hover:underline">{t('login')}</Link>
        </p>
      </form>
    </div>
  );
}
