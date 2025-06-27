'use client'

import { FaBriefcase, FaUserTie, FaGraduationCap, FaClock, FaLaptop, FaUsers, FaChartLine, FaCogs, FaCalculator, FaUserFriends, FaDesktop, FaHeadset, FaIndustry, FaTruck, FaChalkboardTeacher, FaHeartbeat, FaSearch, FaUserPlus, FaUserCheck, FaUserGraduate, FaUserCog, FaUserShield, FaUserEdit, FaUserClock, FaUserTie as FaUserTieAlt } from 'react-icons/fa'
import Link from 'next/link'
import { useState } from 'react'

const subcategories = [
  // İş Arama Kategorileri
  { id: 'is-ariyorum', name: 'İş Arıyorum', icon: <FaSearch className="inline mr-2 text-red-500" />, type: 'job-seeker' },
  { id: 'eleman-ariyorum', name: 'Eleman Arıyorum', icon: <FaUserPlus className="inline mr-2 text-blue-500" />, type: 'employer' },
  
  // Çalışma Türleri
  { id: 'tam-zamanli', name: 'Tam Zamanlı', icon: <FaBriefcase className="inline mr-2 text-blue-500" />, type: 'work-type' },
  { id: 'yari-zamanli', name: 'Yarı Zamanlı', icon: <FaClock className="inline mr-2 text-green-500" />, type: 'work-type' },
  { id: 'freelance', name: 'Freelance', icon: <FaLaptop className="inline mr-2 text-purple-500" />, type: 'work-type' },
  { id: 'staj', name: 'Staj', icon: <FaGraduationCap className="inline mr-2 text-orange-500" />, type: 'work-type' },
  { id: 'gecici-is', name: 'Geçici İş', icon: <FaClock className="inline mr-2 text-red-500" />, type: 'work-type' },
  { id: 'uzaktan-calisma', name: 'Uzaktan Çalışma', icon: <FaDesktop className="inline mr-2 text-indigo-500" />, type: 'work-type' },
  
  // Pozisyon Türleri
  { id: 'yonetici', name: 'Yönetici', icon: <FaUserTie className="inline mr-2 text-indigo-500" />, type: 'position' },
  { id: 'uzman', name: 'Uzman', icon: <FaChartLine className="inline mr-2 text-teal-500" />, type: 'position' },
  { id: 'muhendis', name: 'Mühendis', icon: <FaCogs className="inline mr-2 text-gray-700" />, type: 'position' },
  { id: 'teknisyen', name: 'Teknisyen', icon: <FaCogs className="inline mr-2 text-yellow-600" />, type: 'position' },
  { id: 'operator', name: 'Operatör', icon: <FaCogs className="inline mr-2 text-blue-600" />, type: 'position' },
  { id: 'satis-pazarlama', name: 'Satış & Pazarlama', icon: <FaChartLine className="inline mr-2 text-green-600" />, type: 'position' },
  { id: 'muhasebe-finans', name: 'Muhasebe & Finans', icon: <FaCalculator className="inline mr-2 text-red-600" />, type: 'position' },
  { id: 'insan-kaynaklari', name: 'İnsan Kaynakları', icon: <FaUserFriends className="inline mr-2 text-pink-600" />, type: 'position' },
  { id: 'bilgi-teknolojileri', name: 'Bilgi Teknolojileri', icon: <FaDesktop className="inline mr-2 text-blue-700" />, type: 'position' },
  { id: 'musteri-hizmetleri', name: 'Müşteri Hizmetleri', icon: <FaHeadset className="inline mr-2 text-green-700" />, type: 'position' },
  { id: 'uretim-imalat', name: 'Üretim & İmalat', icon: <FaIndustry className="inline mr-2 text-gray-800" />, type: 'position' },
  { id: 'lojistik-depo', name: 'Lojistik & Depo', icon: <FaTruck className="inline mr-2 text-orange-700" />, type: 'position' },
  { id: 'egitim-ogretim', name: 'Eğitim & Öğretim', icon: <FaChalkboardTeacher className="inline mr-2 text-purple-700" />, type: 'position' },
  { id: 'saglik-bakim', name: 'Sağlık & Bakım', icon: <FaHeartbeat className="inline mr-2 text-red-700" />, type: 'position' },
  
  // Eleman Türleri
  { id: 'deneyimli-eleman', name: 'Deneyimli Eleman', icon: <FaUserCheck className="inline mr-2 text-green-600" />, type: 'employee' },
  { id: 'yeni-mezun', name: 'Yeni Mezun', icon: <FaUserGraduate className="inline mr-2 text-blue-600" />, type: 'employee' },
  { id: 'part-time-eleman', name: 'Part-Time Eleman', icon: <FaUserClock className="inline mr-2 text-orange-600" />, type: 'employee' },
  { id: 'sezonluk-eleman', name: 'Sezonluk Eleman', icon: <FaUserEdit className="inline mr-2 text-purple-600" />, type: 'employee' },
  { id: 'güvenlik-elemani', name: 'Güvenlik Elemanı', icon: <FaUserShield className="inline mr-2 text-red-600" />, type: 'employee' },
  { id: 'teknik-eleman', name: 'Teknik Eleman', icon: <FaUserCog className="inline mr-2 text-gray-600" />, type: 'employee' },
  { id: 'ofis-elemani', name: 'Ofis Elemanı', icon: <FaUserTieAlt className="inline mr-2 text-indigo-600" />, type: 'employee' },
]

export default function IsKategoriPage() {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const filteredSubcategories = selectedType 
    ? subcategories.filter(cat => cat.type === selectedType)
    : subcategories

  const categoryTypes = [
    { id: 'job-seeker', name: 'İş Arama', icon: <FaSearch className="w-4 h-4" /> },
    { id: 'employer', name: 'Eleman Arama', icon: <FaUserPlus className="w-4 h-4" /> },
    { id: 'work-type', name: 'Çalışma Türleri', icon: <FaClock className="w-4 h-4" /> },
    { id: 'position', name: 'Pozisyonlar', icon: <FaUserTie className="w-4 h-4" /> },
    { id: 'employee', name: 'Eleman Türleri', icon: <FaUsers className="w-4 h-4" /> },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">İş & Eleman İlanları</h1>
        <p className="text-gray-600 mt-2">
          İş arıyorum, eleman arıyorum, tam zamanlı, yarı zamanlı, freelance ve diğer iş fırsatları. Kariyerinizi geliştirin veya uygun elemanı bulun.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sol Sidebar - Kategori Türleri */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h2 className="text-lg font-semibold mb-4">Kategori Türleri</h2>
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
            <h2 className="text-xl font-semibold mb-4">İş & Eleman Fırsatları</h2>
            <p className="text-gray-600 mb-6">
              Kariyerinizi geliştirmek için uygun iş fırsatını bulun veya şirketiniz için uygun elemanı arayın. Sol menüden kategori türünü ve alt kategoriyi seçerek detaylı ilanları görüntüleyebilirsiniz.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">İş Arıyorum</h3>
                <p className="text-sm text-red-600">İş arayanlar için özel bölüm</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Eleman Arıyorum</h3>
                <p className="text-sm text-blue-600">Şirketler için eleman arama</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Tam Zamanlı İşler</h3>
                <p className="text-sm text-green-600">Sürekli ve güvenli iş fırsatları</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Freelance Projeler</h3>
                <p className="text-sm text-purple-600">Esnek çalışma saatleri</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">Yeni Mezunlar</h3>
                <p className="text-sm text-orange-600">Kariyer başlangıcı fırsatları</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-800 mb-2">Deneyimli Elemanlar</h3>
                <p className="text-sm text-indigo-600">Uzman pozisyonlar</p>
              </div>
            </div>

            {/* İstatistikler */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-alo-orange">1,234</div>
                <div className="text-sm text-gray-600">Aktif İş İlanı</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-alo-orange">567</div>
                <div className="text-sm text-gray-600">Eleman Arayan</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-alo-orange">890</div>
                <div className="text-sm text-gray-600">İş Arayan</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-alo-orange">456</div>
                <div className="text-sm text-gray-600">Başarılı Eşleşme</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 