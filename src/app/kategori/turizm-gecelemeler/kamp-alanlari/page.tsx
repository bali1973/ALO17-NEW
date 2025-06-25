'use client'

import { FaCampground } from 'react-icons/fa'

export default function KampAlanlariPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 flex items-center">
        <FaCampground className="mr-2 text-green-600" />
        Kamp Alanları
      </h1>
      <p className="text-gray-600 mt-2">
        Doğa ile iç içe kamp alanları ve camping seçenekleri
      </p>
      
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Kamp Alanları</h2>
          <p className="text-gray-600">
            Bu bölümde kamp alanları ve camping ilanları listelenecek.
          </p>
        </div>
      </div>
    </div>
  )
} 