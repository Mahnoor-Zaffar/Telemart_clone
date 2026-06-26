import { Controller, Get } from '@nestjs/common';
import { FlashDealsService } from './flash-deals.service';
import { Public } from '../auth/guards';

@Controller('flash-deals')
@Public()
export class FlashDealsController {
  constructor(private flashDealsService: FlashDealsService) {}

  @Get()
  getActive() {
    return this.flashDealsService.getActiveDeals();
  }
}
