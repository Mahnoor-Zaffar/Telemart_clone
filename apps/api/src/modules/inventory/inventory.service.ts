import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class InventoryService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async reserveStock(productId: string, quantity: number): Promise<boolean> {
    const lockKey = `lock:product:${productId}`;
    const acquired = await this.redis.acquireLock(lockKey, 30);
    if (!acquired) {
      await new Promise((r) => setTimeout(r, 100));
      return this.reserveStock(productId, quantity);
    }

    try {
      const product = await this.prisma.product.findUnique({ where: { id: productId } });
      if (!product || product.stock < quantity) return false;

      const result = await this.prisma.product.updateMany({
        where: { id: productId, stock: { gte: quantity }, version: product.version },
        data: { stock: { decrement: quantity }, version: { increment: 1 } },
      });

      return result.count > 0;
    } finally {
      await this.redis.releaseLock(lockKey);
    }
  }

  async releaseStock(productId: string, quantity: number) {
    await this.prisma.product.update({
      where: { id: productId },
      data: { stock: { increment: quantity } },
    });
  }

  async reserveFlashSaleStock(flashSaleId: string, quantity: number): Promise<boolean> {
    const flash = await this.prisma.flashSale.findUnique({
      where: { id: flashSaleId },
      include: { product: true },
    });
    if (!flash || !flash.isActive || flash.endsAt < new Date()) {
      throw new BadRequestException('Flash sale not active');
    }
    if (flash.soldCount + quantity > flash.maxStock) return false;
    return this.reserveStock(flash.productId, quantity);
  }
}
