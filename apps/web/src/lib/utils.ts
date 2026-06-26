import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, locale = 'en-PK') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getCartId(): string {
  if (typeof window === 'undefined') return 'guest';
  let id = localStorage.getItem('cart-id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('cart-id', id);
  }
  return id;
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access-token');
}

export function setAuthTokens(access: string, refresh: string) {
  localStorage.setItem('access-token', access);
  localStorage.setItem('refresh-token', refresh);
}

export function clearAuth() {
  localStorage.removeItem('access-token');
  localStorage.removeItem('refresh-token');
}
