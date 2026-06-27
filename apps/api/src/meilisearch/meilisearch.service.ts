import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type MeilisearchIndex = {
  updateFilterableAttributes(attrs: string[]): Promise<void>;
  updateSortableAttributes(attrs: string[]): Promise<void>;
  addDocuments(docs: MeiliProductDoc[], opts: { primaryKey: string }): Promise<void>;
  deleteDocument(id: string): Promise<void>;
  search(
    q: string,
    opts: { offset: number; limit: number; facets: string[] },
  ): Promise<{
    hits: MeiliProductDoc[];
    estimatedTotalHits?: number;
    facetDistribution?: Record<string, Record<string, number>>;
  }>;
};

type MeilisearchClient = { index(name: string): MeilisearchIndex };

export const PRODUCTS_INDEX = 'products';

export interface MeiliProductDoc {
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
}

@Injectable()
export class MeilisearchService implements OnModuleInit {
  private readonly logger = new Logger(MeilisearchService.name);
  private client: MeilisearchClient | null = null;
  private index: MeilisearchIndex | null = null;
  private enabled = false;

  constructor(private config: ConfigService) {
    const host = this.config.get<string>('MEILISEARCH_HOST');
    if (host) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { Meilisearch } = require('meilisearch') as {
        Meilisearch: new (opts: { host: string; apiKey?: string }) => MeilisearchClient;
      };
      this.client = new Meilisearch({
        host,
        apiKey: this.config.get<string>('MEILISEARCH_API_KEY') || undefined,
      });
      this.index = this.client.index(PRODUCTS_INDEX);
    }
  }

  async onModuleInit() {
    if (!this.index) {
      this.logger.warn('Meilisearch not configured — search uses PostgreSQL fallback');
      return;
    }
    try {
      await this.index.updateFilterableAttributes(['brand', 'price', 'ptaStatus', 'condition', 'categorySlug']);
      await this.index.updateSortableAttributes(['price', 'reviewCount', 'rating']);
      this.enabled = true;
      this.logger.log('Meilisearch index ready');
    } catch (err) {
      this.logger.warn(`Meilisearch unavailable: ${err instanceof Error ? err.message : err}`);
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async indexProducts(docs: MeiliProductDoc[]): Promise<void> {
    if (!this.index || !docs.length) return;
    await this.index.addDocuments(docs, { primaryKey: 'id' });
    this.enabled = true;
  }

  async search(q: string, page = 1, limit = 20) {
    if (!this.index || !this.enabled) return null;
    const offset = (page - 1) * limit;
    const result = await this.index.search(q, {
      offset,
      limit,
      facets: ['brand', 'ptaStatus', 'condition'],
    });
    return {
      ids: result.hits.map((h) => h.id),
      total: result.estimatedTotalHits ?? result.hits.length,
      facetHits: result.facetDistribution ?? {},
    };
  }
}

export function toMeiliDoc(
  product: {
    id: string;
    slug: string;
    title: string;
    brand: string | null;
    description?: string;
    price: unknown;
    ptaStatus: string;
    condition: string;
    reviewCount: number;
    rating: number | null;
    imageUrl: string;
  },
  categorySlug: string,
): MeiliProductDoc {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    brand: product.brand,
    description: product.description ?? product.title,
    price: Number(product.price),
    ptaStatus: product.ptaStatus,
    condition: product.condition,
    categorySlug,
    reviewCount: product.reviewCount,
    rating: product.rating,
    imageUrl: product.imageUrl,
  };
}
