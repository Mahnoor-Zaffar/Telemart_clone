'use client';

import { useTranslations } from 'next-intl';
import { ShieldCheck, Truck, Headphones, BadgeCheck, Package } from 'lucide-react';

export function TrustBar() {
  const t = useTranslations('trust');
  const items = [
    { icon: Truck, label: t('cod') },
    { icon: ShieldCheck, label: t('returns') },
    { icon: Headphones, label: t('support') },
    { icon: BadgeCheck, label: t('genuine') },
    { icon: Package, label: t('freeShipping') },
  ];

  return (
    <div className="border-y border-border bg-card">
      <div className="container-main flex flex-wrap items-center justify-center gap-4 py-3 text-xs sm:gap-8 sm:text-sm">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-muted">
            <Icon className="h-4 w-4 text-primary" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
