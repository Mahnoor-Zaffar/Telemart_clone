import { Body, Controller, Delete, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { Public } from '../auth/guards';
import { IsInt, IsString, Min } from 'class-validator';

class AddToCartDto {
  @IsString()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

class UpdateCartDto {
  @IsInt()
  @Min(0)
  quantity!: number;
}

@Controller('cart')
@Public()
export class CartController {
  constructor(private cartService: CartService) {}

  private getCartId(headers: Record<string, string>) {
    return headers['x-cart-id'] || 'guest';
  }

  @Get()
  getCart(@Headers() headers: Record<string, string>) {
    return this.cartService.getCart(this.getCartId(headers));
  }

  @Post('items')
  addItem(@Headers() headers: Record<string, string>, @Body() dto: AddToCartDto) {
    return this.cartService.addItem(this.getCartId(headers), dto.productId, dto.quantity);
  }

  @Patch('items/:productId')
  updateItem(
    @Headers() headers: Record<string, string>,
    @Param('productId') productId: string,
    @Body() dto: UpdateCartDto,
  ) {
    return this.cartService.updateQuantity(this.getCartId(headers), productId, dto.quantity);
  }

  @Delete('items/:productId')
  removeItem(@Headers() headers: Record<string, string>, @Param('productId') productId: string) {
    return this.cartService.removeItem(this.getCartId(headers), productId);
  }

  @Delete()
  clearCart(@Headers() headers: Record<string, string>) {
    return this.cartService.clearCart(this.getCartId(headers));
  }
}
