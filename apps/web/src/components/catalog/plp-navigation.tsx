'use client';

import { createContext, useCallback, useContext, useTransition, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

type PlpNavigationContextValue = {
  navigate: (url: string) => void;
  isPending: boolean;
};

const PlpNavigationContext = createContext<PlpNavigationContextValue | null>(null);

export function PlpNavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = useCallback(
    (url: string) => {
      startTransition(() => router.push(url));
    },
    [router],
  );

  return (
    <PlpNavigationContext.Provider value={{ navigate, isPending }}>
      {children}
    </PlpNavigationContext.Provider>
  );
}

export function usePlpNavigation() {
  const ctx = useContext(PlpNavigationContext);
  if (!ctx) {
    throw new Error('usePlpNavigation must be used within PlpNavigationProvider');
  }
  return ctx;
}

export function PlpResultsShell({ children }: { children: ReactNode }) {
  const { isPending } = usePlpNavigation();
  return (
    <div
      className={cn(
        'min-w-0 flex-1 transition-opacity duration-200',
        isPending && 'pointer-events-none opacity-60',
      )}
      aria-busy={isPending}
    >
      {children}
    </div>
  );
}
