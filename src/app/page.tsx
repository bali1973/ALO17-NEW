import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Alo17 İlan Sitesi</h1>
          <p className="text-xl mb-8">Türkiye'nin güvenilir online alışveriş platformu</p>
          <div className="space-x-4">
            <Link 
              href="/listings/create" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              İlan Ver
            </Link>
            <Link 
              href="/listings" 
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              İlanları Görüntüle
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popüler Kategoriler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/listings?category=${category.id}`}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-semibold">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nasıl Çalışır?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Öne Çıkan İlanlar</h2>
            <Link 
              href="/listings" 
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Tümünü Gör →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Featured listings will be dynamically loaded here */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg mb-4"></div>
              <h3 className="font-semibold mb-2">İlanlar yakında burada görünecek</h3>
              <p className="text-gray-600 text-sm mb-4">İlanlar yüklendiğinde burada listelenecek</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-semibold">₺0</span>
                <Link 
                  href="/listings" 
                  className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                >
                  Detayları Gör
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Hemen İlan Vermeye Başlayın</h2>
          <p className="text-xl mb-8">Binlerce potansiyel alıcıya ulaşın</p>
          <Link 
            href="/listings/create" 
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
          >
            Ücretsiz İlan Ver
          </Link>
        </div>
      </section>
    </div>
  );
}

const categories = [
  { id: 'electronics', name: 'Elektronik', icon: '📱' },
  { id: 'vehicles', name: 'Araçlar', icon: '🚗' },
  { id: 'property', name: 'Emlak', icon: '🏠' },
  { id: 'furniture', name: 'Mobilya', icon: '🪑' },
  { id: 'fashion', name: 'Moda', icon: '👕' },
  { id: 'sports', name: 'Spor', icon: '⚽' },
  { id: 'pets', name: 'Evcil Hayvanlar', icon: '🐾' },
  { id: 'jobs', name: 'İş İlanları', icon: '💼' },
];

const steps = [
  {
    title: 'İlan Oluştur',
    description: 'Ücretsiz hesap oluşturun ve ilanınızı detaylı bir şekilde hazırlayın',
  },
  {
    title: 'Onay Bekle',
    description: 'İlanınız hızlı bir şekilde incelenir ve onaylanır',
  },
  {
    title: 'Satışa Başla',
    description: 'İlanınız yayınlanır ve potansiyel alıcılarla iletişime geçebilirsiniz',
  },
]; 