'use client'

import Link from 'next/link'
import { useCategories } from '@/lib/useCategories'

// Boş iş ilanları listesi (örnek, gerçek API ile değiştirilebilir)
const jobListings: any[] = []

export default function IsKategoriPage() {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();

  // Ana kategori olarak 'is' veya 'is-kariyer' slug'ını bul
  const mainCategory = categories.find(cat => cat.slug === 'is' || cat.slug === 'is-kariyer');
  const subcategories = mainCategory?.subCategories || [];

  if (categoriesLoading) return <div>Kategoriler yükleniyor...</div>;
  if (categoriesError) return <div>{categoriesError}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">İş & Eleman İlanları</h1>
        <p className="text-gray-600 mt-2">
          İş arıyorum, eleman arıyorum, tam zamanlı, yarı zamanlı, freelance ve diğer iş fırsatları. Kariyerinizi geliştirin veya uygun elemanı bulun.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar - Alt Kategoriler */}
        <aside className="md:w-64 w-full mb-4 md:mb-0">
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-3">Alt Kategoriler</h2>
            <ul className="space-y-2">
              {subcategories.length === 0 && <li>Alt kategori bulunamadı.</li>}
              {subcategories.map((s: any) => (
                <li key={s.slug}>
                  <Link
                    href={`/kategori/is/${s.slug}`}
                    className="block w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                  >{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        {/* İlanlar */}
        <main className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobListings.map(listing => (
              <div key={listing.id} className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-2">{listing.title}</h2>
                <div className="text-gray-600 mb-1">{listing.location}</div>
                <div className="text-gray-800 font-bold mb-2">{listing.price} TL</div>
                {/* Diğer alanlar */}
              </div>
            ))}
          </div>
          {jobListings.length === 0 && <div className="text-center py-12">İlan bulunamadı.</div>}
        </main>
      </div>
    </div>
  );
} 