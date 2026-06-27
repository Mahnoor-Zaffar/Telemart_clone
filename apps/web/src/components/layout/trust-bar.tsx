import { getTranslations } from 'next-intl/server';
import { Truck, ShieldCheck, Headphones, BadgeCheck } from 'lucide-react';

/** Compact trust strip — Nike utility-bar style */
export async function TrustBar() {
  const t = await getTranslations('trust');
  const items = [
    { icon: Truck, label: t('cod') },
    { icon: ShieldCheck, label: t('returns') },
    { icon: Headphones, label: t('support') },
    { icon: BadgeCheck, label: t('genuine') },
  ];

  return (
    <div className="border-b border-[var(--nike-hairline-soft)] bg-[var(--nike-soft-cloud)]">
      <div className="container-main flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-2">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-caption-sm text-[var(--nike-ink)]">
            <Icon className="h-3.5 w-3.5" strokeWidth={2} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
