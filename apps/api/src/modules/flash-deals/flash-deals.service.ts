import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { toProductCard } from '../../common/mappers';

@Injectable()
export class FlashDealsService {
  constructor(private prisma: PrismaService) {}

  async getActiveDeals() {
    const deals = await this.prisma.flashSale.findMany({
      where: { isActive: true, endsAt: { gt: new Date() } },
      include: { product: true },
      orderBy: { endsAt: 'asc' },
    });

    return deals.map((d) => ({
      id: d.id,
      product: toProductCard({ ...d.product, flashDeals: [{ endsAt: d.endsAt, discountPercent: d.discountPercent }] }),
      discountPercent: d.discountPercent,
      endsAt: d.endsAt.toISOString(),
      stockRemaining: d.maxStock - d.soldCount,
    }));
  }
}
