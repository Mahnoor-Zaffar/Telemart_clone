'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore, useAuthStore } from '@/lib/store';
import { Link as IntlLink, usePathname } from '@/i18n/navigation';

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
  const logout = useAuthStore((s) => s.logout);

  const navLinks = [
    { href: '/mobiles/smartphones', label: t('mobiles') },
    { href: '/laptops/gaming-laptops', label: t('laptops') },
    { href: '/electronics/smartwatches', label: t('electronics') },
    { href: '/fashion/mens-wear', label: t('fashion') },
    { href: '/pre-owned/used-phones', label: t('preOwned') },
    { href: '/deals/flash', label: t('flashDeals') },
    { href: '/blog', label: t('blog') },
  ];

  const switchLocale = locale === 'en' ? 'ur' : 'en';

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="sticky top-0 z-50 bg-card shadow-sm">
      <div className="container-main flex items-center gap-4 py-3">
        <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <Menu className="h-6 w-6" />
        </button>
        <IntlLink href="/" className="text-xl font-bold text-primary shrink-0">
          Telemart
        </IntlLink>
        <form onSubmit={handleSearch} className="hidden flex-1 md:flex max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search')}
              className="pl-10"
            />
          </div>
        </form>
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <Link
            href={`/${switchLocale}${pathname}`}
            className="text-sm font-medium text-muted hover:text-primary"
          >
            {switchLocale === 'ur' ? 'اردو' : 'EN'}
          </Link>
          {user ? (
            <IntlLink href="/account/orders" className="flex items-center gap-1 text-sm hover:text-primary">
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">{user.fullName.split(' ')[0]}</span>
            </IntlLink>
          ) : (
            <IntlLink href="/account/login" className="flex items-center gap-1 text-sm hover:text-primary">
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">{t('login')}</span>
            </IntlLink>
          )}
          <IntlLink href="/cart" className="relative flex items-center gap-1 hover:text-primary">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-white">
                {itemCount}
              </span>
            )}
          </IntlLink>
        </div>
      </div>
      <nav className={`border-t border-border bg-card ${mobileOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="container-main flex flex-wrap gap-1 py-2">
          {navLinks.map((link) => (
            <IntlLink
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm text-foreground hover:bg-secondary hover:text-primary"
            >
              {link.label}
            </IntlLink>
          ))}
          <IntlLink
            href="/vendor/register"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10"
          >
            {t('vendorRegister')}
          </IntlLink>
        </div>
      </nav>
    </header>
  );
}
