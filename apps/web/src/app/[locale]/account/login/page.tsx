'use client';

import { Suspense, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { setAuthTokens } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function LoginPage() {
  const tc = useTranslations('common');
  return (
    <Suspense fallback={<div className="container-main py-12 text-center">{tc('loading')}</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const t = useTranslations('nav');
  const ta = useTranslations('auth');
  const tc = useTranslations('common');
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await apiFetch<{ accessToken: string; refreshToken: string; user: { id: string; email: string; fullName: string; role: string } }>(
        '/auth/login',
        { method: 'POST', body: JSON.stringify({ email, password }) },
      );
      setAuthTokens(result.accessToken, result.refreshToken);
      setUser(result.user);
      router.push(searchParams.get('redirect') || `/${locale}/account/orders`);
    } catch (err) {
      setError(err instanceof Error ? err.message : ta('loginFailed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-main flex min-h-[60vh] items-center justify-center py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded-lg border bg-card p-8">
        <h1 className="text-2xl font-bold">{t('login')}</h1>
        {error && <p className="text-sm text-accent">{error}</p>}
        <Input type="email" placeholder={ta('email')} value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input type="password" placeholder={ta('password')} value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? '...' : t('login')}
        </Button>
        <p className="text-center text-sm">
          {ta('noAccount')}{' '}
          <Link href={`/${locale}/account/register`} className="text-primary hover:underline">
            {t('register')}
          </Link>
        </p>
        <p className="text-center text-xs text-muted">{ta('demoHint')}</p>
      </form>
    </div>
  );
}
