'use client'

import React from 'react';
import { useCategories } from '@/lib/useCategories'
import Link from 'next/link'
import { Smartphone, Home as HomeIcon, Shirt, Baby, Dumbbell, Heart, GraduationCap, Utensils, Palette, Gift, Users, Circle, Briefcase } from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  elektronik: Smartphone,
  "ev-bahce": HomeIcon,
  giyim: Shirt,
  "anne-bebek": Baby,
  "sporlar-oyunlar-eglenceler": Dumbbell,
  "egitim-kurslar": GraduationCap,
  "yemek-icecek": Utensils,
  "turizm-gecelemeler": Gift,
  "saglik-guzellik": Heart,
  "sanat-hobi": Palette,
  "is": Briefcase,
  "hizmetler": Users,
  "ucretsiz-gel-al": Gift,
  diger: Circle
};

const colorPalette = [
  "text-blue-500",
  "text-indigo-500",
  "text-orange-500",
  "text-purple-500",
  "text-pink-500",
  "text-emerald-500",
  "text-cyan-500",
  "text-amber-500",
  "text-teal-500",
  "text-rose-500",
  "text-violet-500",
  "text-lime-500",
  "text-green-600",
  "text-slate-500"
];

function getIcon(slug: string) {
  return iconMap[slug] || Circle;
}

function getColor(slug: string, index: number) {
  return colorPalette[index % colorPalette.length];
}

export default function TumKategorilerPage() {
  
  const { categories, loading, error } = useCategories();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Kategoriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Kategoriler yüklenirken hata oluştu: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tüm Kategoriler</h1>
          <p className="text-gray-600">İhtiyacınız olan ürün veya hizmeti bulmak için kategorileri keşfedin</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, i) => {
            const Icon = getIcon(category.slug);
            const color = getColor(category.slug, i);
            return (
              <div key={category.slug} className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200">
                <Link href={`/kategori/${category.slug}`} className="block p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Icon className={`w-8 h-8 ${color}`} />
                    <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                  </div>
                  
                  {category.subCategories && category.subCategories.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500 mb-3">
                        {category.subCategories.length} alt kategori
                      </p>
                      <div className="grid grid-cols-1 gap-1">
                        {category.subCategories.slice(0, 4).map((subcategory) => (
                          <Link
                            key={subcategory.slug}
                            href={`/kategori/${category.slug}/${subcategory.slug}`}
                            className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center"
                          >
                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                            {subcategory.name}
                          </Link>
                        ))}
                        {category.subCategories.length > 4 && (
                          <p className="text-xs text-gray-400 mt-1">
                            +{category.subCategories.length - 4} daha
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
} 
