"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCategories } from '@/lib/useCategories';

export default function YemekIcecekPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();

  // Ana kategori ve alt kategorileri bul
  const mainCategory = categories.find(cat => cat.slug === 'yemek-icecek');
  const subcategories = (mainCategory?.subCategories || []).sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

  useEffect(() => {
    setLoading(true);
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        setListings(data.filter((l: any) => l.category === 'yemek-icecek'));
        setLoading(false);
      })
      .catch(() => {
        setError('İlanlar yüklenemedi');
        setLoading(false);
      });
  }, []);

  if (loading || categoriesLoading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (categoriesError) return <div className="text-red-600">{categoriesError}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Yemek & İçecek İlanları</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar - Alt Kategoriler */}
        <aside className="md:w-64 w-full mb-4 md:mb-0">
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-3">Alt Kategoriler</h2>
            <ul className="space-y-2">
              {subcategories.length === 0 && <li>Alt kategori bulunamadı.</li>}
              {subcategories.map((s: any) => (
                <li key={s.slug}>
                  <Link
                    href={`/kategori/yemek-icecek/${s.slug}`}
                    className="block w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                  >{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        {/* İlanlar */}
        <main className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => (
              <div key={listing.id} className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-2">{listing.title}</h2>
                <div className="text-gray-600 mb-1">{listing.location}</div>
                <div className="text-gray-800 font-bold mb-2">{listing.price} TL</div>
                {/* Diğer alanlar */}
              </div>
            ))}
          </div>
          {listings.length === 0 && <div className="text-center py-12">İlan bulunamadı.</div>}
        </main>
      </div>
    </div>
  );
} 