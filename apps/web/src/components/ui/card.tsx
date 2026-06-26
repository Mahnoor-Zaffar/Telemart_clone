import { cn } from '@/lib/utils';
import { Skeleton } from './skeleton';

export { Skeleton };

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-none border border-[var(--nike-hairline-soft)] bg-[var(--nike-canvas)]',
        className,
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-4', className)} {...props} />;
}
