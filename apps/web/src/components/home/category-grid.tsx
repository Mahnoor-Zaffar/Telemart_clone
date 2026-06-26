import Link from 'next/link';
import Image from 'next/image';
import type { CategoryTree } from '@telemart/types';

export function CategoryGrid({ categories, locale }: { categories: CategoryTree[]; locale: string }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/${locale}/${cat.slug}/${cat.children?.[0]?.slug ?? cat.slug}`}
          className="group flex flex-col items-center rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md"
        >
          <div className="relative mb-3 h-16 w-16 overflow-hidden rounded-full bg-secondary">
            {cat.imageUrl && (
              <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover" />
            )}
          </div>
          <span className="text-center text-sm font-medium group-hover:text-primary">
            {locale === 'ur' && cat.nameUr ? cat.nameUr : cat.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
