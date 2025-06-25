'use client'

import { FaSearch, FaMapMarkerAlt, FaClock, FaGraduationCap, FaBriefcase, FaUserTie, FaLaptop, FaIndustry, FaCalculator, FaDesktop, FaHeadset, FaTruck, FaChalkboardTeacher, FaHeartbeat } from 'react-icons/fa'
import Link from 'next/link'
import { useState } from 'react'

const jobSeekerCategories = [
  { id: 'yazilim-gelistirici', name: 'Yazılım Geliştirici', icon: <FaDesktop className="inline mr-2 text-blue-500" /> },
  { id: 'muhendis', name: 'Mühendis', icon: <FaIndustry className="inline mr-2 text-gray-700" /> },
  { id: 'muhasebe', name: 'Muhasebe', icon: <FaCalculator className="inline mr-2 text-red-600" /> },
  { id: 'satis', name: 'Satış & Pazarlama', icon: <FaUserTie className="inline mr-2 text-green-600" /> },
  { id: 'musteri-hizmetleri', name: 'Müşteri Hizmetleri', icon: <FaHeadset className="inline mr-2 text-green-700" /> },
  { id: 'lojistik', name: 'Lojistik', icon: <FaTruck className="inline mr-2 text-orange-700" /> },
  { id: 'egitim', name: 'Eğitim', icon: <FaChalkboardTeacher className="inline mr-2 text-purple-700" /> },
  { id: 'saglik', name: 'Sağlık', icon: <FaHeartbeat className="inline mr-2 text-red-700" /> },
  { id: 'freelance', name: 'Freelance', icon: <FaLaptop className="inline mr-2 text-purple-500" /> },
]

export default function IsAriyorumPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">İş Arıyorum</h1>
        <p className="text-gray-600 mt-2">
          İş arayanlar için özel bölüm. Uygun iş fırsatını bulun ve kariyerinizi geliştirin.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sol Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Meslek Kategorileri</h2>
            
            <div className="space-y-2">
              {jobSeekerCategories.map(category => (
                <Link
                  key={category.id}
                  href={`/kategori/is/is-ariyorum/${category.id}`}
                  className={`block px-3 py-2 rounded-md hover:bg-gray-100 transition-colors ${selectedCategory === category.id ? 'bg-gray-100 font-medium' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.icon}{category.name}
                </Link>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <h3 className="font-medium mb-2">Filtreler</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Uzaktan Çalışma</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Yeni Mezun</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Deneyimli</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">İş Arayan Profilleri</h2>
              <div className="flex gap-2">
                <Link 
                  href="/ilan-ver" 
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  İş İlanı Ver
                </Link>
              </div>
            </div>

            {/* Örnek İş Arayan Profilleri */}
            <div className="space-y-4">
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">Yazılım Geliştirici Arıyor</h3>
                    <p className="text-gray-600 mb-2">Ahmet Yılmaz - 3 yıl deneyim</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <span className="flex items-center">
                        <FaMapMarkerAlt className="mr-1" />
                        İstanbul, Kadıköy
                      </span>
                      <span className="flex items-center">
                        <FaClock className="mr-1" />
                        Tam Zamanlı
                      </span>
                      <span className="flex items-center">
                        <FaGraduationCap className="mr-1" />
                        Bilgisayar Mühendisliği
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      React, Node.js, TypeScript deneyimli yazılım geliştirici arıyorum. 
                      Uzaktan çalışma imkanı olan pozisyonlar tercih edilir.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                      Aktif
                    </span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">Muhasebe Uzmanı Arıyor</h3>
                    <p className="text-gray-600 mb-2">Ayşe Demir - 5 yıl deneyim</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <span className="flex items-center">
                        <FaMapMarkerAlt className="mr-1" />
                        Ankara, Çankaya
                      </span>
                      <span className="flex items-center">
                        <FaClock className="mr-1" />
                        Tam Zamanlı
                      </span>
                      <span className="flex items-center">
                        <FaGraduationCap className="mr-1" />
                        İşletme
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Maliyet muhasebesi ve finansal analiz konularında deneyimli. 
                      Büyük şirketlerde çalışma deneyimi var.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      Yeni
                    </span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">Freelance Tasarımcı Arıyor</h3>
                    <p className="text-gray-600 mb-2">Mehmet Kaya - 2 yıl deneyim</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <span className="flex items-center">
                        <FaMapMarkerAlt className="mr-1" />
                        İzmir, Konak
                      </span>
                      <span className="flex items-center">
                        <FaClock className="mr-1" />
                        Freelance
                      </span>
                      <span className="flex items-center">
                        <FaGraduationCap className="mr-1" />
                        Grafik Tasarım
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Logo tasarımı, kurumsal kimlik ve dijital pazarlama materyalleri 
                      konularında projeler arıyorum.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      Uzaktan
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">İş arayan profilinizi eklemek için</p>
              <Link 
                href="/ilan-ver" 
                className="inline-block px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                İş İlanı Ver
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 