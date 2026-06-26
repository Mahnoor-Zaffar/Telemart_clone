import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CatalogService } from '../catalog/catalog.service';
import { VendorsService } from '../vendors/vendors.service';
import { BlogService } from '../blog/blog.service';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/guards';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PrismaService } from '../../prisma/prisma.service';

class CreateProductDto {
  @IsString() title!: string;
  @IsString() description!: string;
  @IsNumber() price!: number;
  @IsOptional() @IsNumber() compareAtPrice?: number;
  @IsNumber() stock!: number;
  @IsString() imageUrl!: string;
  @IsOptional() @IsString() brand?: string;
  @IsString() categoryId!: string;
  @IsOptional() @IsString() vendorId?: string;
  @IsOptional() @IsString() ptaStatus?: string;
  @IsOptional() @IsString() condition?: string;
}

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(
    private catalog: CatalogService,
    private vendors: VendorsService,
    private blog: BlogService,
    private prisma: PrismaService,
  ) {}

  @Get('stats')
  async stats() {
    const [products, orders, vendors, users] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.vendor.count(),
      this.prisma.user.count(),
    ]);
    return { products, orders, vendors, users };
  }

  @Post('products')
  createProduct(@Body() dto: CreateProductDto) {
    return this.catalog.createProduct(dto);
  }

  @Get('vendors/pending')
  pendingVendors() {
    return this.vendors.getPending();
  }

  @Post('flash-sales')
  async createFlashSale(@Body() dto: { productId: string; discountPercent: number; hours: number; maxStock: number }) {
    const startsAt = new Date();
    const endsAt = new Date(Date.now() + dto.hours * 60 * 60 * 1000);
    return this.prisma.flashSale.create({
      data: {
        productId: dto.productId,
        discountPercent: dto.discountPercent,
        startsAt,
        endsAt,
        maxStock: dto.maxStock,
      },
    });
  }
}
