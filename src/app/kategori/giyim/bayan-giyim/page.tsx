'use client'

import { FaTshirt, FaShoePrints, FaGlasses, FaRunning, FaUmbrellaBeach, FaShoppingBag } from 'react-icons/fa'
import { GiClothes, GiUnderwearShorts, GiWinterHat } from 'react-icons/gi'
import { useState } from 'react'
import { listings } from '@/lib/listings'
import { ListingCard } from '@/components/listing-card'

const staticSubcategories = [
  'Üst Giyim',
  'Alt Giyim',
  'Elbise & Tulum',
  'Dış Giyim',
  'İç Giyim & Ev Giyimi',
  'Ayakkabı',
  'Aksesuar',
  'Spor Giyim',
  'Plaj Giyimi',
];

export default function BayanGiyimCategoryPage() {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<string | null>(null)
  const [condition, setCondition] = useState<string | null>(null)

  // Bayan giyim ilanlarını filtrele
  const bayanGiyimListings = listings.filter(listing => 
    listing.category === 'giyim' && 
    listing.subcategory === 'bayan'
  )

  // Filtreleme fonksiyonu
  const filteredListings = bayanGiyimListings.filter(listing => {
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
        <h1 className="text-3xl font-bold text-gray-900">Bayan Giyim</h1>
        <p className="text-gray-600 mt-2">
          Bayan giyim ürünlerini inceleyebilir, kıyafet, ayakkabı ve aksesuar seçeneklerini keşfedebilirsiniz.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sol Sidebar - Alt Kategoriler */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Alt Kategoriler</h2>
            <ul className="space-y-2 mb-6">
              <li>
                <button
                  className="w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                  onClick={() => setSelectedSubcategory(null)}
                >Tümü</button>
              </li>
              {staticSubcategories.map((sub) => (
                <li key={sub}>
                  <button
                    className="w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                    onClick={() => setSelectedSubcategory(sub)}
                  >{sub}</button>
                </li>
              ))}
            </ul>
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