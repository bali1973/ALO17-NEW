'use client';

import React from 'react';
import Link from 'next/link';

const categories = [
  { id: 1, title: 'Emlak', icon: '🏠', count: 1234 },
  { id: 2, title: 'Vasıta', icon: '🚗', count: 856 },
  { id: 3, title: 'Elektronik', icon: '📱', count: 945 },
  { id: 4, title: 'Ev Eşyası', icon: '🛋️', count: 678 },
  { id: 5, title: 'Giyim', icon: '👕', count: 789 },
  { id: 6, title: 'Spor', icon: '⚽', count: 432 },
  { id: 7, title: 'Hobi', icon: '🎨', count: 345 },
  { id: 8, title: 'Hayvanlar', icon: '🐶', count: 234 },
  { id: 9, title: 'İş Makineleri', icon: '🚜', count: 123 },
  { id: 10, title: 'Yemek', icon: '🍽️', count: 567 }
];

const featuredListings = [
  { id: 1, title: 'iPhone 14 Pro Max 256GB - Sıfır, Kutusunda', category: 'elektronik', price: 42000, location: 'Ankara', time: '2 gün önce' },
  { id: 2, title: 'İngilizce Özel Ders - Konuşma ve Yazma Odaklı', category: 'egitim', price: 300, location: 'Çanakkale', time: '3 gün önce' },
  { id: 3, title: 'Elektrik Tesisatı Tamiri ve Bakım', category: 'hizmet', price: 250, location: 'İzmir', time: '1 gün önce' },
  { id: 4, title: 'Ücretsiz Roman ve Kitaplar - İyi Durumda', category: 'ucretsiz-gel-al', price: 0, location: 'İstanbul', time: '5 saat önce', isFree: true }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1e40af] to-[#3b82f6] text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6 text-center">Herkesin Kolayca İlan Verebileceği Platform</h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-center text-blue-100">30 gün ücretsiz kullanım imkanıyla hayalinizdeki alıcı veya satıcıyı bulun.</p>
          <div className="flex gap-6 justify-center">
            <Link href="/ilan-ver" className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg">İlan Ver</Link>
            <Link href="/giris" className="bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-800 transition-colors border border-blue-600 shadow-lg">Giriş Yap</Link>
          </div>
        </div>
      </section>

      {/* Premium İlan Avantajları */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Premium İlan Avantajları</h2>
            <p className="text-lg text-gray-600">İlanınızı öne çıkarın, daha fazla görüntülenme ve etkileşim alın!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Premium Özellik 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-4 rounded-full">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold ml-4 text-blue-900">Öne Çıkan İlan</h3>
              </div>
              <p className="text-gray-600 text-lg">İlanınız kategorisinde en üstte gösterilir ve daha fazla dikkat çeker.</p>
            </div>

            {/* Premium Özellik 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-4 rounded-full">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold ml-4 text-blue-900">Premium Rozeti</h3>
              </div>
              <p className="text-gray-600 text-lg">Premium rozeti ile ilanınız daha güvenilir ve profesyonel görünür.</p>
            </div>

            {/* Premium Özellik 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-4 rounded-full">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold ml-4 text-blue-900">3 Kat Daha Fazla Görüntülenme</h3>
              </div>
              <p className="text-gray-600 text-lg">Premium ilanlar normal ilanlara göre 3 kat daha fazla görüntülenme alır.</p>
            </div>
          </div>

          {/* Premium Fiyat ve CTA */}
          <div className="mt-12 text-center">
            <div className="inline-block bg-white p-8 rounded-2xl shadow-lg border border-blue-200">
              <p className="text-3xl font-bold text-blue-900 mb-2">Sadece 99.00 ₺</p>
              <p className="text-gray-600 text-lg mb-6">/ aylık</p>
              <Link 
                href="/ilan-ver" 
                className="inline-block bg-blue-600 text-white px-10 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Hemen Premium İlan Ver
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popüler Kategoriler */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center text-blue-900">Popüler Kategoriler</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categories.map(cat => (
              <Link 
                href={`/kategori/${cat.title.toLowerCase()}`} 
                key={cat.id} 
                className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition-shadow border border-gray-100"
              >
                <span className="text-4xl mb-3">{cat.icon}</span>
                <span className="font-semibold text-gray-800 text-center text-lg">{cat.title}</span>
                <span className="text-blue-600 text-sm mt-2 font-medium">{cat.count} ilan</span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link 
              href="/kategoriler" 
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md"
            >
              Tüm Kategoriler
            </Link>
          </div>
        </div>
      </section>

      {/* Öne Çıkan İlanlar */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center text-blue-900">Öne Çıkan İlanlar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featuredListings.map(listing => (
              <div key={listing.id} className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-3 hover:shadow-lg transition-shadow">
                <span className="font-bold text-lg text-gray-800">{listing.title}</span>
                <span className="text-gray-500 text-sm font-medium">{listing.category}</span>
                {listing.isFree ? (
                  <span className="text-blue-600 font-semibold text-lg">Ücretsiz Gel Al</span>
                ) : (
                  <span className="text-blue-600 font-semibold text-lg">{listing.price} ₺</span>
                )}
                <span className="text-gray-400 text-sm">{listing.location} • {listing.time}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/ilanlar" className="text-blue-700 font-semibold text-lg hover:underline">Tüm İlanlar →</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-12 mt-12 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          {/* İletişim ve Hakkımızda */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-base mb-10">
            {/* İletişim */}
            <div>
              <h3 className="font-bold mb-4 text-lg text-gray-800">İletişim</h3>
              <p className="text-gray-600 mb-2">📍 Cevatpaşa Mahallesi, Bayrak Sokak No:4, Çanakkale</p>
              <p className="text-gray-600 mb-2">✉️ destek@alo17.tr</p>
              <p className="text-gray-600">📞 0541 404 2 404</p>
            </div>
            {/* Hakkımızda */}
            <div>
              <h3 className="font-bold mb-4 text-lg text-gray-800">Hakkımızda</h3>
              <p className="text-gray-600">ALO17.TR, Türkiye'nin yeni nesil ilan platformudur. 30 gün ücretsiz kullanım imkanıyla kullanıcılarına kolayca ilan vermeleri sağlar.</p>
            </div>
          </div>
          {/* Telif Hakkı */}
          <div className="text-center text-gray-500 text-sm">© 2025 ALO17.TR. Tüm hakları saklıdır.</div>
          {/* Ücretsiz Dönem */}
          <div className="text-center text-blue-600 font-bold text-lg mt-4">30 GÜN ÜCRETSİZ! Avantajlı ücretsiz dönemini kaçırma!</div>
        </div>
      </footer>
    </main>
  );
} 