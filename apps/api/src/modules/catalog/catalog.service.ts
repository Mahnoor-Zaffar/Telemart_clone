import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Prisma } from '@prisma/client';
import slugify from 'slugify';
import { PrismaService } from '../../prisma/prisma.service';
import { PreOwnedReport, ProductSpecs } from '../../mongoose/schemas';
import { buildSearchVector, toProductCard, toProductDetail } from '../../common/mappers';
import { clampLimit, productListSelect } from '../../common/product-select';
import { ProductFilter, PreOwnedGrade, ProductCondition } from '@telemart/types';
import { CatalogCacheService } from './catalog-cache.service';
import { MeilisearchService, toMeiliDoc } from '../../meilisearch/meilisearch.service';

@Injectable()
export class CatalogService {
  constructor(
    private prisma: PrismaService,
    private cache: CatalogCacheService,
    private meili: MeilisearchService,
    @InjectModel(ProductSpecs.name) private specsModel: Model<ProductSpecs>,
    @InjectModel(PreOwnedReport.name) private preOwnedModel: Model<PreOwnedReport>,
  ) {}

  async getCategories() {
    const cached = await this.cache.get<Awaited<ReturnType<CatalogService['fetchCategories']>>>(
      this.cache.categoriesKey,
    );
    if (cached) return cached;
    const data = await this.fetchCategories();
    await this.cache.set(this.cache.categoriesKey, data, this.cache.ttl.categories);
    return data;
  }

  private async fetchCategories() {
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
    const limit = clampLimit(filter.limit);
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
      this.prisma.product.findMany({ where, orderBy, skip, take: limit, select: productListSelect }),
      this.prisma.product.count({ where }),
    ]);

    return { items: items.map(toProductCard), total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getProductBySlug(slug: string, include: string[] = []) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        vendor: true,
        flashDeals: { where: { isActive: true, endsAt: { gt: new Date() } }, take: 1 },
      },
    });
    if (!product) throw new NotFoundException('Product not found');

    const [mongoSpecs, preOwned, reviews] = await Promise.all([
      this.specsModel.findOne({ productId: product.id }).lean(),
      product.condition === 'PRE_OWNED' ? this.preOwnedModel.findOne({ productId: product.id }).lean() : null,
      include.includes('reviews')
        ? this.prisma.review.findMany({
            where: { productId: product.id },
            include: { user: { select: { fullName: true } } },
            orderBy: { createdAt: 'desc' },
            take: 20,
          })
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

    const detail = toProductDetail(product, { specs: normalizedSpecs, preOwnedReport });
    if (!reviews) return detail;

    return {
      ...detail,
      reviews: reviews.map((r) => ({
        id: r.id,
        userId: r.userId,
        userName: r.user.fullName,
        rating: r.rating,
        title: r.title ?? undefined,
        comment: r.comment,
        createdAt: r.createdAt.toISOString(),
      })),
    };
  }

  async getFeatured() {
    const cached = await this.cache.get<ReturnType<typeof toProductCard>[]>(this.cache.featuredKey);
    if (cached) return cached;
    const products = await this.prisma.product.findMany({
      where: { isFeatured: true },
      take: 8,
      select: productListSelect,
    });
    const data = products.map(toProductCard);
    await this.cache.set(this.cache.featuredKey, data, this.cache.ttl.featured);
    return data;
  }

  async getWeeklyDeals() {
    const cached = await this.cache.get<ReturnType<typeof toProductCard>[]>(this.cache.weeklyKey);
    if (cached) return cached;
    const products = await this.prisma.product.findMany({
      where: { isWeeklyDeal: true },
      take: 8,
      select: productListSelect,
    });
    const data = products.map(toProductCard);
    await this.cache.set(this.cache.weeklyKey, data, this.cache.ttl.weeklyDeals);
    return data;
  }

  async getUnder999() {
    const cached = await this.cache.get<ReturnType<typeof toProductCard>[]>(this.cache.under999Key);
    if (cached) return cached;
    const products = await this.prisma.product.findMany({
      where: { isUnder999: true },
      take: 12,
      select: productListSelect,
    });
    const data = products.map(toProductCard);
    await this.cache.set(this.cache.under999Key, data, this.cache.ttl.under999);
    return data;
  }

  async getBrands(subcategory?: string, category?: string) {
    const key = this.cache.brandsKey(subcategory, category);
    const cached = await this.cache.get<Array<{ name: string; count: number }>>(key);
    if (cached) return cached;

    const where: Prisma.ProductWhereInput = { brand: { not: null } };
    if (subcategory) {
      const sub = await this.prisma.category.findUnique({ where: { slug: subcategory } });
      if (sub) where.categoryId = sub.id;
    } else if (category) {
      const cat = await this.prisma.category.findFirst({
        where: { OR: [{ slug: category }, { children: { some: { slug: category } } }] },
      });
      if (cat) {
        const childIds = (await this.prisma.category.findMany({ where: { parentId: cat.id }, select: { id: true } })).map((c) => c.id);
        where.categoryId = { in: [cat.id, ...childIds] };
      }
    }

    const brands = await this.prisma.product.groupBy({ by: ['brand'], where, _count: true });
    const data = brands.filter((b) => b.brand).map((b) => ({ name: b.brand!, count: b._count }));
    await this.cache.set(key, data, this.cache.ttl.brands);
    return data;
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
        isUnder999: data.price < 1000,
      },
      include: { category: { select: { slug: true } } },
    });

    await this.prisma.product.update({
      where: { id: product.id },
      data: { searchVector: buildSearchVector(product) },
    });

    if (data.specs && Object.keys(data.specs).length) {
      await this.specsModel.create({ productId: product.id, categorySlug: product.category.slug, specs: data.specs });
    }

    await this.cache.invalidateAll();
    const row = await this.prisma.product.findUnique({
      where: { id: product.id },
      select: { ...productListSelect, description: true, category: { select: { slug: true } } },
    });
    if (row) await this.meili.indexProducts([toMeiliDoc(row, row.category.slug)]);

    return product;
  }
}
