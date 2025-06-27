'use client'

import { FaClock, FaBriefcase, FaMapMarkerAlt, FaMoneyBillWave, FaBuilding, FaUsers, FaStar, FaCheckCircle, FaGraduationCap } from 'react-icons/fa'
import { useState } from 'react'
import { Sparkles, Star, Clock, TrendingUp } from 'lucide-react'

// Yarı zamanlı iş ilanları
const yariZamanliIlanlar = [
  {
    id: 1,
    title: 'Kasiyer (Yarı Zamanlı)',
    company: 'Market Zinciri',
    location: 'İstanbul',
    salary: '4.500 - 6.000',
    type: 'Yarı Zamanlı',
    experience: 'Deneyim şart değil',
    education: 'Lise',
    description: 'Hafta sonu ve akşam vardiyalarında çalışacak kasiyer arıyoruz. Esnek çalışma saatleri.',
    createdAt: '2024-03-20',
    isPremium: true,
    premiumFeatures: ['featured', 'urgent'],
    views: 189,
    isUrgent: true,
    isFeatured: true,
    requirements: ['Dikkatli çalışma', 'Müşteri odaklı yaklaşım', 'Hızlı öğrenme'],
    benefits: ['SSK', 'Yemek', 'Esnek saatler'],
    workHours: 'Hafta sonu + 3 akşam'
  },
  {
    id: 2,
    title: 'Öğretmen (Matematik)',
    company: 'Eğitim Merkezi',
    location: 'Ankara',
    salary: '8.000 - 12.000',
    type: 'Yarı Zamanlı',
    experience: '1-3 yıl',
    education: 'Üniversite',
    description: 'Hafta sonu matematik dersleri verecek öğretmen arıyoruz. Lise öğrencilerine yönelik.',
    createdAt: '2024-03-19',
    isPremium: false,
    premiumFeatures: [],
    views: 67,
    isUrgent: false,
    isFeatured: false,
    requirements: ['Matematik bölümü mezunu', 'Öğretmenlik deneyimi', 'İletişim becerisi'],
    benefits: ['SSK', 'Hafta sonu çalışma', 'Performans primi'],
    workHours: 'Hafta sonu 09:00-17:00'
  },
  {
    id: 3,
    title: 'Garson (Part-Time)',
    company: 'Restoran',
    location: 'İzmir',
    salary: '3.500 - 5.000',
    type: 'Yarı Zamanlı',
    experience: 'Deneyim şart değil',
    education: 'Lise',
    description: 'Akşam vardiyalarında çalışacak garson arıyoruz. Müşteri hizmetleri konusunda istekli olması gerekir.',
    createdAt: '2024-03-18',
    isPremium: true,
    premiumFeatures: ['featured', 'highlighted'],
    views: 134,
    isUrgent: false,
    isFeatured: true,
    requirements: ['Temiz ve düzenli', 'Hızlı hareket', 'Güleryüzlü'],
    benefits: ['SSK', 'Yemek', 'Bahşiş'],
    workHours: 'Akşam 18:00-24:00'
  },
  {
    id: 4,
    title: 'Çağrı Merkezi Temsilcisi',
    company: 'Müşteri Hizmetleri',
    location: 'Bursa',
    salary: '5.000 - 7.000',
    type: 'Yarı Zamanlı',
    experience: 'Deneyim şart değil',
    education: 'Lise',
    description: 'Evden çalışma imkanı olan çağrı merkezi temsilcisi arıyoruz. Bilgisayar kullanımı şart.',
    createdAt: '2024-03-17',
    isPremium: true,
    premiumFeatures: ['urgent', 'top'],
    views: 298,
    isUrgent: true,
    isFeatured: false,
    requirements: ['Bilgisayar kullanımı', 'İyi diksiyon', 'Sabırlı olma'],
    benefits: ['SSK', 'Evden çalışma', 'Esnek saatler'],
    workHours: 'Günlük 4-6 saat'
  },
  {
    id: 5,
    title: 'Sosyal Medya Yöneticisi',
    company: 'Dijital Ajans',
    location: 'Antalya',
    salary: '6.000 - 10.000',
    type: 'Yarı Zamanlı',
    experience: '1-2 yıl',
    education: 'Üniversite',
    description: 'Sosyal medya hesaplarını yönetecek, içerik üretecek kişi arıyoruz. Uzaktan çalışma imkanı.',
    createdAt: '2024-03-16',
    isPremium: false,
    premiumFeatures: [],
    views: 89,
    isUrgent: false,
    isFeatured: false,
    requirements: ['Sosyal medya deneyimi', 'İçerik üretme', 'Yaratıcılık'],
    benefits: ['Esnek çalışma', 'Uzaktan çalışma', 'Proje bazlı'],
    workHours: 'Günlük 3-4 saat'
  },
  {
    id: 6,
    title: 'Temizlik Görevlisi',
    company: 'Temizlik Şirketi',
    location: 'Çanakkale',
    salary: '4.000 - 5.500',
    type: 'Yarı Zamanlı',
    experience: 'Deneyim şart değil',
    education: 'İlkokul',
    description: 'Ofis temizliği yapacak personel arıyoruz. Sabah veya akşam vardiyası seçeneği.',
    createdAt: '2024-03-15',
    isPremium: true,
    premiumFeatures: ['featured', 'urgent', 'top'],
    views: 156,
    isUrgent: true,
    isFeatured: true,
    requirements: ['Temizlik konusunda titiz', 'Düzenli çalışma', 'Güvenilir'],
    benefits: ['SSK', 'Yol', 'Esnek saatler'],
    workHours: 'Günlük 3-4 saat'
  }
]

export default function YariZamanliPage() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

  // Filtreleme ve sıralama
  const filteredIlanlar = yariZamanliIlanlar
    .filter(ilan => {
      if (showPremiumOnly && !ilan.isPremium) return false
      if (selectedLocation && ilan.location !== selectedLocation) return false
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Yarı Zamanlı İşler</h1>
        <p className="text-gray-600 mt-2">
          Esnek çalışma saatleri ile yarı zamanlı iş fırsatları. Öğrenciler ve ek gelir arayanlar için ideal.
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

            {/* Yarı Zamanlı Avantajları */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">Yarı Zamanlı Avantajları</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Esnek çalışma saatleri</li>
                <li>• Öğrenciler için ideal</li>
                <li>• Ek gelir imkanı</li>
                <li>• Deneyim kazanma</li>
                <li>• Sosyal güvence</li>
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
                {filteredIlanlar.length} yarı zamanlı iş ilanı bulundu
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
                <option value="salary-high">Maaş (Yüksekten Düşüğe)</option>
                <option value="salary-low">Maaş (Düşükten Yükseğe)</option>
                <option value="premium-first">Premium Önce</option>
              </select>
            </div>
          </div>

          {/* İlanlar */}
          <div className="space-y-6">
            {filteredIlanlar.map((ilan) => (
              <div
                key={ilan.id}
                className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 ${
                  ilan.isPremium ? 'ring-2 ring-yellow-200 hover:ring-yellow-300' : ''
                } ${ilan.isUrgent ? 'border-l-4 border-red-500' : ''}`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{ilan.title}</h3>
                        <div className="flex flex-wrap gap-1">
                          {ilan.isPremium && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Premium
                            </span>
                          )}
                          {ilan.isUrgent && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Acil
                            </span>
                          )}
                          {ilan.isFeatured && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <Star className="w-3 h-3 mr-1" />
                              Öne Çıkan
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-gray-600 mb-3">
                        <div className="flex items-center">
                          <FaBuilding className="w-4 h-4 mr-1" />
                          <span>{ilan.company}</span>
                        </div>
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                          <span>{ilan.location}</span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="w-4 h-4 mr-1" />
                          <span className="text-green-600 font-medium">{ilan.type}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-gray-600 mb-3">
                        <div className="flex items-center">
                          <FaMoneyBillWave className="w-4 h-4 mr-1" />
                          <span className="font-semibold text-alo-orange">{ilan.salary} ₺</span>
                        </div>
                        <div className="flex items-center">
                          <FaUsers className="w-4 h-4 mr-1" />
                          <span>{ilan.experience}</span>
                        </div>
                        <div className="flex items-center">
                          <FaGraduationCap className="w-4 h-4 mr-1" />
                          <span>{ilan.education}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{ilan.description}</p>

                      {/* Çalışma Saatleri */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Çalışma Saatleri:</h4>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          <FaClock className="w-4 h-4 mr-1" />
                          {ilan.workHours}
                        </span>
                      </div>

                      {/* Gereksinimler */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Gereksinimler:</h4>
                        <div className="flex flex-wrap gap-2">
                          {ilan.requirements.map((req, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              <FaCheckCircle className="w-3 h-3 mr-1 text-green-500" />
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Faydalar */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Sosyal Haklar:</h4>
                        <div className="flex flex-wrap gap-2">
                          {ilan.benefits.map((benefit, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Premium Özellikler */}
                      {ilan.premiumFeatures.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {ilan.premiumFeatures.map((feature, index) => (
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
                      <div>{ilan.views} görüntülenme</div>
                      <div>{new Date(ilan.createdAt).toLocaleDateString('tr-TR')}</div>
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
          {filteredIlanlar.length === 0 && (
            <div className="text-center py-12">
              <FaClock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                İlan Bulunamadı
              </h3>
              <p className="text-gray-600 mb-4">
                Seçtiğiniz kriterlere uygun yarı zamanlı iş ilanı bulunamadı. Lütfen filtreleri değiştirerek tekrar deneyin.
              </p>
              <button
                onClick={() => {
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