import { Body, Controller, Get, Headers, Param, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard, Public } from '../auth/guards';
import { IsEmail, IsEnum, IsInt, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '@prisma/client';

class AddressDto {
  @IsString() fullName!: string;
  @IsString() phone!: string;
  @IsOptional() @IsEmail() email?: string;
  @IsString() city!: string;
  @IsString() area!: string;
  @IsString() streetAddress!: string;
  @IsOptional() @IsString() landmark?: string;
}

class CreateOrderDto {
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress!: AddressDto;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @IsOptional() @IsEmail() guestEmail?: string;
  @IsOptional() @IsInt() bnplInstallments?: number;
}

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Public()
  @Post()
  create(
    @Headers() headers: Record<string, string>,
    @Body() dto: CreateOrderDto,
    @Req() req: { user?: { id: string } },
  ) {
    return this.ordersService.createOrder({
      cartId: headers['x-cart-id'] || 'guest',
      userId: req.user?.id,
      guestEmail: dto.guestEmail,
      shippingAddress: dto.shippingAddress as unknown as Record<string, unknown>,
      paymentMethod: dto.paymentMethod,
      bnplInstallments: dto.bnplInstallments,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@Req() req: { user: { id: string } }) {
    return this.ordersService.getUserOrders(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    return this.ordersService.getOrder(id, req.user.id);
  }
}
