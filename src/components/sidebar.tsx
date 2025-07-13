"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCategories } from '@/lib/useCategories'
import { Home, Smartphone, Shirt, Baby, Dumbbell, Heart, GraduationCap, Utensils, Palette, Gift, MoreHorizontal, Circle, Briefcase, Users } from 'lucide-react'
import { useState } from 'react'

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

function normalizeSlug(slug: string) {
  return slug?.toLowerCase().replace(/\s+/g, '-');
}

export const Sidebar = () => {
  const pathname = usePathname()
  const isCategoryPage = pathname?.startsWith("/kategori/") ?? false
  const currentPath = pathname?.split("/").filter(Boolean) ?? []
  const currentCategory = currentPath[1]
  const currentSubcategory = currentPath[2]
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [open, setOpen] = useState(false);

  if (categoriesLoading) {
    return <div className="w-64 bg-white p-4 border-r">Kategoriler yükleniyor...</div>;
  }
  if (categoriesError) {
    return <div className="w-64 bg-white p-4 border-r text-red-600">{categoriesError}</div>;
  }

  return (
    <>
      {/* Mobilde açılır sidebar butonu */}
      <button className="lg:hidden fixed top-20 left-4 z-40 bg-primary text-white p-2 rounded-full shadow-lg" onClick={()=>setOpen(o=>!o)}>
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="25" y2="12" /><line x1="3" y1="6" x2="25" y2="6" /><line x1="3" y1="18" x2="25" y2="18" /></svg>
      </button>
      {/* Sidebar ana */}
      <aside className={`w-64 bg-white p-4 border-r shadow-lg rounded-xl transition-all duration-300 z-30 lg:static fixed top-0 left-0 h-full ${open ? 'block' : 'hidden'} lg:block`}> 
        <h2 className="text-xl font-bold mb-6 text-primary tracking-tight">Kategoriler</h2>
        <div className="space-y-2">
          {categories.map((category, i) => {
            const Icon = iconMap[category.slug] || Circle;
            const color = colorPalette[i % colorPalette.length];
            return (
              <div key={category.slug}>
                <Link
                  href={`/kategori/${category.slug}`}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-lg font-medium transition-all duration-150 cursor-pointer ${
                    currentCategory === category.slug
                      ? "bg-blue-50 text-primary shadow"
                      : "text-gray-700 hover:bg-gray-50 hover:shadow"
                  }`}
                  onClick={()=>setOpen(false)}
                >
                  <Icon className={`w-7 h-7 ${color}`} />
                  <span>{category.name}</span>
                </Link>
                {isCategoryPage &&
                  currentCategory === category.slug &&
                  category.subCategories && (
                    <div className="ml-6 mt-1 space-y-1">
                      {category.subCategories.map((subcategory, j) => {
                        const subSlug = normalizeSlug(subcategory.slug);
                        const SubIcon = iconMap[subSlug] || Circle;
                        const subColor = colorPalette[j % colorPalette.length];
                        return (
                          <Link
                            key={subcategory.slug}
                            href={`/kategori/${category.slug}/${subcategory.slug}`}
                            className={`flex items-center gap-2 px-3 py-1.5 text-base rounded-md transition-all duration-150 cursor-pointer ${
                              currentSubcategory === subcategory.slug
                                ? "bg-blue-50 text-primary shadow"
                                : "text-gray-600 hover:bg-gray-50 hover:shadow"
                            }`}
                            onClick={()=>setOpen(false)}
                          >
                            <SubIcon className={`w-5 h-5 ${subColor}`} />
                            <span>{subcategory.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      </aside>
      {/* Mobilde sidebar açıkken arka planı karart */}
      {open && <div className="fixed inset-0 bg-black bg-opacity-30 z-20 lg:hidden" onClick={()=>setOpen(false)}></div>}
    </>
  )
} 