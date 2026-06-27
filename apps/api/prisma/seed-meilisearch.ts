import { Meilisearch } from 'meilisearch';

const INDEX = 'products';

export async function seedMeilisearch(
  products: Array<{
    id: string;
    slug: string;
    title: string;
    brand: string | null;
    description: string;
    price: number;
    ptaStatus: string;
    condition: string;
    categorySlug: string;
    reviewCount: number;
    rating: number | null;
    imageUrl: string;
  }>,
) {
  const host = process.env.MEILISEARCH_HOST;
  if (!host) {
    console.log('Meilisearch not configured — skipping index');
    return;
  }

  try {
    const client = new Meilisearch({ host, apiKey: process.env.MEILISEARCH_API_KEY || undefined });
    const index = client.index(INDEX);
    await index.updateFilterableAttributes(['brand', 'price', 'ptaStatus', 'condition', 'categorySlug']);
    await index.updateSortableAttributes(['price', 'reviewCount', 'rating']);
    await index.addDocuments(
      products.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        brand: p.brand,
        description: p.description,
        price: p.price,
        ptaStatus: p.ptaStatus,
        condition: p.condition,
        categorySlug: p.categorySlug,
        reviewCount: p.reviewCount,
        rating: p.rating,
        imageUrl: p.imageUrl,
      })),
      { primaryKey: 'id' },
    );
    console.log(`Meilisearch: indexed ${products.length} products`);
  } catch (err) {
    console.warn('Meilisearch indexing skipped:', err instanceof Error ? err.message : err);
  }
}
