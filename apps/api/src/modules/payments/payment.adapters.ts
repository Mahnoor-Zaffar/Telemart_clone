import { PaymentMethod, PaymentStatus } from '@telemart/types';

export interface PaymentAdapter {
  initiate(orderId: string, amount: number, metadata?: Record<string, unknown>): Promise<{
    status: PaymentStatus;
    reference?: string;
    redirectUrl?: string;
  }>;
  verify(reference: string): Promise<PaymentStatus>;
}

export class CodAdapter implements PaymentAdapter {
  async initiate() {
    return { status: PaymentStatus.PENDING as PaymentStatus, reference: `COD-${Date.now()}` };
  }
  async verify() {
    return PaymentStatus.PENDING;
  }
}

export class MockGatewayAdapter implements PaymentAdapter {
  constructor(private method: PaymentMethod) {}

  async initiate(orderId: string, amount: number) {
    return {
      status: PaymentStatus.COMPLETED,
      reference: `${this.method}-${orderId}-${amount}`,
      redirectUrl: `/checkout/success?ref=${orderId}`,
    };
  }

  async verify() {
    return PaymentStatus.COMPLETED;
  }
}

export class BnplAdapter implements PaymentAdapter {
  async initiate(orderId: string, amount: number, metadata?: Record<string, unknown>) {
    const installments = (metadata?.installments as number) || 4;
    const perInstallment = Math.ceil(amount / installments);
    return {
      status: PaymentStatus.COMPLETED,
      reference: `BNPL-${installments}x-${orderId}`,
      redirectUrl: `/checkout/success?bnpl=${perInstallment}`,
    };
  }

  async verify() {
    return PaymentStatus.COMPLETED;
  }
}

export function getPaymentAdapter(method: PaymentMethod): PaymentAdapter {
  switch (method) {
    case PaymentMethod.COD:
      return new CodAdapter();
    case PaymentMethod.BNPL:
      return new BnplAdapter();
    default:
      return new MockGatewayAdapter(method);
  }
}
