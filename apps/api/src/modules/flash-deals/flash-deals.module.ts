import { Module } from '@nestjs/common';
import { FlashDealsService } from './flash-deals.service';
import { FlashDealsController } from './flash-deals.controller';

@Module({
  controllers: [FlashDealsController],
  providers: [FlashDealsService],
})
export class FlashDealsModule {}
