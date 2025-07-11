"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCategories } from '@/lib/useCategories'
import { Home, Smartphone, Shirt, Baby, Dumbbell, Heart, GraduationCap, Utensils, Palette, Gift, MoreHorizontal, Circle, Briefcase } from 'lucide-react'

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

const iconMap: Record<string, any> = {
  elektronik: Smartphone,
  "ev-bahce": Home,
  giyim: Shirt,
  "anne-bebek": Baby,
  "spor-oyunlar-eglenceler": Dumbbell,
  "egitim-kurslar": GraduationCap,
  "yemek-icecek": Utensils,
  "turizm-gecelemeler": Gift,
  "saglik-guzellik": Heart,
  "sanat-hobi": Palette,
  "is": Briefcase,
  "hizmetler": MoreHorizontal,
  diger: Circle
};

function normalizeSlug(slug: string) {
  return slug?.toLowerCase().replace(/\s+/g, '-');
}

function getColor(slug: string, index: number) {
  // slug normalize edilerek renk atanacak
  return colorPalette[index % colorPalette.length];
}

function getIcon(slug: string) {
  const normalized = normalizeSlug(slug);
  return iconMap[normalized] || Circle;
}

export const Sidebar = () => {
  const pathname = usePathname()
  const isCategoryPage = pathname?.startsWith("/kategori/") ?? false
  const currentPath = pathname?.split("/").filter(Boolean) ?? []
  const currentCategory = currentPath[1]
  const currentSubcategory = currentPath[2]
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();

  if (categoriesLoading) {
    return <div className="w-64 bg-white p-4 border-r">Kategoriler yükleniyor...</div>;
  }
  if (categoriesError) {
    return <div className="w-64 bg-white p-4 border-r text-red-600">{categoriesError}</div>;
  }

  return (
    <div className="w-64 bg-white p-4 border-r">
      <h2 className="text-lg font-semibold mb-4">Kategoriler</h2>
      <div className="space-y-2">
        {categories.map((category, i) => {
          const Icon = getIcon(category.slug);
          const color = getColor(category.slug, i);
          console.log('KATEGORI:', category.slug, '->', Icon?.name || Icon);
          return (
            <div key={category.slug}>
              <Link
                href={`/kategori/${category.slug}`}
                className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                  currentCategory === category.slug
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className={`w-5 h-5 ${color}`} />
                <span>{category.name}</span>
              </Link>
              {isCategoryPage &&
                currentCategory === category.slug &&
                category.subCategories && (
                  <div className="ml-4 mt-1 space-y-1">
                    {category.subCategories.map((subcategory, j) => {
                      const subSlug = normalizeSlug(subcategory.slug);
                      const SubIcon = getIcon(subSlug);
                      const subColor = getColor(subSlug, j);
                      console.log('SUBKATEGORI:', subSlug, '->', SubIcon?.name || SubIcon);
                      return (
                        <Link
                          key={subcategory.slug}
                          href={`/kategori/${category.slug}/${subcategory.slug}`}
                          className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md ${
                            currentSubcategory === subcategory.slug
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <SubIcon className={`w-4 h-4 ${subColor}`} />
                          <span>{subcategory.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
            </div>
          )
        })}
      </div>
    </div>
  )
} 