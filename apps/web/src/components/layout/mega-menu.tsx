'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { CategoryTree } from '@telemart/types';
import { cn } from '@/lib/utils';

type MegaMenuProps = {
  categories: CategoryTree[];
  locale: string;
  flashDealsLabel: string;
  flashDealsHref: string;
  onNavigate?: () => void;
  variant?: 'desktop' | 'mobile';
};

export function MegaMenu({
  categories,
  locale,
  flashDealsLabel,
  flashDealsHref,
  onNavigate,
  variant = 'desktop',
}: MegaMenuProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  if (variant === 'mobile') {
    return (
      <div className="flex flex-col gap-1">
        {categories.map((cat) => {
          const label = locale === 'ur' && cat.nameUr ? cat.nameUr : cat.name;
          const expanded = openSlug === cat.slug;
          return (
            <div key={cat.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between py-2 text-body-strong"
                onClick={() => setOpenSlug(expanded ? null : cat.slug)}
              >
                {label}
                <ChevronDown className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')} />
              </button>
              {expanded && cat.children && cat.children.length > 0 && (
                <div className="ml-3 flex flex-col gap-2 pb-2">
                  {cat.children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/${locale}/${cat.slug}/${child.slug}`}
                      className="text-sm text-[var(--nike-mute)] hover:text-[var(--nike-ink)]"
                      onClick={onNavigate}
                    >
                      {locale === 'ur' && child.nameUr ? child.nameUr : child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <Link
          href={flashDealsHref}
          className="text-body-strong py-2 text-[var(--nike-sale)]"
          onClick={onNavigate}
        >
          {flashDealsLabel}
        </Link>
      </div>
    );
  }

  return (
    <nav className="mx-auto hidden items-center gap-1 lg:flex">
      {categories.map((cat) => {
        const label = locale === 'ur' && cat.nameUr ? cat.nameUr : cat.name;
        return (
          <div
            key={cat.id}
            className="group relative"
            onMouseEnter={() => setOpenSlug(cat.slug)}
            onMouseLeave={() => setOpenSlug(null)}
          >
            <Link
              href={`/${locale}/${cat.slug}/${cat.children?.[0]?.slug ?? cat.slug}`}
              className="flex items-center gap-1 px-3 py-2 text-body-strong text-sm hover:underline underline-offset-4"
            >
              {label}
              {cat.children && cat.children.length > 0 && (
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              )}
            </Link>
            {cat.children && cat.children.length > 0 && openSlug === cat.slug && (
              <div className="absolute left-0 top-full z-50 min-w-[220px] border border-[var(--nike-hairline-soft)] bg-[var(--nike-canvas)] py-2 shadow-lg">
                {cat.children.map((child) => (
                  <Link
                    key={child.id}
                    href={`/${locale}/${cat.slug}/${child.slug}`}
                    className="block px-4 py-2 text-sm hover:bg-[var(--nike-soft-cloud)]"
                    onClick={onNavigate}
                  >
                    {locale === 'ur' && child.nameUr ? child.nameUr : child.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <Link
        href={flashDealsHref}
        className="px-3 py-2 text-body-strong text-sm text-[var(--nike-sale)] hover:underline underline-offset-4"
      >
        {flashDealsLabel}
      </Link>
    </nav>
  );
}
