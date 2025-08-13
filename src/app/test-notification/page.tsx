'use client';

import { useState } from 'react';
import NotificationSubscription from '@/components/NotificationSubscription';

export default function TestNotificationPage() {
  const [selectedCategory, setSelectedCategory] = useState('elektronik');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  const categories = [
    { slug: 'elektronik', name: 'Elektronik' },
    { slug: 'ev-bahce', name: 'Ev & Bahçe' },
    { slug: 'yemek-icecek', name: 'Yemek & İçecek' },
    { slug: 'egitim-kurslar', name: 'Eğitim & Kurslar' },
    { slug: 'hizmetler', name: 'Hizmetler' }
  ];

  const subcategories = {
    elektronik: [
      { slug: 'telefon', name: 'Telefon' },
      { slug: 'bilgisayar', name: 'Bilgisayar' },
      { slug: 'tablet', name: 'Tablet' }
    ],
    'ev-bahce': [
      { slug: 'mobilya', name: 'Mobilya' },
      { slug: 'dekorasyon', name: 'Dekorasyon' },
      { slug: 'bahce', name: 'Bahçe' }
    ],
    'yemek-icecek': [
      { slug: 'restoranlar', name: 'Restoranlar' },
      { slug: 'kafeler', name: 'Kafeler' },
      { slug: 'pastaneler', name: 'Pastaneler' }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Notification Subscription Test
          </h1>
          <p className="text-gray-600">
            Farklı kategoriler için notification subscription sistemini test edin
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Kontrolleri */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Test Ayarları
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori Seçin
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {subcategories[selectedCategory as keyof typeof subcategories] && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Kategori Seçin (Opsiyonel)
                  </label>
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Tüm Alt Kategoriler</option>
                    {subcategories[selectedCategory as keyof typeof subcategories].map((subcategory) => (
                      <option key={subcategory.slug} value={subcategory.slug}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Seçili Ayarlar:</h3>
                <div className="text-sm text-blue-800">
                  <p><strong>Kategori:</strong> {categories.find(c => c.slug === selectedCategory)?.name}</p>
                  {selectedSubcategory && (
                    <p><strong>Alt Kategori:</strong> {subcategories[selectedCategory as keyof typeof subcategories]?.find(s => s.slug === selectedSubcategory)?.name}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notification Subscription Bileşeni */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Notification Subscription
            </h2>
            
            <NotificationSubscription
              category={selectedCategory}
              subcategory={selectedSubcategory}
            />
          </div>
        </div>

        {/* Test Bilgileri */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Test Bilgileri
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Nasıl Test Edilir:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Farklı kategoriler seçin</li>
                <li>• Alt kategoriler ekleyin</li>
                <li>• Anahtar kelimeler girin</li>
                <li>• Fiyat aralığı belirleyin</li>
                <li>• Konum filtresi ekleyin</li>
                <li>• Bildirim sıklığını değiştirin</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">API Endpoint&apos;leri:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <code>POST /api/notifications/subscription</code></li>
                <li>• <code>DELETE /api/notifications/subscription</code></li>
                <li>• <code>GET /api/notifications/subscription</code></li>
                <li>• <code>GET /api/notifications/subscription/check</code></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">Önemli Notlar:</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Test için gerçek e-posta adresi kullanın</li>
              <li>• Abonelik oluşturduktan sonra yeni ilan eklendiğinde bildirim alacaksınız</li>
              <li>• Abonelikleri profil sayfasından yönetebilirsiniz</li>
              <li>• E-posta gönderimi için SMTP ayarları gerekli</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 
