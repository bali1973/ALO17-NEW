'use client'

import { FaUserCog } from 'react-icons/fa'

export default function TeknikElemanPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Teknik Eleman</h1>
        <p className="text-gray-600 mt-2">
          Teknik eleman pozisyonları. Teknik beceri fırsatları.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <FaUserCog className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Teknik Eleman
          </h3>
          <p className="text-gray-600 mb-4">
            Bu sayfa yakında güncellenecek. Teknik Eleman burada listelenecek.
          </p>
        </div>
      </div>
    </div>
  )
}