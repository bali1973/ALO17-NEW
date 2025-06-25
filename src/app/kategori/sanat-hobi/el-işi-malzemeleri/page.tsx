'use client'

import { useParams } from 'next/navigation'
import { listings } from '@/lib/listings'
import { ListingCard } from '@/components/listing-card'
import { useState } from 'react'

export default function CraftSuppliesCategoryPage() {
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [priceRange, setPriceRange] = useState<string | null>(null)
  const [features, setFeatures] = useState<string[]>([])

  // El işi malzemeleri ilanlarını filtrele
  const craftListings = listings.filter(listing => 
    listing.category === 'sanat-hobi' && 
    listing.subcategory === 'el-işi-malzemeleri'
  )

  // Filter listings based on selected filters
  const filteredListings = craftListings.filter(listing => {
    if (selectedLocation && listing.location !== selectedLocation) return false
    if (features.length > 0 && !features.every(feature => listing.features.includes(feature))) return false
    if (priceRange) {
      const price = parseInt(listing.price.replace(/[^0-9]/g, ''))
      switch (priceRange) {
        case '0-50':
          if (price > 50) return false
          break
        case '50-200':
          if (price < 50 || price > 200) return false
          break
        case '200-500':
          if (price < 200 || price > 500) return false
          break
        case '500+':
          if (price < 500) return false
          break
      }
    }
    return true
  })

  // Get unique locations for filter
  const locations = Array.from(new Set(craftListings.map(listing => listing.location)))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">El İşi Malzemeleri</h1>
        <p className="text-gray-600 mt-2">
          Dikiş, örgü, takı yapımı ve diğer el işi malzemeleri.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sol Sidebar - Filtreler */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Filtreler</h2>
            
            {/* Location Filtresi */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Location</h3>
              <div className="space-y-2">
                {locations.map(location => (
                  <label key={location} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedLocation === location}
                      onChange={() => setSelectedLocation(selectedLocation === location ? '' : location)}
                    />
                    <span>{location}</span>
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
                  { value: '50-200', label: '50 - 200 TL' },
                  { value: '200-500', label: '200 - 500 TL' },
                  { value: '500+', label: '500 TL ve üzeri' }
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
                {filteredListings.length} ürün bulundu
              </span>
              <select 
                className="border rounded-md p-2"
                aria-label="Sıralama seçenekleri"
              >
                <option value="newest">En Yeni</option>
                <option value="price-asc">Fiyat (Düşükten Yükseğe)</option>
                <option value="price-desc">Fiyat (Yüksekten Düşüğe)</option>
                <option value="rating">Puana Göre</option>
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
                Ürün Bulunamadı
              </h3>
              <p className="text-gray-600">
                Seçtiğiniz kriterlere uygun el işi malzemesi bulunamadı. Lütfen filtreleri değiştirerek tekrar deneyin.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 