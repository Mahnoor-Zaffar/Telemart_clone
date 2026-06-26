'use client';

import { useState } from 'react';
import { ProductImage } from '@/components/product/product-image';
import { cn } from '@/lib/utils';

export function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [selected, setSelected] = useState(0);
  const main = images[selected] ?? images[0];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden nike-product-image-bg">
        <ProductImage src={main} alt={title} fill className="object-cover" priority sizes="(max-width:1024px) 100vw, 50vw" />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={cn(
                'relative aspect-square overflow-hidden border-2 transition-colors',
                selected === i ? 'border-[var(--nike-ink)]' : 'border-transparent',
              )}
            >
              <ProductImage src={img} alt="" fill className="object-cover" sizes="100px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
