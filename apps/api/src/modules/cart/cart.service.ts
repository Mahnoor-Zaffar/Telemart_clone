import { Injectable, BadRequestException } from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CartItem } from '@telemart/types';

const CART_TTL = 7 * 24 * 60 * 60;

@Injectable()
export class CartService {
  constructor(
    private redis: RedisService,
    private prisma: PrismaService,
  ) {}

  private cartKey(cartId: string) {
    return `cart:${cartId}`;
  }

  async getCart(cartId: string): Promise<CartItem[]> {
    const data = await this.redis.get(this.cartKey(cartId));
    return data ? JSON.parse(data) : [];
  }

  async addItem(cartId: string, productId: string, quantity = 1) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new BadRequestException('Product not found');
    if (product.stock < quantity) throw new BadRequestException('Insufficient stock');

    const cart = await this.getCart(cartId);
    const existing = cart.find((i) => i.productId === productId);

    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock);
    } else {
      cart.push({
        productId: product.id,
        slug: product.slug,
        title: product.title,
        price: Number(product.price),
        imageUrl: product.imageUrl,
        quantity,
        maxQuantity: product.stock,
      });
    }

    await this.redis.set(this.cartKey(cartId), JSON.stringify(cart), CART_TTL);
    return cart;
  }

  async updateQuantity(cartId: string, productId: string, quantity: number) {
    const cart = await this.getCart(cartId);
    const item = cart.find((i) => i.productId === productId);
    if (!item) throw new BadRequestException('Item not in cart');

    if (quantity <= 0) {
      return this.removeItem(cartId, productId);
    }

    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    item.quantity = Math.min(quantity, product?.stock ?? item.maxQuantity);
    await this.redis.set(this.cartKey(cartId), JSON.stringify(cart), CART_TTL);
    return cart;
  }

  async removeItem(cartId: string, productId: string) {
    const cart = (await this.getCart(cartId)).filter((i) => i.productId !== productId);
    await this.redis.set(this.cartKey(cartId), JSON.stringify(cart), CART_TTL);
    return cart;
  }

  async clearCart(cartId: string) {
    await this.redis.del(this.cartKey(cartId));
    return [];
  }
}
