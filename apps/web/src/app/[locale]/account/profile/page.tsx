'use client';

import { useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProfilePage() {
  const { locale } = useParams<{ locale: string }>();
  const { user, logout } = useAuthStore();

  if (!user) {
    return (
      <div className="container-main py-8 text-center">
        <Link href={`/${locale}/account/login`}><Button>Login</Button></Link>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      <h1 className="mb-6 text-2xl font-bold">Profile</h1>
      <div className="max-w-md rounded-lg border bg-card p-6 space-y-3">
        <p><strong>Name:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <Button variant="destructive" onClick={logout}>Logout</Button>
      </div>
    </div>
  );
}
