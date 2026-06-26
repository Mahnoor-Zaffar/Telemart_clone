'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const FALLBACK =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect fill="%23f5f5f5" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239e9ea0" font-family="system-ui,sans-serif" font-size="14"%3ENo image%3C/text%3E%3C/svg%3E';

type ProductImageProps = Omit<ImageProps, 'src'> & {
  src?: string | null;
};

export function ProductImage({ src, alt, className, onError, ...props }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const resolved = !src || failed ? FALLBACK : src;

  return (
    <Image
      src={resolved}
      alt={alt}
      className={cn(className)}
      onError={(e) => {
        setFailed(true);
        onError?.(e);
      }}
      {...props}
    />
  );
}
