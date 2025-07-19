"use client"

import Link from 'next/link'
import { listings } from '@/lib/listings'
import { ListingCard } from '@/components/listing-card'
import { useCategories } from '@/lib/useCategories'

export default function EgitimKurslarPage() {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()

  // Eğitim & Kurslar ana kategorisini bul
  const mainCategory = categories.find(cat => cat.slug === 'egitim-kurslar')
  const subcategories = (mainCategory?.subCategories || []).sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))

  // Eğitim ve Kurslar ilanlarını filtrele (sadece ana kategoriye ait olanlar)
  const egitimKurslarListings = listings.filter(listing => 
    listing.category === 'egitim-kurslar'
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Eğitim ve Kurslar</h1>
        <p className="text-gray-600 mt-2">
          Üniversite, kurs, özel ders ve dil eğitimi ilanları
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sol Sidebar - Sadece Alt Kategoriler */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Alt Kategoriler</h2>
            {categoriesLoading ? (
              <div>Yükleniyor...</div>
            ) : categoriesError ? (
              <div className="text-red-500">{categoriesError}</div>
            ) : (
              <div className="flex flex-col gap-2">
                {subcategories.map(subcategory => (
                  <Link
                    key={subcategory.id}
                    href={`/kategori/egitim-kurslar/${subcategory.slug}`}
                    className="px-3 py-2 rounded text-left bg-gray-100 hover:bg-gray-200 text-gray-800"
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Ana İçerik */}
        <div className="flex-1 space-y-8">
          {/* İlanlar */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {egitimKurslarListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          {/* Sonuç Bulunamadı */}
          {egitimKurslarListings.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                İlan Bulunamadı
              </h3>
              <p className="text-gray-600">
                Bu kategoride henüz ilan yok.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 