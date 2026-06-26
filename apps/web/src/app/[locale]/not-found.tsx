import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations('notFound');

  return (
    <div className="container-main flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-display-campaign text-[var(--nike-mute)]">404</p>
      <h1 className="text-heading-xl mt-2">{t('title')}</h1>
      <p className="mt-3 max-w-md text-[var(--nike-mute)]">{t('description')}</p>
      <Link href={`/${locale}`} className="mt-8">
        <Button>{t('backHome')}</Button>
      </Link>
    </div>
  );
}
