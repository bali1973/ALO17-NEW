'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCategories } from '@/lib/useCategories'

export default function TurizmGecelemelerCategoryPage() {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const turizm = categories.find(cat => cat.slug === 'turizm-gecelemeler');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Turizm ve Gecelemeler</h1>
        <p className="text-gray-600 mt-2">
          Turizm ve gecelemeler ürünleri
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sol Sidebar - Kategoriler ve Filtreler */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-4">
            {/* Alt Kategoriler */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Kategoriler</h2>
              {categoriesLoading ? (
                <div>Kategoriler yükleniyor...</div>
              ) : categoriesError ? (
                <div className="text-red-600">{categoriesError}</div>
              ) : turizm && turizm.subCategories && turizm.subCategories.length > 0 ? (
                <div className="space-y-2">
                  {turizm.subCategories.map(subcategory => (
                    <Link
                      key={subcategory.id}
                      href={`/kategori/turizm-gecelemeler/${subcategory.slug}`}
                      onClick={() => setSelectedSubcategory(subcategory.slug)}
                      className={`block px-3 py-2 rounded-md hover:bg-gray-100 ${
                        selectedSubcategory === subcategory.slug ? 'bg-gray-100 font-medium' : ''
                      }`}
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <div>Alt kategori bulunamadı.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 