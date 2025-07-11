'use client'

import { FaFutbol, FaGamepad, FaDice, FaCampground, FaTicketAlt } from 'react-icons/fa'
import { useState } from 'react'
import { listings } from '@/lib/listings'
import { ListingCard } from '@/components/listing-card'
import Link from 'next/link'
import { useCategories } from '@/lib/useCategories'

export default function SporlarOyunlarEglencelerPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<string | null>(null)
  const [condition, setCondition] = useState<string | null>(null)
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()

  // API'den gelen ana kategori ve alt kategorileri bul
  const mainCategory = categories.find(cat => cat.slug === 'sporlar-oyunlar-eglenceler')
  const subCategories = mainCategory?.subCategories || []

  // Sporlar, oyunlar ve eğlenceler ilanlarını filtrele
  const sporlarOyunlarEglencelerListings = listings.filter(listing => 
    listing.category === 'sporlar-oyunlar-eglenceler'
  )

  // Filtreleme fonksiyonu
  const filteredListings = sporlarOyunlarEglencelerListings.filter(listing => {
    if (selectedCategory && listing.subcategory !== selectedCategory) return false
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

  if (categoriesLoading) {
    return <div className="min-h-screen flex items-center justify-center">Kategoriler yükleniyor...</div>
  }
  if (categoriesError) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{categoriesError}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sporlar, Oyunlar ve Eğlenceler</h1>
          <p className="text-gray-600 mt-2">
            Spor ekipmanları, oyunlar ve eğlence aktiviteleri için ilanları keşfedin
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sol Sidebar - Kategoriler */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold mb-4">Kategoriler</h2>
              {/* Alt Kategoriler - Sadece admin panelde olanlar */}
              <div className="space-y-4">
                {subCategories.map(sub => (
                  <Link 
                    key={sub.slug}
                    href={`/kategori/sporlar-oyunlar-eglenceler/${sub.slug}`}
                    className="flex items-center text-gray-700 hover:text-blue-600 font-medium p-2 rounded-lg hover:bg-gray-50"
                  >
                    {/* İkon desteği isterseniz ekleyebilirsiniz */}
                    <span>{sub.name}</span>
                  </Link>
                ))}
              </div>

              <div className="border-t pt-4 mt-6">
                <h2 className="text-lg font-semibold mb-4">Filtreler</h2>
                
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
          </div>

          {/* Ana İçerik */}
          <div className="flex-1">
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
    </div>
  )
} 