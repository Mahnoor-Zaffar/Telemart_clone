'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { getAuthToken } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<{ products: number; orders: number; vendors: number; users: number } | null>(null);

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      router.push(`/${locale}/account/login`);
      return;
    }
    apiFetch<typeof stats>('/admin/stats', { token: getAuthToken() }).then(setStats).catch(() => {});
  }, [user, locale, router]);

  if (!stats) return <div className="container-main py-8">Loading...</div>;

  return (
    <div className="container-main py-8">
      <h1 className="mb-8 text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Object.entries(stats).map(([key, val]) => (
          <div key={key} className="rounded-lg border bg-card p-6 text-center">
            <p className="text-3xl font-bold text-primary">{val}</p>
            <p className="capitalize text-muted">{key}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted">Login: admin@telemart.local / admin123</p>
    </div>
  );
}
