import { Injectable } from '@nestjs/common';
import { PaymentMethod } from '@prisma/client';
import { getPaymentAdapter } from './payment.adapters';

@Injectable()
export class PaymentsService {
  async processPayment(orderId: string, method: PaymentMethod, amount: number, metadata?: Record<string, unknown>) {
    const adapter = getPaymentAdapter(method as never);
    return adapter.initiate(orderId, amount, metadata);
  }
}
