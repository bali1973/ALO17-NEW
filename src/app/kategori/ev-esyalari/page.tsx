'use client'

import { FaHome } from 'react-icons/fa'
import Link from 'next/link'
import { useState } from 'react'

const subcategories = [
  { id: 'mobilya', name: 'Mobilya', icon: <FaHome className="inline mr-2 text-orange-500" /> },
  { id: 'dekorasyon', name: 'Dekorasyon', icon: <FaHome className="inline mr-2 text-orange-500" /> },
  { id: 'mutfak', name: 'Mutfak Gereçleri', icon: <FaHome className="inline mr-2 text-orange-500" /> },
]

export default function EvEsyaKategoriPage() {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Ev Eşyaları</h1>
      <p className="text-gray-600 mt-2">Ev eşyaları ve ilgili ürünler burada listelenir.</p>
      <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
        <h2 className="text-lg font-semibold mb-4">Alt Kategoriler</h2>
        <div className="space-y-2">
          {subcategories.map(subcategory => (
            <Link
              key={subcategory.id}
              href={`/kategori/ev-esyalari/${subcategory.id}`}
              className={`block px-3 py-2 rounded-md hover:bg-gray-100 ${selectedSubcategory === subcategory.id ? 'bg-gray-100 font-medium' : ''}`}
              onClick={() => setSelectedSubcategory(subcategory.id)}
            >
              {subcategory.icon}{subcategory.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 