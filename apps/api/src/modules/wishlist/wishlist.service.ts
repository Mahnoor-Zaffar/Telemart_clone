import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { toProductCard } from '../../common/mappers';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getWishlist(userId: string) {
    const items = await this.prisma.wishlistItem.findMany({
      where: { userId },
      include: { product: true },
    });
    return items.map((i) => toProductCard(i.product));
  }

  async add(userId: string, productId: string) {
    await this.prisma.wishlistItem.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId },
      update: {},
    });
    return this.getWishlist(userId);
  }

  async remove(userId: string, productId: string) {
    await this.prisma.wishlistItem.deleteMany({ where: { userId, productId } });
    return this.getWishlist(userId);
  }
}
