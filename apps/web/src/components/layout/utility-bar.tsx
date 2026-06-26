'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export function UtilityBar() {
  const t = useTranslations('nav');
  const locale = useLocale();

  return (
    <div className="hidden h-9 items-center justify-end gap-6 bg-[var(--nike-soft-cloud)] px-4 text-xs font-medium text-[var(--nike-ink)] sm:flex sm:px-8 lg:px-12">
      <span className="mr-auto hidden lg:inline">{t('support')}</span>
      <Link href={`/${locale}/help`} className="hover:underline">
        {t('help')}
      </Link>
      <Link href={`/${locale}/account/register`} className="hover:underline">
        {t('register')}
      </Link>
      <Link href={`/${locale}/account/login`} className="hover:underline">
        {t('login')}
      </Link>
    </div>
  );
}
