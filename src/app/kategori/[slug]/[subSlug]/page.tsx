'use client'

import { useParams } from 'next/navigation'
import { categories } from '@/lib/categories'
import { FeaturedAds } from '@/components/featured-ads'
import { LatestAds } from '@/components/latest-ads'

export default function SubCategoryPage() {
  const params = useParams()
  const slug = params?.slug as string;
  const subslug = params?.subslug as string;

  const category = categories.find(cat => cat.slug === slug)
  const subcategory = category?.subcategories?.find(sub => sub.slug === subslug)

  if (!category || !subcategory) {
    return <div>Kategori bulunamadı</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {category.name} - {subcategory.name}
      </h1>
      
      <div className="space-y-8">
        <FeaturedAds 
          category={subcategory.name}
          title={`Öne Çıkan ${subcategory.name} İlanları`}
        />
        
        <LatestAds 
          category={subcategory.name}
          title={`En Son ${subcategory.name} İlanları`}
        />
      </div>
    </div>
  )
} 