'use client'

import { FaMobile, FaTabletAlt, FaHeadphones } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { Sparkles, Star, Clock, TrendingUp } from 'lucide-react'
import { listings } from '@/lib/listings'
import { ListingCard } from '@/components/listing-card'

// Örnek telefon ilanları listesi
const phoneListings: any[] = [
  {
    id: '1',
    title: 'iPhone 13 Pro Max 256GB',
    price: '32000',
    image: 'https://dummyimage.com/400x300/cccccc/000000&text=iPhone+13+Pro+Max',
    location: 'İstanbul, Kadıköy',
    createdAt: '2024-06-10T12:00:00Z',
    isPremium: true,
    isUrgent: false,
    isFeatured: true,
    condition: 'Yeni',
    views: 123,
    premiumFeatures: ['featured', 'highlighted'],
    subcategory: 'akilli-telefon',
  },
  {
    id: '2',
    title: 'Samsung Galaxy S22 Ultra',
    price: '28000',
    image: 'https://dummyimage.com/400x300/cccccc/000000&text=Galaxy+S22+Ultra',
    location: 'Ankara, Çankaya',
    createdAt: '2024-06-12T09:30:00Z',
    isPremium: false,
    isUrgent: true,
    isFeatured: false,
    condition: 'İkinci El',
    views: 87,
    premiumFeatures: ['urgent'],
    subcategory: 'akilli-telefon',
  },
  {
    id: '3',
    title: 'iPad Pro 11" 2022',
    price: '25000',
    image: 'https://dummyimage.com/400x300/cccccc/000000&text=iPad+Pro+11',
    location: 'İzmir, Bornova',
    createdAt: '2024-06-15T15:45:00Z',
    isPremium: true,
    isUrgent: false,
    isFeatured: false,
    condition: 'Yeni',
    views: 45,
    premiumFeatures: ['top'],
    subcategory: 'tablet',
  },
  {
    id: '4',
    title: 'Xiaomi Redmi Note 12',
    price: '9000',
    image: 'https://dummyimage.com/400x300/cccccc/000000&text=Redmi+Note+12',
    location: 'Bursa, Nilüfer',
    createdAt: '2024-06-14T18:20:00Z',
    isPremium: false,
    isUrgent: false,
    isFeatured: false,
    condition: 'İkinci El',
    views: 62,
    premiumFeatures: [],
    subcategory: 'akilli-telefon',
  },
  {
    id: '5',
    title: 'AirPods Pro 2. Nesil',
    price: '6000',
    image: 'https://dummyimage.com/400x300/cccccc/000000&text=AirPods+Pro+2',
    location: 'Antalya, Muratpaşa',
    createdAt: '2024-06-13T11:10:00Z',
    isPremium: false,
    isUrgent: false,
    isFeatured: false,
    condition: 'Yeni',
    views: 30,
    premiumFeatures: [],
    subcategory: 'aksesuar',
  },
]

export default function TelefonCategoryPage() {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<string | null>(null)
  const [condition, setCondition] = useState<string | null>(null)
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [search, setSearch] = useState("")
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [loadingSubcategories, setLoadingSubcategories] = useState(false)
  const [subcategoryError, setSubcategoryError] = useState("")

  useEffect(() => {
    async function fetchSubcategories() {
      setLoadingSubcategories(true)
      setSubcategoryError("")
      try {
        const res = await fetch('/categories.json')
        const data = await res.json()
        // Elektronik kategorisini bul
        const elektronik = data.find((cat: any) => cat.slug === 'elektronik')
        setSubcategories(elektronik?.subCategories || [])
        console.log('API /categories.json yanıtı:', data)
        console.log('Elektronik alt kategoriler:', elektronik?.subCategories)
      } catch (err) {
        setSubcategoryError('Alt kategoriler yüklenemedi')
      }
      setLoadingSubcategories(false)
    }
    fetchSubcategories()
  }, [])

  useEffect(() => {
    console.log('subcategories state:', subcategories)
  }, [subcategories])

  // Filtreleme ve sıralama
  const filteredListings = phoneListings
    .filter(listing => {
      if (showPremiumOnly && !listing.isPremium) return false
      if (condition && listing.condition !== condition) return false
      if (selectedSubcategory && listing.subcategory !== selectedSubcategory) return false
      if (priceRange) {
        const price = parseInt(listing.price.replace(/[^0-9]/g, ''))
        switch (priceRange) {
          case '0-5000':
            if (price > 5000) return false
            break
          case '5000-15000':
            if (price < 5000 || price > 15000) return false
            break
          case '15000-30000':
            if (price < 15000 || price > 30000) return false
            break
          case '30000+':
            if (price < 30000) return false
            break
        }
      }
      if (search && !(
        listing.title.toLowerCase().includes(search.toLowerCase()) ||
        (listing.description && listing.description.toLowerCase().includes(search.toLowerCase()))
      )) {
        return false;
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
          return parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, ''))
        case 'price-high':
          return parseInt(b.price.replace(/[^0-9]/g, '')) - parseInt(a.price.replace(/[^0-9]/g, ''))
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
        <h1 className="text-3xl font-bold text-gray-900">Telefon</h1>
        <p className="text-gray-600 mt-2">
          Akıllı telefonlar, tabletler ve aksesuarlar
        </p>
        <div className="mt-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Başlık veya açıklamada ara..."
            className="border rounded px-3 py-2 w-full max-w-md"
          />
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sol Sidebar - Filtreler */}
        <div className="w-full lg:w-64 flex-shrink-0 order-2 lg:order-1">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4 lg:mb-0">
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
              <h3 className="font-medium mb-2">Tür</h3>
              {loadingSubcategories ? (
                <div>Yükleniyor...</div>
              ) : subcategoryError ? (
                <div className="text-red-500">{subcategoryError}</div>
              ) : (
              <div className="space-y-2">
                {subcategories.map(subcategory => (
                  <label key={subcategory.id} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                        checked={selectedSubcategory === subcategory.slug}
                        onChange={() => setSelectedSubcategory(selectedSubcategory === subcategory.slug ? null : subcategory.slug)}
                    />
                      <span>{subcategory.name}</span>
                  </label>
                ))}
              </div>
              )}
            </div>

            {/* Fiyat Aralığı Filtresi */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Fiyat Aralığı</h3>
              <div className="space-y-2">
                {[
                  { value: '0-5000', label: '0 - 5.000 TL' },
                  { value: '5000-15000', label: '5.000 - 15.000 TL' },
                  { value: '15000-30000', label: '15.000 - 30.000 TL' },
                  { value: '30000+', label: '30.000 TL ve üzeri' }
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

            {/* Durum Filtresi */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Durum</h3>
              <div className="space-y-2">
                {['Yeni', 'İkinci El'].map(status => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={condition === status}
                      onChange={() => setCondition(condition === status ? null : status)}
                    />
                    <span>{status}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="flex-1 space-y-8 order-1 lg:order-2">
          {/* Sıralama ve Sonuç Sayısı */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
                <option value="premium-first">Premium Önce</option>
              </select>
            </div>
          </div>

          {/* İlanlar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
                    <span className="text-xs">
                      {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>

                  {/* Premium Özellikler */}
                  {listing.premiumFeatures.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {listing.premiumFeatures.map((feature: string, index: number) => (
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
              <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
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
                  setCondition(null)
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