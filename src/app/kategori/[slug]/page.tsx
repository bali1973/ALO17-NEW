'use client'

import { useCategories } from '@/lib/useCategories'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Smartphone, Home as HomeIcon, Shirt, Baby, Dumbbell, Heart, GraduationCap, Utensils, Palette, Gift, Users, Circle, Briefcase } from 'lucide-react'

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

function getColor(slug: string, index: number) {
  return colorPalette[index % colorPalette.length];
}

// Function to render icon from category data
function renderIcon(iconData: string | null, slug: string, index: number) {
  if (iconData && iconData.startsWith('emoji:')) {
    // Handle emoji icons
    const emoji = iconData.replace('emoji:', '');
    return (
      <span className={`text-2xl ${getColor(slug, index)}`}>
        {emoji}
      </span>
    );
  } else if (iconData && iconData.startsWith('color:')) {
    // Handle color-only icons (fallback to emoji)
    const colorClass = iconData.replace('color:', '');
    return (
      <div className={`w-6 h-6 rounded-full ${colorClass} flex items-center justify-center`}>
        <span className="text-white text-xs font-bold">
          {slug.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  } else {
    // Fallback to default icon
    const defaultIcons: Record<string, any> = {
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
    };
    const Icon = defaultIcons[slug] || Circle;
    return <Icon className={`w-6 h-6 ${getColor(slug, index)}`} />;
  }
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const { categories, loading, error } = useCategories()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Kategori yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Kategori yüklenirken hata oluştu: {error}</p>
        </div>
      </div>
    )
  }

  const category = categories.find(cat => cat.slug === slug)

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Kategori Bulunamadı</h1>
          <p className="text-gray-600 mb-6">Aradığınız kategori mevcut değil.</p>
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

  const color = getColor(category.slug, categories.findIndex(c => c.slug === slug))

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar: Alt kategoriler */}
      <aside className="w-64 p-4 border-r bg-white">
        <div className="flex items-center space-x-3 mb-6">
          {renderIcon(category.icon || null, category.slug, categories.findIndex(c => c.slug === slug))}
          <h2 className="text-lg font-semibold">{category.name}</h2>
        </div>
        
        {category.subCategories && category.subCategories.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Alt Kategoriler</h3>
            {category.subCategories.map((subcategory, index) => {
              const subColor = getColor(subcategory.slug, index)
              return (
                <Link
                  key={subcategory.slug}
                  href={`/kategori/${category.slug}/${subcategory.slug}`}
                  className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-50 transition-colors"
                >
                  {renderIcon(subcategory.icon || null, subcategory.slug, index)}
                  <span className="text-gray-700 hover:text-blue-600">{subcategory.name}</span>
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
            <div>
              {/* <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1> */}
              {/* <p className="text-gray-600">
                {category.subCategories ? `${category.subCategories.length} alt kategori` : 'Kategori'}
              </p> */}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex flex-col items-center justify-center">
              <p className="text-gray-600 mb-4 text-center">Bu kategoride henüz ilan bulunmuyor.</p>
              <Link
                href="/ilan-ver"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                İlan Ver
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 