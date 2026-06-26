import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-[24px] bg-[var(--nike-soft-cloud)] px-4 py-2 text-base text-[var(--nike-ink)] placeholder:text-[var(--nike-mute)]',
        'focus:bg-[var(--nike-canvas)] focus:outline-none focus:ring-2 focus:ring-[var(--nike-ink)] focus:ring-offset-2 focus:ring-offset-[var(--nike-soft-cloud)]',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
