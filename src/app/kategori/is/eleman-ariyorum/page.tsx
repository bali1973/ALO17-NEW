'use client'

import { FaUserPlus, FaBriefcase, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaBuilding, FaUsers, FaStar, FaCheckCircle } from 'react-icons/fa'
import { useState } from 'react'
import { Sparkles, Star, Clock, TrendingUp } from 'lucide-react'

// Eleman arama ilanları
const elemanIlanlari = [
  {
    id: 1,
    title: 'Satış Temsilcisi Aranıyor',
    company: 'ABC Şirketi',
    location: 'İstanbul',
    salary: '8.000 - 12.000',
    type: 'Tam Zamanlı',
    experience: '2-5 yıl',
    education: 'Lise',
    description: 'Dinamik, girişken satış temsilcisi arıyoruz. Müşteri ilişkileri konusunda deneyimli olması tercih edilir.',
    createdAt: '2024-03-20',
    isPremium: true,
    premiumFeatures: ['featured', 'urgent'],
    views: 245,
    isUrgent: true,
    isFeatured: true,
    requirements: ['Satış deneyimi', 'İyi iletişim becerisi', 'B sınıfı ehliyet'],
    benefits: ['SSK + Özel Sağlık Sigortası', 'Yol + Yemek', 'Performans primi']
  },
  {
    id: 2,
    title: 'Muhasebe Uzmanı',
    company: 'XYZ Ltd. Şti.',
    location: 'Ankara',
    salary: '12.000 - 18.000',
    type: 'Tam Zamanlı',
    experience: '3-7 yıl',
    education: 'Üniversite',
    description: 'Muhasebe ve finans konularında uzman, ekip çalışmasına yatkın personel arıyoruz.',
    createdAt: '2024-03-19',
    isPremium: false,
    premiumFeatures: [],
    views: 89,
    isUrgent: false,
    isFeatured: false,
    requirements: ['Muhasebe lisansı', 'Bilgisayar kullanımı', 'Analitik düşünme'],
    benefits: ['SSK', 'Yemek', 'Yıllık izin']
  },
  {
    id: 3,
    title: 'Teknik Servis Elemanı',
    company: 'Teknoloji A.Ş.',
    location: 'İzmir',
    salary: '6.000 - 9.000',
    type: 'Tam Zamanlı',
    experience: '1-3 yıl',
    education: 'Meslek Lisesi',
    description: 'Elektronik cihazların tamir ve bakımı konusunda deneyimli teknik servis elemanı arıyoruz.',
    createdAt: '2024-03-18',
    isPremium: true,
    premiumFeatures: ['featured', 'highlighted'],
    views: 156,
    isUrgent: false,
    isFeatured: true,
    requirements: ['Elektronik bilgisi', 'Teknik servis deneyimi', 'Dikkatli çalışma'],
    benefits: ['SSK', 'Yol', 'Hafta sonu izni']
  },
  {
    id: 4,
    title: 'Güvenlik Görevlisi',
    company: 'Güvenlik Hizmetleri',
    location: 'Bursa',
    salary: '5.500 - 7.500',
    type: 'Tam Zamanlı',
    experience: 'Deneyim şart değil',
    education: 'Lise',
    description: 'Güvenlik görevlisi arıyoruz. 8 saat vardiyalı çalışma sistemi.',
    createdAt: '2024-03-17',
    isPremium: true,
    premiumFeatures: ['urgent', 'top'],
    views: 312,
    isUrgent: true,
    isFeatured: false,
    requirements: ['Güvenlik belgesi', 'Askerlik görevini tamamlamış', 'Temiz sicil'],
    benefits: ['SSK', 'Vardiya primi', 'Yemek']
  },
  {
    id: 5,
    title: 'Web Geliştirici',
    company: 'Dijital Ajans',
    location: 'Antalya',
    salary: '15.000 - 25.000',
    type: 'Freelance',
    experience: '2-5 yıl',
    education: 'Üniversite',
    description: 'React, Node.js konularında deneyimli web geliştirici arıyoruz. Uzaktan çalışma imkanı.',
    createdAt: '2024-03-16',
    isPremium: false,
    premiumFeatures: [],
    views: 67,
    isUrgent: false,
    isFeatured: false,
    requirements: ['React/Node.js deneyimi', 'Git kullanımı', 'İngilizce'],
    benefits: ['Esnek çalışma', 'Proje bazlı ödeme', 'Uzaktan çalışma']
  },
  {
    id: 6,
    title: 'Öğretmen (Matematik)',
    company: 'Eğitim Merkezi',
    location: 'Çanakkale',
    salary: '10.000 - 15.000',
    type: 'Yarı Zamanlı',
    experience: '1-3 yıl',
    education: 'Üniversite',
    description: 'Matematik öğretmeni arıyoruz. Hafta sonu çalışma imkanı.',
    createdAt: '2024-03-15',
    isPremium: true,
    premiumFeatures: ['featured', 'urgent', 'top'],
    views: 423,
    isUrgent: true,
    isFeatured: true,
    requirements: ['Matematik bölümü mezunu', 'Öğretmenlik deneyimi', 'İletişim becerisi'],
    benefits: ['SSK', 'Hafta sonu çalışma', 'Performans primi']
  }
]

export default function ElemanAriyorumPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

  // Filtreleme ve sıralama
  const filteredIlanlar = elemanIlanlari
    .filter(ilan => {
      if (showPremiumOnly && !ilan.isPremium) return false
      if (selectedType && ilan.type !== selectedType) return false
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

  const workTypes = ['Tam Zamanlı', 'Yarı Zamanlı', 'Freelance', 'Staj', 'Geçici İş']
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
        <h1 className="text-3xl font-bold text-gray-900">Eleman Arıyorum</h1>
        <p className="text-gray-600 mt-2">
          Şirketlerin aradığı elemanlar ve iş fırsatları. Uygun pozisyonu bulun ve başvurun.
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

            {/* Çalışma Türü */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Çalışma Türü</h3>
              <div className="space-y-2">
                {workTypes.map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedType === type}
                      onChange={() => setSelectedType(selectedType === type ? null : type)}
                    />
                    <span>{type}</span>
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
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="flex-1 space-y-8">
          {/* Sıralama ve Sonuç Sayısı */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                {filteredIlanlar.length} ilan bulundu
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
                          <span>{ilan.type}</span>
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
                          <FaStar className="w-4 h-4 mr-1" />
                          <span>{ilan.education}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{ilan.description}</p>

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
              <FaUserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                İlan Bulunamadı
              </h3>
              <p className="text-gray-600 mb-4">
                Seçtiğiniz kriterlere uygun ilan bulunamadı. Lütfen filtreleri değiştirerek tekrar deneyin.
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