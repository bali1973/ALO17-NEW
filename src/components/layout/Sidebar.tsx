'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const categories = [
  { id: 'emlak', name: 'Emlak', icon: '🏠', subcategories: [
    { id: 'konut', name: 'Konut' },
    { id: 'isyeri', name: 'İş Yeri' },
    { id: 'arsa', name: 'Arsa' },
    { id: 'projeler', name: 'Projeler' }
  ]},
  { id: 'vasita', name: 'Vasıta', icon: '🚗', subcategories: [
    { id: 'otomobil', name: 'Otomobil' },
    { id: 'motosiklet', name: 'Motosiklet' },
    { id: 'ticari', name: 'Ticari Araçlar' },
    { id: 'yedek-parca', name: 'Yedek Parça' }
  ]},
  { id: 'elektronik', name: 'Elektronik', icon: '📱', subcategories: [
    { id: 'telefon', name: 'Telefon' },
    { id: 'bilgisayar', name: 'Bilgisayar' },
    { id: 'tablet', name: 'Tablet' },
    { id: 'televizyon', name: 'Televizyon' }
  ]},
  { id: 'ev-esyasi', name: 'Ev Eşyası', icon: '🛋️', subcategories: [
    { id: 'mobilya', name: 'Mobilya' },
    { id: 'beyaz-esya', name: 'Beyaz Eşya' },
    { id: 'mutfak', name: 'Mutfak Gereçleri' },
    { id: 'dekorasyon', name: 'Dekorasyon' }
  ]},
  { id: 'giyim', name: 'Giyim', icon: '👕', subcategories: [
    { id: 'erkek', name: 'Erkek' },
    { id: 'kadin', name: 'Kadın' },
    { id: 'cocuk', name: 'Çocuk' },
    { id: 'ayakkabi', name: 'Ayakkabı' }
  ]},
  { id: 'spor', name: 'Spor', icon: '⚽', subcategories: [
    { id: 'fitness', name: 'Fitness' },
    { id: 'kamp', name: 'Kamp' },
    { id: 'bisiklet', name: 'Bisiklet' },
    { id: 'balik', name: 'Balık' }
  ]},
  { id: 'hobi', name: 'Hobi', icon: '🎨', subcategories: [
    { id: 'koleksiyon', name: 'Koleksiyon' },
    { id: 'muzik', name: 'Müzik Aletleri' },
    { id: 'sanat', name: 'Sanat' },
    { id: 'kitap', name: 'Kitap' }
  ]},
  { id: 'hayvanlar', name: 'Hayvanlar', icon: '🐶', subcategories: [
    { id: 'kopek', name: 'Köpek' },
    { id: 'kedi', name: 'Kedi' },
    { id: 'kus', name: 'Kuş' },
    { id: 'balik', name: 'Balık' }
  ]},
  { id: 'is-makine', name: 'İş Makineleri', icon: '🚜', subcategories: [
    { id: 'insaat', name: 'İnşaat' },
    { id: 'tarim', name: 'Tarım' },
    { id: 'sanayi', name: 'Sanayi' },
    { id: 'yemek', name: 'Yemek' }
  ]},
  { id: 'yemek', name: 'Yemek', icon: '🍽️', subcategories: [
    { id: 'restoran', name: 'Restoran' },
    { id: 'kafe', name: 'Kafe' },
    { id: 'pastane', name: 'Pastane' },
    { id: 'catering', name: 'Catering' }
  ]}
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedCategory, setExpandedCategory] = React.useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="w-64 bg-white shadow-sm h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Kategoriler</h2>
        <nav className="space-y-1">
          {categories.map((category) => (
            <div key={category.id}>
              <button
                onClick={() => toggleCategory(category.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                  pathname === `/kategori/${category.id}`
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-2">{category.icon}</span>
                  <span>{category.name}</span>
                </div>
                <svg
                  className={`h-5 w-5 transform transition-transform ${
                    expandedCategory === category.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {expandedCategory === category.id && (
                <div className="ml-6 mt-1 space-y-1">
                  {category.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      href={`/kategori/${category.id}/${subcategory.id}`}
                      className={`block px-3 py-2 text-sm font-medium rounded-md ${
                        pathname === `/kategori/${category.id}/${subcategory.id}`
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
} 