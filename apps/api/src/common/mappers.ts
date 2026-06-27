import { Product } from '@prisma/client';
import { ProductCard, ProductDetail, PtaStatus, ProductCondition, PreOwnedGrade } from '@telemart/types';

type ProductWithFlash = {
  id: string;
  slug: string;
  title: string;
  price: unknown;
  compareAtPrice?: unknown;
  imageUrl: string;
  brand?: string | null;
  ptaStatus: string;
  condition: string;
  rating?: number | null;
  reviewCount: number;
  stock: number;
  flashDeals?: Array<{ endsAt: Date; discountPercent: number }>;
};

export function toProductCard(product: ProductWithFlash | (Product & { flashDeals?: Array<{ endsAt: Date; discountPercent: number }> })): ProductCard {
  const activeFlash = product.flashDeals?.[0];
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
    imageUrl: product.imageUrl,
    brand: product.brand ?? undefined,
    ptaStatus: product.ptaStatus as unknown as PtaStatus,
    condition: product.condition as unknown as ProductCondition,
    rating: product.rating ?? undefined,
    reviewCount: product.reviewCount,
    inStock: product.stock > 0,
    isFlashDeal: !!activeFlash,
    flashEndsAt: activeFlash?.endsAt.toISOString(),
  };
}

export function toProductDetail(
  product: Product & {
    category: { id: string; slug: string; name: string };
    vendor?: { id: string; businessName: string; rating: number | null } | null;
    flashDeals?: Array<{ id: string; endsAt: Date; discountPercent: number }>;
  },
  extra?: { specs?: Record<string, string | number | boolean>; preOwnedReport?: ProductDetail['preOwnedReport'] },
): ProductDetail {
  const card = toProductCard(product);
  const activeFlash = product.flashDeals?.[0];
  return {
    ...card,
    description: product.description,
    descriptionUr: product.descriptionUr ?? undefined,
    images: product.images.length ? product.images : [product.imageUrl],
    stock: product.stock,
    category: product.category,
    vendor: product.vendor
      ? { id: product.vendor.id, name: product.vendor.businessName, rating: product.vendor.rating ?? undefined }
      : undefined,
    specs: (extra?.specs ?? (product.specs as Record<string, string | number | boolean>)) || {},
    preOwnedReport: extra?.preOwnedReport,
    flashSale: activeFlash
      ? { id: activeFlash.id, endsAt: activeFlash.endsAt.toISOString(), discountPercent: activeFlash.discountPercent }
      : undefined,
  };
}

export function buildSearchVector(product: Product): string {
  return [product.title, product.brand, product.description, JSON.stringify(product.specs)]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}
