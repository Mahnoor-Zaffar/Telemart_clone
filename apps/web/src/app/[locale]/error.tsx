'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('common');

  return (
    <div className="container-main flex flex-col items-center py-20 text-center">
      <h1 className="text-heading-lg mb-2">{t('error')}</h1>
      <Button onClick={reset} className="mt-4">{t('retry')}</Button>
    </div>
  );
}
