'use client'

import { FaBriefcase, FaUserTie, FaGraduationCap, FaClock, FaLaptop, FaUsers, FaChartLine, FaCogs, FaCalculator, FaUserFriends, FaDesktop, FaHeadset, FaIndustry, FaTruck, FaChalkboardTeacher, FaHeartbeat, FaSearch, FaUserPlus, FaUserCheck, FaUserGraduate, FaUserCog, FaUserShield, FaUserEdit, FaUserClock, FaUserTie as FaUserTieAlt, FaMapMarkerAlt, FaMoneyBillWave, FaStar, FaSparkles } from 'react-icons/fa'
import Link from 'next/link'
import { useState } from 'react'
import { Sparkles, Star, Clock, TrendingUp } from 'lucide-react'

// Örnek iş ilanları
const jobListings = [
  {
    id: 1,
    title: 'Yazılım Geliştirici (React/Node.js)',
    company: 'Tech Solutions A.Ş.',
    location: 'İstanbul',
    salary: '25.000 - 35.000',
    type: 'Tam Zamanlı',
    experience: '3-5 yıl',
    description: 'React ve Node.js teknolojilerinde deneyimli yazılım geliştirici arıyoruz.',
    createdAt: '2024-03-20',
    isPremium: true,
    premiumFeatures: ['featured', 'urgent'],
    views: 245,
    isUrgent: true,
    isFeatured: true
  },
  {
    id: 2,
    title: 'Satış Temsilcisi',
    company: 'ABC Şirketi',
    location: 'Ankara',
    salary: '8.000 - 12.000',
    type: 'Tam Zamanlı',
    experience: '1-3 yıl',
    description: 'Dinamik ve sonuç odaklı satış temsilcisi arıyoruz.',
    createdAt: '2024-03-19',
    isPremium: false,
    premiumFeatures: [],
    views: 89,
    isUrgent: false,
    isFeatured: false
  },
  {
    id: 3,
    title: 'Muhasebe Uzmanı',
    company: 'Finans Ltd. Şti.',
    location: 'İzmir',
    salary: '15.000 - 20.000',
    type: 'Tam Zamanlı',
    experience: '5-7 yıl',
    description: 'Muhasebe ve finans alanında deneyimli uzman arıyoruz.',
    createdAt: '2024-03-18',
    isPremium: true,
    premiumFeatures: ['featured'],
    views: 156,
    isUrgent: false,
    isFeatured: true
  },
  {
    id: 4,
    title: 'Freelance Web Tasarımcı',
    company: 'Dijital Ajans',
    location: 'Uzaktan',
    salary: 'Proje Bazlı',
    type: 'Freelance',
    experience: '2-4 yıl',
    description: 'Yaratıcı ve deneyimli web tasarımcı arıyoruz.',
    createdAt: '2024-03-17',
    isPremium: true,
    premiumFeatures: ['urgent', 'top'],
    views: 312,
    isUrgent: true,
    isFeatured: false
  },
  {
    id: 5,
    title: 'İnsan Kaynakları Uzmanı',
    company: 'HR Solutions',
    location: 'Bursa',
    salary: '18.000 - 25.000',
    type: 'Tam Zamanlı',
    experience: '3-5 yıl',
    description: 'İnsan kaynakları süreçlerinde deneyimli uzman arıyoruz.',
    createdAt: '2024-03-16',
    isPremium: false,
    premiumFeatures: [],
    views: 67,
    isUrgent: false,
    isFeatured: false
  },
  {
    id: 6,
    title: 'Stajyer Mühendis',
    company: 'Mühendislik A.Ş.',
    location: 'Antalya',
    salary: '5.000 - 7.000',
    type: 'Staj',
    experience: 'Öğrenci',
    description: 'Mühendislik öğrencileri için staj imkanı.',
    createdAt: '2024-03-15',
    isPremium: true,
    premiumFeatures: ['featured', 'urgent', 'top'],
    views: 423,
    isUrgent: true,
    isFeatured: true
  }
]

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
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

  const filteredSubcategories = selectedType 
    ? subcategories.filter(cat => cat.type === selectedType)
    : subcategories

  // İlanları filtrele ve sırala
  const filteredListings = jobListings
    .filter(listing => {
      if (showPremiumOnly && !listing.isPremium) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'premium-first':
          if (a.isPremium && !b.isPremium) return -1
          if (!a.isPremium && b.isPremium) return 1
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

  const categoryTypes = [
    { id: 'job-seeker', name: 'İş Arama', icon: <FaSearch className="w-4 h-4" /> },
    { id: 'employer', name: 'Eleman Arama', icon: <FaUserPlus className="w-4 h-4" /> },
    { id: 'work-type', name: 'Çalışma Türleri', icon: <FaClock className="w-4 h-4" /> },
    { id: 'position', name: 'Pozisyonlar', icon: <FaUserTie className="w-4 h-4" /> },
    { id: 'employee', name: 'Eleman Türleri', icon: <FaUsers className="w-4 h-4" /> },
  ]

  const getPremiumFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'featured':
        return <Star className="w-3 h-3 text-yellow-500" />
      case 'urgent':
        return <Clock className="w-3 h-3 text-red-500" />
      case 'highlighted':
        return <Sparkles className="w-3 h-3 text-blue-500" />
      case 'top':
        return <TrendingUp className="w-3 h-3 text-green-500" />
      default:
        return null
    }
  }

  const getPremiumFeatureText = (feature: string) => {
    switch (feature) {
      case 'featured':
        return 'Öne Çıkan'
      case 'urgent':
        return 'Acil'
      case 'highlighted':
        return 'Vurgulanmış'
      case 'top':
        return 'Üst Sıralarda'
      default:
        return ''
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">İş & Eleman İlanları</h1>
        <p className="text-gray-600 mt-2">
          İş arıyorum, eleman arıyorum, tam zamanlı, yarı zamanlı, freelance ve diğer iş fırsatları. Kariyerinizi geliştirin veya uygun elemanı bulun.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sol Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h2 className="text-lg font-semibold mb-4">Filtreler</h2>
            
            {/* Premium Filtresi */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Premium</h3>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPremiumOnly}
                  onChange={(e) => setShowPremiumOnly(e.target.checked)}
                  className="rounded border-gray-300 text-alo-orange focus:ring-alo-orange"
                />
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">Sadece Premium İlanlar</span>
              </label>
            </div>

            {/* Kategori Türleri */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Kategori Türleri</h3>
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
            <div className="mb-6">
              <h3 className="font-medium mb-2">Alt Kategoriler</h3>
              <div className="space-y-2">
                {filteredSubcategories.map(subcategory => (
                  <Link
                    key={subcategory.id}
                    href={`/kategori/is/${subcategory.id}`}
                    className={`block px-3 py-2 rounded-md hover:bg-gray-50 transition-colors ${selectedSubcategory === subcategory.id ? 'bg-gray-100 font-medium' : ''}`}
                    onClick={() => setSelectedSubcategory(subcategory.id)}
                  >
                    {subcategory.icon}{subcategory.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* İş İlanları Avantajları */}
            <div className="bg-emerald-50 p-4 rounded-lg">
              <h3 className="font-medium text-emerald-800 mb-2">İş İlanları Avantajları</h3>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• Hızlı iş bulma</li>
                <li>• Güvenilir şirketler</li>
                <li>• Detaylı ilan bilgileri</li>
                <li>• Kolay başvuru</li>
                <li>• Ücretsiz kullanım</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Ana İçerik - İlanlar */}
        <div className="flex-1 space-y-8">
          {/* Sıralama ve Sonuç Sayısı */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                {filteredListings.length} iş ilanı bulundu
                {showPremiumOnly && (
                  <span className="ml-2 text-yellow-600 font-medium">
                    (Premium ilanlar)
                  </span>
                )}
              </span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent"
                aria-label="Sıralama seçenekleri"
              >
                <option value="newest">En Yeni</option>
                <option value="oldest">En Eski</option>
                <option value="premium-first">Premium Önce</option>
              </select>
            </div>
          </div>

          {/* İlanlar */}
          <div className="space-y-6">
            {filteredListings.map((listing) => (
              <div
                key={listing.id}
                className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 ${
                  listing.isPremium ? 'ring-2 ring-yellow-200 hover:ring-yellow-300' : ''
                } ${listing.isUrgent ? 'border-l-4 border-red-500' : ''}`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{listing.title}</h3>
                        <div className="flex flex-wrap gap-1">
                          {listing.isPremium && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Premium
                            </span>
                          )}
                          {listing.isUrgent && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Acil
                            </span>
                          )}
                          {listing.isFeatured && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <Star className="w-3 h-3 mr-1" />
                              Öne Çıkan
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-gray-600 mb-3">
                        <div className="flex items-center">
                          <FaBriefcase className="w-4 h-4 mr-1" />
                          <span>{listing.company}</span>
                        </div>
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                          <span>{listing.location}</span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="w-4 h-4 mr-1" />
                          <span>{listing.type}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-gray-600 mb-3">
                        <div className="flex items-center">
                          <FaMoneyBillWave className="w-4 h-4 mr-1" />
                          <span className="font-semibold text-alo-orange">{listing.salary} ₺</span>
                        </div>
                        <div className="flex items-center">
                          <FaUserTie className="w-4 h-4 mr-1" />
                          <span>{listing.experience} deneyim</span>
                        </div>
                        <div className="flex items-center">
                          <FaStar className="w-4 h-4 mr-1" />
                          <span>{listing.views} görüntülenme</span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{listing.description}</p>

                      {/* Premium Özellikler */}
                      {listing.premiumFeatures.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {listing.premiumFeatures.map((feature, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                            >
                              {getPremiumFeatureIcon(feature)}
                              <span className="ml-1">{getPremiumFeatureText(feature)}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="text-right text-sm text-gray-500">
                      <div>{listing.views} görüntülenme</div>
                      <div>{new Date(listing.createdAt).toLocaleDateString('tr-TR')}</div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Detayları Gör
                    </button>
                    <button className="px-4 py-2 bg-alo-orange text-white rounded-lg hover:bg-orange-600 transition-colors">
                      Başvur
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sonuç Bulunamadı */}
          {filteredListings.length === 0 && (
            <div className="text-center py-12">
              <FaBriefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                İlan Bulunamadı
              </h3>
              <p className="text-gray-600 mb-4">
                Seçtiğiniz kriterlere uygun iş ilanı bulunamadı. Lütfen filtreleri değiştirerek tekrar deneyin.
              </p>
              <button
                onClick={() => {
                  setSelectedSubcategory(null)
                  setSelectedType(null)
                  setShowPremiumOnly(false)
                  setSortBy('newest')
                }}
                className="bg-alo-orange text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 