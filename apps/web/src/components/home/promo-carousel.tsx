'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type PromoSlide = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  imageUrl?: string;
  accent?: string;
};

export function PromoCarousel({ slides, locale }: { slides: PromoSlide[]; locale: string }) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const go = useCallback(
    (next: number) => {
      setIndex((next + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(timer);
  }, [count]);

  if (count === 0) return null;

  const slide = slides[index];

  return (
    <section className="relative overflow-hidden bg-[var(--nike-ink)] text-[var(--nike-on-primary)]">
      <div className="container-main relative flex min-h-[420px] flex-col justify-end gap-6 py-16 md:min-h-[520px] md:py-24">
        {slide.imageUrl && (
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
            aria-hidden
          />
        )}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-r from-[var(--nike-ink)] via-[var(--nike-ink)]/85 to-transparent',
            slide.accent,
          )}
          aria-hidden
        />
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-display-campaign">{slide.title}</h1>
          <p className="mt-4 max-w-xl text-caption-md text-[var(--nike-stone)] md:text-base">
            {slide.subtitle}
          </p>
          <div className="mt-6">
            <Link href={`/${locale}${slide.href}`}>
              <Button variant="outline-on-image" size="lg">
                {slide.cta}
              </Button>
            </Link>
          </div>
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 md:left-8"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 md:right-8"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={cn(
                    'h-2 w-2 rounded-full transition-colors',
                    i === index ? 'bg-white' : 'bg-white/40 hover:bg-white/70',
                  )}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
