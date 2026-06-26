'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useCartStore, useAuthStore } from '@/lib/store';
import { Link as IntlLink } from '@/i18n/navigation';
import { UtilityBar } from './utility-bar';

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartItems = useCartStore((s) => s.items);
  const itemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const user = useAuthStore((s) => s.user);

  const navLinks = [
    { href: '/mobiles/smartphones', label: t('mobiles') },
    { href: '/laptops/gaming-laptops', label: t('laptops') },
    { href: '/electronics/smartwatches', label: t('electronics') },
    { href: '/fashion/mens-wear', label: t('fashion') },
    { href: '/pre-owned/used-phones', label: t('preOwned') },
    { href: '/deals/flash', label: t('flashDeals') },
  ];

  const switchLocale = locale === 'en' ? 'ur' : 'en';

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="sticky top-0 z-50 bg-[var(--nike-canvas)]">
      <UtilityBar />
      <div className="border-b border-[var(--nike-hairline-soft)] shadow-[inset_0_-1px_0_var(--nike-hairline-soft)]">
        <div className="container-main flex h-14 items-center gap-4 md:h-16">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--nike-soft-cloud)] lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <IntlLink href="/" className="text-display-campaign shrink-0 text-2xl tracking-wide md:text-3xl">
            TELEMART
          </IntlLink>

          <nav className="mx-auto hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <IntlLink
                key={link.href}
                href={link.href}
                className="text-body-strong text-sm hover:underline underline-offset-4"
              >
                {link.label}
              </IntlLink>
            ))}
          </nav>

          <form onSubmit={handleSearch} className="hidden max-w-xs flex-1 md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--nike-mute)]" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search')}
                className="pl-10"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-1 sm:gap-3">
            <Link
              href={`/${switchLocale}${pathname}`}
              className="hidden text-caption-sm text-[var(--nike-mute)] hover:text-[var(--nike-ink)] sm:inline"
            >
              {switchLocale === 'ur' ? 'اردو' : 'EN'}
            </Link>
            {user ? (
              <IntlLink
                href="/account/orders"
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--nike-soft-cloud)]"
                aria-label={t('account')}
              >
                <User className="h-5 w-5" />
              </IntlLink>
            ) : (
              <IntlLink
                href="/account/login"
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--nike-soft-cloud)]"
                aria-label={t('login')}
              >
                <User className="h-5 w-5" />
              </IntlLink>
            )}
            <IntlLink
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--nike-soft-cloud)]"
              aria-label={t('cart')}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--nike-ink)] px-1 text-[10px] font-medium text-white">
                  {itemCount}
                </span>
              )}
            </IntlLink>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-b border-[var(--nike-hairline)] bg-[var(--nike-canvas)] px-4 py-4 lg:hidden">
          <form onSubmit={handleSearch} className="mb-4">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('search')} />
          </form>
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <IntlLink
                key={link.href}
                href={link.href}
                className="text-body-strong py-1"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </IntlLink>
            ))}
            <IntlLink href="/vendor/register" className="text-body-strong text-[var(--nike-mute)]">
              {t('vendorRegister')}
            </IntlLink>
          </div>
        </nav>
      )}
    </header>
  );
}
