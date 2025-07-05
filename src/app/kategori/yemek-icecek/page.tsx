'use client'

import { FaUtensils, FaCoffee, FaGlassMartini, FaStar, FaMapMarkerAlt, FaFilter, FaSearch } from 'react-icons/fa'
import { useState } from 'react'
import { Sparkles, Star, Clock, TrendingUp } from 'lucide-react'

// Gerçek yemek-icecek ilanları
const foodListings = [
  {
    id: 1,
    title: 'Lezzetli Türk Mutfağı - Özel Menü',
    price: '150',
    location: 'İstanbul',
    image: '/images/listings/iphone-14-pro-max-1.jpg',
    category: 'yemek-icecek',
    subcategory: 'restoranlar',
    cuisine: 'Türk Mutfağı',
    createdAt: '2024-03-20',
    isPremium: true,
    premiumFeatures: ['featured', 'urgent', 'highlighted'],
    views: 245,
    isUrgent: true,
    isFeatured: true,
    rating: 4.8,
    delivery: true,
    takeaway: true
  },
  {
    id: 2,
    title: 'İtalyan Restoranı - Pizza & Pasta',
    price: '200',
    location: 'Ankara',
    image: '/images/listings/iphone-14-pro-max-1.jpg',
    category: 'yemek-icecek',
    subcategory: 'restoranlar',
    cuisine: 'İtalyan Mutfağı',
    createdAt: '2024-03-19',
    isPremium: false,
    premiumFeatures: [],
    views: 89,
    isUrgent: false,
    isFeatured: false,
    rating: 4.5,
    delivery: true,
    takeaway: false
  },
  {
    id: 3,
    title: 'Kahve Dükkanı - Özel Kahve Çeşitleri',
    price: '45',
    location: 'İzmir',
    image: '/images/listings/iphone-14-pro-max-1.jpg',
    category: 'yemek-icecek',
    subcategory: 'kafeler',
    cuisine: 'Kahve',
    createdAt: '2024-03-18',
    isPremium: true,
    premiumFeatures: ['featured', 'highlighted'],
    views: 156,
    isUrgent: false,
    isFeatured: true,
    rating: 4.7,
    delivery: false,
    takeaway: true
  },
  {
    id: 4,
    title: 'Sushi Bar - Taze Deniz Ürünleri',
    price: '350',
    location: 'Bursa',
    image: '/images/listings/iphone-14-pro-max-1.jpg',
    category: 'yemek-icecek',
    subcategory: 'restoranlar',
    cuisine: 'Japon Mutfağı',
    createdAt: '2024-03-17',
    isPremium: true,
    premiumFeatures: ['urgent', 'top'],
    views: 312,
    isUrgent: true,
    isFeatured: false,
    rating: 4.9,
    delivery: true,
    takeaway: true
  },
  {
    id: 5,
    title: 'Ev Yapımı Tatlılar - Özel Tarifler',
    price: '80',
    location: 'Antalya',
    image: '/images/listings/iphone-14-pro-max-1.jpg',
    category: 'yemek-icecek',
    subcategory: 'tatli-pastane',
    cuisine: 'Tatlı',
    createdAt: '2024-03-16',
    isPremium: false,
    premiumFeatures: [],
    views: 67,
    isUrgent: false,
    isFeatured: false,
    rating: 4.6,
    delivery: true,
    takeaway: true
  },
  {
    id: 6,
    title: 'Cocktail Bar - Özel İçecekler',
    price: '120',
    location: 'İstanbul',
    image: '/images/listings/iphone-14-pro-max-1.jpg',
    category: 'yemek-icecek',
    subcategory: 'icecekler',
    cuisine: 'İçecek',
    createdAt: '2024-03-15',
    isPremium: true,
    premiumFeatures: ['featured', 'urgent', 'top'],
    views: 423,
    isUrgent: true,
    isFeatured: true,
    rating: 4.8,
    delivery: false,
    takeaway: false
  },
  {
    id: 7,
    title: 'Fast Food - Burger & Pizza',
    price: '75',
    location: 'Ankara',
    image: '/images/listings/iphone-14-pro-max-1.jpg',
    category: 'yemek-icecek',
    subcategory: 'fast-food',
    cuisine: 'Fast Food',
    createdAt: '2024-03-14',
    isPremium: false,
    premiumFeatures: [],
    views: 134,
    isUrgent: false,
    isFeatured: false,
    rating: 4.3,
    delivery: true,
    takeaway: true
  },
  {
    id: 8,
    title: 'Organik Smoothie Bar',
    price: '55',
    location: 'İzmir',
    image: '/images/listings/iphone-14-pro-max-1.jpg',
    category: 'yemek-icecek',
    subcategory: 'icecekler',
    cuisine: 'Sağlıklı İçecek',
    createdAt: '2024-03-13',
    isPremium: true,
    premiumFeatures: ['featured'],
    views: 98,
    isUrgent: false,
    isFeatured: true,
    rating: 4.7,
    delivery: true,
    takeaway: true
  }
]

const subcategories = [
  { id: 'restoranlar', name: 'Restoranlar', icon: <FaUtensils className="inline mr-2 text-yellow-500" /> },
  { id: 'kafeler', name: 'Kafeler', icon: <FaCoffee className="inline mr-2 text-brown-500" /> },
  { id: 'icecekler', name: 'İçecekler', icon: <FaGlassMartini className="inline mr-2 text-blue-500" /> },
  { id: 'fast-food', name: 'Fast Food', icon: <FaUtensils className="inline mr-2 text-red-500" /> },
  { id: 'tatli-pastane', name: 'Tatlı & Pastane', icon: <FaUtensils className="inline mr-2 text-pink-500" /> },
]

export default function YemekIcecekPage() {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<string | null>(null)
  const [cuisine, setCuisine] = useState<string | null>(null)
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

  // Filtreleme ve sıralama
  const filteredListings = foodListings
    .filter(listing => {
      if (showPremiumOnly && !listing.isPremium) return false
      if (selectedSubcategory && listing.subcategory !== selectedSubcategory) return false
      if (cuisine && listing.cuisine !== cuisine) return false
      if (priceRange) {
        const price = parseInt(listing.price)
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
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'price-low':
          return parseInt(a.price) - parseInt(b.price)
        case 'price-high':
          return parseInt(b.price) - parseInt(a.price)
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
                <span className="text-sm">Sadece Premium İlanlar</span>
              </label>
            </div>

            {/* Alt Kategoriler */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Kategori</h3>
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

            {/* Mutfak Türü Filtresi */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Mutfak Türü</h3>
              <div className="space-y-2">
                {['Türk Mutfağı', 'İtalyan Mutfağı', 'Japon Mutfağı', 'Kahve', 'İçecek', 'Fast Food', 'Tatlı', 'Sağlıklı İçecek'].map(cuisineType => (
                  <label key={cuisineType} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={cuisine === cuisineType}
                      onChange={() => setCuisine(cuisine === cuisineType ? null : cuisineType)}
                    />
                    <span>{cuisineType}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Fiyat Aralığı Filtresi */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Fiyat Aralığı</h3>
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
                {filteredListings.length} ilan bulundu
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
                <div className="relative h-48">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Premium Rozetleri */}
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
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

                  {/* Görüntülenme Sayısı */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                    {listing.views} görüntülenme
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">{listing.title}</h3>
                  <p className="text-xl font-bold text-alo-orange mb-2">
                    {parseInt(listing.price).toLocaleString('tr-TR')} ₺
                  </p>
                  
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <div className="flex items-center">
                      <span className="text-sm">{listing.location}</span>
                    </div>
                    <div className="flex items-center">
                      <FaStar className="w-3 h-3 text-yellow-500 mr-1" />
                      <span className="text-xs">{listing.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-500 mb-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded mr-2">{listing.cuisine}</span>
                    <span className="text-xs">
                      {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>

                  {/* Teslimat Bilgileri */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {listing.delivery && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Teslimat
                      </span>
                    )}
                    {listing.takeaway && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Paket Servis
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
                </div>
              </div>
            ))}
          </div>

          {/* Sonuç Bulunamadı */}
          {filteredListings.length === 0 && (
            <div className="text-center py-12">
              <FaUtensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                İlan Bulunamadı
              </h3>
              <p className="text-gray-600 mb-4">
                Seçtiğiniz kriterlere uygun ilan bulunamadı. Lütfen filtreleri değiştirerek tekrar deneyin.
              </p>
              <button
                onClick={() => {
                  setSelectedSubcategory(null)
                  setPriceRange(null)
                  setCuisine(null)
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