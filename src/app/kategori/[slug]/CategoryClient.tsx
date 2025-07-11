"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ListingCard } from '@/components/listing-card';
import { useCategories } from '@/lib/useCategories';

interface CategoryClientProps {
  slug: string;
}

export default function CategoryClient({ slug }: CategoryClientProps) {
  const router = useRouter();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const category = categories.find(cat => cat.slug === slug);

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/listings?category=${slug}`)
      .then(res => res.json())
      .then(data => {
        setListings(data.listings || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Kategoriler yükleniyor...</p>
        </div>
      </div>
    );
  }
  if (categoriesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="mt-4 text-red-600">{categoriesError}</p>
        </div>
      </div>
    );
  }
  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Kategori yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar: Sadece alt kategoriler */}
      <aside className="w-64 p-4 border-r bg-white">
        <h2 className="text-lg font-semibold mb-4">Alt Kategoriler</h2>
        <div className="space-y-2">
          {(category.subCategories || []).map((sub: any) => (
            <Link
              key={sub.slug}
              href={`/kategori/${category.slug}/${sub.slug}`}
              className="block p-3 rounded-md transition-colors hover:bg-blue-50"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      </aside>
      {/* Ana içerik */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          {loading ? (
            <div className="text-center text-gray-500">İlanlar yükleniyor...</div>
          ) : listings.length === 0 ? (
            <div className="text-center text-gray-500">Bu kategoride ilan bulunamadı.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 