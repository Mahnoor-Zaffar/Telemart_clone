import { Controller, Get, Param, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { Public } from '../auth/guards';

@Controller('search')
@Public()
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  search(
    @Query('q') q = '',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.searchService.search(q, page ? Number(page) : 1, limit ? Number(limit) : 20);
  }

  @Get('trending/:key')
  trending(@Param('key') key = 'featured') {
    return this.searchService.getTrending(key);
  }
}
