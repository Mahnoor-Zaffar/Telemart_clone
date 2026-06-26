import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'outline-on-image' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-medium transition-all active:scale-[0.98] active:opacity-85 disabled:pointer-events-none disabled:opacity-50';

    const variants = {
      primary:
        'bg-[var(--nike-ink)] text-[var(--nike-on-primary)] rounded-[30px] hover:opacity-90',
      secondary:
        'bg-[var(--nike-soft-cloud)] text-[var(--nike-ink)] rounded-[30px] hover:bg-[var(--nike-hairline-soft)]',
      outline:
        'border border-[var(--nike-hairline)] bg-transparent text-[var(--nike-ink)] rounded-[30px] hover:bg-[var(--nike-soft-cloud)]',
      'outline-on-image':
        'bg-[var(--nike-canvas)] text-[var(--nike-ink)] rounded-[30px] shadow-sm',
      ghost: 'bg-transparent text-[var(--nike-ink)] rounded-full hover:bg-[var(--nike-soft-cloud)]',
      destructive:
        'bg-[var(--nike-sale)] text-white rounded-[30px] hover:opacity-90',
    };

    const sizes = {
      sm: 'h-10 px-4 text-sm',
      md: 'h-12 px-8 text-base',
      lg: 'h-14 px-10 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
