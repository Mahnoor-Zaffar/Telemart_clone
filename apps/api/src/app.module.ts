import { Module } from '@nestjs/common';
import { MeilisearchModule } from './meilisearch/meilisearch.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { DatabaseModule } from './mongoose/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards';
import { CatalogModule } from './modules/catalog/catalog.module';
import { SearchModule } from './modules/search/search.module';
import { CartModule } from './modules/cart/cart.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { FlashDealsModule } from './modules/flash-deals/flash-deals.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { BlogModule } from './modules/blog/blog.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '../../.env'] }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: new URL(config.get('REDIS_URL') || 'redis://localhost:6379').hostname,
          port: Number(new URL(config.get('REDIS_URL') || 'redis://localhost:6379').port || 6379),
        },
      }),
    }),
    PrismaModule,
    RedisModule,
    MeilisearchModule,
    DatabaseModule,
    AuthModule,
    CatalogModule,
    SearchModule,
    CartModule,
    InventoryModule,
    OrdersModule,
    PaymentsModule,
    FlashDealsModule,
    ReviewsModule,
    WishlistModule,
    VendorsModule,
    BlogModule,
    NotificationsModule,
    AdminModule,
  ],
  controllers: [HealthController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
