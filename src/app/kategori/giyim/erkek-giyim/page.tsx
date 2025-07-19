'use client';
import { useEffect, useState } from 'react';
import { ListingCard } from '@/components/listing-card';
import { useCategories } from '@/lib/useCategories';

export default function ErkekGiyimPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSub, setSelectedSub] = useState<string>('');
  const { categories, loading: catLoading } = useCategories();

  // Giyim ana kategorisinin alt kategorileri
  const giyimCat = categories?.find((cat: any) => cat.slug === 'giyim');
  const erkekGiyimCat = giyimCat?.subCategories?.find((sub: any) => sub.slug === 'erkek-giyim');
  const subcategories = erkekGiyimCat?.subCategories || [];

  // Sabit alt kategori listesi
  const staticSubcategories = [
    'Üst Giyim',
    'Alt Giyim',
    'Elbise & Tulum',
    'Dış Giyim',
    'İç Giyim & Ev Giyimi',
    'Ayakkabı',
    'Aksesuar',
    'Spor Giyim',
    'Plaj Giyimi',
  ];

  useEffect(() => {
    setLoading(true);
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        setListings(data.filter((l: any) => l.category === 'giyim' && l.subcategory === 'Erkek Giyim'));
        setLoading(false);
      })
      .catch(() => {
        setError('İlanlar yüklenemedi');
        setLoading(false);
      });
  }, []);

  // Seçili alt kategoriye göre filtrele
  const filteredListings = selectedSub
    ? listings.filter(l => l.subsubcategory === selectedSub)
    : listings;

  if (loading || catLoading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Erkek Giyim İlanları</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-64 w-full mb-4 md:mb-0">
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-3">Alt Kategoriler</h2>
            <ul className="space-y-2">
              <li>
                <button
                  className="w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                  onClick={() => setSelectedSub('')}
                >Tümü</button>
              </li>
              {staticSubcategories.map((sub) => (
                <li key={sub}>
                  <button
                    className="w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                    onClick={() => setSelectedSub(sub)}
                  >{sub}</button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        {/* İlanlar */}
        <main className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          {filteredListings.length === 0 && <div className="text-center py-12">İlan bulunamadı.</div>}
        </main>
      </div>
    </div>
  );
} 