"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CategoryLayout from '@/components/CategoryLayout';
import { Listing } from '@/types';
import { useCategories } from '@/lib/useCategories';

interface SubCategoryPageProps {
  params: {
    slug: string;
  };
}

export default function SubCategoryPage({ params }: SubCategoryPageProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [premiumOnly, setPremiumOnly] = useState(false);
  const { categories, loading: categoriesLoading } = useCategories();

  // Ana kategoriyi ve alt kategorileri bul
  const mainCategory = categories.find(cat => cat.slug === 'hizmetler');
  const subcategories = mainCategory?.subCategories || [];
  const currentSubcategory = subcategories.find(sub => sub.slug === params.slug);

  useEffect(() => {
    if (!currentSubcategory) {
      notFound();
      return;
    }

    setLoading(true);
    setError(null);

    fetch('/api/listings')
      .then(res => {
        if (!res.ok) throw new Error('İlanlar yüklenirken bir hata oluştu');
        return res.json();
      })
      .then(data => {
        setListings(data.filter((listing: Listing) => 
          listing.category === 'hizmetler' && 
          listing.subcategory === params.slug
        ));
        setLoading(false);
      })
      .catch(err => {
        console.error('İlanlar yüklenirken hata:', err);
        setError('İlanlar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
        setLoading(false);
      });
  }, [params.slug, currentSubcategory]);

  const filteredListings = listings.filter((listing: Listing) => {
    if (city && listing.city !== city) return false;
    if (premiumOnly && !listing.isPremium) return false;
    if (priceRange) {
      const price = Number(listing.price);
      const [min, max] = priceRange.split('-').map(Number);
      if (max && (price < min || price > max)) return false;
      if (!max && price < min) return false;
    }
    return true;
  });

  if (categoriesLoading || loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  if (!currentSubcategory) {
    return notFound();
  }

  return (
    <CategoryLayout
      subcategories={subcategories}
      activeSlug={params.slug}
      categoryBasePath="hizmetler"
      city={city}
      onCityChange={setCity}
      priceRange={priceRange}
      onPriceRangeChange={setPriceRange}
      premiumOnly={premiumOnly}
      onPremiumOnlyChange={setPremiumOnly}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{currentSubcategory.name}</h1>
        <p className="text-gray-600 mt-2">
          {currentSubcategory.name} kategorisindeki tüm ilanlar
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing: Listing) => (
            <div key={listing.id} className="bg-white rounded-lg shadow-md p-4">
              <Link href={`/listing/${listing.id}`}>
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <img
                    src={listing.images?.[0] || '/placeholder.png'}
                    alt={listing.title}
                    className="object-cover w-full h-full rounded"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">{listing.title}</h3>
                <p className="text-gray-600">{listing.price} TL</p>
                <p className="text-sm text-gray-500 mt-2">{listing.city}</p>
                {listing.isPremium && (
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mt-2">
                    Premium
                  </span>
                )}
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            Bu kategoride ilan bulunamadı.
          </div>
        )}
      </div>
    </CategoryLayout>
  );
} 