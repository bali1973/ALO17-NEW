import { notFound } from "next/navigation"
import { categories } from "@/lib/categories"
import { Sidebar } from "@/components/sidebar"

// Örnek ilanlar
const sampleListings = {
  "erkek-gomlek": [
    {
      id: 1,
      title: "Yeni Lacoste Gömlek",
      price: "1.999 TL",
      location: "İstanbul",
      condition: "Yeni",
      description: "Kutusunda, etiketi çıkarılmamış, 42 beden",
      imageUrl: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2hpcnR8ZW58MHx8MHx8fDA%3D"
    },
    {
      id: 2,
      title: "Tommy Hilfiger Gömlek",
      price: "1.499 TL",
      location: "Ankara",
      condition: "İkinci El",
      description: "Az kullanılmış, 40 beden",
      imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNoaXJ0fGVufDB8fDB8fHww"
    }
  ],
  "kadin-elbise": [
    {
      id: 1,
      title: "Zara Yazlık Elbise",
      price: "2.499 TL",
      location: "İzmir",
      condition: "Yeni",
      description: "Etiketi çıkarılmamış, S beden",
      imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHJlc3N8ZW58MHx8MHx8fDA%3D"
    },
    {
      id: 2,
      title: "Mango Çiçekli Elbise",
      price: "1.999 TL",
      location: "İstanbul",
      condition: "İkinci El",
      description: "Az kullanılmış, M beden",
      imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRyZXNzfGVufDB8fDB8fHww"
    }
  ]
}

export default function SubSubCategoryPage({
  params,
}: {
  params: { slug: string; subslug: string; subsubslug: string }
}) {
  // Ana kategoriyi bul
  const category = categories.find((cat) => cat.slug === params.slug)
  if (!category) notFound()

  // Alt kategoriyi bul
  const subcategory = category.subcategories?.find(
    (sub) => sub.slug === params.subslug
  )
  if (!subcategory) notFound()

  // Alt alt kategoriyi bul
  const subsubcategory = subcategory.subcategories?.find(
    (subsub) => subsub.slug === params.subsubslug
  )
  if (!subsubcategory) notFound()

  // Örnek ilanları al
  const listings = sampleListings[params.subslug as keyof typeof sampleListings] || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sol Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <Sidebar />
        </div>

        {/* Ana İçerik */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{subsubcategory.name}</h1>
            <p className="text-gray-600">
              {category.name} &gt; {subcategory.name} &gt; {subsubcategory.name}
            </p>
          </div>

          {/* Filtreler */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fiyat Aralığı
                </label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  title="Fiyat aralığı seçin"
                >
                  <option>Tümü</option>
                  <option>0 - 100 TL</option>
                  <option>100 - 500 TL</option>
                  <option>500 - 1000 TL</option>
                  <option>1000 TL ve üzeri</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sıralama
                </label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  title="Sıralama seçenekleri"
                >
                  <option>En Yeni</option>
                  <option>Fiyat (Düşükten Yükseğe)</option>
                  <option>Fiyat (Yüksekten Düşüğe)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durum
                </label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  title="Durum seçenekleri"
                >
                  <option>Tümü</option>
                  <option>Yeni</option>
                  <option>İkinci El</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Konum
                </label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  title="Konum seçenekleri"
                >
                  <option>Tümü</option>
                  <option>İstanbul</option>
                  <option>Ankara</option>
                  <option>İzmir</option>
                </select>
              </div>
            </div>
          </div>

          {/* İlanlar */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-500">{listing.location}</span>
                    <span className="text-sm text-gray-500">{listing.condition}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{listing.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-blue-600">
                      {listing.price}
                    </span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                      İncele
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 