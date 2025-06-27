'use client'

import { FaLaptop, FaMobile, FaDesktop, FaWifi, FaTools, FaCog, FaClock, FaMoneyBillWave, FaMapMarkerAlt, FaStar, FaCheckCircle, FaShieldAlt, FaUserCog, FaNetworkWired, FaServer, FaTabletAlt, FaHeadphones, FaTv, FaGamepad, FaPrint } from 'react-icons/fa'
import { useState } from 'react'
import { Sparkles, Star, Clock, TrendingUp } from 'lucide-react'

// Teknik hizmetler ilanları
const teknikHizmetler = [
  {
    id: 1,
    title: 'Bilgisayar Tamir ve Bakım Hizmeti',
    provider: 'Uzman Teknisyen',
    location: 'İstanbul',
    price: '150 - 500',
    type: 'Bilgisayar',
    duration: '1-3 saat',
    description: 'Bilgisayar tamiri, bakım, yazılım kurulumu, virüs temizleme, donanım değişimi.',
    createdAt: '2024-03-20',
    isPremium: true,
    premiumFeatures: ['featured', 'urgent'],
    views: 312,
    isUrgent: true,
    isFeatured: true,
    services: ['Donanım tamiri', 'Yazılım kurulumu', 'Virüs temizleme', 'Sistem optimizasyonu'],
    benefits: ['Uzman teknisyen', 'Garantili hizmet', 'Evde hizmet', 'Hızlı çözüm'],
    experience: '8 yıl',
    specialties: ['Laptop Tamiri', 'Desktop Tamiri', 'Yazılım Sorunları', 'Donanım Sorunları']
  },
  {
    id: 2,
    title: 'Telefon Tamir ve Ekran Değişimi',
    provider: 'Telefon Ustası',
    location: 'Ankara',
    price: '200 - 800',
    type: 'Telefon',
    duration: '30-120 dakika',
    description: 'Telefon tamiri, ekran değişimi, batarya değişimi, yazılım sorunları çözümü.',
    createdAt: '2024-03-19',
    isPremium: false,
    premiumFeatures: [],
    views: 245,
    isUrgent: false,
    isFeatured: false,
    services: ['Ekran değişimi', 'Batarya değişimi', 'Yazılım sorunları', 'Donanım tamiri'],
    benefits: ['Orijinal parça', 'Hızlı servis', 'Garantili işçilik', 'Ücretsiz kontrol'],
    experience: '6 yıl',
    specialties: ['iPhone Tamiri', 'Samsung Tamiri', 'Android Telefonlar', 'Ekran Değişimi']
  },
  {
    id: 3,
    title: 'Ağ ve İnternet Kurulum Hizmeti',
    provider: 'Ağ Uzmanı',
    location: 'İzmir',
    price: '300 - 1.200',
    type: 'Ağ',
    duration: '2-6 saat',
    description: 'WiFi kurulumu, ağ yapılandırması, güvenlik duvarı, ofis ağı kurulumu.',
    createdAt: '2024-03-18',
    isPremium: true,
    premiumFeatures: ['featured', 'highlighted'],
    views: 178,
    isUrgent: false,
    isFeatured: true,
    services: ['WiFi kurulumu', 'Ağ yapılandırması', 'Güvenlik duvarı', 'Ofis ağı'],
    benefits: ['Uzman mühendis', 'Modern ekipman', 'Teknik destek', 'Güvenlik odaklı'],
    experience: '10 yıl',
    specialties: ['Ev Ağı', 'Ofis Ağı', 'Güvenlik Sistemleri', 'WiFi Optimizasyonu']
  },
  {
    id: 4,
    title: 'Yazıcı ve Tarayıcı Tamiri',
    provider: 'Yazıcı Uzmanı',
    location: 'Bursa',
    price: '100 - 400',
    type: 'Yazıcı',
    duration: '1-2 saat',
    description: 'Yazıcı tamiri, tarayıcı tamiri, kartuş değişimi, yazılım sorunları.',
    createdAt: '2024-03-17',
    isPremium: true,
    premiumFeatures: ['urgent', 'top'],
    views: 134,
    isUrgent: true,
    isFeatured: false,
    services: ['Yazıcı tamiri', 'Tarayıcı tamiri', 'Kartuş değişimi', 'Yazılım sorunları'],
    benefits: ['Orijinal parça', 'Hızlı servis', 'Garantili işçilik', 'Ücretsiz kontrol'],
    experience: '7 yıl',
    specialties: ['Lazer Yazıcı', 'Mürekkep Püskürtmeli', 'Tarayıcı', 'Çok Fonksiyonlu']
  },
  {
    id: 5,
    title: 'Oyun Konsolu Tamiri',
    provider: 'Konsol Uzmanı',
    location: 'Antalya',
    price: '250 - 600',
    type: 'Konsol',
    duration: '1-4 saat',
    description: 'PlayStation, Xbox, Nintendo tamiri. Donanım sorunları, yazılım sorunları.',
    createdAt: '2024-03-16',
    isPremium: false,
    premiumFeatures: [],
    views: 98,
    isUrgent: false,
    isFeatured: false,
    services: ['Donanım tamiri', 'Yazılım sorunları', 'Kontrolcü tamiri', 'Sistem güncelleme'],
    benefits: ['Uzman teknisyen', 'Orijinal parça', 'Garantili hizmet', 'Hızlı çözüm'],
    experience: '5 yıl',
    specialties: ['PlayStation', 'Xbox', 'Nintendo', 'Kontrolcü Tamiri']
  },
  {
    id: 6,
    title: 'Televizyon ve Ses Sistemi Tamiri',
    provider: 'Elektronik Uzmanı',
    location: 'Çanakkale',
    price: '200 - 800',
    type: 'TV/Ses',
    duration: '1-3 saat',
    description: 'TV tamiri, ses sistemi kurulumu, uzaktan kumanda sorunları, görüntü sorunları.',
    createdAt: '2024-03-15',
    isPremium: true,
    premiumFeatures: ['featured', 'urgent', 'top'],
    views: 167,
    isUrgent: true,
    isFeatured: true,
    services: ['TV tamiri', 'Ses sistemi', 'Uzaktan kumanda', 'Görüntü sorunları'],
    benefits: ['Uzman teknisyen', 'Orijinal parça', 'Garantili hizmet', 'Evde hizmet'],
    experience: '12 yıl',
    specialties: ['LCD/LED TV', 'Plazma TV', 'Ses Sistemleri', 'Home Theater']
  }
]

export default function TeknikHizmetlerPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

  // Filtreleme ve sıralama
  const filteredHizmetler = teknikHizmetler
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

  const serviceTypes = ['Bilgisayar', 'Telefon', 'Ağ', 'Yazıcı', 'Konsol', 'TV/Ses']
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
      case 'Bilgisayar':
        return <FaLaptop className="w-4 h-4 text-blue-500" />
      case 'Telefon':
        return <FaMobile className="w-4 h-4 text-green-500" />
      case 'Ağ':
        return <FaWifi className="w-4 h-4 text-purple-500" />
      case 'Yazıcı':
        return <FaPrint className="w-4 h-4 text-gray-500" />
      case 'Konsol':
        return <FaGamepad className="w-4 h-4 text-orange-500" />
      case 'TV/Ses':
        return <FaTv className="w-4 h-4 text-red-500" />
      default:
        return <FaTools className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Teknik Hizmetler</h1>
        <p className="text-gray-600 mt-2">
          Bilgisayar, telefon, elektronik cihaz tamiri ve teknik destek hizmetleri
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

            {/* Teknik Hizmetler Avantajları */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Teknik Hizmetler Avantajları</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Uzman teknisyenler</li>
                <li>• Garantili hizmet</li>
                <li>• Hızlı çözüm</li>
                <li>• Orijinal parça</li>
                <li>• Evde hizmet</li>
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
                {filteredHizmetler.length} teknik hizmet bulundu
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
                          <FaUserCog className="w-4 h-4 mr-1" />
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
              <FaTools className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Hizmet Bulunamadı
              </h3>
              <p className="text-gray-600 mb-4">
                Seçtiğiniz kriterlere uygun teknik hizmet bulunamadı. Lütfen filtreleri değiştirerek tekrar deneyin.
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