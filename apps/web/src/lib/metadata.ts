import type { Metadata } from 'next';

const SITE = 'Telemart Clone';

export function siteMetadata({
  title,
  description,
  path = '',
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const fullTitle = title === SITE ? title : `${title} | ${SITE}`;
  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      type: 'website',
      siteName: SITE,
    },
    alternates: path ? { canonical: path } : undefined,
  };
}
