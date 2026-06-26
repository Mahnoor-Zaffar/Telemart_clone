import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { COD_FEE, FREE_SHIPPING_THRESHOLD } from '@telemart/types';
import { PrismaService } from '../../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { InventoryService } from '../inventory/inventory.service';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
    private inventory: InventoryService,
    private payments: PaymentsService,
    @InjectQueue('orders') private ordersQueue: Queue,
  ) {}

  private generateOrderNumber() {
    return `TM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  }

  async createOrder(params: {
    cartId: string;
    userId?: string;
    guestEmail?: string;
    shippingAddress: Record<string, unknown>;
    paymentMethod: PaymentMethod;
    bnplInstallments?: number;
  }) {
    const cart = await this.cartService.getCart(params.cartId);
    if (!cart.length) throw new BadRequestException('Cart is empty');

    for (const item of cart) {
      const reserved = await this.inventory.reserveStock(item.productId, item.quantity);
      if (!reserved) {
        throw new BadRequestException(`Insufficient stock for ${item.title}`);
      }
    }

    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 250;
    const codFee = params.paymentMethod === 'COD' ? COD_FEE : 0;
    const total = subtotal + shippingFee + codFee;

    const order = await this.prisma.order.create({
      data: {
        orderNumber: this.generateOrderNumber(),
        userId: params.userId,
        guestEmail: params.guestEmail,
        paymentMethod: params.paymentMethod,
        subtotal,
        shippingFee,
        codFee,
        total,
        shippingAddress: params.shippingAddress as object,
        bnplInstallments: params.bnplInstallments,
        items: {
          create: cart.map((item) => ({
            productId: item.productId,
            title: item.title,
            imageUrl: item.imageUrl,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    const payment = await this.payments.processPayment(
      order.id,
      params.paymentMethod,
      Number(total),
      { installments: params.bnplInstallments },
    );

    await this.prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: payment.status as PaymentStatus,
        paymentRef: payment.reference,
      },
    });

    await this.ordersQueue.add('process-order', { orderId: order.id });
    await this.cartService.clearCart(params.cartId);

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      total: Number(order.total),
      paymentStatus: payment.status,
      redirectUrl: payment.redirectUrl,
    };
  }

  async getUserOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      total: Number(o.total),
      itemCount: o.items.reduce((s, i) => s + i.quantity, 0),
      createdAt: o.createdAt.toISOString(),
    }));
  }

  async getOrder(id: string, userId?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (userId && order.userId !== userId) throw new NotFoundException('Order not found');

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: Number(order.total),
      itemCount: order.items.reduce((s, i) => s + i.quantity, 0),
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((i) => ({
        productId: i.productId,
        title: i.title,
        imageUrl: i.imageUrl,
        price: Number(i.price),
        quantity: i.quantity,
      })),
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      subtotal: Number(order.subtotal),
      shippingFee: Number(order.shippingFee),
      codFee: Number(order.codFee),
      discount: Number(order.discount),
    };
  }
}
