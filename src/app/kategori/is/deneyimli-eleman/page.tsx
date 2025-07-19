'use client'

import { FaUserCheck, FaBriefcase, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaGraduationCap, FaUsers, FaStar, FaCheckCircle, FaAward } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { Sparkles, Star, Clock, TrendingUp } from 'lucide-react'

export default function DeneyimliElemanPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        setListings(data.filter((l: any) => l.category === 'is' && l.type === 'Deneyimli'));
        setLoading(false);
      })
      .catch(() => {
        setError('İlanlar yüklenemedi');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null)
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

  // Filtreleme ve sıralama
  const filteredElemanlar = listings
    .filter(eleman => {
      if (showPremiumOnly && !eleman.isPremium) return false
      if (selectedLocation && eleman.location !== selectedLocation) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'salary-high':
          return parseInt(b.salary.split('-')[1].replace(/[^0-9]/g, '')) - parseInt(a.salary.split('-')[1].replace(/[^0-9]/g, ''))
        case 'salary-low':
          return parseInt(a.salary.split('-')[0].replace(/[^0-9]/g, '')) - parseInt(b.salary.split('-')[0].replace(/[^0-9]/g, ''))
        case 'premium-first':
          if (a.isPremium && !b.isPremium) return -1
          if (!a.isPremium && b.isPremium) return 1
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

  const locations = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya']

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
        <h1 className="text-3xl font-bold text-gray-900">Deneyimli Elemanlar</h1>
        <p className="text-gray-600 mt-2">
          Uzun yıllar deneyimli, uzman elemanların iş arama ilanları. Kaliteli personel bulun.
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
                <span className="text-sm">Sadece Premium Profiller</span>
              </label>
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

            {/* Deneyimli Eleman Avantajları */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">Deneyimli Eleman Avantajları</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Hızlı adaptasyon</li>
                <li>• Problem çözme becerisi</li>
                <li>• Ekip liderliği</li>
                <li>• Sektör bilgisi</li>
                <li>• Güvenilir performans</li>
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
                {filteredElemanlar.length} deneyimli eleman bulundu
                {showPremiumOnly && (
                  <span className="ml-2 text-yellow-600 font-medium">
                    (Premium profiller)
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
                <option value="salary-high">Maaş (Yüksekten Düşüğe)</option>
                <option value="salary-low">Maaş (Düşükten Yükseğe)</option>
                <option value="premium-first">Premium Önce</option>
              </select>
            </div>
          </div>

          {/* Elemanlar */}
          <div className="space-y-6">
            {filteredElemanlar.map((eleman) => (
              <div
                key={eleman.id}
                className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 ${
                  eleman.isPremium ? 'ring-2 ring-yellow-200 hover:ring-yellow-300' : ''
                } ${eleman.isUrgent ? 'border-l-4 border-red-500' : ''}`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{eleman.name}</h3>
                        <div className="flex flex-wrap gap-1">
                          {eleman.isPremium && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Premium
                            </span>
                          )}
                          {eleman.isUrgent && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Acil
                            </span>
                          )}
                          {eleman.isFeatured && (
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
                          <span className="font-medium">{eleman.title}</span>
                        </div>
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                          <span>{eleman.location}</span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="w-4 h-4 mr-1" />
                          <span className="text-green-600 font-medium">{eleman.type}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-gray-600 mb-3">
                        <div className="flex items-center">
                          <FaMoneyBillWave className="w-4 h-4 mr-1" />
                          <span className="font-semibold text-alo-orange">{eleman.salary} ₺</span>
                        </div>
                        <div className="flex items-center">
                          <FaAward className="w-4 h-4 mr-1" />
                          <span className="text-blue-600 font-medium">{eleman.experience}</span>
                        </div>
                        <div className="flex items-center">
                          <FaGraduationCap className="w-4 h-4 mr-1" />
                          <span>{eleman.education}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{eleman.description}</p>

                      {/* Beceriler */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Beceriler:</h4>
                        <div className="flex flex-wrap gap-2">
                          {eleman.skills.map((skill, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              <FaCheckCircle className="w-3 h-3 mr-1" />
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Başarılar */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Başarılar:</h4>
                        <div className="flex flex-wrap gap-2">
                          {eleman.achievements.map((achievement, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <FaAward className="w-3 h-3 mr-1" />
                              {achievement}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Dil Bilgisi */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Dil Bilgisi:</h4>
                        <div className="flex flex-wrap gap-2">
                          {eleman.languages.map((language, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              {language}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Müsaitlik */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Müsaitlik:</h4>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                          <FaClock className="w-4 h-4 mr-1" />
                          {eleman.availability}
                        </span>
                      </div>

                      {/* Premium Özellikler */}
                      {eleman.premiumFeatures.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {eleman.premiumFeatures.map((feature, index) => (
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
                      <div>{eleman.views} görüntülenme</div>
                      <div>{new Date(eleman.createdAt).toLocaleDateString('tr-TR')}</div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Profili Gör
                    </button>
                    <button className="px-4 py-2 bg-alo-orange text-white rounded-lg hover:bg-orange-600 transition-colors">
                      İletişime Geç
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sonuç Bulunamadı */}
          {filteredElemanlar.length === 0 && (
            <div className="text-center py-12">
              <FaUserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Eleman Bulunamadı
              </h3>
              <p className="text-gray-600 mb-4">
                Seçtiğiniz kriterlere uygun deneyimli eleman bulunamadı. Lütfen filtreleri değiştirerek tekrar deneyin.
              </p>
              <button
                onClick={() => {
                  setSelectedLocation(null)
                  setSelectedExperience(null)
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