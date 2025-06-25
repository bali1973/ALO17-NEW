'use client'

import { FaBriefcase, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaBuilding, FaUserTie } from 'react-icons/fa'
import Link from 'next/link'

export default function TamZamanliPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tam Zamanlı İş İlanları</h1>
        <p className="text-gray-600 mt-2">
          Sürekli ve güvenli tam zamanlı iş fırsatları. Kariyerinizi geliştirin.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sol Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Filtreler</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Lokasyon</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">İstanbul</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Ankara</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">İzmir</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Bursa</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Deneyim</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">0-2 yıl</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">3-5 yıl</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">6-10 yıl</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">10+ yıl</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Maaş Aralığı</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">0-10.000 TL</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">10.000-20.000 TL</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">20.000-35.000 TL</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">35.000+ TL</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">İlanlar</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  İlan Ver
                </button>
              </div>
            </div>

            {/* Örnek İlanlar */}
            <div className="space-y-4">
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">Yazılım Geliştirici</h3>
                    <p className="text-gray-600 mb-2">ABC Teknoloji A.Ş.</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <FaMapMarkerAlt className="mr-1" />
                        İstanbul, Kadıköy
                      </span>
                      <span className="flex items-center">
                        <FaClock className="mr-1" />
                        Tam Zamanlı
                      </span>
                      <span className="flex items-center">
                        <FaMoneyBillWave className="mr-1" />
                        25.000 - 35.000 TL
                      </span>
                    </div>
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
                    <h3 className="font-semibold text-lg">Satış Temsilcisi</h3>
                    <p className="text-gray-600 mb-2">XYZ Şirketi</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <FaMapMarkerAlt className="mr-1" />
                        Ankara, Çankaya
                      </span>
                      <span className="flex items-center">
                        <FaClock className="mr-1" />
                        Tam Zamanlı
                      </span>
                      <span className="flex items-center">
                        <FaMoneyBillWave className="mr-1" />
                        15.000 - 25.000 TL
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      Aktif
                    </span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">Muhasebe Uzmanı</h3>
                    <p className="text-gray-600 mb-2">DEF Holding</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <FaMapMarkerAlt className="mr-1" />
                        İzmir, Konak
                      </span>
                      <span className="flex items-center">
                        <FaClock className="mr-1" />
                        Tam Zamanlı
                      </span>
                      <span className="flex items-center">
                        <FaMoneyBillWave className="mr-1" />
                        20.000 - 30.000 TL
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                      Acil
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Daha fazla ilan görmek için</p>
              <Link 
                href="/ilan-ver" 
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                İlan Ver
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 