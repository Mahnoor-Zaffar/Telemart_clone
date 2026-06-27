/** Curated Unsplash images for seed data — w=600&h=600&fit=crop for product cards */

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/${id}?w=600&h=600&fit=crop&q=80`;

export const CATEGORY_IMAGES: Record<string, string> = {
  mobiles: UNSPLASH('photo-1511707171634-5f897ff02aa9'),
  laptops: UNSPLASH('photo-1496181133206-80ce9b88a853'),
  electronics: UNSPLASH('photo-1523275335684-37898b6baf30'),
  fashion: UNSPLASH('photo-1445205170230-053b83016050'),
  'pre-owned': UNSPLASH('photo-1556656793-08538906a9f8'),
};

const POOLS: Record<string, string[]> = {
  smartphones: [
    UNSPLASH('photo-1592750475338-74b7b21085ab'),
    UNSPLASH('photo-1511707171634-5f897ff02aa9'),
    UNSPLASH('photo-1601784551446-20c9e07cdbdb'),
    UNSPLASH('photo-1556656793-08538906a9f8'),
    UNSPLASH('photo-1592750475338-74b7b21085ab'),
    UNSPLASH('photo-1511707171634-5f897ff02aa9'),
  ],
  tablets: [
    UNSPLASH('photo-1544244015-0df4b3ffc6b0'),
    UNSPLASH('photo-1511707171634-5f897ff02aa9'),
    UNSPLASH('photo-1592750475338-74b7b21085ab'),
  ],
  'mobile-accessories': [
    UNSPLASH('photo-1625842268584-8f3296236761'),
    UNSPLASH('photo-1505740420928-5e560c06d30e'),
    UNSPLASH('photo-1572569511254-d8f925fe2cbb'),
    UNSPLASH('photo-1608043152269-423dbba4e7e1'),
  ],
  'gaming-laptops': [
    UNSPLASH('photo-1496181133206-80ce9b88a853'),
    UNSPLASH('photo-1517336714731-489689fd1ca8'),
    UNSPLASH('photo-1496181133206-80ce9b88a853'),
  ],
  'business-laptops': [
    UNSPLASH('photo-1496181133206-80ce9b88a853'),
    UNSPLASH('photo-1517336714731-489689fd1ca8'),
    UNSPLASH('photo-1517336714731-489689fd1ca8'),
  ],
  smartwatches: [
    UNSPLASH('photo-1523275335684-37898b6baf30'),
    UNSPLASH('photo-1579586337278-3befd40fd17a'),
    UNSPLASH('photo-1523275335684-37898b6baf30'),
  ],
  headphones: [
    UNSPLASH('photo-1505740420928-5e560c06d30e'),
    UNSPLASH('photo-1484704849700-f032a568e944'),
    UNSPLASH('photo-1572569511254-d8f925fe2cbb'),
    UNSPLASH('photo-1608043152269-423dbba4e7e1'),
  ],
  'mens-wear': [
    UNSPLASH('photo-1617137968427-85924c800a22'),
    UNSPLASH('photo-1521572163474-6864f9cf17ab'),
    UNSPLASH('photo-1542291026-7eec264c27ff'),
  ],
  'womens-wear': [
    UNSPLASH('photo-1469334031218-e382a71b716b'),
    UNSPLASH('photo-1515372039744-b8f02a3ae446'),
    UNSPLASH('photo-1445205170230-053b83016050'),
  ],
  'used-phones': [
    UNSPLASH('photo-1556656793-08538906a9f8'),
    UNSPLASH('photo-1601784551446-20c9e07cdbdb'),
    UNSPLASH('photo-1592750475338-74b7b21085ab'),
  ],
  'used-laptops': [
    UNSPLASH('photo-1517336714731-489689fd1ca8'),
    UNSPLASH('photo-1496181133206-80ce9b88a853'),
  ],
};

const DEFAULT_POOL = [UNSPLASH('photo-1563013544-824ae1b704d3')];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function getCategoryImage(slug: string): string {
  return CATEGORY_IMAGES[slug] ?? UNSPLASH('photo-1563013544-824ae1b704d3');
}

export function getProductImage(slug: string, categorySlug: string): string {
  const pool = POOLS[categorySlug] ?? DEFAULT_POOL;
  return pool[hashString(slug) % pool.length];
}

export function getProductGallery(slug: string, categorySlug: string): string[] {
  const primary = getProductImage(slug, categorySlug);
  const pool = POOLS[categorySlug] ?? DEFAULT_POOL;
  const alt = pool[(hashString(slug) + 1) % pool.length];
  return alt === primary ? [primary] : [primary, alt];
}
