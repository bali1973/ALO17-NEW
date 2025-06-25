'use client';

import React from 'react';
import Link from 'next/link';
import { listings } from '@/lib/listings';
import { ListingCard } from './listing-card';

interface FeaturedAdsProps {
  category?: string;
  subcategory?: string;
  limit?: number;
  title?: string;
}

export function FeaturedAds({ category, subcategory, limit = 6, title }: FeaturedAdsProps) {
  const filteredAds = listings.filter(ad => {
    if (category && subcategory) {
      return ad.category.toLowerCase() === category.toLowerCase() && 
             ad.subcategory.toLowerCase() === subcategory.toLowerCase();
    } else if (category) {
      return ad.category.toLowerCase() === category.toLowerCase();
    }
    return true;
  });

  const displayAds = filteredAds.slice(0, limit);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title || "Öne Çıkan İlanlar"}</h2>
        {category && subcategory && (
          <Link href={`/kategori/${category.toLowerCase()}/${subcategory.toLowerCase()}`} className="text-blue-600 hover:text-blue-800">
            Tümünü Gör
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayAds.map((ad) => (
          <ListingCard key={ad.id} listing={ad} />
        ))}
      </div>
    </div>
  );
} 