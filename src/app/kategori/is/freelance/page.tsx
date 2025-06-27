'use client'

import { FaLaptop, FaCode, FaPen, FaCamera, FaPalette, FaGlobe, FaMoneyBillWave, FaClock, FaStar, FaCheckCircle } from 'react-icons/fa'
import { useState } from 'react'
import { Sparkles, Star, Clock, TrendingUp } from 'lucide-react'

// Freelance projeleri
const freelanceProjeleri = [
  {
    id: 1,
    title: 'Web Sitesi Tasarımı ve Geliştirme',
    client: 'E-ticaret Şirketi',
    budget: '15.000 - 25.000',
    type: 'Web Geliştirme',
    duration: '2-4 hafta',
    skills: ['React', 'Node.js', 'MongoDB'],
    description: 'E-ticaret web sitesi tasarımı ve geliştirmesi. Responsive tasarım, ödeme sistemi entegrasyonu gerekli.',
    createdAt: '2024-03-20',
    isPremium: true,
    premiumFeatures: ['featured', 'urgent'],
    views: 234,
    isUrgent: true,
    isFeatured: true,
    requirements: ['React/Node.js deneyimi', 'E-ticaret projeleri', 'API entegrasyonu'],
    benefits: ['Uzaktan çalışma', 'Esnek saatler', 'Proje bazlı ödeme']
  },
  {
    id: 2,
    title: 'Logo ve Kurumsal Kimlik Tasarımı',
    client: 'Startup Şirketi',
    budget: '3.000 - 8.000',
    type: 'Grafik Tasarım',
    duration: '1-2 hafta',
    skills: ['Adobe Illustrator', 'Photoshop', 'Logo Tasarımı'],
    description: 'Yeni kurulan teknoloji şirketi için logo ve kurumsal kimlik tasarımı. Modern ve minimalist yaklaşım.',
    createdAt: '2024-03-19',
    isPremium: false,
    premiumFeatures: [],
    views: 89,
    isUrgent: false,
    isFeatured: false,
    requirements: ['Logo tasarım deneyimi', 'Adobe Creative Suite', 'Kurumsal kimlik'],
    benefits: ['Yaratıcı özgürlük', 'Portfolio için', 'Tek seferlik ödeme']
  },
  {
    id: 3,
    title: 'İçerik Yazarlığı - Blog Yazıları',
    client: 'Dijital Pazarlama Ajansı',
    budget: '500 - 1.500',
    type: 'İçerik Yazarlığı',
    duration: 'Sürekli',
    skills: ['SEO', 'Blog Yazarlığı', 'Türkçe'],
    description: 'Teknoloji ve dijital pazarlama konularında blog yazıları. Haftalık 3-5 yazı.',
    createdAt: '2024-03-18',
    isPremium: true,
    premiumFeatures: ['featured', 'highlighted'],
    views: 156,
    isUrgent: false,
    isFeatured: true,
    requirements: ['SEO bilgisi', 'Teknoloji konuları', 'Türkçe yazım'],
    benefits: ['Sürekli iş', 'Uzaktan çalışma', 'Yazı başına ödeme']
  },
  {
    id: 4,
    title: 'Mobil Uygulama Geliştirme',
    client: 'Sağlık Teknolojileri',
    budget: '25.000 - 40.000',
    type: 'Mobil Geliştirme',
    duration: '3-6 ay',
    skills: ['React Native', 'Firebase', 'API'],
    description: 'Sağlık takip uygulaması geliştirme. iOS ve Android platformları için.',
    createdAt: '2024-03-17',
    isPremium: true,
    premiumFeatures: ['urgent', 'top'],
    views: 312,
    isUrgent: true,
    isFeatured: false,
    requirements: ['React Native deneyimi', 'Mobil uygulama', 'Sağlık sektörü'],
    benefits: ['Uzun vadeli proje', 'Yüksek bütçe', 'Teknoloji deneyimi']
  },
  {
    id: 5,
    title: 'Sosyal Medya Yönetimi',
    client: 'Restoran Zinciri',
    budget: '2.000 - 4.000',
    type: 'Sosyal Medya',
    duration: 'Aylık',
    skills: ['Instagram', 'Facebook', 'İçerik Üretimi'],
    description: 'Restoran zincirinin sosyal medya hesaplarının yönetimi. Günlük içerik üretimi ve etkileşim.',
    createdAt: '2024-03-16',
    isPremium: false,
    premiumFeatures: [],
    views: 67,
    isUrgent: false,
    isFeatured: false,
    requirements: ['Sosyal medya deneyimi', 'İçerik üretimi', 'Restoran sektörü'],
    benefits: ['Aylık sözleşme', 'Yaratıcı içerik', 'Düzenli gelir']
  },
  {
    id: 6,
    title: 'Çeviri Projesi - Teknik Dokümanlar',
    client: 'Yazılım Şirketi',
    budget: '1.500 - 3.000',
    type: 'Çeviri',
    duration: '2-3 hafta',
    skills: ['İngilizce', 'Teknik Çeviri', 'Yazılım'],
    description: 'Teknik dokümanların İngilizce\'den Türkçe\'ye çevirisi. API dokümantasyonu ve kullanıcı kılavuzları.',
    createdAt: '2024-03-15',
    isPremium: true,
    premiumFeatures: ['featured', 'urgent', 'top'],
    views: 423,
    isUrgent: true,
    isFeatured: true,
    requirements: ['İngilizce-Türkçe çeviri', 'Teknik terimler', 'Yazılım bilgisi'],
    benefits: ['Teknik deneyim', 'Hızlı ödeme', 'Uzaktan çalışma']
  }
]

export default function FreelancePage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null)
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

  // Filtreleme ve sıralama
  const filteredProjeler = freelanceProjeleri
    .filter(proje => {
      if (showPremiumOnly && !proje.isPremium) return false
      if (selectedType && proje.type !== selectedType) return false
      if (selectedBudget) {
        const budget = parseInt(proje.budget.split('-')[1].replace(/[^0-9]/g, ''))
        switch (selectedBudget) {
          case '0-5000':
            if (budget > 5000) return false
            break
          case '5000-15000':
            if (budget < 5000 || budget > 15000) return false
            break
          case '15000-30000':
            if (budget < 15000 || budget > 30000) return false
            break
          case '30000+':
            if (budget < 30000) return false
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
        case 'budget-high':
          return parseInt(b.budget.split('-')[1].replace(/[^0-9]/g, '')) - parseInt(a.budget.split('-')[1].replace(/[^0-9]/g, ''))
        case 'budget-low':
          return parseInt(a.budget.split('-')[0].replace(/[^0-9]/g, '')) - parseInt(b.budget.split('-')[0].replace(/[^0-9]/g, ''))
        case 'premium-first':
          if (a.isPremium && !b.isPremium) return -1
          if (!a.isPremium && b.isPremium) return 1
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

  const projectTypes = ['Web Geliştirme', 'Grafik Tasarım', 'İçerik Yazarlığı', 'Mobil Geliştirme', 'Sosyal Medya', 'Çeviri']
  const budgetRanges = [
    { value: '0-5000', label: '0 - 5.000 TL' },
    { value: '5000-15000', label: '5.000 - 15.000 TL' },
    { value: '15000-30000', label: '15.000 - 30.000 TL' },
    { value: '30000+', label: '30.000 TL ve üzeri' }
  ]

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Web Geliştirme':
        return <FaCode className="w-4 h-4 text-blue-500" />
      case 'Grafik Tasarım':
        return <FaPalette className="w-4 h-4 text-purple-500" />
      case 'İçerik Yazarlığı':
        return <FaPen className="w-4 h-4 text-green-500" />
      case 'Mobil Geliştirme':
        return <FaLaptop className="w-4 h-4 text-indigo-500" />
      case 'Sosyal Medya':
        return <FaGlobe className="w-4 h-4 text-pink-500" />
      case 'Çeviri':
        return <FaStar className="w-4 h-4 text-yellow-500" />
      default:
        return <FaCode className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Freelance Projeler</h1>
        <p className="text-gray-600 mt-2">
          Uzaktan çalışma fırsatları ve freelance projeler. Becerilerinizi kullanarak gelir elde edin.
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
                <span className="text-sm">Sadece Premium Projeler</span>
              </label>
            </div>

            {/* Proje Türü */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Proje Türü</h3>
              <div className="space-y-2">
                {projectTypes.map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedType === type}
                      onChange={() => setSelectedType(selectedType === type ? null : type)}
                    />
                    <span className="flex items-center">
                      {getTypeIcon(type)}
                      <span className="ml-2">{type}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Bütçe Aralığı */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Bütçe Aralığı</h3>
              <div className="space-y-2">
                {budgetRanges.map(range => (
                  <label key={range.value} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedBudget === range.value}
                      onChange={() => setSelectedBudget(selectedBudget === range.value ? null : range.value)}
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Freelance Avantajları */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-800 mb-2">Freelance Avantajları</h3>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Esnek çalışma saatleri</li>
                <li>• Uzaktan çalışma</li>
                <li>• Yüksek kazanç potansiyeli</li>
                <li>• Beceri geliştirme</li>
                <li>• Bağımsız çalışma</li>
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
                {filteredProjeler.length} freelance proje bulundu
                {showPremiumOnly && (
                  <span className="ml-2 text-yellow-600 font-medium">
                    (Premium projeler)
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
                <option value="budget-high">Bütçe (Yüksekten Düşüğe)</option>
                <option value="budget-low">Bütçe (Düşükten Yükseğe)</option>
                <option value="premium-first">Premium Önce</option>
              </select>
            </div>
          </div>

          {/* Projeler */}
          <div className="space-y-6">
            {filteredProjeler.map((proje) => (
              <div
                key={proje.id}
                className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 ${
                  proje.isPremium ? 'ring-2 ring-yellow-200 hover:ring-yellow-300' : ''
                } ${proje.isUrgent ? 'border-l-4 border-red-500' : ''}`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{proje.title}</h3>
                        <div className="flex flex-wrap gap-1">
                          {proje.isPremium && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Premium
                            </span>
                          )}
                          {proje.isUrgent && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Acil
                            </span>
                          )}
                          {proje.isFeatured && (
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
                          <span>{proje.client}</span>
                        </div>
                        <div className="flex items-center">
                          {getTypeIcon(proje.type)}
                          <span className="ml-1">{proje.type}</span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="w-4 h-4 mr-1" />
                          <span>{proje.duration}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-gray-600 mb-3">
                        <div className="flex items-center">
                          <FaMoneyBillWave className="w-4 h-4 mr-1" />
                          <span className="font-semibold text-alo-orange">{proje.budget} ₺</span>
                        </div>
                        <div className="flex items-center">
                          <FaStar className="w-4 h-4 mr-1" />
                          <span>{proje.views} görüntülenme</span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{proje.description}</p>

                      {/* Gerekli Beceriler */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Gerekli Beceriler:</h4>
                        <div className="flex flex-wrap gap-2">
                          {proje.skills.map((skill, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              <FaCheckCircle className="w-3 h-3 mr-1" />
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Gereksinimler */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Gereksinimler:</h4>
                        <div className="flex flex-wrap gap-2">
                          {proje.requirements.map((req, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              <FaCheckCircle className="w-3 h-3 mr-1 text-green-500" />
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Faydalar */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Avantajlar:</h4>
                        <div className="flex flex-wrap gap-2">
                          {proje.benefits.map((benefit, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Premium Özellikler */}
                      {proje.premiumFeatures.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {proje.premiumFeatures.map((feature, index) => (
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
                      <div>{new Date(proje.createdAt).toLocaleDateString('tr-TR')}</div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Detayları Gör
                    </button>
                    <button className="px-4 py-2 bg-alo-orange text-white rounded-lg hover:bg-orange-600 transition-colors">
                      Teklif Ver
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sonuç Bulunamadı */}
          {filteredProjeler.length === 0 && (
            <div className="text-center py-12">
              <FaLaptop className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Proje Bulunamadı
              </h3>
              <p className="text-gray-600 mb-4">
                Seçtiğiniz kriterlere uygun freelance proje bulunamadı. Lütfen filtreleri değiştirerek tekrar deneyin.
              </p>
              <button
                onClick={() => {
                  setSelectedType(null)
                  setSelectedBudget(null)
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