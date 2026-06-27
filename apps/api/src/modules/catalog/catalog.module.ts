import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { CatalogCacheService } from './catalog-cache.service';
import { DatabaseModule } from '../../mongoose/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CatalogController],
  providers: [CatalogService, CatalogCacheService],
  exports: [CatalogService],
})
export class CatalogModule {}
