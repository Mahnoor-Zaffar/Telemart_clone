'use client';

import { useSearchParams } from 'next/navigation';
import { Select } from '@/components/ui/select';
import { useTranslations } from 'next-intl';
import { usePlpNavigation } from '@/components/catalog/plp-navigation';

const SORT_OPTIONS = ['newest', 'price_asc', 'price_desc', 'popular', 'rating'] as const;

interface PlpSortBarProps {
  locale: string;
  category: string;
  subcategory: string;
  total: number;
}

export function PlpSortBar({ locale, category, subcategory, total }: PlpSortBarProps) {
  const t = useTranslations('catalog');
  const { navigate } = usePlpNavigation();
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') ?? 'newest';

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <p className="text-caption-md text-[var(--nike-mute)]">{t('results', { count: total })}</p>
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-caption-sm text-[var(--nike-mute)]">
          {t('sortBy')}
        </label>
        <Select
          id="sort"
          value={sort}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set('sort', e.target.value);
            params.delete('page');
            navigate(`/${locale}/${category}/${subcategory}?${params.toString()}`);
          }}
          className="w-44"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {t(`sort.${opt}`)}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
