import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { serverFetch } from '@/lib/api';
import type { BlogPost } from '@telemart/types';

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let post: BlogPost;
  try {
    post = await serverFetch<BlogPost>(`/blog/${slug}`);
  } catch {
    notFound();
  }

  return (
    <article className="container-main max-w-3xl py-8">
      <h1 className="mb-4 text-3xl font-bold">
        {locale === 'ur' && post.titleUr ? post.titleUr : post.title}
      </h1>
      <p className="mb-8 text-sm text-muted">
        {post.author} · {new Date(post.publishedAt).toLocaleDateString()}
      </p>
      <div className="prose prose-slate max-w-none whitespace-pre-wrap">{post.content}</div>
    </article>
  );
}
