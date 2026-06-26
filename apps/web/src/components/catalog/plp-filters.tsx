'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet } from '@/components/ui/sheet';
import { SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PlpFiltersProps {
  locale: string;
  category: string;
  subcategory: string;
  brands: Array<{ name: string; count: number }>;
}

export function PlpFilters({ locale, category, subcategory, brands }: PlpFiltersProps) {
  const t = useTranslations('catalog');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const selectedBrand = searchParams.get('brand') ?? '';
  const minPrice = searchParams.get('minPrice') ?? '';
  const maxPrice = searchParams.get('maxPrice') ?? '';
  const ptaStatus = searchParams.get('ptaStatus') ?? '';

  const apply = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v);
        else params.delete(k);
      });
      params.delete('page');
      router.push(`/${locale}/${category}/${subcategory}?${params.toString()}`);
      setMobileOpen(false);
    },
    [searchParams, router, locale, category, subcategory],
  );

  const clearAll = () => {
    const sort = searchParams.get('sort');
    router.push(`/${locale}/${category}/${subcategory}${sort ? `?sort=${sort}` : ''}`);
    setMobileOpen(false);
  };

  const panel = (
    <div className="space-y-6">
      <div>
        <h3 className="text-body-strong mb-3">{t('brand')}</h3>
        <div className="max-h-48 space-y-2 overflow-y-auto">
          {brands.map((b) => (
            <label key={b.name} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="brand"
                checked={selectedBrand === b.name}
                onChange={() => apply({ brand: b.name })}
                className="accent-[var(--nike-ink)]"
              />
              <span>{b.name}</span>
              <span className="text-[var(--nike-mute)]">({b.count})</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-body-strong mb-3">{t('priceRange')}</h3>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            apply({
              minPrice: String(fd.get('minPrice') ?? ''),
              maxPrice: String(fd.get('maxPrice') ?? ''),
            });
          }}
        >
          <Input name="minPrice" placeholder={t('min')} defaultValue={minPrice} type="number" />
          <Input name="maxPrice" placeholder={t('max')} defaultValue={maxPrice} type="number" />
          <Button type="submit" size="sm">{t('apply')}</Button>
        </form>
      </div>

      <div>
        <h3 className="text-body-strong mb-3">{t('ptaStatus')}</h3>
        <div className="flex flex-wrap gap-2">
          {['APPROVED', 'NON_PTA'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => apply({ ptaStatus: ptaStatus === status ? '' : status })}
              className={ptaStatus === status ? 'nike-filter-chip-active nike-filter-chip' : 'nike-filter-chip'}
            >
              {status === 'APPROVED' ? t('ptaApproved') : t('nonPta')}
            </button>
          ))}
        </div>
      </div>

      <Button variant="secondary" className="w-full" onClick={clearAll}>
        {t('clearFilters')}
      </Button>
    </div>
  );

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        className="mb-4 lg:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <SlidersHorizontal className="mr-2 h-4 w-4" />
        {t('filters')}
      </Button>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen} title={t('filters')}>
        {panel}
      </Sheet>
      <aside className="hidden w-64 shrink-0 lg:block">
        <h2 className="text-heading-lg mb-4">{t('filters')}</h2>
        {panel}
      </aside>
    </>
  );
}
