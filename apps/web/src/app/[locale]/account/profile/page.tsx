'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProfilePage() {
  const t = useTranslations('profile');
  const tn = useTranslations('nav');
  const { locale } = useParams<{ locale: string }>();
  const { user, logout } = useAuthStore();

  if (!user) {
    return (
      <div className="container-main py-8 text-center">
        <Link href={`/${locale}/account/login`}><Button>{t('loginPrompt')}</Button></Link>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      <h1 className="text-heading-xl mb-6">{t('title')}</h1>
      <div className="max-w-md space-y-3 border border-[var(--nike-hairline-soft)] p-6">
        <p><strong>{t('name')}:</strong> {user.fullName}</p>
        <p><strong>{t('email')}:</strong> {user.email}</p>
        <p><strong>{t('role')}:</strong> {user.role}</p>
        <Button variant="destructive" onClick={logout}>{tn('logout')}</Button>
      </div>
    </div>
  );
}
