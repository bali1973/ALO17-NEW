'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  location: string;
  images: string[];
  createdAt: string;
  user: {
    username: string;
  };
}

export default function SubcategoryPage() {
  const params = useParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(
          `https://alo17-api.onrender.com/api/listings?category=${params.category}&subcategory=${params.subcategory}`
        );
        
        if (!response.ok) throw new Error('İlanlar yüklenirken bir hata oluştu');
        
        const data = await response.json();
        setListings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [params.category, params.subcategory]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {params.category} &gt; {params.subcategory}
      </h1>

      {listings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Bu kategoride henüz ilan bulunmuyor.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {listing.images && listing.images.length > 0 && (
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="object-cover w-full h-48"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">{listing.title}</h2>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {listing.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">
                    ₺{listing.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <span>{listing.location}</span>
                  <span className="mx-2">•</span>
                  <span>{listing.user.username}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 