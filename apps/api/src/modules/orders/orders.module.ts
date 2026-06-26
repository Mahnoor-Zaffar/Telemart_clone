import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersProcessor } from './orders.processor';
import { CartModule } from '../cart/cart.module';
import { InventoryModule } from '../inventory/inventory.module';
import { PaymentsModule } from '../payments/payments.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'orders' }),
    CartModule,
    InventoryModule,
    PaymentsModule,
    NotificationsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersProcessor],
  exports: [OrdersService],
})
export class OrdersModule {}
