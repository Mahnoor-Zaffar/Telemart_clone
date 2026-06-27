import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@telemart/types';
import { apiFetch } from './api';
import { getCartId } from './utils';

function countItems(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

interface CartStore {
  items: CartItem[];
  loading: boolean;
  initialized: boolean;
  itemCount: number;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  loading: false,
  initialized: false,
  itemCount: 0,
  fetchCart: async () => {
    set({ loading: true });
    try {
      const items = await apiFetch<CartItem[]>('/cart', { cartId: getCartId() });
      set({ items, itemCount: countItems(items), initialized: true });
    } finally {
      set({ loading: false });
    }
  },
  addItem: async (productId, quantity = 1) => {
    const items = await apiFetch<CartItem[]>('/cart/items', {
      method: 'POST',
      cartId: getCartId(),
      body: JSON.stringify({ productId, quantity }),
    });
    set({ items, itemCount: countItems(items), initialized: true });
  },
  updateQuantity: async (productId, quantity) => {
    const items = await apiFetch<CartItem[]>(`/cart/items/${productId}`, {
      method: 'PATCH',
      cartId: getCartId(),
      body: JSON.stringify({ quantity }),
    });
    set({ items, itemCount: countItems(items) });
  },
  removeItem: async (productId) => {
    const items = await apiFetch<CartItem[]>(`/cart/items/${productId}`, {
      method: 'DELETE',
      cartId: getCartId(),
    });
    set({ items, itemCount: countItems(items) });
  },
}));

interface AuthStore {
  user: { id: string; email: string; fullName: string; role: string } | null;
  setUser: (user: AuthStore['user']) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access-token');
          localStorage.removeItem('refresh-token');
        }
        set({ user: null });
      },
    }),
    { name: 'auth-user' },
  ),
);
