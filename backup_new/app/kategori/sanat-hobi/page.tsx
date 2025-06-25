'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { listings } from '@/lib/listings'

const ArtAndHobbyCategoryPage = () => {
  const params = useParams()
  const slug = params?.slug as string || ''

  // Alt kategorileri tanımla
  const subcategories = [
    {
      title: 'Resim Malzemeleri',
      description: 'Boya, fırça, tuval ve diğer resim malzemeleri.',
      slug: 'resim-malzemeleri',
      icon: '🎨'
    },
    {
      title: 'Müzik Aletleri',
      description: 'Gitar, piyano, davul ve diğer müzik aletleri.',
      slug: 'müzik-aletleri',
      icon: '🎸'
    },
    {
      title: 'El İşi Malzemeleri',
      description: 'Dikiş, örgü, takı yapımı ve diğer el işi malzemeleri.',
      slug: 'el-işi-malzemeleri',
      icon: '🧶'
    },
    {
      title: 'Hobi Kursları',
      description: 'Resim, müzik, el işi ve diğer hobi kursları.',
      slug: 'hobi-kursları',
      icon: '📚'
    },
    {
      title: 'Koleksiyon',
      description: 'Pul, para, kart ve diğer koleksiyon ürünleri.',
      slug: 'koleksiyon',
      icon: '🏺'
    }
  ]

  // Kategorileri filtrele
  const artListings = listings.filter(listing => 
    listing.category === 'sanat-hobi'
  )

  // Markaları topla
  const brands = Array.from(new Set(artListings.map(listing => listing.brand)))

  // Fiyat aralıklarını tanımla
  const priceRanges = [
    { value: '0-100', label: '0 - 100 TL' },
    { value: '100-500', label: '100 - 500 TL' },
    { value: '500-1000', label: '500 - 1.000 TL' },
    { value: '1000+', label: '1.000 TL ve üzeri' }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sanat & Hobi</h1>
        <p className="text-gray-600 mt-2">
          Sanat malzemeleri, müzik aletleri, el işi malzemeleri, hobi kursları ve koleksiyon ürünleri.
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
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Fiyat Aralığı Filtresi */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Fiyat Aralığı</h3>
              <div className="space-y-2">
                {priceRanges.map(range => (
                  <label key={range.value} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
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
                    />
                    <span>{status}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subcategories.map((subcategory) => (
              <Link
                key={subcategory.slug}
                href={`/kategori/sanat-hobi/${subcategory.slug}`}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="text-4xl mb-4">{subcategory.icon}</div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {subcategory.title}
                  </h2>
                  <p className="text-gray-600">
                    {subcategory.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArtAndHobbyCategoryPage 