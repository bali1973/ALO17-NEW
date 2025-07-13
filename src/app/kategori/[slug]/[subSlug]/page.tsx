'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ListingCard } from '@/components/listing-card'
import { useCategories } from '@/lib/useCategories'
import { Smartphone, Home as HomeIcon, Shirt, Baby, Dumbbell, Heart, GraduationCap, Utensils, Palette, Gift, Users, Circle, Briefcase } from 'lucide-react'

const iconMap: Record<string, any> = {
  elektronik: Smartphone,
  "ev-bahce": HomeIcon,
  giyim: Shirt,
  "anne-bebek": Baby,
  "sporlar-oyunlar-eglenceler": Dumbbell,
  "egitim-kurslar": GraduationCap,
  "yemek-icecek": Utensils,
  "turizm-gecelemeler": Gift,
  "saglik-guzellik": Heart,
  "sanat-hobi": Palette,
  "is": Briefcase,
  "hizmetler": Users,
  "ucretsiz-gel-al": Gift,
  diger: Circle
};

const colorPalette = [
  "text-blue-500",
  "text-indigo-500",
  "text-orange-500",
  "text-purple-500",
  "text-pink-500",
  "text-emerald-500",
  "text-cyan-500",
  "text-amber-500",
  "text-teal-500",
  "text-rose-500",
  "text-violet-500",
  "text-lime-500",
  "text-green-600",
  "text-slate-500"
];

function getIcon(slug: string) {
  return iconMap[slug] || Circle;
}

function getColor(slug: string, index: number) {
  return colorPalette[index % colorPalette.length];
}

export default function SubCategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const subSlug = params.subSlug as string
  const { categories, loading, error } = useCategories()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Alt kategori yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Alt kategori yüklenirken hata oluştu: {error}</p>
        </div>
      </div>
    )
  }

  const category = categories.find(cat => cat.slug === slug)
  const subCategory = category?.subCategories?.find(sub => sub.slug === subSlug)

  if (!category || !subCategory) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Alt Kategori Bulunamadı</h1>
          <p className="text-gray-600 mb-6">Aradığınız alt kategori mevcut değil.</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    )
  }

  const Icon = getIcon(category.slug)
  const color = getColor(category.slug, categories.findIndex(c => c.slug === slug))

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar: Bu ana kategoriye ait alt kategoriler */}
      <aside className="w-64 p-4 border-r bg-white">
        <div className="flex items-center space-x-3 mb-6">
          <Icon className={`w-6 h-6 ${color}`} />
          <h2 className="text-lg font-semibold">{category.name}</h2>
        </div>
        
        {category.subCategories && category.subCategories.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Alt Kategoriler</h3>
            {category.subCategories.map((sub, index) => {
              const SubIcon = getIcon(sub.slug)
              const subColor = getColor(sub.slug, index)
              const isActive = sub.slug === subSlug
              return (
                <Link
                  key={sub.slug}
                  href={`/kategori/${category.slug}/${sub.slug}`}
                  className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'hover:bg-blue-50'
                  }`}
                >
                  <SubIcon className={`w-4 h-4 ${subColor}`} />
                  <span className={isActive ? 'text-blue-700' : 'text-gray-700 hover:text-blue-600'}>
                    {sub.name}
                  </span>
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Bu kategoride alt kategori bulunmuyor.</p>
        )}
      </aside>

      {/* Ana içerik */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <Icon className={`w-8 h-8 ${color}`} />
            <div>
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <Link href="/" className="hover:text-blue-600">Ana Sayfa</Link>
                <span>/</span>
                <Link href={`/kategori/${category.slug}`} className="hover:text-blue-600">
                  {category.name}
                </Link>
                <span>/</span>
                <span className="text-gray-900">{subCategory.name}</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">{subCategory.name}</h1>
              <p className="text-gray-600">
                {category.name} kategorisinde {subCategory.name} alt kategorisi
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Bu Alt Kategorideki İlanlar</h2>
            <p className="text-gray-600 mb-6">
              Bu alt kategoride henüz ilan bulunmuyor. İlk ilanı vermek için aşağıdaki butona tıklayın.
            </p>
            <div className="flex space-x-4">
              <Link
                href="/ilan-ver"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                İlan Ver
              </Link>
              <Link
                href={`/kategori/${category.slug}`}
                className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Tüm {category.name} İlanları
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 