import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { toProductCard } from '../../common/mappers';
import { SearchResult } from '@telemart/types';

@Injectable()
export class SearchService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async search(q: string, page = 1, limit = 20): Promise<SearchResult> {
    const cacheKey = `search:${q}:${page}:${limit}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const skip = (page - 1) * limit;
    const query = q.trim().toLowerCase();

    const where: Prisma.ProductWhereInput = query
      ? {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { brand: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { searchVector: { contains: query, mode: 'insensitive' } },
          ],
        }
      : {};

    const [products, total, brandFacets, conditionFacets, ptaFacets] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { reviewCount: 'desc' },
        include: {
          flashDeals: { where: { isActive: true, endsAt: { gt: new Date() } }, take: 1 },
        },
      }),
      this.prisma.product.count({ where }),
      this.prisma.product.groupBy({
        by: ['brand'],
        where: { ...where, brand: { not: null } },
        _count: true,
      }),
      this.prisma.product.groupBy({
        by: ['condition'],
        where,
        _count: true,
      }),
      this.prisma.product.groupBy({
        by: ['ptaStatus'],
        where,
        _count: true,
      }),
    ]);

    const result: SearchResult = {
      products: products.map(toProductCard),
      total,
      page,
      query: q,
      facets: {
        brands: brandFacets.filter((b) => b.brand).map((b) => ({ name: b.brand!, count: b._count })),
        priceRanges: [
          { min: 0, max: 999, count: 0 },
          { min: 1000, max: 9999, count: 0 },
          { min: 10000, max: 49999, count: 0 },
          { min: 50000, max: 999999, count: 0 },
        ],
        ptaStatus: ptaFacets.map((p) => ({ status: p.ptaStatus as never, count: p._count })),
        conditions: conditionFacets.map((c) => ({ condition: c.condition as never, count: c._count })),
      },
    };

    await this.redis.set(cacheKey, JSON.stringify(result), 300);
    return result;
  }

  async getTrending(key: string) {
    const cacheKey = `trending:${key}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const products = await this.prisma.product.findMany({
      where: key === 'laptops'
        ? { category: { slug: { contains: 'laptop' } } }
        : key === 'mobiles'
          ? { category: { slug: { contains: 'mobile' } } }
          : { isFeatured: true },
      orderBy: { reviewCount: 'desc' },
      take: 8,
    });

    const items = products.map(toProductCard);
    await this.redis.set(cacheKey, JSON.stringify(items), 900);
    return items;
  }
}
