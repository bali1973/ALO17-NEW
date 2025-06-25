'use client'

import { FaLaptop, FaMobile, FaTabletAlt, FaHeadphones, FaTv, FaCamera, FaGamepad, FaPrint, FaServer } from 'react-icons/fa'
import Link from 'next/link'
import { useState } from 'react'

const subcategories = [
  { id: 'bilgisayar', name: 'Bilgisayar', icon: <FaLaptop className="inline mr-2 text-blue-500" /> },
  { id: 'telefon', name: 'Telefon', icon: <FaMobile className="inline mr-2 text-blue-500" /> },
  { id: 'tablet', name: 'Tablet', icon: <FaTabletAlt className="inline mr-2 text-blue-500" /> },
  { id: 'kulaklik', name: 'Kulaklık', icon: <FaHeadphones className="inline mr-2 text-blue-500" /> },
  { id: 'televizyon', name: 'Televizyon', icon: <FaTv className="inline mr-2 text-blue-500" /> },
  { id: 'kamera', name: 'Kamera', icon: <FaCamera className="inline mr-2 text-blue-500" /> },
  { id: 'oyun-konsolu', name: 'Oyun Konsolu', icon: <FaGamepad className="inline mr-2 text-blue-500" /> },
  { id: 'yazici', name: 'Yazıcı', icon: <FaPrint className="inline mr-2 text-blue-500" /> },
  { id: 'network', name: 'Network', icon: <FaServer className="inline mr-2 text-blue-500" /> },
]

export default function ElektronikCategoryPage() {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)

  return (
    <div className="container mx-auto px-4 py-8">
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
              <div className="space-y-2">
                {subcategories.map(subcategory => (
                  <Link
                    key={subcategory.id}
                    href={`/kategori/elektronik/${subcategory.id}`}
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