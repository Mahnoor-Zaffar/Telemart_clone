import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { serverFetch } from '@/lib/api';
import type { BlogPost } from '@telemart/types';

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('blog');
  const posts = await serverFetch<BlogPost[]>('/blog', 60, []);

  return (
    <div className="container-main py-8">
      <h1 className="text-heading-xl mb-8">{t('title')}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/${locale}/blog/${post.slug}`} className="border border-[var(--nike-hairline-soft)] p-6 hover:bg-[var(--nike-soft-cloud)]">
            <h2 className="mb-2 text-body-strong">{locale === 'ur' && post.titleUr ? post.titleUr : post.title}</h2>
            <p className="text-sm text-[var(--nike-mute)] line-clamp-3">{post.excerpt}</p>
            <p className="mt-4 text-xs text-[var(--nike-mute)]">{new Date(post.publishedAt).toLocaleDateString()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
