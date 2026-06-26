import { cn } from '@/lib/utils';

export function Badge({ className, variant = 'default', ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'success' | 'accent' | 'outline' }) {
  const variants = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-green-100 text-green-800',
    accent: 'bg-red-100 text-red-700',
    outline: 'border border-border text-muted',
  };
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variants[variant], className)} {...props} />
  );
}
