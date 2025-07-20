'use client'

import { FaHeadset, FaPhone, FaComments, FaUserTie, FaGraduationCap } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { Sparkles, Star, Clock, TrendingUp, MapPin, Building, DollarSign } from 'lucide-react'

const subcategories = [
  { id: 'musteri-temsilcisi', name: 'Müşteri Temsilcisi', icon: <FaHeadset className="inline mr-2 text-blue-500" /> },
  { id: 'call-center', name: 'Call Center', icon: <FaPhone className="inline mr-2 text-green-500" /> },
  { id: 'chat-destek', name: 'Chat Destek', icon: <FaComments className="inline mr-2 text-purple-500" /> },
  { id: 'musteri-iliskileri', name: 'Müşteri İlişkileri', icon: <FaUserTie className="inline mr-2 text-indigo-500" /> },
]

const FILTER_STORAGE_KEY = 'musteriHizmetleriFilters';

// Türkiye'deki tüm şehirler
const cities = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara", "Antalya", "Ardahan", "Artvin", "Aydın", "Balıkesir", "Bartın", "Batman", "Bayburt", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Iğdır", "Isparta", "İstanbul", "İzmir", "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kırıkkale", "Kırklareli", "Kırşehir", "Kilis", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Osmaniye", "Rize", "Sakarya", "Samsun", "Şanlıurfa", "Siirt", "Sinop", "Şırnak", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak"
];

export default function MusteriHizmetleriPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        setListings(data.filter((l: any) => l.category === 'is' && l.type === 'Müşteri Hizmetleri'));
        setLoading(false);
      })
      .catch(() => {
        setError('İlanlar yüklenemedi');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [salaryRange, setSalaryRange] = useState<string | null>(null)
  const [workType, setWorkType] = useState<string | null>(null)
  const [experience, setExperience] = useState<string | null>(null)
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  // Filtreleri localStorage'dan yükle
  useEffect(() => {
    const saved = localStorage.getItem(FILTER_STORAGE_KEY);
    if (saved) {
      const filters = JSON.parse(saved);
      setSelectedSubcategory(filters.selectedSubcategory ?? null);
      setSalaryRange(filters.salaryRange ?? null);
      setWorkType(filters.workType ?? null);
      setExperience(filters.experience ?? null);
      setShowPremiumOnly(filters.showPremiumOnly ?? false);
      setSortBy(filters.sortBy ?? 'newest');
      setSelectedCity(filters.selectedCity ?? null);
    }
  }, []);

  // Filtreler değiştikçe kaydet
  useEffect(() => {
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify({
      selectedSubcategory,
      salaryRange,
      workType,
      experience,
      showPremiumOnly,
      sortBy,
      selectedCity,
    }));
  }, [selectedSubcategory, salaryRange, workType, experience, showPremiumOnly, sortBy, selectedCity]);

  // Filtreleme ve sıralama
  const filteredListings = listings
    .filter(listing => {
      if (showPremiumOnly && !listing.isPremium) return false
      if (selectedSubcategory && listing.category !== selectedSubcategory) return false
      if (workType && listing.type !== workType) return false
      if (experience && listing.experience !== experience) return false
      if (selectedCity && listing.location !== selectedCity) return false
      if (salaryRange) {
        const salary = parseInt(listing.salary.split('-')[0].replace(/[^0-9]/g, ''))
        switch (salaryRange) {
          case '0-10000':
            if (salary > 10000) return false
            break
          case '10000-20000':
            if (salary < 10000 || salary > 20000) return false
            break
          case '20000-35000':
            if (salary < 20000 || salary > 35000) return false
            break
          case '35000+':
            if (salary < 35000) return false
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
        case 'salary-low':
          return parseInt(a.salary.split('-')[0].replace(/[^0-9]/g, '')) - parseInt(b.salary.split('-')[0].replace(/[^0-9]/g, ''))
        case 'salary-high':
          return parseInt(b.salary.split('-')[0].replace(/[^0-9]/g, '')) - parseInt(a.salary.split('-')[0].replace(/[^0-9]/g, ''))
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
        <h1 className="text-3xl font-bold text-gray-900">Müşteri Hizmetleri</h1>
        <p className="text-gray-600 mt-2">
          Müşteri hizmetleri pozisyonları. Müşteri odaklı çalışma fırsatları.
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
              <h3 className="font-medium mb-2">Pozisyon Türü</h3>
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

            {/* Çalışma Türü Filtresi */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Çalışma Türü</h3>
              <div className="space-y-2">
                {['Tam Zamanlı', 'Yarı Zamanlı', 'Staj', 'Freelance'].map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={workType === type}
                      onChange={() => setWorkType(workType === type ? null : type)}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Deneyim Filtresi */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Deneyim</h3>
              <div className="space-y-2">
                {['Öğrenci', '1-2 yıl', '1-3 yıl', '2-4 yıl', '3-5 yıl', '5-7 yıl'].map(exp => (
                  <label key={exp} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={experience === exp}
                      onChange={() => setExperience(experience === exp ? null : exp)}
                    />
                    <span>{exp}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Maaş Aralığı Filtresi */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Maaş Aralığı</h3>
              <div className="space-y-2">
                {[
                  { value: '0-10000', label: '0 - 10.000 TL' },
                  { value: '10000-20000', label: '10.000 - 20.000 TL' },
                  { value: '20000-35000', label: '20.000 - 35.000 TL' },
                  { value: '35000+', label: '35.000 TL ve üzeri' }
                ].map(range => (
                  <label key={range.value} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={salaryRange === range.value}
                      onChange={() => setSalaryRange(salaryRange === range.value ? null : range.value)}
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Şehir Filtresi */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Şehir</h3>
              <select
                className="w-full border rounded px-2 py-1"
                value={selectedCity || ''}
                onChange={e => setSelectedCity(e.target.value || null)}
              >
                <option value="">Tüm Şehirler</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
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
                <option value="salary-low">Maaş (Düşükten Yükseğe)</option>
                <option value="salary-high">Maaş (Yüksekten Düşüğe)</option>
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
                    <span className="text-sm font-medium text-alo-orange">{listing.salary} ₺</span>
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

                  {/* Görüntülenme Sayısı */}
                  <div className="mt-3 text-xs text-gray-500">
                    {listing.views} görüntülenme
                  </div>

                  {/* Instagram Paylaşım Butonu */}
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => {
                        const shareUrl = `${window.location.origin}/ilan/${listing.id}`;
                        navigator.clipboard.writeText(shareUrl);
                        alert('İlan linki panoya kopyalandı! Instagram uygulamasında paylaşabilirsiniz.');
                      }}
                      className="flex items-center px-3 py-1 bg-pink-500 hover:bg-pink-600 text-white rounded-full text-xs font-medium transition-colors"
                      title="Instagram'da Paylaş"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-4 h-4 mr-1">
                        <path d="M224,202.66A53.34,53.34,0,1,0,277.34,256,53.38,53.38,0,0,0,224,202.66Zm124.71-41a54,54,0,0,0-30.36-30.36C293.19,120,256,118.13,224,118.13s-69.19,1.87-94.35,13.17a54,54,0,0,0-30.36,30.36C120,162.81,118.13,200,118.13,232s1.87,69.19,13.17,94.35a54,54,0,0,0,30.36,30.36C162.81,392,200,393.87,232,393.87s69.19-1.87,94.35-13.17a54,54,0,0,0,30.36-30.36C392,349.19,393.87,312,393.87,280S392,162.81,348.71,161.66ZM224,338a82,82,0,1,1,82-82A82,82,0,0,1,224,338Zm85.4-148.6a19.2,19.2,0,1,1-19.2-19.2A19.2,19.2,0,0,1,309.4,189.4ZM398.8,80A64,64,0,0,0,368,51.2C346.6,32,320.4,32,224,32S101.4,32,80,51.2A64,64,0,0,0,51.2,80C32,101.4,32,127.6,32,224s0,122.6,19.2,144A64,64,0,0,0,80,460.8C101.4,480,127.6,480,224,480s122.6,0,144-19.2a64,64,0,0,0,28.8-28.8C480,422.6,480,396.4,480,300S480,101.4,398.8,80ZM224,400c-88.22,0-160-71.78-160-160S135.78,80,224,80s160,71.78,160,160S312.22,400,224,400Z" />
                      </svg>
                      Instagram'da Paylaş
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sonuç Bulunamadı */}
          {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <FaHeadset className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                İlan Bulunamadı
          </h3>
          <p className="text-gray-600 mb-4">
                Seçtiğiniz kriterlere uygun müşteri hizmetleri ilanı bulunamadı. Lütfen filtreleri değiştirerek tekrar deneyin.
              </p>
              <button
                onClick={() => {
                  setSelectedSubcategory(null)
                  setSalaryRange(null)
                  setWorkType(null)
                  setExperience(null)
                  setShowPremiumOnly(false)
                  setSortBy('newest')
                  setSelectedCity(null)
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