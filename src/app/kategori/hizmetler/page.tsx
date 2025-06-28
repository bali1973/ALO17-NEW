'use client'

import { FaTools, FaCar, FaHome, FaGraduationCap, FaHeartbeat, FaPalette, FaLaptop, FaHandshake, FaWrench, FaShieldAlt, FaLeaf, FaCamera, FaMusic, FaUtensils, FaPlane, FaTruck, FaCalculator, FaUserTie, FaDesktop, FaUsers, FaGlobeAmericas } from 'react-icons/fa'
import Link from 'next/link'
import { useState } from 'react'

const subcategories = [
  // Temel Hizmetler
  { id: 'ev-hizmetleri', name: 'Ev Hizmetleri', icon: <FaHome className="inline mr-2 text-blue-500" />, type: 'home' },
  { id: 'arac-hizmetleri', name: 'Araç Hizmetleri', icon: <FaCar className="inline mr-2 text-red-500" />, type: 'vehicle' },
  { id: 'teknik-hizmetler', name: 'Teknik Hizmetler', icon: <FaTools className="inline mr-2 text-gray-600" />, type: 'technical' },
  
  // Profesyonel Hizmetler
  { id: 'egitim-hizmetleri', name: 'Eğitim Hizmetleri', icon: <FaGraduationCap className="inline mr-2 text-green-500" />, type: 'education' },
  { id: 'saglik-hizmetleri', name: 'Sağlık Hizmetleri', icon: <FaHeartbeat className="inline mr-2 text-red-600" />, type: 'health' },
  { id: 'hukuki-hizmetler', name: 'Hukuki Hizmetler', icon: <FaShieldAlt className="inline mr-2 text-indigo-500" />, type: 'legal' },
  { id: 'muhasebe-hizmetleri', name: 'Muhasebe Hizmetleri', icon: <FaCalculator className="inline mr-2 text-green-600" />, type: 'accounting' },
  { id: 'danismanlik-hizmetleri', name: 'Danışmanlık Hizmetleri', icon: <FaUserTie className="inline mr-2 text-purple-500" />, type: 'consulting' },
  
  // Teknoloji Hizmetleri
  { id: 'bilgisayar-hizmetleri', name: 'Bilgisayar Hizmetleri', icon: <FaDesktop className="inline mr-2 text-blue-600" />, type: 'computer' },
  { id: 'yazilim-hizmetleri', name: 'Yazılım Hizmetleri', icon: <FaLaptop className="inline mr-2 text-indigo-600" />, type: 'software' },
  { id: 'web-hizmetleri', name: 'Web Hizmetleri', icon: <FaGlobeAmericas className="inline mr-2 text-cyan-500" />, type: 'web' },
  
  // Yaratıcı Hizmetler
  { id: 'tasarim-hizmetleri', name: 'Tasarım Hizmetleri', icon: <FaPalette className="inline mr-2 text-pink-500" />, type: 'design' },
  { id: 'fotograf-hizmetleri', name: 'Fotoğraf Hizmetleri', icon: <FaCamera className="inline mr-2 text-yellow-500" />, type: 'photography' },
  { id: 'muzik-hizmetleri', name: 'Müzik Hizmetleri', icon: <FaMusic className="inline mr-2 text-purple-600" />, type: 'music' },
  
  // Diğer Hizmetler
  { id: 'temizlik-hizmetleri', name: 'Temizlik Hizmetleri', icon: <FaLeaf className="inline mr-2 text-green-600" />, type: 'cleaning' },
  { id: 'yemek-hizmetleri', name: 'Yemek Hizmetleri', icon: <FaUtensils className="inline mr-2 text-orange-500" />, type: 'food' },
  { id: 'ulasim-hizmetleri', name: 'Ulaşım Hizmetleri', icon: <FaTruck className="inline mr-2 text-gray-700" />, type: 'transport' },
  { id: 'seyahat-hizmetleri', name: 'Seyahat Hizmetleri', icon: <FaPlane className="inline mr-2 text-blue-700" />, type: 'travel' },
  { id: 'organizasyon-hizmetleri', name: 'Organizasyon Hizmetleri', icon: <FaUsers className="inline mr-2 text-teal-500" />, type: 'organization' },
]

export default function HizmetlerKategoriPage() {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const filteredSubcategories = selectedType 
    ? subcategories.filter(cat => cat.type === selectedType)
    : subcategories

  const categoryTypes = [
    { id: 'home', name: 'Ev Hizmetleri', icon: <FaHome className="w-4 h-4" /> },
    { id: 'vehicle', name: 'Araç Hizmetleri', icon: <FaCar className="w-4 h-4" /> },
    { id: 'technical', name: 'Teknik Hizmetler', icon: <FaTools className="w-4 h-4" /> },
    { id: 'education', name: 'Eğitim Hizmetleri', icon: <FaGraduationCap className="w-4 h-4" /> },
    { id: 'health', name: 'Sağlık Hizmetleri', icon: <FaHeartbeat className="w-4 h-4" /> },
    { id: 'legal', name: 'Hukuki Hizmetler', icon: <FaShieldAlt className="w-4 h-4" /> },
    { id: 'accounting', name: 'Muhasebe Hizmetleri', icon: <FaCalculator className="w-4 h-4" /> },
    { id: 'consulting', name: 'Danışmanlık Hizmetleri', icon: <FaUserTie className="w-4 h-4" /> },
    { id: 'computer', name: 'Bilgisayar Hizmetleri', icon: <FaDesktop className="w-4 h-4" /> },
    { id: 'software', name: 'Yazılım Hizmetleri', icon: <FaLaptop className="w-4 h-4" /> },
    { id: 'web', name: 'Web Hizmetleri', icon: <FaGlobeAmericas className="w-4 h-4" /> },
    { id: 'design', name: 'Tasarım Hizmetleri', icon: <FaPalette className="w-4 h-4" /> },
    { id: 'photography', name: 'Fotoğraf Hizmetleri', icon: <FaCamera className="w-4 h-4" /> },
    { id: 'music', name: 'Müzik Hizmetleri', icon: <FaMusic className="w-4 h-4" /> },
    { id: 'cleaning', name: 'Temizlik Hizmetleri', icon: <FaLeaf className="w-4 h-4" /> },
    { id: 'food', name: 'Yemek Hizmetleri', icon: <FaUtensils className="w-4 h-4" /> },
    { id: 'transport', name: 'Ulaşım Hizmetleri', icon: <FaTruck className="w-4 h-4" /> },
    { id: 'travel', name: 'Seyahat Hizmetleri', icon: <FaPlane className="w-4 h-4" /> },
    { id: 'organization', name: 'Organizasyon Hizmetleri', icon: <FaUsers className="w-4 h-4" /> },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hizmetler</h1>
        <p className="text-gray-600 mt-2">
          Profesyonel hizmetler, teknik destek, danışmanlık ve daha fazlası. İhtiyacınız olan hizmeti bulun.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sol Sidebar - Kategori Türleri */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h2 className="text-lg font-semibold mb-4">Hizmet Türleri</h2>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedType(null)}
                className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors ${!selectedType ? 'bg-gray-100 font-medium' : ''}`}
              >
                Tümü
              </button>
              {categoryTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center space-x-2 ${selectedType === type.id ? 'bg-gray-100 font-medium' : ''}`}
                >
                  {type.icon}
                  <span>{type.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Alt Kategoriler */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Alt Kategoriler</h2>
            <div className="space-y-2">
              {filteredSubcategories.map(subcategory => (
                <Link
                  key={subcategory.id}
                  href={`/kategori/hizmetler/${subcategory.id}`}
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
            <h2 className="text-xl font-semibold mb-4">Hizmet Fırsatları</h2>
            <p className="text-gray-600 mb-6">
              Profesyonel hizmetler, teknik destek, danışmanlık ve daha fazlası. Sol menüden hizmet türünü seçerek detaylı ilanları görüntüleyebilirsiniz.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Ev Hizmetleri</h3>
                <p className="text-sm text-blue-600">Temizlik, tamirat, bakım hizmetleri</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">Araç Hizmetleri</h3>
                <p className="text-sm text-red-600">Servis, bakım, onarım hizmetleri</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Eğitim Hizmetleri</h3>
                <p className="text-sm text-green-600">Özel ders, kurs, eğitim danışmanlığı</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Teknoloji Hizmetleri</h3>
                <p className="text-sm text-purple-600">Yazılım, web, bilgisayar hizmetleri</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">Sağlık Hizmetleri</h3>
                <p className="text-sm text-orange-600">Sağlık danışmanlığı, bakım hizmetleri</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-800 mb-2">Hukuki Hizmetler</h3>
                <p className="text-sm text-indigo-600">Hukuki danışmanlık, avukatlık hizmetleri</p>
              </div>
            </div>

            {/* Popüler Hizmetler */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Popüler Hizmetler</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <FaTools className="w-8 h-8 text-alo-orange mx-auto mb-2" />
                  <div className="font-medium">Teknik Servis</div>
                  <div className="text-sm text-gray-600">1,234 ilan</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <FaGraduationCap className="w-8 h-8 text-alo-orange mx-auto mb-2" />
                  <div className="font-medium">Özel Ders</div>
                  <div className="text-sm text-gray-600">856 ilan</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <FaPalette className="w-8 h-8 text-alo-orange mx-auto mb-2" />
                  <div className="font-medium">Tasarım</div>
                  <div className="text-sm text-gray-600">567 ilan</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <FaCalculator className="w-8 h-8 text-alo-orange mx-auto mb-2" />
                  <div className="font-medium">Muhasebe</div>
                  <div className="text-sm text-gray-600">432 ilan</div>
                </div>
              </div>
            </div>

            {/* İstatistikler */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-alo-orange">5,678</div>
                <div className="text-sm text-gray-600">Aktif Hizmet İlanı</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-alo-orange">2,345</div>
                <div className="text-sm text-gray-600">Hizmet Veren</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-alo-orange">1,890</div>
                <div className="text-sm text-gray-600">Hizmet Alan</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-alo-orange">3,456</div>
                <div className="text-sm text-gray-600">Başarılı Hizmet</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 