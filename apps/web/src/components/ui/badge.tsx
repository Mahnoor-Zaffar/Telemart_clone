import { cn } from '@/lib/utils';

export function Badge({
  className,
  variant = 'default',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'promo' | 'sale' | 'outline' | 'success';
}) {
  const variants = {
    default:
      'border border-[var(--nike-hairline)] bg-[var(--nike-canvas)] text-[var(--nike-ink)] text-xs font-medium rounded-[30px] px-3 py-1',
    promo:
      'border border-[var(--nike-hairline)] bg-[var(--nike-canvas)] text-[var(--nike-ink)] text-xs font-medium rounded-[30px] px-3 py-1',
    sale: 'text-[var(--nike-sale)] text-sm font-medium bg-transparent p-0',
    outline:
      'border border-[var(--nike-hairline)] bg-transparent text-[var(--nike-ink)] text-xs font-medium rounded-[30px] px-3 py-1',
    success:
      'border border-[var(--nike-success)] bg-transparent text-[var(--nike-success)] text-xs font-medium rounded-[30px] px-3 py-1',
  };
  return <span className={cn('inline-flex items-center', variants[variant], className)} {...props} />;
}
