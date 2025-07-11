import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ListingCard } from '@/components/listing-card';
import { useCategories } from '@/lib/useCategories';
import * as LucideIcons from 'lucide-react';

interface SubCategoryPageProps {
  params: { slug: string; subSlug: string };
};

// Statik kategori ve alt kategori verisi (örnek)
const categories = [
  {
    slug: 'elektronik',
    name: 'Elektronik',
    subCategories: [
      { slug: 'telefon', name: 'Telefon' },
      { slug: 'bilgisayar', name: 'Bilgisayar' },
    ],
  },
  {
    slug: 'ev-bahce',
    name: 'Ev & Bahçe',
    subCategories: [
      { slug: 'mobilya', name: 'Mobilya' },
      { slug: 'dekorasyon', name: 'Dekorasyon' },
    ],
  },
  // ... diğer kategoriler ...
];

function renderSubCategoryIcon(icon: string, colorClass: string = "") {
  if (icon === "baby-carriage") {
    return <img src="/icons/baby-carriage.svg" alt="Bebek Arabası" className={`inline w-5 h-5 align-middle ${colorClass}`} />;
  }
  const LucideIcon = (LucideIcons as any)[icon] || LucideIcons.Circle;
  return <LucideIcon className={`inline w-5 h-5 align-middle ${colorClass}`} />;
}

export default function SubCategoryPage({ params }: SubCategoryPageProps) {
  const category = categories.find(cat => cat.slug === params.slug);
  const subCategory = category?.subCategories?.find(sub => sub.slug === params.subSlug);

  if (!category || !subCategory) {
    return <div className="p-8">Alt kategori bulunamadı.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar: Sadece bu ana kategoriye ait alt kategoriler */}
      <aside className="w-64 p-4 border-r bg-white">
        <h2 className="text-lg font-semibold mb-4">Alt Kategoriler</h2>
        <div className="space-y-2">
          {category.subCategories.map((sub) => (
            <div key={sub.slug} className={`block p-3 rounded-md ${sub.slug === params.subSlug ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-blue-50'}`}>{sub.name}</div>
          ))}
        </div>
      </aside>
      {/* Ana içerik */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-2">{subCategory.name}</h1>
          <div className="text-gray-500">Statik export için örnek alt kategori sayfası.</div>
        </div>
      </div>
    </div>
  );
}

// Statik export için generateStaticParams fonksiyonu
export async function generateStaticParams() {
  // Tüm ana ve alt kategoriler için parametreleri döndür
  const params = [];
  for (const cat of categories) {
    for (const sub of cat.subCategories) {
      params.push({ slug: cat.slug, subSlug: sub.slug });
    }
  }
  return params;
} 