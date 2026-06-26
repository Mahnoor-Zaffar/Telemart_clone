import { Controller, Get, Param } from '@nestjs/common';
import { BlogService } from './blog.service';
import { Public } from '../auth/guards';

@Controller('blog')
@Public()
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get()
  list() {
    return this.blogService.list();
  }

  @Get(':slug')
  get(@Param('slug') slug: string) {
    return this.blogService.getBySlug(slug);
  }
}
