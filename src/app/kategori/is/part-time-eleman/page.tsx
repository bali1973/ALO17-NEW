'use client'

import { FaUserClock } from 'react-icons/fa'

export default function PartTimeElemanPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Part-Time Eleman</h1>
        <p className="text-gray-600 mt-2">
          Yarı zamanlı eleman pozisyonları. Esnek çalışma.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <FaUserClock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Part-Time Eleman
          </h3>
          <p className="text-gray-600 mb-4">
            Bu sayfa yakında güncellenecek. Part-Time Eleman burada listelenecek.
          </p>
        </div>
      </div>
    </div>
  )
}