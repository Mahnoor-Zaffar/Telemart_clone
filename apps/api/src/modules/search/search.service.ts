import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { toProductCard } from '../../common/mappers';
import { productListSelect, clampLimit } from '../../common/product-select';
import { MeilisearchService } from '../../meilisearch/meilisearch.service';
import { SearchResult } from '@telemart/types';

const PRICE_RANGES = [
  { min: 0, max: 999 },
  { min: 1000, max: 9999 },
  { min: 10000, max: 49999 },
  { min: 50000, max: 999999 },
] as const;

@Injectable()
export class SearchService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private meili: MeilisearchService,
  ) {}

  async search(q: string, page = 1, limit = 20): Promise<SearchResult> {
    const safeLimit = clampLimit(limit);
    const cacheKey = `search:${q}:${page}:${safeLimit}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const query = q.trim();
    const result =
      this.meili.isEnabled() && query
        ? await this.searchViaMeili(query, page, safeLimit)
        : await this.searchViaPostgres(query, page, safeLimit);

    await this.redis.set(cacheKey, JSON.stringify(result), 300);
    return result;
  }

  private async searchViaMeili(q: string, page: number, limit: number): Promise<SearchResult> {
    const meiliResult = await this.meili.search(q, page, limit);
    if (!meiliResult) return this.searchViaPostgres(q, page, limit);

    const products = meiliResult.ids.length
      ? await this.prisma.product.findMany({ where: { id: { in: meiliResult.ids } }, select: productListSelect })
      : [];
    const byId = new Map(products.map((p) => [p.id, p]));
    const ordered = meiliResult.ids.map((id) => byId.get(id)).filter(Boolean);
    const where = this.buildPostgresWhere(q);

    const [priceFacets, conditionFacets, ptaFacets] = await Promise.all([
      this.priceRangeFacets(where),
      this.prisma.product.groupBy({ by: ['condition'], where, _count: true }),
      this.prisma.product.groupBy({ by: ['ptaStatus'], where, _count: true }),
    ]);

    return {
      products: ordered.map((p) => toProductCard(p!)),
      total: meiliResult.total,
      page,
      query: q,
      facets: {
        brands: Object.entries(meiliResult.facetHits.brand ?? {}).map(([name, count]) => ({ name, count })),
        priceRanges: priceFacets,
        ptaStatus: ptaFacets.map((p) => ({ status: p.ptaStatus as never, count: p._count })),
        conditions: conditionFacets.map((c) => ({ condition: c.condition as never, count: c._count })),
      },
    };
  }

  private async searchViaPostgres(q: string, page: number, limit: number): Promise<SearchResult> {
    const skip = (page - 1) * limit;
    const query = q.trim().toLowerCase();
    const where = this.buildPostgresWhere(query);

    const [products, total, brandFacets, conditionFacets, ptaFacets, priceFacets] = await Promise.all([
      this.prisma.product.findMany({ where, skip, take: limit, orderBy: { reviewCount: 'desc' }, select: productListSelect }),
      this.prisma.product.count({ where }),
      this.prisma.product.groupBy({ by: ['brand'], where: { ...where, brand: { not: null } }, _count: true }),
      this.prisma.product.groupBy({ by: ['condition'], where, _count: true }),
      this.prisma.product.groupBy({ by: ['ptaStatus'], where, _count: true }),
      this.priceRangeFacets(where),
    ]);

    return {
      products: products.map(toProductCard),
      total,
      page,
      query: q,
      facets: {
        brands: brandFacets.filter((b) => b.brand).map((b) => ({ name: b.brand!, count: b._count })),
        priceRanges: priceFacets,
        ptaStatus: ptaFacets.map((p) => ({ status: p.ptaStatus as never, count: p._count })),
        conditions: conditionFacets.map((c) => ({ condition: c.condition as never, count: c._count })),
      },
    };
  }

  private buildPostgresWhere(query: string): Prisma.ProductWhereInput {
    if (!query) return {};
    return {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { searchVector: { contains: query, mode: 'insensitive' } },
      ],
    };
  }

  private async priceRangeFacets(where: Prisma.ProductWhereInput) {
    const counts = await Promise.all(
      PRICE_RANGES.map(({ min, max }) =>
        this.prisma.product.count({ where: { ...where, price: { gte: min, lte: max } } }),
      ),
    );
    return PRICE_RANGES.map((range, i) => ({ ...range, count: counts[i] }));
  }

  async getTrending(key: string) {
    const cacheKey = `trending:${key}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const products = await this.prisma.product.findMany({
      where:
        key === 'laptops'
          ? { category: { slug: { contains: 'laptop' } } }
          : key === 'mobiles'
            ? { category: { slug: { contains: 'mobile' } } }
            : { isFeatured: true },
      orderBy: { reviewCount: 'desc' },
      take: 8,
      select: productListSelect,
    });

    const items = products.map(toProductCard);
    await this.redis.set(cacheKey, JSON.stringify(items), 900);
    return items;
  }
}
