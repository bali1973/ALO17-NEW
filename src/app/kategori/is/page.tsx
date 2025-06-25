'use client'

import { FaBriefcase, FaUserTie, FaGraduationCap, FaClock, FaLaptop, FaUsers, FaChartLine, FaCogs, FaCalculator, FaUserFriends, FaDesktop, FaHeadset, FaIndustry, FaTruck, FaChalkboardTeacher, FaHeartbeat, FaSearch } from 'react-icons/fa'
import Link from 'next/link'
import { useState } from 'react'

const subcategories = [
  { id: 'is-ariyorum', name: 'İş Arıyorum', icon: <FaSearch className="inline mr-2 text-red-500" /> },
  { id: 'tam-zamanli', name: 'Tam Zamanlı', icon: <FaBriefcase className="inline mr-2 text-blue-500" /> },
  { id: 'yari-zamanli', name: 'Yarı Zamanlı', icon: <FaClock className="inline mr-2 text-green-500" /> },
  { id: 'freelance', name: 'Freelance', icon: <FaLaptop className="inline mr-2 text-purple-500" /> },
  { id: 'staj', name: 'Staj', icon: <FaGraduationCap className="inline mr-2 text-orange-500" /> },
  { id: 'gecici-is', name: 'Geçici İş', icon: <FaClock className="inline mr-2 text-red-500" /> },
  { id: 'yonetici', name: 'Yönetici', icon: <FaUserTie className="inline mr-2 text-indigo-500" /> },
  { id: 'uzman', name: 'Uzman', icon: <FaChartLine className="inline mr-2 text-teal-500" /> },
  { id: 'muhendis', name: 'Mühendis', icon: <FaCogs className="inline mr-2 text-gray-700" /> },
  { id: 'teknisyen', name: 'Teknisyen', icon: <FaCogs className="inline mr-2 text-yellow-600" /> },
  { id: 'operator', name: 'Operatör', icon: <FaCogs className="inline mr-2 text-blue-600" /> },
  { id: 'satis-pazarlama', name: 'Satış & Pazarlama', icon: <FaChartLine className="inline mr-2 text-green-600" /> },
  { id: 'muhasebe-finans', name: 'Muhasebe & Finans', icon: <FaCalculator className="inline mr-2 text-red-600" /> },
  { id: 'insan-kaynaklari', name: 'İnsan Kaynakları', icon: <FaUserFriends className="inline mr-2 text-pink-600" /> },
  { id: 'bilgi-teknolojileri', name: 'Bilgi Teknolojileri', icon: <FaDesktop className="inline mr-2 text-blue-700" /> },
  { id: 'musteri-hizmetleri', name: 'Müşteri Hizmetleri', icon: <FaHeadset className="inline mr-2 text-green-700" /> },
  { id: 'uretim-imalat', name: 'Üretim & İmalat', icon: <FaIndustry className="inline mr-2 text-gray-800" /> },
  { id: 'lojistik-depo', name: 'Lojistik & Depo', icon: <FaTruck className="inline mr-2 text-orange-700" /> },
  { id: 'egitim-ogretim', name: 'Eğitim & Öğretim', icon: <FaChalkboardTeacher className="inline mr-2 text-purple-700" /> },
  { id: 'saglik-bakim', name: 'Sağlık & Bakım', icon: <FaHeartbeat className="inline mr-2 text-red-700" /> },
]

export default function IsKategoriPage() {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">İş İlanları</h1>
        <p className="text-gray-600 mt-2">
          İş arıyorum, tam zamanlı, yarı zamanlı, freelance ve diğer iş fırsatları. Kariyerinizi geliştirin.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sol Sidebar - Alt Kategoriler */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">İş Türleri</h2>
            <div className="space-y-2">
              {subcategories.map(subcategory => (
                <Link
                  key={subcategory.id}
                  href={`/kategori/is/${subcategory.id}`}
                  className={`block px-3 py-2 rounded-md hover:bg-gray-100 transition-colors ${selectedSubcategory === subcategory.id ? 'bg-gray-100 font-medium' : ''}`}
                  onClick={() => setSelectedSubcategory(subcategory.id)}
                >
                  {subcategory.icon}{subcategory.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">İş Fırsatları</h2>
            <p className="text-gray-600 mb-6">
              Kariyerinizi geliştirmek için uygun iş fırsatını bulun. Sol menüden iş türünü seçerek detaylı ilanları görüntüleyebilirsiniz.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">İş Arıyorum</h3>
                <p className="text-sm text-red-600">İş arayanlar için özel bölüm</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Tam Zamanlı İşler</h3>
                <p className="text-sm text-blue-600">Sürekli ve güvenli iş fırsatları</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Freelance Projeler</h3>
                <p className="text-sm text-green-600">Esnek çalışma saatleri</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 