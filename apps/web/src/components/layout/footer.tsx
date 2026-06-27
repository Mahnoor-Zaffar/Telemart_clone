import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export async function Footer() {
  const t = await getTranslations('footer');
  const nav = await getTranslations('nav');

  const columns = [
    {
      title: t('shop'),
      links: [
        { href: '/mobiles/smartphones', label: nav('mobiles') },
        { href: '/laptops/gaming-laptops', label: nav('laptops') },
        { href: '/deals/flash', label: nav('flashDeals') },
        { href: '/pre-owned/used-phones', label: nav('preOwned') },
      ],
    },
    {
      title: t('help'),
      links: [
        { href: '/help', label: t('help') },
        { href: '/help/returns', label: t('returns') },
        { href: '/help/about', label: t('about') },
      ],
    },
    {
      title: t('account'),
      links: [
        { href: '/account/login', label: t('signIn') },
        { href: '/account/register', label: t('joinUs') },
        { href: '/vendor/register', label: t('sellOnTelemart') },
      ],
    },
  ];

  return (
    <footer className="mt-auto border-t border-[var(--nike-hairline)] bg-[var(--nike-canvas)]">
      <div className="container-main grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-display-campaign text-3xl">TELEMART</p>
          <p className="mt-3 text-caption-md text-[var(--nike-mute)]">{t('tagline')}</p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-body-strong mb-4">{col.title}</h4>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-caption-md text-[var(--nike-mute)] hover:text-[var(--nike-ink)]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--nike-hairline)]">
        <div className="container-main flex flex-col items-center justify-between gap-2 py-4 text-[9px] font-medium uppercase tracking-wide text-[var(--nike-mute)] sm:flex-row">
          <span>&copy; {new Date().getFullYear()} Telemart Clone. {t('rights')}</span>
          <span>{t('contact')}</span>
        </div>
      </div>
    </footer>
  );
}
