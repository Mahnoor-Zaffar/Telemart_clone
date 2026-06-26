import Link from 'next/link';
import type { CategoryTree } from '@telemart/types';
import { ProductImage } from '@/components/product/product-image';

export function CategoryGrid({ categories, locale }: { categories: CategoryTree[]; locale: string }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/${locale}/${cat.slug}/${cat.children?.[0]?.slug ?? cat.slug}`}
          className="group flex flex-col items-center bg-[var(--nike-canvas)] p-4 transition-opacity hover:opacity-80"
        >
          <div className="relative mb-3 h-20 w-20 overflow-hidden rounded-full nike-product-image-bg">
            {cat.imageUrl && (
              <ProductImage src={cat.imageUrl} alt={cat.name} fill className="object-cover" />
            )}
          </div>
          <span className="text-body-strong text-center text-sm group-hover:underline">
            {locale === 'ur' && cat.nameUr ? cat.nameUr : cat.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
