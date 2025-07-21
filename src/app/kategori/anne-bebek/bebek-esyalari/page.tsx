"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CategoryFilters from '@/components/CategoryFilters';

const subcategories = [
  { slug: 'bebek-arabasi', name: 'Bebek Arabası' },
  { slug: 'bebek-giyim', name: 'Bebek Giyim' },
  { slug: 'bebek-oyuncaklari', name: 'Bebek Oyuncakları' },
  { slug: 'bebek-esyalari', name: 'Bebek Eşyaları' },
];

export default function BebekEsyaPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Filtre state'leri
  const [city, setCity] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [premiumOnly, setPremiumOnly] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        setListings(data.filter((l: any) => l.category === 'anne-bebek' && l.subcategory === 'bebek-esyalari'));
        setLoading(false);
      })
      .catch(() => {
        setError('İlanlar yüklenemedi');
        setLoading(false);
      });
  }, []);

  // Filtreleme
  const filteredListings = listings.filter(listing => {
    if (premiumOnly && !listing.isPremium) return false;
    if (city && listing.location !== city) return false;
    if (priceRange) {
      const price = parseFloat(listing.price);
      if (priceRange === '0-1000' && !(price >= 0 && price <= 1000)) return false;
      if (priceRange === '1000-5000' && !(price >= 1000 && price <= 5000)) return false;
      if (priceRange === '5000-10000' && !(price >= 5000 && price <= 10000)) return false;
      if (priceRange === '10000+' && !(price >= 10000)) return false;
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-80 flex-shrink-0 mb-8 md:mb-0">
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Alt Kategoriler</h2>
          <ul className="space-y-2">
            {subcategories.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/kategori/anne-bebek/${cat.slug}`}
                  className={`block px-3 py-2 rounded transition ${cat.slug === 'bebek-esyalari' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'hover:bg-gray-100'}`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-yellow-100 rounded-lg shadow p-4 mb-6 border border-blue-200">
          <CategoryFilters
            city={city}
            onCityChange={setCity}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            premiumOnly={premiumOnly}
            onPremiumOnlyChange={setPremiumOnly}
          />
        </div>
      </aside>
      {/* Main */}
      <main className="flex-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bebek Eşyaları</h1>
        <p className="text-gray-600 mb-6">Anne & Bebek kategorisinde Bebek Eşyaları alt kategorisi</p>
        {loading ? (
          <div>Yükleniyor...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : filteredListings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-2">Bu Alt Kategorideki İlanlar</h2>
            <p className="mb-4 text-gray-600">Bu alt kategoride henüz ilan bulunmuyor. İlk ilanı vermek için aşağıdaki butona tıklayın.</p>
            <div className="flex gap-3">
              <Link href="/ilan-ver" className="bg-blue-600 text-white px-5 py-2 rounded font-semibold hover:bg-blue-700 transition">İlan Ver</Link>
              <Link href="/kategori/anne-bebek" className="bg-gray-100 text-gray-700 px-5 py-2 rounded font-semibold hover:bg-gray-200 transition">Tüm Anne & Bebek İlanları</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredListings.map(listing => (
              <div key={listing.id} className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-2">{listing.title}</h3>
                <p className="text-gray-600 mb-1">{listing.description}</p>
                <div className="text-sm text-gray-500 mb-1">Şehir: {listing.location}</div>
                <div className="text-sm text-gray-500 mb-1">Fiyat: {listing.price} TL</div>
                {listing.isPremium && <span className="inline-block bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold">Premium</span>}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 