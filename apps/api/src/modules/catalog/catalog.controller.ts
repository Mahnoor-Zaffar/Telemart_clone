import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { Public } from '../auth/guards';
import { ProductCondition, PtaStatus, PreOwnedGrade } from '@telemart/types';

@Controller('catalog')
@Public()
export class CatalogController {
  constructor(private catalogService: CatalogService) {}

  @Get('categories')
  getCategories() {
    return this.catalogService.getCategories();
  }

  @Get('products')
  getProducts(
    @Query('category') category?: string,
    @Query('subcategory') subcategory?: string,
    @Query('brand') brand?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('ptaStatus') ptaStatus?: string,
    @Query('condition') condition?: string,
    @Query('grade') grade?: string,
    @Query('sort') sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.catalogService.getProducts({
      category,
      subcategory,
      brand: brand ? brand.split(',') : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      ptaStatus: ptaStatus ? (ptaStatus.split(',') as PtaStatus[]) : undefined,
      condition: condition ? (condition.split(',') as ProductCondition[]) : undefined,
      grade: grade ? (grade.split(',') as unknown as PreOwnedGrade[]) : undefined,
      sort,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
  }

  @Get('products/:slug')
  getProduct(@Param('slug') slug: string) {
    return this.catalogService.getProductBySlug(slug);
  }

  @Get('featured')
  getFeatured() {
    return this.catalogService.getFeatured();
  }

  @Get('weekly-deals')
  getWeeklyDeals() {
    return this.catalogService.getWeeklyDeals();
  }

  @Get('under-999')
  getUnder999() {
    return this.catalogService.getUnder999();
  }

  @Get('brands')
  getBrands(@Query('subcategory') subcategory?: string, @Query('category') category?: string) {
    return this.catalogService.getBrands(subcategory, category);
  }
}
