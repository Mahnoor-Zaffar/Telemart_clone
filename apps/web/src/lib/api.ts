const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type FetchOptions = RequestInit & { cartId?: string; token?: string | null; skipRefresh?: boolean };

async function parseError(res: Response) {
  const err = await res.json().catch(() => ({ message: res.statusText }));
  return new Error(err.message || err.error || 'Request failed');
}

async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const refreshToken = localStorage.getItem('refresh-token');
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { accessToken: string; refreshToken: string };
    localStorage.setItem('access-token', data.accessToken);
    localStorage.setItem('refresh-token', data.refreshToken);
    return data.accessToken;
  } catch {
    return null;
  }
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { cartId, token, skipRefresh, headers: customHeaders, ...rest } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  };
  if (cartId) headers['x-cart-id'] = cartId;
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res = await fetch(`${API_BASE}/api/v1${path}`, { ...rest, headers });

  if (res.status === 401 && !skipRefresh && typeof window !== 'undefined') {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(`${API_BASE}/api/v1${path}`, { ...rest, headers });
    }
  }

  if (!res.ok) throw await parseError(res);
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
