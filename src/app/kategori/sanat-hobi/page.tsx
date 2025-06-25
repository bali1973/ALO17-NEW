'use client'

import { useParams } from 'next/navigation'
import { listings } from '@/lib/listings'
import { ListingCard } from '@/components/listing-card'
import { useState } from 'react'
import Link from 'next/link'
import { FaPaintBrush, FaGuitar, FaHandPaper, FaStamp, FaBiking, FaBook, FaGamepad } from 'react-icons/fa'

// Alt kategoriler
const subcategories = [
  { id: 'resim', name: 'Resim ve Boyama', icon: <FaPaintBrush className="inline mr-2 text-blue-500" /> },
  { id: 'muzik', name: 'Müzik Aletleri', icon: <FaGuitar className="inline mr-2 text-green-500" /> },
  { id: 'el-sanatlari', name: 'El Sanatları', icon: <FaHandPaper className="inline mr-2 text-yellow-500" /> },
  { id: 'koleksiyon', name: 'Koleksiyon', icon: <FaStamp className="inline mr-2 text-red-500" /> },
  { id: 'spor', name: 'Spor ve Outdoor', icon: <FaBiking className="inline mr-2 text-purple-500" /> },
  { id: 'kitap', name: 'Kitap ve Dergi', icon: <FaBook className="inline mr-2 text-indigo-500" /> },
  { id: 'oyun', name: 'Oyun ve Hobi', icon: <FaGamepad className="inline mr-2 text-pink-500" /> },
]

export default function SanatHobiCategoryPage() {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<string | null>(null)
  const [condition, setCondition] = useState<string | null>(null)

  // Sanat ve hobi ilanlarını filtrele
  const sanatHobiListings = listings.filter(listing => 
    listing.category === 'sanat-hobi'
  )

  // Filtreleme fonksiyonu
  const filteredListings = sanatHobiListings.filter(listing => {
    if (selectedSubcategory && listing.subcategory !== selectedSubcategory) return false
    if (condition && listing.condition !== condition) return false
    if (priceRange) {
      const price = parseInt(listing.price.replace(/[^0-9]/g, ''))
      switch (priceRange) {
        case '0-5000':
          if (price > 5000) return false
          break
        case '5000-10000':
          if (price < 5000 || price > 10000) return false
          break
        case '10000-20000':
          if (price < 10000 || price > 20000) return false
          break
        case '20000+':
          if (price < 20000) return false
          break
      }
    }
    return true
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sanat ve Hobi</h1>
        <p className="text-gray-600 mt-2">
          Sanat malzemeleri, hobi ürünleri ve koleksiyon parçaları
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sol Sidebar - Kategoriler ve Filtreler */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-4">
            {/* Alt Kategoriler */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Kategoriler</h2>
              <div className="space-y-2">
                {subcategories.map(subcategory => (
                  <Link
                    key={subcategory.id}
                    href={`/kategori/sanat-hobi/${subcategory.id}`}
                    className={`block px-3 py-2 rounded-md hover:bg-gray-100 ${
                      selectedSubcategory === subcategory.id ? 'bg-gray-100 font-medium' : ''
                    }`}
                  >
                    {subcategory.icon}{subcategory.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Fiyat Aralığı Filtresi */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Fiyat Aralığı</h3>
              <div className="space-y-2">
                {[
                  { value: '0-5000', label: '0 - 5.000 TL' },
                  { value: '5000-10000', label: '5.000 - 10.000 TL' },
                  { value: '10000-20000', label: '10.000 - 20.000 TL' },
                  { value: '20000+', label: '20.000 TL ve üzeri' }
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
        <div className="flex-1 space-y-8">
          {/* Sıralama ve Sonuç Sayısı */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                {filteredListings.length} ilan bulundu
              </span>
              <select 
                className="border rounded-md p-2"
                aria-label="Sıralama seçenekleri"
              >
                <option value="newest">En Yeni</option>
                <option value="price-asc">Fiyat (Düşükten Yükseğe)</option>
                <option value="price-desc">Fiyat (Yüksekten Düşüğe)</option>
              </select>
            </div>
          </div>

          {/* İlanlar */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          {/* Sonuç Bulunamadı */}
          {filteredListings.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                İlan Bulunamadı
              </h3>
              <p className="text-gray-600">
                Seçtiğiniz kriterlere uygun ilan bulunamadı. Lütfen filtreleri değiştirerek tekrar deneyin.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 