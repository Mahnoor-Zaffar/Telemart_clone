'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('admin');
  const tc = useTranslations('common');
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<{ products: number; orders: number; vendors: number; users: number } | null>(null);
  const [vendors, setVendors] = useState<VendorRow[]>([]);
  const [productForm, setProductForm] = useState({
    title: '', description: '', price: '', stock: '10', imageUrl: '', brand: '', categoryId: '',
  });
  const [flashForm, setFlashForm] = useState({
    productId: '', discountPercent: '15', hours: '24', maxStock: '20',
  });

  const token = getAuthToken();

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      router.push(`/${locale}/account/login`);
      return;
    }
    apiFetch<typeof stats>('/admin/stats', { token }).then(setStats).catch(() => toast(tc('error'), 'error'));
    apiFetch<VendorRow[]>('/admin/vendors/pending', { token }).then(setVendors).catch(() => {});
  }, [user, locale, router, token, tc]);

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
      toast(t('productCreated'), 'success');
      setProductForm({ title: '', description: '', price: '', stock: '10', imageUrl: '', brand: '', categoryId: '' });
    } catch {
      toast(t('productFailed'), 'error');
    }
  }

  async function approveVendor(id: string) {
    try {
      await apiFetch(`/vendors/${id}/approve`, { method: 'PATCH', token });
      setVendors((v) => v.filter((x) => x.id !== id));
      toast(t('vendorApproved'), 'success');
    } catch {
      toast(t('vendorFailed'), 'error');
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
      toast(t('flashCreated'), 'success');
    } catch {
      toast(t('flashFailed'), 'error');
    }
  }

  if (!stats) return <div className="container-main py-8">{tc('loading')}</div>;

  return (
    <div className="container-main py-8">
      <h1 className="text-heading-xl mb-8">{t('title')}</h1>
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
          <h2 className="text-body-strong">{t('addProduct')}</h2>
          <Input placeholder={t('titleLabel')} value={productForm.title} onChange={(e) => setProductForm({ ...productForm, title: e.target.value })} required />
          <Input placeholder={t('description')} value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} required />
          <Input placeholder={t('price')} type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required />
          <Input placeholder={t('stock')} type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} />
          <Input placeholder={t('imageUrl')} value={productForm.imageUrl} onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })} required />
          <Input placeholder={t('brand')} value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} />
          <Input placeholder={t('categoryId')} value={productForm.categoryId} onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })} required />
          <Button type="submit">{t('createProduct')}</Button>
        </form>

        <form onSubmit={createFlashSale} className="space-y-4 border border-[var(--nike-hairline-soft)] p-6">
          <h2 className="text-body-strong">{t('createFlash')}</h2>
          <Input placeholder={t('productId')} value={flashForm.productId} onChange={(e) => setFlashForm({ ...flashForm, productId: e.target.value })} required />
          <Input placeholder={t('discount')} type="number" value={flashForm.discountPercent} onChange={(e) => setFlashForm({ ...flashForm, discountPercent: e.target.value })} />
          <Input placeholder={t('duration')} type="number" value={flashForm.hours} onChange={(e) => setFlashForm({ ...flashForm, hours: e.target.value })} />
          <Input placeholder={t('maxStock')} type="number" value={flashForm.maxStock} onChange={(e) => setFlashForm({ ...flashForm, maxStock: e.target.value })} />
          <Button type="submit">{t('startFlash')}</Button>
        </form>
      </div>

      <section className="mt-10">
        <h2 className="text-body-strong mb-4">{t('pendingVendors')}</h2>
        {vendors.length === 0 ? (
          <p className="text-[var(--nike-mute)]">{t('noVendors')}</p>
        ) : (
          <div className="space-y-3">
            {vendors.map((v) => (
              <div key={v.id} className="flex items-center justify-between border border-[var(--nike-hairline-soft)] p-4">
                <div>
                  <p className="text-body-strong">{v.businessName}</p>
                  <p className="text-caption-sm text-[var(--nike-mute)]">{v.email} · {v.city}</p>
                </div>
                <Button size="sm" onClick={() => approveVendor(v.id)}>{t('approve')}</Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
