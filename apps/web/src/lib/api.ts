const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { cartId?: string; token?: string | null } = {},
): Promise<T> {
  const { cartId, token, headers: customHeaders, ...rest } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  };
  if (cartId) headers['x-cart-id'] = cartId;
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/api/v1${path}`, {
    ...rest,
    headers,
    next: rest.method ? undefined : { revalidate: 60 },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || err.error || 'Request failed');
  }

  return res.json();
}

export async function serverFetch<T>(path: string, revalidate = 60, fallback?: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}/api/v1${path}`, {
      next: { revalidate },
    });
    if (!res.ok) throw new Error(`Failed to fetch ${path}`);
    return res.json();
  } catch {
    if (fallback !== undefined) return fallback;
    throw new Error(`Failed to fetch ${path}`);
  }
}
