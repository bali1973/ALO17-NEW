'use client'

import { useParams } from 'next/navigation'
import { listings } from '@/lib/listings'
import { ListingCard } from '@/components/listing-card'
import { useState } from 'react'

export default function AccessoriesCategoryPage() {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<string | null>(null)
  const [condition, setCondition] = useState<string | null>(null)
  const [type, setType] = useState<string | null>(null)

  // Aksesuar ilanlarını filtrele
  const accessoriesListings = listings.filter(listing => 
    listing.category === 'giyim' && 
    listing.subcategory === 'aksesuar'
  )

  // Markaları topla
  const brands = Array.from(new Set(accessoriesListings.map(listing => listing.brand)))

  // Filtreleme fonksiyonu
  const filteredListings = accessoriesListings.filter(listing => {
    if (selectedBrand && listing.brand !== selectedBrand) return false
    if (condition && listing.condition !== condition) return false
    if (type && !listing.features.includes(type)) return false
    if (priceRange) {
      const price = parseInt(listing.price.replace(/[^0-9]/g, ''))
      switch (priceRange) {
        case '0-200':
          if (price > 200) return false
          break
        case '200-500':
          if (price < 200 || price > 500) return false
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Aksesuar</h1>
        <p className="text-gray-600 mt-2">
          Takı, saat, gözlük ve daha fazla aksesuar ürününü inceleyebilirsiniz.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sol Sidebar - Filtreler */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Filtreler</h2>
            
            {/* Marka Filtresi */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Marka</h3>
              <div className="space-y-2">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedBrand === brand}
                      onChange={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ürün Tipi Filtresi */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Ürün Tipi</h3>
              <div className="space-y-2">
                {[
                  'Takı',
                  'Saat',
                  'Gözlük',
                  'Şal',
                  'Eşarp',
                  'Kravat',
                  'Papyon',
                  'Şapka',
                  'Eldiven',
                  'Kemer'
                ].map(productType => (
                  <label key={productType} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={type === productType}
                      onChange={() => setType(type === productType ? null : productType)}
                    />
                    <span>{productType}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Fiyat Aralığı Filtresi */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Fiyat Aralığı</h3>
              <div className="space-y-2">
                {[
                  { value: '0-200', label: '0 - 200 TL' },
                  { value: '200-500', label: '200 - 500 TL' },
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