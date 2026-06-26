'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function Footer() {
  const t = useTranslations('footer');
  return (
    <footer className="mt-auto border-t border-border bg-slate-900 text-slate-300">
      <div className="container-main grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-4 text-lg font-bold text-white">Telemart</h3>
          <p className="text-sm">Pakistan&apos;s trusted online marketplace for mobiles, electronics, and fashion.</p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/help" className="hover:text-white">{t('help')}</Link></li>
            <li><Link href="/help/returns" className="hover:text-white">{t('returns')}</Link></li>
            <li><Link href="/help/about" className="hover:text-white">{t('about')}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/deals/flash" className="hover:text-white">Flash Deals</Link></li>
            <li><Link href="/pre-owned/used-phones" className="hover:text-white">Pre-Owned</Link></li>
            <li><Link href="/catalog/under-999" className="hover:text-white">Under Rs 999</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Contact</h4>
          <p className="text-sm">{t('contact')}</p>
          <p className="mt-2 text-sm">WhatsApp support available 24/7</p>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-sm">
        &copy; {new Date().getFullYear()} Telemart Clone. {t('rights')}
      </div>
    </footer>
  );
}
