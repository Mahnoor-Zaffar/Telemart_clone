'use client';

import { create } from 'zustand';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useEffect } from 'react';

export type ToastVariant = 'default' | 'success' | 'error';

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastStore {
  toasts: ToastItem[];
  add: (message: string, variant?: ToastVariant) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (message, variant = 'default') => {
    const id = crypto.randomUUID();
    set((s) => ({ toasts: [...s.toasts, { id, message, variant }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export function toast(message: string, variant?: ToastVariant) {
  useToastStore.getState().add(message, variant);
}

function ToastItemView({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const variants = {
    default: 'border-[var(--nike-hairline)] bg-[var(--nike-canvas)]',
    success: 'border-[var(--nike-success)] bg-[var(--nike-canvas)]',
    error: 'border-[var(--nike-sale)] bg-[var(--nike-canvas)]',
  };

  return (
    <div
      role="status"
      className={cn(
        'flex items-start gap-3 rounded-[24px] border px-4 py-3 shadow-lg',
        variants[item.variant],
      )}
    >
      <p className="flex-1 text-sm font-medium">{item.message}</p>
      <button type="button" onClick={onDismiss} className="text-[var(--nike-mute)] hover:text-[var(--nike-ink)]">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function Toaster() {
  const { toasts, dismiss } = useToastStore();

  useEffect(() => {
    // noop — keeps client boundary
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[110] flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0">
      {toasts.map((t) => (
        <ToastItemView key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>
  );
}
