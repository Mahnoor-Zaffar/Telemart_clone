import { Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get()
  get(@Req() req: { user: { id: string } }) {
    return this.wishlistService.getWishlist(req.user.id);
  }

  @Post(':productId')
  add(@Req() req: { user: { id: string } }, @Param('productId') productId: string) {
    return this.wishlistService.add(req.user.id, productId);
  }

  @Delete(':productId')
  remove(@Req() req: { user: { id: string } }, @Param('productId') productId: string) {
    return this.wishlistService.remove(req.user.id, productId);
  }
}
