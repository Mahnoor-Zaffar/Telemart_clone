'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  side?: 'left' | 'right';
}

export function Sheet({ open, onOpenChange, title, children, side = 'left' }: SheetProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close panel"
        onClick={() => onOpenChange(false)}
      />
      <aside
        className={cn(
          'absolute top-0 flex h-full w-full max-w-sm flex-col bg-[var(--nike-canvas)] shadow-xl',
          side === 'left' ? 'left-0' : 'right-0',
        )}
      >
        <div className="flex items-center justify-between border-b border-[var(--nike-hairline-soft)] px-4 py-4">
          {title && <h2 className="text-body-strong">{title}</h2>}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--nike-soft-cloud)]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </aside>
    </div>
  );
}
