'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <Header />
      <main className="min-h-screen bg-alo-light">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-alo-blue to-alo-light-blue text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
              ALO.TR
            </h1>
            <p className="text-xl md:text-2xl text-center mb-8">
              Türkiye'nin En Büyük İlan Platformu
            </p>
            
            {/* Arama Kutusu */}
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ne aramıştınız?"
                  className="flex-1 px-6 py-3 rounded-lg text-alo-dark focus:outline-none focus:ring-2 focus:ring-alo-orange"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="bg-alo-orange hover:bg-alo-light-orange px-8 py-3 rounded-lg font-semibold transition-colors">
                  Ara
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Kategoriler */}
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-alo-dark mb-8 text-center">Popüler Kategoriler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/kategori/${category.slug}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center group"
              >
                <div className="text-alo-blue text-4xl mb-3 group-hover:text-alo-orange transition-colors">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-alo-dark">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Öne Çıkan İlanlar */}
        <div className="bg-alo-light py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-alo-dark mb-8 text-center">Öne Çıkan İlanlar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredListings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-alo-light-blue relative">
                    {/* İlan resmi buraya gelecek */}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
                    <p className="text-alo-red font-bold">{listing.price} TL</p>
                    <p className="text-gray-600 text-sm mt-2">{listing.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-alo-orange text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">İlanınızı Hemen Verin!</h2>
            <p className="mb-8">Binlerce potansiyel alıcıya ulaşın</p>
            <Link
              href="/ilan-ver"
              className="bg-white text-alo-orange px-8 py-3 rounded-lg font-semibold hover:bg-alo-light transition-colors inline-block"
            >
              İlan Ver
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

// Örnek veriler
const categories = [
  { id: 1, name: 'Emlak', slug: 'emlak', icon: '🏠' },
  { id: 2, name: 'Vasıta', slug: 'vasita', icon: '🚗' },
  { id: 3, name: 'Elektronik', slug: 'elektronik', icon: '📱' },
  { id: 4, name: 'İş Makineleri', slug: 'is-makineleri', icon: '🚜' },
  { id: 5, name: 'Ev Eşyaları', slug: 'ev-esyalari', icon: '🛋️' },
  { id: 6, name: 'İş İlanları', slug: 'is-ilanlari', icon: '💼' },
  { id: 7, name: 'Yedek Parça', slug: 'yedek-parca', icon: '🔧' },
  { id: 8, name: 'Diğer', slug: 'diger', icon: '📦' },
];

const featuredListings = [
  {
    id: 1,
    title: 'Sahibinden Satılık Lüks Daire',
    price: '2.450.000',
    location: 'Kadıköy, İstanbul',
  },
  {
    id: 2,
    title: '2020 Model Volkswagen Golf',
    price: '850.000',
    location: 'Çankaya, Ankara',
  },
  {
    id: 3,
    title: 'iPhone 14 Pro Max',
    price: '45.000',
    location: 'Konak, İzmir',
  },
]; 