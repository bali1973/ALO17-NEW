'use client'

import { useParams } from 'next/navigation'
import { listings } from '@/lib/listings'
import { ListingCard } from '@/components/listing-card'
import { useState } from 'react'
import CategoryFilters from '@/components/CategoryFilters';

export default function HotelsCategoryPage() {
  const [selectedStar, setSelectedStar] = useState<string | null>(null)
  const [features, setFeatures] = useState<string[]>([])
  // Merkezi filtreler
  const [city, setCity] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [premiumOnly, setPremiumOnly] = useState(false);

  // Otel ilanlarını filtrele
  const hotelListings = listings.filter(listing => 
    listing.category === 'turizm-gecelemeler' && 
    listing.subcategory === 'oteller'
  )

  // Yıldız sayılarını topla
  const stars = Array.from(new Set(hotelListings.map(listing => listing.brand)))

  // Filtreleme fonksiyonu
  const filteredListings = hotelListings.filter(listing => {
    if (selectedStar && listing.brand !== selectedStar) return false;
    if (features.length > 0 && !features.every(feature => listing.features.includes(feature))) return false;
    if (premiumOnly && !listing.isPremium) return false;
    if (city && listing.location !== city) return false;
    if (priceRange) {
      const price = parseInt(listing.price.replace(/[^0-9]/g, ''));
      if (priceRange === '0-1000' && !(price >= 0 && price <= 1000)) return false;
      if (priceRange === '1000-2000' && !(price >= 1000 && price <= 2000)) return false;
      if (priceRange === '2000-5000' && !(price >= 2000 && price <= 5000)) return false;
      if (priceRange === '5000+' && !(price >= 5000)) return false;
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Oteller</h1>
        <p className="text-gray-600 mt-2">
          Lüks, butik ve ekonomik otelleri keşfedin.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sol Sidebar - Filtreler */}
        <div className="w-full md:w-80 flex-shrink-0 mb-8 md:mb-0">
          <div className="bg-yellow-100 rounded-lg shadow p-4 mb-6 border border-blue-200">
            <CategoryFilters
              city={city}
              onCityChange={setCity}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              premiumOnly={premiumOnly}
              onPremiumOnlyChange={setPremiumOnly}
            />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
            {/* Yıldız ve Özellikler Filtresi buraya */}
            <h3 className="font-medium mb-2">Yıldız</h3>
            <div className="space-y-2">
              {stars.map(star => (
                <label key={star} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedStar === star}
                    onChange={() => setSelectedStar(selectedStar === star ? null : star)}
                  />
                  <span>{star}</span>
                </label>
              ))}
            </div>
            <h3 className="font-medium mb-2 mt-4">Özellikler</h3>
            {/* Özellikler filtreleri buraya */}
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="flex-1 space-y-8">
          {/* Sıralama ve Sonuç Sayısı */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                {filteredListings.length} otel bulundu
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
                Otel Bulunamadı
              </h3>
              <p className="text-gray-600">
                Seçtiğiniz kriterlere uygun otel bulunamadı. Lütfen filtreleri değiştirerek tekrar deneyin.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 