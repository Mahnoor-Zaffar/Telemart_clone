import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { serverFetch } from '@/lib/api';
import { MarkdownContent } from '@/components/blog/markdown-content';
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
      <h1 className="text-heading-xl mb-4">
        {locale === 'ur' && post.titleUr ? post.titleUr : post.title}
      </h1>
      <p className="mb-8 text-caption-md text-[var(--nike-mute)]">
        {post.author} · {new Date(post.publishedAt).toLocaleDateString()}
      </p>
      <MarkdownContent content={post.content} />
    </article>
  );
}
