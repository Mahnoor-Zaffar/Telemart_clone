import { Injectable } from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';

const TTL = {
  categories: 3600,
  featured: 300,
  weeklyDeals: 300,
  under999: 300,
  brands: 3600,
} as const;

@Injectable()
export class CatalogCacheService {
  constructor(private redis: RedisService) {}

  async get<T>(key: string): Promise<T | null> {
    const raw = await this.redis.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), ttlSeconds);
  }

  async invalidateAll(): Promise<void> {
    await this.redis.delByPrefix('catalog:');
    await this.redis.delByPrefix('search:');
  }

  categoriesKey = 'catalog:categories';
  featuredKey = 'catalog:featured';
  weeklyKey = 'catalog:weekly-deals';
  under999Key = 'catalog:under-999';
  brandsKey(subcategory?: string, category?: string) {
    return `catalog:brands:${subcategory ?? ''}:${category ?? ''}`;
  }

  readonly ttl = TTL;
}
