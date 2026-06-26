import { Injectable, NotFoundException } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async list() {
    const posts = await this.prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
    });
    return posts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      titleUr: p.titleUr ?? undefined,
      excerpt: p.excerpt,
      content: p.content,
      coverImage: p.coverImage ?? undefined,
      publishedAt: p.publishedAt?.toISOString() ?? p.createdAt.toISOString(),
      author: p.author,
    }));
  }

  async getBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (!post || !post.published) throw new NotFoundException('Post not found');
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      titleUr: post.titleUr ?? undefined,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage ?? undefined,
      publishedAt: post.publishedAt?.toISOString() ?? post.createdAt.toISOString(),
      author: post.author,
    };
  }

  async create(data: { title: string; titleUr?: string; excerpt: string; content: string; coverImage?: string; author?: string }) {
    const slug = slugify(data.title, { lower: true, strict: true });
    return this.prisma.blogPost.create({
      data: {
        ...data,
        slug,
        published: true,
        publishedAt: new Date(),
      },
    });
  }
}
