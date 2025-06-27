'use client'

import { FaPalette, FaLaptopCode, FaCamera, FaPen, FaPencilAlt, FaBrush, FaEye, FaClock, FaMoneyBillWave, FaMapMarkerAlt, FaStar, FaCheckCircle, FaShieldAlt, FaUserTie, FaMobile, FaDesktop, FaTabletAlt, FaVideo, FaMicrophone, FaMusic, FaPaintBrush, FaDraftingCompass } from 'react-icons/fa'
import { useState } from 'react'
import { Sparkles, Star, Clock, TrendingUp } from 'lucide-react'

// Tasarım hizmetleri ilanları
const tasarimHizmetleri = [
  {
    id: 1,
    title: 'Grafik Tasarım ve Logo Tasarımı',
    provider: 'Grafik Tasarımcı',
    location: 'İstanbul',
    price: '500 - 2.000',
    type: 'Grafik Tasarım',
    duration: '3-7 gün',
    description: 'Logo tasarımı, kurumsal kimlik, broşür, kartvizit, sosyal medya görselleri tasarımı.',
    createdAt: '2024-03-20',
    isPremium: true,
    premiumFeatures: ['featured', 'urgent'],
    views: 289,
    isUrgent: true,
    isFeatured: true,
    services: ['Logo tasarımı', 'Kurumsal kimlik', 'Broşür tasarımı', 'Sosyal medya görselleri'],
    benefits: ['Profesyonel tasarım', 'Sınırsız revizyon', 'Vektörel dosyalar', 'Hızlı teslimat'],
    experience: '8 yıl',
    specialties: ['Logo Tasarımı', 'Kurumsal Kimlik', 'Sosyal Medya', 'Print Tasarım']
  },
  {
    id: 2,
    title: 'Web Sitesi Tasarımı ve Geliştirme',
    provider: 'Web Tasarımcı',
    location: 'Ankara',
    price: '2.000 - 15.000',
    type: 'Web Tasarım',
    duration: '1-4 hafta',
    description: 'Modern web sitesi tasarımı, responsive tasarım, e-ticaret sitesi, WordPress geliştirme.',
    createdAt: '2024-03-19',
    isPremium: false,
    premiumFeatures: [],
    views: 345,
    isUrgent: false,
    isFeatured: false,
    services: ['Web sitesi tasarımı', 'Responsive tasarım', 'E-ticaret sitesi', 'WordPress geliştirme'],
    benefits: ['Modern tasarım', 'SEO uyumlu', 'Mobil uyumlu', 'Teknik destek'],
    experience: '10 yıl',
    specialties: ['Frontend Geliştirme', 'UI/UX Tasarım', 'E-ticaret', 'WordPress']
  },
  {
    id: 3,
    title: 'Fotoğraf Çekimi ve Düzenleme',
    provider: 'Profesyonel Fotoğrafçı',
    location: 'İzmir',
    price: '300 - 1.500',
    type: 'Fotoğraf',
    duration: '1-3 gün',
    description: 'Ürün fotoğrafı, portre çekimi, etkinlik fotoğrafı, fotoğraf düzenleme ve retouch.',
    createdAt: '2024-03-18',
    isPremium: true,
    premiumFeatures: ['featured', 'highlighted'],
    views: 234,
    isUrgent: false,
    isFeatured: true,
    services: ['Ürün fotoğrafı', 'Portre çekimi', 'Etkinlik fotoğrafı', 'Fotoğraf düzenleme'],
    benefits: ['Profesyonel ekipman', 'Yüksek kalite', 'Hızlı teslimat', 'Dijital dosyalar'],
    experience: '12 yıl',
    specialties: ['Ürün Fotoğrafçılığı', 'Portre Fotoğrafçılığı', 'Etkinlik Fotoğrafçılığı', 'Retouch']
  },
  {
    id: 4,
    title: 'İçerik Yazarlığı ve SEO',
    provider: 'İçerik Yazarı',
    location: 'Bursa',
    price: '200 - 800',
    type: 'İçerik',
    duration: '1-5 gün',
    description: 'Web sitesi içeriği, blog yazıları, SEO uyumlu içerik, sosyal medya içeriği yazımı.',
    createdAt: '2024-03-17',
    isPremium: true,
    premiumFeatures: ['urgent', 'top'],
    views: 178,
    isUrgent: true,
    isFeatured: false,
    services: ['Web sitesi içeriği', 'Blog yazıları', 'SEO içerik', 'Sosyal medya içeriği'],
    benefits: ['SEO uyumlu', 'Orijinal içerik', 'Hızlı teslimat', 'Sınırsız revizyon'],
    experience: '6 yıl',
    specialties: ['SEO Yazarlığı', 'Blog Yazarlığı', 'Sosyal Medya', 'Teknik Yazarlık']
  },
  {
    id: 5,
    title: 'Video Prodüksiyon ve Düzenleme',
    provider: 'Video Editörü',
    location: 'Antalya',
    price: '500 - 3.000',
    type: 'Video',
    duration: '1-2 hafta',
    description: 'Kurumsal video, reklam filmi, sosyal medya videosu, video düzenleme ve montaj.',
    createdAt: '2024-03-16',
    isPremium: false,
    premiumFeatures: [],
    views: 156,
    isUrgent: false,
    isFeatured: false,
    services: ['Kurumsal video', 'Reklam filmi', 'Sosyal medya videosu', 'Video düzenleme'],
    benefits: ['Profesyonel ekipman', 'Yüksek kalite', 'Hızlı teslimat', 'Çoklu format'],
    experience: '7 yıl',
    specialties: ['Kurumsal Video', 'Reklam Filmi', 'Sosyal Medya', 'Video Montaj']
  },
  {
    id: 6,
    title: 'İllüstrasyon ve Karikatür',
    provider: 'İllüstratör',
    location: 'Çanakkale',
    price: '300 - 1.200',
    type: 'İllüstrasyon',
    duration: '2-7 gün',
    description: 'Özel illüstrasyon, karikatür, çizgi roman, karakter tasarımı, dijital sanat.',
    createdAt: '2024-03-15',
    isPremium: true,
    premiumFeatures: ['featured', 'urgent', 'top'],
    views: 198,
    isUrgent: true,
    isFeatured: true,
    services: ['Özel illüstrasyon', 'Karikatür', 'Karakter tasarımı', 'Dijital sanat'],
    benefits: ['Özgün tasarım', 'Yüksek kalite', 'Vektörel dosyalar', 'Hızlı teslimat'],
    experience: '9 yıl',
    specialties: ['Dijital İllüstrasyon', 'Karikatür', 'Karakter Tasarımı', 'Çizgi Roman']
  }
]

export default function TasarimHizmetleriPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

  // Filtreleme ve sıralama
  const filteredHizmetler = tasarimHizmetleri
    .filter(hizmet => {
      if (showPremiumOnly && !hizmet.isPremium) return false
      if (selectedType && hizmet.type !== selectedType) return false
      if (selectedLocation && hizmet.location !== selectedLocation) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'price-low':
          return parseInt(a.price.split('-')[0].replace(/[^0-9]/g, '')) - parseInt(b.price.split('-')[0].replace(/[^0-9]/g, ''))
        case 'price-high':
          return parseInt(b.price.split('-')[1].replace(/[^0-9]/g, '')) - parseInt(a.price.split('-')[1].replace(/[^0-9]/g, ''))
        case 'premium-first':
          if (a.isPremium && !b.isPremium) return -1
          if (!a.isPremium && b.isPremium) return 1
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

  const serviceTypes = ['Grafik Tasarım', 'Web Tasarım', 'Fotoğraf', 'İçerik', 'Video', 'İllüstrasyon']
  const locations = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Çanakkale']

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

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'Grafik Tasarım':
        return <FaPalette className="w-4 h-4 text-purple-500" />
      case 'Web Tasarım':
        return <FaLaptopCode className="w-4 h-4 text-blue-500" />
      case 'Fotoğraf':
        return <FaCamera className="w-4 h-4 text-green-500" />
      case 'İçerik':
        return <FaPen className="w-4 h-4 text-orange-500" />
      case 'Video':
        return <FaVideo className="w-4 h-4 text-red-500" />
      case 'İllüstrasyon':
        return <FaPaintBrush className="w-4 h-4 text-pink-500" />
      default:
        return <FaPalette className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tasarım Hizmetleri</h1>
        <p className="text-gray-600 mt-2">
          Grafik tasarım, web tasarım, fotoğraf, içerik üretimi ve yaratıcı hizmetler
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sol Sidebar - Filtreler */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-4">
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
                <span className="text-sm">Sadece Premium Hizmetler</span>
              </label>
            </div>

            {/* Hizmet Türü */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Hizmet Türü</h3>
              <div className="space-y-2">
                {serviceTypes.map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedType === type}
                      onChange={() => setSelectedType(selectedType === type ? null : type)}
                    />
                    <span className="flex items-center">
                      {getServiceIcon(type)}
                      <span className="ml-2">{type}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Konum */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Konum</h3>
              <div className="space-y-2">
                {locations.map(location => (
                  <label key={location} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedLocation === location}
                      onChange={() => setSelectedLocation(selectedLocation === location ? null : location)}
                    />
                    <span>{location}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tasarım Hizmetleri Avantajları */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-800 mb-2">Tasarım Hizmetleri Avantajları</h3>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Profesyonel tasarım</li>
                <li>• Sınırsız revizyon</li>
                <li>• Yüksek kalite</li>
                <li>• Hızlı teslimat</li>
                <li>• Özgün içerik</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="flex-1 space-y-8">
          {/* Sıralama ve Sonuç Sayısı */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                {filteredHizmetler.length} tasarım hizmeti bulundu
                {showPremiumOnly && (
                  <span className="ml-2 text-yellow-600 font-medium">
                    (Premium hizmetler)
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
                <option value="price-low">Fiyat (Düşükten Yükseğe)</option>
                <option value="price-high">Fiyat (Yüksekten Düşüğe)</option>
                <option value="premium-first">Premium Önce</option>
              </select>
            </div>
          </div>

          {/* Hizmetler */}
          <div className="space-y-6">
            {filteredHizmetler.map((hizmet) => (
              <div
                key={hizmet.id}
                className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 ${
                  hizmet.isPremium ? 'ring-2 ring-yellow-200 hover:ring-yellow-300' : ''
                } ${hizmet.isUrgent ? 'border-l-4 border-red-500' : ''}`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{hizmet.title}</h3>
                        <div className="flex flex-wrap gap-1">
                          {hizmet.isPremium && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Premium
                            </span>
                          )}
                          {hizmet.isUrgent && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Acil
                            </span>
                          )}
                          {hizmet.isFeatured && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <Star className="w-3 h-3 mr-1" />
                              Öne Çıkan
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-gray-600 mb-3">
                        <div className="flex items-center">
                          <FaUserTie className="w-4 h-4 mr-1" />
                          <span>{hizmet.provider}</span>
                        </div>
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                          <span>{hizmet.location}</span>
                        </div>
                        <div className="flex items-center">
                          {getServiceIcon(hizmet.type)}
                          <span className="ml-1">{hizmet.type}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-gray-600 mb-3">
                        <div className="flex items-center">
                          <FaMoneyBillWave className="w-4 h-4 mr-1" />
                          <span className="font-semibold text-alo-orange">{hizmet.price} ₺</span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="w-4 h-4 mr-1" />
                          <span>{hizmet.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <FaShieldAlt className="w-4 h-4 mr-1" />
                          <span>{hizmet.experience} deneyim</span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{hizmet.description}</p>

                      {/* Hizmetler */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Sunulan Hizmetler:</h4>
                        <div className="flex flex-wrap gap-2">
                          {hizmet.services.map((service, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              <FaCheckCircle className="w-3 h-3 mr-1" />
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Avantajlar */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Avantajlar:</h4>
                        <div className="flex flex-wrap gap-2">
                          {hizmet.benefits.map((benefit, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Uzmanlık Alanları */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Uzmanlık Alanları:</h4>
                        <div className="flex flex-wrap gap-2">
                          {hizmet.specialties.map((specialty, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Premium Özellikler */}
                      {hizmet.premiumFeatures.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {hizmet.premiumFeatures.map((feature, index) => (
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
                      <div>{hizmet.views} görüntülenme</div>
                      <div>{new Date(hizmet.createdAt).toLocaleDateString('tr-TR')}</div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Detayları Gör
                    </button>
                    <button className="px-4 py-2 bg-alo-orange text-white rounded-lg hover:bg-orange-600 transition-colors">
                      Hizmet Al
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sonuç Bulunamadı */}
          {filteredHizmetler.length === 0 && (
            <div className="text-center py-12">
              <FaPalette className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Hizmet Bulunamadı
              </h3>
              <p className="text-gray-600 mb-4">
                Seçtiğiniz kriterlere uygun tasarım hizmeti bulunamadı. Lütfen filtreleri değiştirerek tekrar deneyin.
              </p>
              <button
                onClick={() => {
                  setSelectedType(null)
                  setSelectedLocation(null)
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