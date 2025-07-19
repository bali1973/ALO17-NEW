import React from 'react';

const fakeIlanlar = [
  { id: 1, title: 'iPhone 13 Pro', price: 35000, city: 'İstanbul', image: '/images/placeholder.jpg' },
  { id: 2, title: 'Samsung Galaxy S22', price: 28000, city: 'Ankara', image: '/images/placeholder.jpg' },
  { id: 3, title: 'Xiaomi Redmi Note 12', price: 12000, city: 'İzmir', image: '/images/placeholder.jpg' },
  { id: 4, title: 'Huawei P40', price: 15000, city: 'Bursa', image: '/images/placeholder.jpg' },
];

export default function TelefonPage() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 mb-8 md:mb-0">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Filtreler</h2>
          <div className="mb-4">
            <label className="block font-medium mb-1">Marka</label>
            <select className="w-full border rounded p-2">
              <option>Tümü</option>
              <option>Apple</option>
              <option>Samsung</option>
              <option>Xiaomi</option>
              <option>Huawei</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Şehir</label>
            <select className="w-full border rounded p-2">
              <option>Tümü</option>
              <option>İstanbul</option>
              <option>Ankara</option>
              <option>İzmir</option>
              <option>Bursa</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Fiyat</label>
            <select className="w-full border rounded p-2">
              <option>Tümü</option>
              <option>0-10.000 TL</option>
              <option>10.000-20.000 TL</option>
              <option>20.000 TL+</option>
            </select>
          </div>
          <button className="w-full bg-alo-orange text-white py-2 rounded hover:bg-orange-600 transition">Filtreleri Temizle</button>
        </div>
      </aside>
      {/* İlanlar */}
      <main className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fakeIlanlar.map((ilan) => (
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