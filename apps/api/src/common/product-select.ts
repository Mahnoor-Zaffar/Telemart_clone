import { Prisma } from '@prisma/client';

export const productCardSelect = {
  id: true,
  slug: true,
  title: true,
  price: true,
  compareAtPrice: true,
  imageUrl: true,
  brand: true,
  ptaStatus: true,
  condition: true,
  rating: true,
  reviewCount: true,
  stock: true,
} satisfies Prisma.ProductSelect;

export const productListSelect = {
  ...productCardSelect,
  flashDeals: {
    where: { isActive: true, endsAt: { gt: new Date() } },
    take: 1,
    select: { endsAt: true, discountPercent: true },
  },
} satisfies Prisma.ProductSelect;

export const MAX_PAGE_LIMIT = 100;

export function clampLimit(limit?: number): number {
  const n = limit ?? 20;
  return Math.min(Math.max(1, n), MAX_PAGE_LIMIT);
}
