'use client'

import { FaBriefcase, FaUserTie, FaGraduationCap, FaClock, FaLaptop, FaUsers, FaChartLine, FaCogs, FaCalculator, FaUserFriends, FaDesktop, FaHeadset, FaIndustry, FaTruck, FaChalkboardTeacher, FaHeartbeat, FaSearch, FaUserPlus, FaUserCheck, FaUserGraduate, FaUserCog, FaUserShield, FaUserEdit, FaUserClock, FaUserTie as FaUserTieAlt, FaMapMarkerAlt, FaMoneyBillWave, FaStar } from 'react-icons/fa'
import Link from 'next/link'
import { useState } from 'react'
import { Star, Clock, TrendingUp } from 'lucide-react'
import { useCategories } from '@/lib/useCategories'

// Boş iş ilanları listesi
const jobListings: any[] = []

export default function IsKategoriPage() {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

  // Ana kategori olarak 'is' veya 'is-kariyer' slug'ını bul
  const mainCategory = categories.find(cat => cat.slug === 'is' || cat.slug === 'is-kariyer');
  const subcategories = mainCategory?.subCategories || [];

  // Eğer alt kategorilerde type varsa, filtrele (yoksa hepsini göster)
  const filteredSubcategories = selectedType 
    ? subcategories.filter((cat: any) => cat.type === selectedType)
    : subcategories

  // İlanları filtrele ve sırala (örnek, gerçek ilanlar için API'den çekilebilir)
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

  const getPremiumFeatureIcon = (feature: any) => {
    switch (feature) {
      case 'featured':
        return <Star className="w-3 h-3 text-yellow-500" />
      case 'urgent':
        return <Clock className="w-3 h-3 text-red-500" />
      case 'highlighted':
        return <Star className="w-3 h-3 text-blue-500" />
      case 'top':
        return <TrendingUp className="w-3 h-3 text-green-500" />
      default:
        return null
    }
  }

  const getPremiumFeatureText = (feature: any) => {
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

  if (categoriesLoading) return <div>Kategoriler yükleniyor...</div>;
  if (categoriesError) return <div>{categoriesError}</div>;

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
                <Star className="w-4 h-4 text-yellow-500" />
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
                {filteredSubcategories.map((subcategory: any) => (
                  <Link
                    key={subcategory.id}
                    href={`/kategori/is/${subcategory.slug}`}
                    className={`block px-3 py-2 rounded-md hover:bg-gray-50 transition-colors ${selectedSubcategory === subcategory.slug ? 'bg-gray-100 font-medium' : ''}`}
                    onClick={() => setSelectedSubcategory(subcategory.slug)}
                  >
                    {subcategory.name}
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
            {filteredListings.map((listing: any, index: number) => (
              <div
                key={listing.id || index}
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
                              <Star className="w-3 h-3 mr-1" />
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