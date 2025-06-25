'use client'

import { FaUtensils } from 'react-icons/fa'
import Link from 'next/link'
import { useState } from 'react'

const subcategories = [
  { id: 'restoran', name: 'Restoranlar', icon: <FaUtensils className="inline mr-2 text-yellow-500" /> },
  { id: 'kafe', name: 'Kafeler', icon: <FaUtensils className="inline mr-2 text-yellow-500" /> },
  { id: 'icecek', name: 'İçecekler', icon: <FaUtensils className="inline mr-2 text-yellow-500" /> },
]

export default function YemekIcecekPage() {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Yemek ve İçecek</h1>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-4">Alt Kategoriler</h2>
        <div className="space-y-2">
          {subcategories.map(subcategory => (
            <Link
              key={subcategory.id}
              href={`/kategori/yemek-icecek/${subcategory.id}`}
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