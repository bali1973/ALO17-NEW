'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCategories } from '@/lib/useCategories'

export default function SaglikGuzellikCategoryPage() {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const saglik = categories.find(cat => cat.slug === 'saglik-guzellik');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sağlık ve Güzellik</h1>
        <p className="text-gray-600 mt-2">
          Sağlık ve güzellik ürünleri
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
              ) : saglik && saglik.subCategories && saglik.subCategories.length > 0 ? (
                <div className="space-y-2">
                  {saglik.subCategories.map(subcategory => (
                    <Link
                      key={subcategory.id}
                      href={`/kategori/saglik-guzellik/${subcategory.slug}`}
                      className={`block px-3 py-2 rounded-md hover:bg-gray-100 ${
                        selectedSubcategory === subcategory.slug ? 'bg-gray-100 font-medium' : ''
                      }`}
                      onClick={() => setSelectedSubcategory(subcategory.slug)}
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