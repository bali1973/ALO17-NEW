import React from 'react';
import Link from 'next/link';

const subcategories = [
  { slug: 'bebek-arabasi', name: 'Bebek Arabası' },
  { slug: 'bebek-giyim', name: 'Bebek Giyim' },
  { slug: 'bebek-oyuncaklari', name: 'Bebek Oyuncakları' },
  { slug: 'bebek-esyalari', name: 'Bebek Eşyaları' },
];

export default function BebekGiyimPage() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 mb-8 md:mb-0">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Alt Kategoriler</h2>
          <ul className="space-y-2">
            {subcategories.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/kategori/anne-bebek/${cat.slug}`}
                  className={`block px-3 py-2 rounded transition ${cat.slug === 'bebek-giyim' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'hover:bg-gray-100'}`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      {/* Main */}
      <main className="flex-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bebek Giyim</h1>
        <p className="text-gray-600 mb-6">Anne & Bebek kategorisinde Bebek Giyim alt kategorisi</p>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-2">Bu Alt Kategorideki İlanlar</h2>
          <p className="mb-4 text-gray-600">Bu alt kategoride henüz ilan bulunmuyor. İlk ilanı vermek için aşağıdaki butona tıklayın.</p>
          <div className="flex gap-3">
            <Link href="/ilan-ver" className="bg-blue-600 text-white px-5 py-2 rounded font-semibold hover:bg-blue-700 transition">İlan Ver</Link>
            <Link href="/kategori/anne-bebek" className="bg-gray-100 text-gray-700 px-5 py-2 rounded font-semibold hover:bg-gray-200 transition">Tüm Anne & Bebek İlanları</Link>
          </div>
        </div>
      </main>
    </div>
  );
} 