import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  private logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async sendOrderConfirmation(email: string, orderNumber: string, total: number) {
    const body = `Your order ${orderNumber} has been confirmed. Total: Rs. ${total.toLocaleString()}`;

    await this.prisma.notification.create({
      data: {
        email,
        type: 'order_confirmation',
        channel: 'email',
        subject: `Order Confirmed - ${orderNumber}`,
        body,
        status: 'sent',
      },
    });

    const apiKey = this.config.get('RESEND_API_KEY');
    if (apiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: this.config.get('EMAIL_FROM') || 'orders@telemart-clone.local',
            to: email,
            subject: `Order Confirmed - ${orderNumber}`,
            html: `<p>${body}</p>`,
          }),
        });
      } catch (err) {
        this.logger.warn('Resend email failed, logged to DB', err);
      }
    } else {
      this.logger.log(`[MOCK EMAIL] To: ${email} - ${body}`);
    }
  }

  async sendSmsMock(phone: string, message: string) {
    await this.prisma.notification.create({
      data: {
        phone,
        type: 'sms',
        channel: 'sms',
        body: message,
        status: 'mock_sent',
      },
    });
    this.logger.log(`[MOCK SMS] To: ${phone} - ${message}`);
  }
}
