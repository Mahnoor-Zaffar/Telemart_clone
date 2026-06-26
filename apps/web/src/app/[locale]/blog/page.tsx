import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { serverFetch } from '@/lib/api';
import type { BlogPost } from '@telemart/types';

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const posts = await serverFetch<BlogPost[]>('/blog');

  return (
    <div className="container-main py-8">
      <h1 className="mb-8 text-2xl font-bold">Blog</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/${locale}/blog/${post.slug}`} className="rounded-lg border bg-card p-6 hover:shadow-md">
            <h2 className="mb-2 font-semibold">{locale === 'ur' && post.titleUr ? post.titleUr : post.title}</h2>
            <p className="text-sm text-muted line-clamp-3">{post.excerpt}</p>
            <p className="mt-4 text-xs text-muted">{new Date(post.publishedAt).toLocaleDateString()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
