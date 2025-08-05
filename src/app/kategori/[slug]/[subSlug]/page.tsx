import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CategoryLayout from '@/components/CategoryLayout';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye } from 'lucide-react';

export const revalidate = 3600;

interface SubCategoryPageProps {
  params: {
    slug: string;
    subSlug: string;
  };
}

async function getSubCategoryData(slug: string, subSlug: string) {
  console.log('Getting subcategory data for slug:', slug, 'subSlug:', subSlug);
  
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      subCategories: {
        orderBy: { order: 'asc' }
      }
    }
  });

  console.log('Category found:', category);

  if (!category) return null;

  // Alt kategoriyi bul
  const subCategory = category.subCategories?.find((sub: any) => sub.slug === subSlug);
  console.log('SubCategory found:', subCategory);

  if (!subCategory) return null;

  // API'den ilanları çek (hem kategori hem alt kategori filtresi ile)
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3004'}/api/listings?category=${slug}&subcategory=${subSlug}`;
  console.log('Fetching from API:', apiUrl);
  
  const response = await fetch(apiUrl, { next: { revalidate: 3600 } });
  
  console.log('API Response status:', response.status);
  
  if (!response.ok) {
    console.error('API response error:', response.status);
    return { category, subCategory, listings: [] };
  }
  
  const data = await response.json();
  console.log('API Data:', data);
  console.log('Data type:', typeof data);
  console.log('Is array:', Array.isArray(data));
  console.log('Data length:', data.length);
  
  const listings = Array.isArray(data) ? data : [];
  console.log('Final listings count:', listings.length);

  return { category, subCategory, listings };
}

export default async function SubCategoryPage({ params }: SubCategoryPageProps) {
  const { slug, subSlug } = await params;
  console.log('SubCategoryPage params slug:', slug, 'subSlug:', subSlug);
  
  const data = await getSubCategoryData(slug, subSlug);

  if (!data) {
    console.log('No data found, showing 404');
    notFound();
  }

  const { category, subCategory, listings } = data;
  console.log('SubCategoryPage - Category:', category.name);
  console.log('SubCategoryPage - SubCategory:', subCategory.name);
  console.log('SubCategoryPage - Listings count:', listings.length);

  const subcategories = category.subCategories?.map((sub: any) => ({
    slug: sub.slug,
    name: sub.name,
  })) || [];

  const breadcrumbSegments = [
    { name: category.name, href: `/kategori/${category.slug}` },
    { name: subCategory.name, href: `/kategori/${category.slug}/${subCategory.slug}` }
  ];

  return (
    <CategoryLayout 
      subcategories={subcategories}
      activeSlug={subCategory.slug}
      categorySlug={category.slug}
      breadcrumbSegments={breadcrumbSegments}
    >




      {/* İlanlar */}
      {listings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz İlan Bulunmuyor</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Bu alt kategoride henüz ilan bulunmuyor. İlk ilanı siz vererek başlayın!
          </p>
          <Link
            href="/ilan-ver"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            + Ücretsiz İlan Ver
          </Link>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing: any) => (
              <Link key={listing.id} href={`/ilan/${listing.id}`} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer">
                <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden">
                  {listing.images && (Array.isArray(listing.images) ? listing.images.length > 0 : listing.images) ? (
                    <Image
                      src={Array.isArray(listing.images) ? listing.images[0] : listing.images}
                      alt={listing.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="text-gray-400 text-4xl">📷</div>
                  )}
                  {listing.premium && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                      ÖNCELİKLİ
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {listing.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {listing.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600">
                      {typeof listing.price === 'number' ? listing.price.toLocaleString('tr-TR') : listing.price} ₺
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Eye className="w-4 h-4 mr-1" />
                      {listing.views || 0}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {listing.location} • {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </CategoryLayout>
  );
} 