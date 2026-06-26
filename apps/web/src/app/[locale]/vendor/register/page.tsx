'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { PAKISTAN_CITIES } from '@telemart/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function VendorRegisterPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const [form, setForm] = useState({
    businessName: '', email: '', phone: '', cnic: '', address: '', city: PAKISTAN_CITIES[0] as string, description: '', password: '', fullName: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch('/vendors/register', { method: 'POST', body: JSON.stringify(form) });
      setSuccess(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="container-main py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold text-success">Application Submitted!</h1>
        <p className="text-muted">Our team will review your application within 2-3 business days.</p>
        <Button className="mt-6" onClick={() => router.push(`/${locale}`)}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      <h1 className="mb-2 text-2xl font-bold">Sell on Telemart</h1>
      <p className="mb-8 text-muted">Join Pakistan&apos;s fastest growing marketplace</p>
      <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-4 rounded-lg border bg-card p-6">
        <Input placeholder="Business Name" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} required />
        <Input placeholder="Your Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
        <Input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        <Input placeholder="CNIC (35202-XXXXXXX-X)" value={form.cnic} onChange={(e) => setForm({ ...form, cnic: e.target.value })} required />
        <select className="flex h-10 w-full rounded-md border px-3 text-sm" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
          {PAKISTAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <Input placeholder="Business Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
        <Input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <textarea
          className="w-full rounded-md border border-border p-3 text-sm"
          placeholder="Tell us about your business"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <Button type="submit" className="w-full" disabled={loading}>Submit Application</Button>
      </form>
    </div>
  );
}
