'use client'

import { FaFutbol, FaSwimmingPool, FaRunning, FaDumbbell, FaMountain, FaSnowflake, FaCar } from 'react-icons/fa'
import { GiTennisBall, GiBoxingGlove } from 'react-icons/gi'
import Link from 'next/link'
import { useCategories } from '@/lib/useCategories'

export default function SporDallariPage() {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  // Ana kategori ve alt kategorileri bul
  const mainCategory = categories.find(cat => cat.slug === 'sporlar-oyunlar-eglenceler');
  const subCategory = mainCategory?.subCategories?.find(sub => sub.slug === 'spor-dallari');
  const subSubCategories = subCategory?.subCategories || [];

  if (categoriesLoading) {
    return <div className="min-h-screen flex items-center justify-center">Kategoriler yükleniyor...</div>;
  }
  if (categoriesError) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{categoriesError}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Spor Aktiviteleri</h1>
        <p className="text-gray-600 mt-2">
          Spor aktiviteleri, ekipmanlar ve malzemeler için ilanları keşfedin
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subSubCategories.map(category => (
          <Link
            key={category.slug}
            href={`/kategori/sporlar-oyunlar-eglenceler/spor-dallari/${category.slug}`}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              {/* İkon desteği isterseniz ekleyebilirsiniz */}
              <h2 className="text-lg font-semibold text-gray-900">
                {category.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 