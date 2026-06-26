'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { getAuthToken } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';

interface VendorRow {
  id: string;
  businessName: string;
  email: string;
  city: string;
}

export default function AdminPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<{ products: number; orders: number; vendors: number; users: number } | null>(null);
  const [vendors, setVendors] = useState<VendorRow[]>([]);
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    price: '',
    stock: '10',
    imageUrl: '',
    brand: '',
    categoryId: '',
  });
  const [flashForm, setFlashForm] = useState({
    productId: '',
    discountPercent: '15',
    hours: '24',
    maxStock: '20',
  });

  const token = getAuthToken();

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      router.push(`/${locale}/account/login`);
      return;
    }
    apiFetch<typeof stats>('/admin/stats', { token }).then(setStats).catch(() => {});
    apiFetch<VendorRow[]>('/admin/vendors/pending', { token }).then(setVendors).catch(() => {});
  }, [user, locale, router, token]);

  async function createProduct(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiFetch('/admin/products', {
        method: 'POST',
        token,
        body: JSON.stringify({
          ...productForm,
          price: Number(productForm.price),
          stock: Number(productForm.stock),
        }),
      });
      toast('Product created', 'success');
      setProductForm({ title: '', description: '', price: '', stock: '10', imageUrl: '', brand: '', categoryId: '' });
    } catch {
      toast('Failed to create product', 'error');
    }
  }

  async function approveVendor(id: string) {
    try {
      await apiFetch(`/vendors/${id}/approve`, { method: 'PATCH', token });
      setVendors((v) => v.filter((x) => x.id !== id));
      toast('Vendor approved', 'success');
    } catch {
      toast('Failed to approve vendor', 'error');
    }
  }

  async function createFlashSale(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiFetch('/admin/flash-sales', {
        method: 'POST',
        token,
        body: JSON.stringify({
          productId: flashForm.productId,
          discountPercent: Number(flashForm.discountPercent),
          hours: Number(flashForm.hours),
          maxStock: Number(flashForm.maxStock),
        }),
      });
      toast('Flash sale created', 'success');
    } catch {
      toast('Failed to create flash sale', 'error');
    }
  }

  if (!stats) return <div className="container-main py-8">Loading...</div>;

  return (
    <div className="container-main py-8">
      <h1 className="text-heading-xl mb-8">Admin Dashboard</h1>
      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Object.entries(stats).map(([key, val]) => (
          <div key={key} className="border border-[var(--nike-hairline-soft)] p-6 text-center">
            <p className="text-heading-xl">{val}</p>
            <p className="text-caption-md capitalize text-[var(--nike-mute)]">{key}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <form onSubmit={createProduct} className="space-y-4 border border-[var(--nike-hairline-soft)] p-6">
          <h2 className="text-body-strong">Add product</h2>
          <Input placeholder="Title" value={productForm.title} onChange={(e) => setProductForm({ ...productForm, title: e.target.value })} required />
          <Input placeholder="Description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} required />
          <Input placeholder="Price (PKR)" type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required />
          <Input placeholder="Stock" type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} />
          <Input placeholder="Image URL" value={productForm.imageUrl} onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })} required />
          <Input placeholder="Brand" value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} />
          <Input placeholder="Category ID (from DB)" value={productForm.categoryId} onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })} required />
          <Button type="submit">Create product</Button>
        </form>

        <form onSubmit={createFlashSale} className="space-y-4 border border-[var(--nike-hairline-soft)] p-6">
          <h2 className="text-body-strong">Create flash sale</h2>
          <Input placeholder="Product ID" value={flashForm.productId} onChange={(e) => setFlashForm({ ...flashForm, productId: e.target.value })} required />
          <Input placeholder="Discount %" type="number" value={flashForm.discountPercent} onChange={(e) => setFlashForm({ ...flashForm, discountPercent: e.target.value })} />
          <Input placeholder="Duration (hours)" type="number" value={flashForm.hours} onChange={(e) => setFlashForm({ ...flashForm, hours: e.target.value })} />
          <Input placeholder="Max stock" type="number" value={flashForm.maxStock} onChange={(e) => setFlashForm({ ...flashForm, maxStock: e.target.value })} />
          <Button type="submit">Start flash sale</Button>
        </form>
      </div>

      <section className="mt-10">
        <h2 className="text-body-strong mb-4">Pending vendors</h2>
        {vendors.length === 0 ? (
          <p className="text-[var(--nike-mute)]">No pending vendors.</p>
        ) : (
          <div className="space-y-3">
            {vendors.map((v) => (
              <div key={v.id} className="flex items-center justify-between border border-[var(--nike-hairline-soft)] p-4">
                <div>
                  <p className="text-body-strong">{v.businessName}</p>
                  <p className="text-caption-sm text-[var(--nike-mute)]">{v.email} · {v.city}</p>
                </div>
                <Button size="sm" onClick={() => approveVendor(v.id)}>Approve</Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
