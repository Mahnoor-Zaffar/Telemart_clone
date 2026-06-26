import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { CatalogModule } from '../catalog/catalog.module';
import { VendorsModule } from '../vendors/vendors.module';
import { BlogModule } from '../blog/blog.module';

@Module({
  imports: [CatalogModule, VendorsModule, BlogModule],
  controllers: [AdminController],
})
export class AdminModule {}
