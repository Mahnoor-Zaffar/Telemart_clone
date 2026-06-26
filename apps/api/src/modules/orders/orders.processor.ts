import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

export interface OrderJobData {
  orderId: string;
}

@Processor('orders')
@Injectable()
export class OrdersProcessor extends WorkerHost {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {
    super();
  }

  async process(job: Job<OrderJobData>) {
    const order = await this.prisma.order.findUnique({
      where: { id: job.data.orderId },
      include: { items: true, user: true },
    });
    if (!order) return;

    await this.prisma.order.update({
      where: { id: order.id },
      data: { status: 'CONFIRMED' },
    });

    const email = order.user?.email || order.guestEmail;
    if (email) {
      await this.notifications.sendOrderConfirmation(email, order.orderNumber, Number(order.total));
    }
  }
}
