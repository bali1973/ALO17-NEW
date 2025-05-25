'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const steps = [
  {
    id: 1,
    title: 'İlan Oluştur',
    description: 'Ücretsiz hesap oluştur ve ilanını yayınla',
    icon: '📝'
  },
  {
    id: 2,
    title: 'Detayları Belirt',
    description: 'İlan detaylarını, fotoğrafları ve fiyatı ekle',
    icon: '📸'
  },
  {
    id: 3,
    title: 'Yayınla',
    description: 'İlanını onayladıktan sonra yayınla',
    icon: '🚀'
  }
];

const categories = [
  { id: 1, title: 'İş İlanları', icon: '💼', count: 567 },
  { id: 2, title: 'Hizmet', icon: '🔧', count: 1432 },
  { id: 3, title: 'Sağlık Güzellik', icon: '🩺', count: 378 },
  { id: 4, title: 'Elektronik', icon: '📱', count: 576 },
  { id: 5, title: 'Ev ve Bahçe', icon: '🏠', count: 534 },
  { id: 6, title: 'Ücretsiz Gel Al', icon: '🎁', count: 210 },
];

const featuredListings = [
  { id: 1, title: 'iPhone 14 Pro Max 256GB - Sıfır, Kutusunda', category: 'elektronik', price: 42000, location: 'Ankara', time: '2 gün önce' },
  { id: 2, title: 'İngilizce Özel Ders - Konuşma ve Yazma Odaklı', category: 'egitim', price: 300, location: 'Çanakkale', time: '3 gün önce' },
  { id: 3, title: 'Elektrik Tesisatı Tamiri ve Bakım', category: 'hizmet', price: 250, location: 'İzmir', time: '1 gün önce' },
  { id: 4, title: 'Ücretsiz Roman ve Kitaplar - İyi Durumda', category: 'ucretsiz-gel-al', price: 0, location: 'İstanbul', time: '5 saat önce', isFree: true },
];

export default function HomePage() {
  // Örnek olarak boş bir dizi (veya gerçek API'den gelen veri) kullanıyoruz.
  const [newListings, setNewListings] = useState<{ id: string; title: string; description: string; price: number; }[]>([]);

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <h1 className="text-4xl font-bold mb-4 text-center">Herkesin Kolayca İlan Verebileceği Platform</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-center">30 gün ücretsiz kullanım imkanıyla hayalinizdeki alıcı veya satıcıyı bulun.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/ilan-ver" className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">İlan Ver</Link>
          <Link href="/giris" className="bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors">Giriş Yap</Link>
        </div>
      </section>

      {/* Premium İlan Avantajları */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-800 mb-2">Premium İlan Avantajları</h2>
            <p className="text-gray-600">İlanınızı öne çıkarın, daha fazla görüntülenme ve etkileşim alın!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Premium Özellik 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold ml-4">Öne Çıkan İlan</h3>
              </div>
              <p className="text-gray-600">İlanınız kategorisinde en üstte gösterilir ve daha fazla dikkat çeker.</p>
            </div>

            {/* Premium Özellik 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold ml-4">Premium Rozeti</h3>
              </div>
              <p className="text-gray-600">Premium rozeti ile ilanınız daha güvenilir ve profesyonel görünür.</p>
            </div>

            {/* Premium Özellik 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold ml-4">3 Kat Daha Fazla Görüntülenme</h3>
              </div>
              <p className="text-gray-600">Premium ilanlar normal ilanlara göre 3 kat daha fazla görüntülenme alır.</p>
            </div>
          </div>

          {/* Premium Fiyat ve CTA */}
          <div className="mt-8 text-center">
            <div className="inline-block bg-white p-6 rounded-lg shadow-sm border border-blue-200">
              <p className="text-2xl font-bold text-blue-800 mb-2">Sadece 99.00 ₺</p>
              <p className="text-gray-600 mb-4">/ aylık</p>
              <Link 
                href="/ilan-ver" 
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Hemen Premium İlan Ver
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popüler Kategoriler */}
      <section className="py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Popüler Kategoriler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <span className="text-4xl mb-2">{cat.icon}</span>
              <span className="font-semibold text-lg mb-1">{cat.title}</span>
              <span className="text-blue-600 text-sm">{cat.count} ilan</span>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/kategoriler" className="text-blue-700 font-medium hover:underline">Tüm Kategoriler →</Link>
        </div>
      </section>

      {/* Öne Çıkan İlanlar */}
      <section className="py-12 bg-gray-50">
        <h2 className="text-2xl font-bold mb-6 text-center">Öne Çıkan İlanlar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {featuredListings.map(listing => (
            <div key={listing.id} className="bg-white rounded-lg shadow p-5 flex flex-col gap-2">
              <span className="font-bold text-lg">{listing.title}</span>
              <span className="text-gray-500 text-sm">{listing.category}</span>
              {listing.isFree ? (
                <span className="text-blue-600 font-semibold">Ücretsiz Gel Al</span>
              ) : (
                <span className="text-blue-600 font-semibold">{listing.price} ₺</span>
              )}
              <span className="text-gray-400 text-xs">{listing.location} • {listing.time}</span>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/ilanlar" className="text-blue-700 font-medium hover:underline">Tüm İlanlar →</Link>
        </div>
      </section>

      {/* Yasal Bilgilendirme */}
      <section className="py-8">
        <div className="max-w-3xl mx-auto text-gray-600 text-sm text-center">
          Siz de kendi güvenliğiniz ve diğer kullanıcıların daha sağlıklı alışveriş yapabilmeleri için, satın almak istediğiniz ürünü teslim almadan ön ödeme yapmamaya, avans ya da kapora ödememeye özen gösteriniz. İlan sahiplerinin ilanlarda belirttiği herhangi bir bilgi ya da görselin gerçeği yansıtmadığını düşünüyorsanız veya ilan sahiplerinin hesap profillerindeki bilgilerin doğru olmadığını düşünüyorsanız, lütfen ilanı bildiriniz.
          <br /><br />
          ALO17.TR'de yer alan kullanıcıların oluşturduğu tüm içerik, görüş ve bilgilerin doğruluğu, eksiksiz ve değişmez olduğu, yayınlanması ile ilgili yasal yükümlülükler içeriği oluşturan kullanıcıya aittir. Bu içeriğin, görüş ve bilgilerin yanlışlık, eksiklik veya yasalarla düzenlenmiş kurallara aykırılığından ALO17.TR hiçbir şekilde sorumlu değildir. Sorularınız için ilan sahibi ile irtibata geçebilirsiniz.
        </div>
      </section>

      {/* İletişim ve Footer Bilgileri */}
      <footer className="bg-gray-100 py-8 mt-8 border-t">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h3 className="font-bold mb-2">İletişim</h3>
            <p>📍 Cevatpaşa Mahallesi, Bayrak Sokak No:4, Çanakkale</p>
            <p>✉️ destek@alo17.tr</p>
            <p>📞 0541 404 2 404</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Yasal</h3>
          </div>
          <div>
            <h3 className="font-bold mb-2">Hakkımızda</h3>
            <p>ALO17.TR, Türkiye'nin yeni nesil ilan platformudur. 30 gün ücretsiz kullanım imkanıyla kullanıcılarına kolayca ilan vermeleri sağlar.</p>
          </div>
        </div>
        <div className="text-center text-gray-400 text-xs mt-8">© 2025 ALO17.TR. Tüm hakları saklıdır.</div>
        <div className="text-center text-blue-600 font-bold mt-2">30 GÜN ÜCRETSİZ! Avantajlı ücretsiz dönemini kaçırma!</div>
      </footer>
    </main>
  );
} 