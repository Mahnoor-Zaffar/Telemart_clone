import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Prisma } from '@prisma/client';
import slugify from 'slugify';
import { PrismaService } from '../../prisma/prisma.service';
import { PreOwnedReport, ProductSpecs } from '../../mongoose/schemas';
import { buildSearchVector, toProductCard, toProductDetail } from '../../common/mappers';
import { ProductFilter, PreOwnedGrade, ProductCondition } from '@telemart/types';

@Injectable()
export class CatalogService {
  constructor(
    private prisma: PrismaService,
    @InjectModel(ProductSpecs.name) private specsModel: Model<ProductSpecs>,
    @InjectModel(PreOwnedReport.name) private preOwnedModel: Model<PreOwnedReport>,
  ) {}

  async getCategories() {
    const categories = await this.prisma.category.findMany({
      where: { parentId: null },
      include: { children: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { sortOrder: 'asc' },
    });
    return categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      nameUr: c.nameUr ?? undefined,
      imageUrl: c.imageUrl ?? undefined,
      children: c.children.map((ch) => ({
        id: ch.id,
        slug: ch.slug,
        name: ch.name,
        nameUr: ch.nameUr ?? undefined,
      })),
    }));
  }

  async getProducts(filter: ProductFilter) {
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (filter.category) {
      const cat = await this.prisma.category.findFirst({
        where: { OR: [{ slug: filter.category }, { children: { some: { slug: filter.category } } }] },
      });
      if (cat) {
        where.categoryId = cat.parentId ? cat.id : { in: [cat.id, ...(await this.prisma.category.findMany({ where: { parentId: cat.id }, select: { id: true } })).map((c) => c.id)] };
      }
    }

    if (filter.subcategory) {
      const sub = await this.prisma.category.findUnique({ where: { slug: filter.subcategory } });
      if (sub) where.categoryId = sub.id;
    }

    if (filter.brand?.length) where.brand = { in: filter.brand };
    if (filter.minPrice || filter.maxPrice) {
      where.price = {};
      if (filter.minPrice) where.price.gte = filter.minPrice;
      if (filter.maxPrice) where.price.lte = filter.maxPrice;
    }
    if (filter.ptaStatus?.length) where.ptaStatus = { in: filter.ptaStatus };
    if (filter.condition?.length) where.condition = { in: filter.condition as unknown as Prisma.EnumProductConditionFilter['in'] };
    if (filter.grade?.length) where.preOwnedGrade = { in: filter.grade };

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    switch (filter.sort) {
      case 'price_asc': orderBy = { price: 'asc' }; break;
      case 'price_desc': orderBy = { price: 'desc' }; break;
      case 'popular': orderBy = { reviewCount: 'desc' }; break;
      case 'rating': orderBy = { rating: 'desc' }; break;
    }

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          flashDeals: {
            where: { isActive: true, endsAt: { gt: new Date() } },
            take: 1,
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items: items.map(toProductCard),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getProductBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        vendor: true,
        flashDeals: {
          where: { isActive: true, endsAt: { gt: new Date() } },
          take: 1,
        },
      },
    });
    if (!product) throw new NotFoundException('Product not found');

    const [mongoSpecs, preOwned] = await Promise.all([
      this.specsModel.findOne({ productId: product.id }).lean(),
      product.condition === 'PRE_OWNED'
        ? this.preOwnedModel.findOne({ productId: product.id }).lean()
        : null,
    ]);

    const preOwnedReport = preOwned
      ? {
          grade: preOwned.grade as unknown as PreOwnedGrade,
          batteryHealth: preOwned.batteryHealth,
          cosmeticNotes: preOwned.cosmeticNotes,
          warrantyDays: preOwned.warrantyDays,
        }
      : undefined;

    const normalizedSpecs = Object.fromEntries(
      Object.entries(mongoSpecs?.specs ?? (product.specs as Record<string, unknown>)).map(([k, v]) => [
        k,
        Array.isArray(v) ? v.join(', ') : v,
      ]),
    ) as Record<string, string | number | boolean>;

    return toProductDetail(product, { specs: normalizedSpecs, preOwnedReport });
  }

  async getFeatured() {
    const products = await this.prisma.product.findMany({
      where: { isFeatured: true },
      take: 8,
      include: {
        flashDeals: { where: { isActive: true, endsAt: { gt: new Date() } }, take: 1 },
      },
    });
    return products.map(toProductCard);
  }

  async getWeeklyDeals() {
    const products = await this.prisma.product.findMany({
      where: { isWeeklyDeal: true },
      take: 8,
    });
    return products.map(toProductCard);
  }

  async getUnder999() {
    const products = await this.prisma.product.findMany({
      where: { isUnder999: true },
      take: 12,
    });
    return products.map(toProductCard);
  }

  async getBrands() {
    const brands = await this.prisma.product.groupBy({
      by: ['brand'],
      where: { brand: { not: null } },
      _count: true,
    });
    return brands.filter((b) => b.brand).map((b) => ({ name: b.brand!, count: b._count }));
  }

  async createProduct(data: {
    title: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    stock: number;
    imageUrl: string;
    images?: string[];
    brand?: string;
    categoryId: string;
    vendorId?: string;
    ptaStatus?: string;
    condition?: string;
    specs?: Record<string, unknown>;
  }) {
    const slug = slugify(data.title, { lower: true, strict: true }) + '-' + Date.now().toString(36);
    const product = await this.prisma.product.create({
      data: {
        slug,
        title: data.title,
        description: data.description,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        stock: data.stock,
        imageUrl: data.imageUrl,
        images: data.images ?? [data.imageUrl],
        brand: data.brand,
        categoryId: data.categoryId,
        vendorId: data.vendorId,
        ptaStatus: (data.ptaStatus as 'APPROVED' | 'NON_PTA' | 'NA') ?? 'NA',
        condition: (data.condition as ProductCondition) ?? ProductCondition.NEW,
        specs: (data.specs ?? {}) as object,
      },
    });

    await this.prisma.product.update({
      where: { id: product.id },
      data: { searchVector: buildSearchVector(product) },
    });

    if (data.specs && Object.keys(data.specs).length) {
      await this.specsModel.create({
        productId: product.id,
        categorySlug: '',
        specs: data.specs,
      });
    }

    return product;
  }
}
