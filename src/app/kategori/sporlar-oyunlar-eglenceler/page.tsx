'use client'

import { FaFutbol, FaGamepad, FaDice, FaCampground, FaTicketAlt } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { ListingCard } from '@/components/listing-card'
import Link from 'next/link'
import { useCategories } from '@/lib/useCategories'

export default function SporlarOyunlarEglencelerPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSub, setSelectedSub] = useState<string>('');
  const { categories, loading: catLoading } = useCategories();

  // Alt kategorileri bul
  const subcategories = categories?.find((cat: any) => cat.slug === 'sporlar-oyunlar-eglenceler')?.subCategories || [];

  useEffect(() => {
    setLoading(true);
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        setListings(data.filter((l: any) => l.category === 'sporlar-oyunlar-eglenceler'));
        setLoading(false);
      })
      .catch(() => {
        setError('İlanlar yüklenemedi');
        setLoading(false);
      });
  }, []);

  // Seçili alt kategoriye göre filtrele
  const filteredListings = selectedSub
    ? listings.filter(l => l.subcategory === selectedSub)
    : listings;

  if (loading || catLoading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Sporlar, Oyunlar ve Eğlenceler İlanları</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-64 w-full mb-4 md:mb-0">
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-3">Alt Kategoriler</h2>
            <ul className="space-y-2">
              <li>
                <button
                  className={`w-full text-left px-2 py-1 rounded ${selectedSub === '' ? 'bg-alo-orange text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setSelectedSub('')}
                >Tümü</button>
              </li>
              {subcategories.map((sub: any) => (
                <li key={sub.slug}>
                  <button
                    className={`w-full text-left px-2 py-1 rounded ${selectedSub === sub.name ? 'bg-alo-orange text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => setSelectedSub(sub.name)}
                  >{sub.name}</button>
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