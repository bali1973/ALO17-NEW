'use client'

import { FaGlobeAmericas } from 'react-icons/fa'

export default function WebHizmetleriPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Web Hizmetleri</h1>
        <p className="text-gray-600 mt-2">Web tasarım, geliştirme ve diğer web hizmetleri burada listelenecek.</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <FaGlobeAmericas className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Web Hizmetleri</h3>
          <p className="text-gray-600 mb-4">Bu sayfa yakında güncellenecek.</p>
        </div>
      </div>
    </div>
  )
} 