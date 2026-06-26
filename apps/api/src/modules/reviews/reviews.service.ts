import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async getProductReviews(productId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { productId },
      include: { user: { select: { fullName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return reviews.map((r) => ({
      id: r.id,
      userId: r.userId,
      userName: r.user.fullName,
      rating: r.rating,
      title: r.title ?? undefined,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async createReview(userId: string, productId: string, data: { rating: number; title?: string; comment: string }) {
    const existing = await this.prisma.review.findUnique({
      where: { productId_userId: { productId, userId } },
    });
    if (existing) throw new ConflictException('Already reviewed');

    const review = await this.prisma.review.create({
      data: { userId, productId, ...data },
    });

    const agg = await this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: true,
    });

    await this.prisma.product.update({
      where: { id: productId },
      data: { rating: agg._avg.rating, reviewCount: agg._count },
    });

    return review;
  }
}
