'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCategories } from '@/lib/useCategories'

export default function ElektronikCategoryPage() {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const elektronik = categories.find(cat => cat.slug === 'elektronik');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Elektronik</h1>
          <p className="text-gray-600 mt-2">
            Elektronik ürünler ve aksesuarlar
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
                ) : elektronik && elektronik.subCategories && elektronik.subCategories.length > 0 ? (
                <div className="space-y-2">
                    {elektronik.subCategories.map(subcategory => (
                    <Link
                      key={subcategory.id}
                        href={`/kategori/elektronik/${subcategory.slug}`}
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
    </div>
  )
} 