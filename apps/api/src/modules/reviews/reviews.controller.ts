import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard, Public } from '../auth/guards';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

class CreateReviewDto {
  @IsInt() @Min(1) @Max(5) rating!: number;
  @IsOptional() @IsString() title?: string;
  @IsString() comment!: string;
}

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Public()
  @Get('product/:productId')
  getReviews(@Param('productId') productId: string) {
    return this.reviewsService.getProductReviews(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('product/:productId')
  create(
    @Param('productId') productId: string,
    @Body() dto: CreateReviewDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.reviewsService.createReview(req.user.id, productId, dto);
  }
}
