'use client'

import { FaUtensils, FaCoffee, FaGlassMartini, FaStar, FaMapMarkerAlt, FaFilter, FaSearch } from 'react-icons/fa'
import Link from 'next/link'
import { useState } from 'react'
import { Sparkles, Star, Clock, TrendingUp, MapPin, Building, DollarSign } from 'lucide-react'

const subcategories = [
  { 
    id: 'restoranlar', 
    name: 'Restoranlar', 
    icon: <FaUtensils className="inline mr-2 text-yellow-500" />,
    description: 'Türk, İtalyan, Uzak Doğu ve daha birçok mutfak türünde restoranlar',
    count: 156,
    isPremium: true,
    rating: 4.7,
    location: 'İstanbul',
    price: '150 - 300'
  },
  { 
    id: 'kafeler', 
    name: 'Kafeler', 
    icon: <FaCoffee className="inline mr-2 text-brown-500" />,
    description: 'Kahve, tatlı ve atıştırmalıklar için en iyi kafeler',
    count: 89,
    isPremium: false,
    rating: 4.5,
    location: 'Ankara',
    price: '50 - 120'
  },
  { 
    id: 'icecekler', 
    name: 'İçecekler', 
    icon: <FaGlassMartini className="inline mr-2 text-blue-500" />,
    description: 'Alkollü, alkolsüz, kahve ve sağlıklı içecek çeşitleri',
    count: 234,
    isPremium: true,
    rating: 4.8,
    location: 'İzmir',
    price: '200 - 500'
  },
  { 
    id: 'fast-food', 
    name: 'Fast Food', 
    icon: <FaUtensils className="inline mr-2 text-red-500" />,
    description: 'Hızlı ve lezzetli fast food seçenekleri',
    count: 67,
    isPremium: false,
    rating: 4.3,
    location: 'Bursa',
    price: '50 - 100'
  },
  { 
    id: 'ozel-yemekler', 
    name: 'Özel Yemekler', 
    icon: <FaUtensils className="inline mr-2 text-green-500" />,
    description: 'Özel tarifler ve ev yapımı lezzetler',
    count: 45,
    isPremium: false,
    rating: 4.6,
    location: 'Antalya',
    price: '80 - 150'
  },
  { 
    id: 'tatli-pastane', 
    name: 'Tatlı & Pastane', 
    icon: <FaUtensils className="inline mr-2 text-pink-500" />,
    description: 'Tatlılar, pastalar ve özel ikramlar',
    count: 78,
    isPremium: false,
    rating: 4.4,
    location: 'İstanbul',
    price: '30 - 80'
  },
]

export default function YemekIcecekPage() {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<string | null>(null)
  const [location, setLocation] = useState<string | null>(null)
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

  // Filtreleme ve sıralama
  const filteredListings = subcategories
    .filter(listing => {
      if (showPremiumOnly && !listing.isPremium) return false
      if (selectedSubcategory && listing.id !== selectedSubcategory) return false
      if (location && listing.location !== location) return false
      if (priceRange) {
        const price = parseInt(listing.price.split('-')[0].replace(/[^0-9]/g, ''))
        switch (priceRange) {
          case '0-50':
            if (price > 50) return false
            break
          case '50-150':
            if (price < 50 || price > 150) return false
            break
          case '150-300':
            if (price < 150 || price > 300) return false
            break
          case '300+':
            if (price < 300) return false
            break
        }
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.count - a.count
        case 'oldest':
          return a.count - b.count
        case 'price-low':
          return parseInt(a.price.split('-')[0].replace(/[^0-9]/g, '')) - parseInt(b.price.split('-')[0].replace(/[^0-9]/g, ''))
        case 'price-high':
          return parseInt(b.price.split('-')[0].replace(/[^0-9]/g, '')) - parseInt(a.price.split('-')[0].replace(/[^0-9]/g, ''))
        case 'rating':
          return b.rating - a.rating
        case 'premium-first':
          if (a.isPremium && !b.isPremium) return -1
          if (!a.isPremium && b.isPremium) return 1
          return b.count - a.count
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
        <h1 className="text-3xl font-bold text-gray-900">Yemek ve İçecek</h1>
        <p className="text-gray-600 mt-2">
          Restoranlar, kafeler, içecekler ve daha fazlası için en iyi seçenekleri keşfedin.
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
                <span className="text-sm">Sadece Premium Kategoriler</span>
              </label>
            </div>

            {/* Alt Kategori Filtresi */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Kategori Türü</h3>
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
              <h3 className="font-medium mb-2">Ortalama Fiyat</h3>
              <div className="space-y-2">
                {[
                  { value: '0-50', label: '0 - 50 TL' },
                  { value: '50-150', label: '50 - 150 TL' },
                  { value: '150-300', label: '150 - 300 TL' },
                  { value: '300+', label: '300 TL ve üzeri' }
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
                {filteredListings.length} kategori bulundu
                {showPremiumOnly && (
                  <span className="ml-2 text-yellow-600 font-medium">
                    (Premium kategoriler)
                  </span>
                )}
              </span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent"
                aria-label="Sıralama seçenekleri"
              >
                <option value="newest">En Popüler</option>
                <option value="oldest">En Az Popüler</option>
                <option value="price-low">Fiyat (Düşükten Yükseğe)</option>
                <option value="price-high">Fiyat (Yüksekten Düşüğe)</option>
                <option value="rating">Puana Göre</option>
                <option value="premium-first">Premium Önce</option>
              </select>
            </div>
          </div>

          {/* Kategoriler */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Link
                key={listing.id}
                href={`/kategori/yemek-icecek/${listing.id}`}
                className={`block bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 ${
                  listing.isPremium ? 'ring-2 ring-yellow-200 hover:ring-yellow-300' : ''
                }`}
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
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {listing.count} ilan
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">{listing.name}</h3>
                  
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
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{listing.icon} Kategori</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{listing.description}</p>

                  {/* Premium Özellikler */}
                  {listing.isPremium && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {getPremiumFeatureIcon('featured')}
                        <span className="ml-1">Öne Çıkan</span>
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {getPremiumFeatureIcon('top')}
                        <span className="ml-1">Popüler</span>
                      </span>
                    </div>
                  )}

                  {/* İncele Butonu */}
                  <div className="mt-3 text-xs text-gray-500">
                    <span className="text-alo-orange font-medium">İncele →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Sonuç Bulunamadı */}
          {filteredListings.length === 0 && (
            <div className="text-center py-12">
              <FaUtensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Kategori Bulunamadı
              </h3>
              <p className="text-gray-600 mb-4">
                Seçtiğiniz kriterlere uygun kategori bulunamadı. Lütfen filtreleri değiştirerek tekrar deneyin.
              </p>
              <button
                onClick={() => {
                  setSelectedSubcategory(null)
                  setPriceRange(null)
                  setLocation(null)
                  setShowPremiumOnly(false)
                  setSortBy('newest')
                }}
                className="bg-alo-orange text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}

          {/* İstatistikler */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Yemek & İçecek Kategorisi İstatistikleri</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-alo-orange">669</div>
                <div className="text-sm text-gray-600">Toplam İlan</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">156</div>
                <div className="text-sm text-gray-600">Restoran</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">89</div>
                <div className="text-sm text-gray-600">Kafe</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">234</div>
                <div className="text-sm text-gray-600">İçecek</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 