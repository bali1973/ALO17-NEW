"use client";
import React, { useState } from 'react';
import CategoryFilters from '@/components/CategoryFilters';

const fakeIlanlar = [
  { id: 1, title: 'iPhone 13 Pro', price: 35000, city: 'İstanbul', brand: 'Apple', image: '/images/placeholder.jpg' },
  { id: 2, title: 'Samsung Galaxy S22', price: 28000, city: 'Ankara', brand: 'Samsung', image: '/images/placeholder.jpg' },
  { id: 3, title: 'Xiaomi Redmi Note 12', price: 12000, city: 'İzmir', brand: 'Xiaomi', image: '/images/placeholder.jpg' },
  { id: 4, title: 'Huawei P40', price: 15000, city: 'Bursa', brand: 'Huawei', image: '/images/placeholder.jpg' },
];

export default function TelefonPage() {
  const [city, setCity] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [brand, setBrand] = useState('');

  // Fiyat aralığı filtreleme
  const filterByPrice = (price: number, range: string) => {
    if (!range) return true;
    if (range === '0-1000') return price >= 0 && price <= 1000;
    if (range === '1000-5000') return price >= 1000 && price <= 5000;
    if (range === '5000-10000') return price >= 5000 && price <= 10000;
    if (range === '10000+') return price >= 10000;
    return true;
  };

  const filteredIlanlar = fakeIlanlar.filter(ilan => {
    if (city && ilan.city !== city) return false;
    if (brand && ilan.brand !== brand) return false;
    if (!filterByPrice(ilan.price, priceRange)) return false;
    // premiumOnly sahte veride yok, gerçek veride eklenecek
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 mb-8 md:mb-0">
        <CategoryFilters
          city={city}
          onCityChange={setCity}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          premiumOnly={premiumOnly}
          onPremiumOnlyChange={setPremiumOnly}
        />
        <div className="bg-white rounded-lg shadow p-4 mt-4">
          <label className="block font-medium mb-1">Marka</label>
          <select className="w-full border rounded p-2" value={brand} onChange={e => setBrand(e.target.value)}>
            <option value="">Tümü</option>
            <option value="Apple">Apple</option>
            <option value="Samsung">Samsung</option>
            <option value="Xiaomi">Xiaomi</option>
            <option value="Huawei">Huawei</option>
          </select>
        </div>
      </aside>
      {/* İlanlar */}
      <main className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIlanlar.map((ilan) => (
            <div key={ilan.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <img src={ilan.image} alt={ilan.title} className="w-full h-32 object-cover rounded mb-3" />
              <h3 className="text-lg font-semibold mb-1">{ilan.title}</h3>
              <div className="text-gray-500 text-sm mb-1">{ilan.city}</div>
              <div className="text-alo-orange font-bold mb-2">{ilan.price.toLocaleString('tr-TR')} ₺</div>
              <button className="bg-alo-orange text-white px-4 py-2 rounded hover:bg-orange-600 transition">Detay</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 