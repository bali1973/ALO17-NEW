'use client'

import { FaTools, FaCar, FaHome, FaGraduationCap, FaHeartbeat, FaPalette, FaLaptop, FaHandshake, FaWrench, FaShieldAlt, FaLeaf, FaCamera, FaMusic, FaUtensils, FaPlane, FaTruck, FaCalculator, FaUserTie, FaDesktop, FaUsers, FaGlobeAmericas, FaSearch, FaFilter, FaSort } from 'react-icons/fa'
import Link from 'next/link'
import { useState } from 'react'
import { Sparkles, Star, Clock, TrendingUp } from 'lucide-react'

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

// Boş array - artık veritabanından gelecek
const serviceListings: any[] = []

export default function HizmetlerKategoriPage() {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<string | null>(null)
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

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

  // Filtreleme ve sıralama
  const filteredListings = serviceListings
    .filter(listing => {
      if (selectedSubcategory && listing.subcategory !== selectedSubcategory) return false
      if (showPremiumOnly && !listing.isPremium) return false
      if (priceRange) {
        const price = parseInt(listing.price)
        switch (priceRange) {
          case '0-100':
            if (price > 100) return false
            break
          case '100-500':
            if (price < 100 || price > 500) return false
            break
          case '500-1000':
            if (price < 500 || price > 1000) return false
            break
          case '1000+':
            if (price < 1000) return false
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
        <h1 className="text-3xl font-bold text-gray-900">Hizmetler</h1>
        <p className="text-gray-600 mt-2">
          Profesyonel hizmetler, teknik destek, danışmanlık ve daha fazlası. İhtiyacınız olan hizmeti bulun.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sol Sidebar - Filtreler */}
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

          {/* Premium Filtresi */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h2 className="text-lg font-semibold mb-4">Premium</h2>
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
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h2 className="text-lg font-semibold mb-4">Alt Kategoriler</h2>
            <div className="space-y-2">
              {filteredSubcategories.map(subcategory => (
                <button
                  key={subcategory.id}
                  onClick={() => setSelectedSubcategory(selectedSubcategory === subcategory.id ? null : subcategory.id)}
                  className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors ${selectedSubcategory === subcategory.id ? 'bg-gray-100 font-medium' : ''}`}
                >
                  {subcategory.icon}{subcategory.name}
                </button>
              ))}
            </div>
          </div>

          {/* Fiyat Aralığı Filtresi */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Fiyat Aralığı</h2>
            <div className="space-y-2">
              {[
                { value: '0-100', label: '0 - 100 TL' },
                { value: '100-500', label: '100 - 500 TL' },
                { value: '500-1000', label: '500 - 1.000 TL' },
                { value: '1000+', label: '1.000 TL ve üzeri' }
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

        {/* Ana İçerik */}
        <div className="flex-1 space-y-8">
          {/* Sıralama ve Sonuç Sayısı */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                {filteredListings.length} hizmet ilanı bulundu
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
                    <span className="text-xs">
                      {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{listing.description}</p>

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
              <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Hizmet İlanı Bulunamadı
              </h3>
              <p className="text-gray-600 mb-4">
                Seçtiğiniz kriterlere uygun hizmet ilanı bulunamadı. Lütfen filtreleri değiştirerek tekrar deneyin.
              </p>
              <button
                onClick={() => {
                  setSelectedSubcategory(null)
                  setSelectedType(null)
                  setPriceRange(null)
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