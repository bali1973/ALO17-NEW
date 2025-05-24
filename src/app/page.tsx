'use client';

import React from 'react';
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

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ALO17 İlan Sitesine Hoş Geldiniz
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Türkiye'nin en büyük ilan sitesinde alım satım yapın, işinizi büyütün
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/ilan/olustur"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            İlan Oluştur
          </Link>
          <Link
            href="/ilanlar"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium border border-blue-600 hover:bg-blue-50 transition-colors"
          >
            İlanları Görüntüle
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Nasıl Çalışır?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className="bg-white p-6 rounded-lg shadow-sm text-center"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Öne Çıkan İlanlar</h2>
          <Link
            href="/ilanlar"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Tümünü Gör →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured listings will be loaded dynamically */}
          <div className="text-center py-8 text-gray-500">
            Öne çıkan ilanlar yakında burada olacak
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-600 text-white py-12 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">
          Hemen İlan Vermeye Başlayın
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Binlerce potansiyel alıcıya ulaşın, işinizi büyütün
        </p>
        <Link
          href="/ilan/olustur"
          className="bg-white text-blue-600 px-8 py-4 rounded-lg font-medium hover:bg-blue-50 transition-colors inline-block"
        >
          Ücretsiz İlan Ver
        </Link>
      </section>
    </div>
  );
} 