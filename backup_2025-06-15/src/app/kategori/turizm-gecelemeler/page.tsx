'use client'

import { FaPlane, FaHotel, FaMapMarkedAlt } from 'react-icons/fa'
import Link from 'next/link'
import { useState } from 'react'

const subcategories = [
  { id: 'otel', name: 'Oteller', icon: <FaHotel className="inline mr-2 text-green-500" /> },
  { id: 'tatil', name: 'Tatil Paketleri', icon: <FaPlane className="inline mr-2 text-green-500" /> },
  { id: 'gezi', name: 'Gezi ve Turlar', icon: <FaMapMarkedAlt className="inline mr-2 text-green-500" /> },
]

export default function TurizmGecelemelerCategoryPage() {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)

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
              <div className="space-y-2">
                {subcategories.map(subcategory => (
                  <Link
                    key={subcategory.id}
                    href={`/kategori/turizm-gecelemeler/${subcategory.id}`}
                    onClick={() => setSelectedSubcategory(subcategory.id)}
                    className={`block px-3 py-2 rounded-md hover:bg-gray-100 ${
                      selectedSubcategory === subcategory.id ? 'bg-gray-100 font-medium' : ''
                    }`}
                  >
                    {subcategory.icon}{subcategory.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 