'use client'

import { FaCoffee, FaWifi, FaLaptop, FaMusic, FaStar, FaMapMarkerAlt } from 'react-icons/fa'
import { useState } from 'react'
import { Sparkles, Star, Clock, TrendingUp, MapPin, Building, DollarSign } from 'lucide-react'

const subcategories = [
  { id: 'kahve-kafesi', name: 'Kahve Kafesi', icon: <FaCoffee className="inline mr-2 text-brown-500" /> },
  { id: 'calisma-kafesi', name: 'Çalışma Kafesi', icon: <FaLaptop className="inline mr-2 text-blue-500" /> },
  { id: 'tatli-kafesi', name: 'Tatlı Kafesi', icon: <FaCoffee className="inline mr-2 text-pink-500" /> },
  { id: 'brunch-kafesi', name: 'Brunch Kafesi', icon: <FaCoffee className="inline mr-2 text-green-500" /> },
  { id: 'muzik-kafesi', name: 'Müzik Kafesi', icon: <FaMusic className="inline mr-2 text-purple-500" /> },
  { id: 'organik-kafe', name: 'Organik Kafe', icon: <FaCoffee className="inline mr-2 text-green-600" /> },
]

// Kafe ilanları
const cafeListings = [
  {
    id: 1,
    title: 'Kahve Dünyası - Premium Kahve Deneyimi',
    company: 'Kahve Dünyası',
    location: 'İstanbul',
    price: '50 - 120',
    type: 'Kahve Kafesi',
    rating: 4.7,
    description: 'Dünya çapında seçkin kahve çeşitleri ve uzman barista hizmeti.',
    createdAt: '2024-03-20',
    isPremium: true,
    premiumFeatures: ['featured', 'urgent'],
    views: 245,
    isUrgent: true,
    isFeatured: true,
    category: 'kahve-kafesi',
    features: ['Açık Hava', 'Teras', 'Wi-Fi', 'Çalışma Alanı', 'Kahvaltı']
  },
  {
    id: 2,
    title: 'Work & Coffee - Çalışma Dostu Kafe',
    company: 'Work & Coffee',
    location: 'Ankara',
    price: '30 - 80',
    type: 'Çalışma Kafesi',
    rating: 4.5,
    description: 'Freelancer ve öğrenciler için ideal çalışma ortamı ve hızlı internet.',
    createdAt: '2024-03-19',
    isPremium: false,
    premiumFeatures: [],
    views: 89,
    isUrgent: false,
    isFeatured: false,
    category: 'calisma-kafesi',
    features: ['Wi-Fi', 'Çalışma Alanı', 'Elektrik Prizleri', 'Sessiz Ortam']
  },
  {
    id: 3,
    title: 'Tatlı Cenneti - Ev Yapımı Tatlılar',
    company: 'Tatlı Cenneti',
    location: 'İzmir',
    price: '40 - 100',
    type: 'Tatlı Kafesi',
    rating: 4.8,
    description: 'Ev yapımı tatlılar ve özel kahve çeşitleri ile tatlı bir mola.',
    createdAt: '2024-03-18',
    isPremium: true,
    premiumFeatures: ['featured'],
    views: 156,
    isUrgent: false,
    isFeatured: true,
    category: 'tatli-kafesi',
    features: ['Açık Hava', 'Teras', 'Tatlı Çeşitleri', 'Vegan Seçenekler']
  },
  {
    id: 4,
    title: 'Brunch & Co - Lezzetli Brunch Menüleri',
    company: 'Brunch & Co',
    location: 'Bursa',
    price: '80 - 150',
    type: 'Brunch Kafesi',
    rating: 4.6,
    description: 'Hafta sonları için özel brunch menüleri ve taze içecekler.',
    createdAt: '2024-03-17',
    isPremium: true,
    premiumFeatures: ['urgent', 'top'],
    views: 312,
    isUrgent: true,
    isFeatured: false,
    category: 'brunch-kafesi',
    features: ['Açık Hava', 'Kahvaltı', 'Brunch Menüleri', 'Glutensiz Seçenekler']
  },
  {
    id: 5,
    title: 'Jazz Corner - Müzik ve Kahve',
    company: 'Jazz Corner',
    location: 'Antalya',
    price: '60 - 120',
    type: 'Müzik Kafesi',
    rating: 4.4,
    description: 'Canlı müzik eşliğinde kahve keyfi ve rahat atmosfer.',
    createdAt: '2024-03-16',
    isPremium: false,
    premiumFeatures: [],
    views: 67,
    isUrgent: false,
    isFeatured: false,
    category: 'muzik-kafesi',
    features: ['Canlı Müzik', 'Açık Hava', 'Alkol Servisi', 'Teras']
  },
  {
    id: 6,
    title: 'Organik Bahçe - Doğal ve Sağlıklı',
    company: 'Organik Bahçe',
    location: 'İstanbul',
    price: '70 - 140',
    type: 'Organik Kafe',
    rating: 4.9,
    description: 'Organik malzemelerle hazırlanan sağlıklı içecekler ve atıştırmalıklar.',
    createdAt: '2024-03-15',
    isPremium: true,
    premiumFeatures: ['featured', 'urgent', 'top'],
    views: 423,
    isUrgent: true,
    isFeatured: true,
    category: 'organik-kafe',
    features: ['Açık Hava', 'Organik Ürünler', 'Vegan Seçenekler', 'Glutensiz Seçenekler', 'Bahçe']
  }
]

export default function CafesCategoryPage() {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<string | null>(null)
  const [location, setLocation] = useState<string | null>(null)
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [features, setFeatures] = useState<string[]>([])

  // Filtreleme ve sıralama
  const filteredListings = cafeListings
    .filter(listing => {
      if (showPremiumOnly && !listing.isPremium) return false
      if (selectedSubcategory && listing.category !== selectedSubcategory) return false
      if (location && listing.location !== location) return false
      if (features.length > 0 && !features.every(feature => listing.features.includes(feature))) return false
      if (priceRange) {
        const price = parseInt(listing.price.split('-')[0].replace(/[^0-9]/g, ''))
        switch (priceRange) {
          case '0-50':
            if (price > 50) return false
            break
          case '50-100':
            if (price < 50 || price > 100) return false
            break
          case '100-150':
            if (price < 100 || price > 150) return false
            break
          case '150+':
            if (price < 150) return false
            break
        }
      }
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
          return parseInt(b.price.split('-')[0].replace(/[^0-9]/g, '')) - parseInt(a.price.split('-')[0].replace(/[^0-9]/g, ''))
        case 'rating':
          return b.rating - a.rating
        case 'premium-first':
          if (a.isPremium && !b.isPremium) return -1
          if (!a.isPremium && b.isPremium) return 1
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

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
        <h1 className="text-3xl font-bold text-gray-900">Kafeler</h1>
        <p className="text-gray-600 mt-2">
          Kahve, tatlı ve atıştırmalıklar için en iyi kafeleri keşfedin.
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
                <span className="text-sm">Sadece Premium İlanlar</span>
              </label>
            </div>

            {/* Kafe Türü Filtresi */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Kafe Türü</h3>
              <div className="space-y-2">
                {subcategories.map(subcategory => (
                  <label key={subcategory.id} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedSubcategory === subcategory.id}
                      onChange={() => setSelectedSubcategory(selectedSubcategory === subcategory.id ? null : subcategory.id)}
                    />
                    <span>{subcategory.icon}{subcategory.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Özellikler Filtresi */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Özellikler</h3>
              <div className="space-y-2">
                {[
                  'Açık Hava',
                  'Teras',
                  'Wi-Fi',
                  'Çalışma Alanı',
                  'Kahvaltı',
                  'Tatlı Çeşitleri',
                  'Vegan Seçenekler',
                  'Glutensiz Seçenekler',
                  'Canlı Müzik',
                  'Organik Ürünler'
                ].map(feature => (
                  <label key={feature} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={features.includes(feature)}
                      onChange={() => {
                        if (features.includes(feature)) {
                          setFeatures(features.filter(f => f !== feature))
                        } else {
                          setFeatures([...features, feature])
                        }
                      }}
                    />
                    <span>{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Konum Filtresi */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Konum</h3>
              <div className="space-y-2">
                {['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'].map(city => (
                  <label key={city} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={location === city}
                      onChange={() => setLocation(location === city ? null : city)}
                    />
                    <span>{city}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Fiyat Aralığı Filtresi */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Ortalama Kişi Başı</h3>
              <div className="space-y-2">
                {[
                  { value: '0-50', label: '0 - 50 TL' },
                  { value: '50-100', label: '50 - 100 TL' },
                  { value: '100-150', label: '100 - 150 TL' },
                  { value: '150+', label: '150 TL ve üzeri' }
                ].map(range => (
                  <label key={range.value} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={priceRange === range.value}
                      onChange={() => setPriceRange(priceRange === range.value ? null : range.value)}
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="flex-1 space-y-8">
          {/* Sıralama ve Sonuç Sayısı */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                {filteredListings.length} kafe bulundu
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
                <option value="price-low">Fiyat (Düşükten Yükseğe)</option>
                <option value="price-high">Fiyat (Yüksekten Düşüğe)</option>
                <option value="rating">Puana Göre</option>
                <option value="premium-first">Premium Önce</option>
              </select>
            </div>
          </div>

          {/* İlanlar */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div
                key={listing.id}
                className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 ${
                  listing.isPremium ? 'ring-2 ring-yellow-200 hover:ring-yellow-300' : ''
                } ${listing.isUrgent ? 'border-l-4 border-red-500' : ''}`}
              >
                <div className="p-4">
                  {/* Premium Rozetleri */}
                  <div className="flex flex-wrap gap-1 mb-3">
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

                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">{listing.title}</h3>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <Building className="w-4 h-4 mr-1" />
                    <span className="text-sm">{listing.company}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{listing.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium text-alo-orange">{listing.price} ₺</span>
                  </div>

                  <div className="flex items-center text-gray-600 mb-2">
                    <FaStar className="w-4 h-4 mr-1 text-yellow-500" />
                    <span className="text-sm">{listing.rating} / 5.0</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-gray-500 mb-3">
                    <div className="flex items-center">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{listing.type}</span>
                    </div>
                    <span className="text-xs">
                      {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{listing.description}</p>

                  {/* Özellikler */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {listing.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                      >
                        {feature}
                      </span>
                    ))}
                    {listing.features.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        +{listing.features.length - 3} daha
                      </span>
                    )}
                  </div>

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

                  {/* Görüntülenme Sayısı */}
                  <div className="mt-3 text-xs text-gray-500">
                    {listing.views} görüntülenme
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sonuç Bulunamadı */}
          {filteredListings.length === 0 && (
            <div className="text-center py-12">
              <FaCoffee className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Kafe Bulunamadı
              </h3>
              <p className="text-gray-600 mb-4">
                Seçtiğiniz kriterlere uygun kafe bulunamadı. Lütfen filtreleri değiştirerek tekrar deneyin.
              </p>
              <button
                onClick={() => {
                  setSelectedSubcategory(null)
                  setPriceRange(null)
                  setLocation(null)
                  setFeatures([])
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