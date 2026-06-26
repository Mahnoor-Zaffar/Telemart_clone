import { cn } from '@/lib/utils';
import { SelectHTMLAttributes, forwardRef } from 'react';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'h-10 w-full appearance-none rounded-[24px] border border-[var(--nike-hairline-soft)] bg-[var(--nike-soft-cloud)] px-4 pr-10 text-sm text-[var(--nike-ink)]',
        'focus:border-[var(--nike-ink)] focus:bg-[var(--nike-canvas)] focus:outline-none focus:ring-2 focus:ring-[var(--nike-ink)] focus:ring-offset-2',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = 'Select';
