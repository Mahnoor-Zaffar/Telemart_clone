import Redis from 'ioredis';

export async function clearCatalogCache() {
  const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 1,
    connectTimeout: 3000,
  });

  try {
    for (const prefix of ['catalog:', 'search:', 'trending:']) {
      let cursor = '0';
      do {
        const [next, keys] = await redis.scan(cursor, 'MATCH', `${prefix}*`, 'COUNT', 100);
        cursor = next;
        if (keys.length) await redis.del(...keys);
      } while (cursor !== '0');
    }
    console.log('Redis catalog cache cleared');
  } catch (err) {
    console.warn('Redis cache clear skipped:', err instanceof Error ? err.message : err);
  } finally {
    redis.disconnect();
  }
}
