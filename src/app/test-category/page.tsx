'use client';

import { useState, useEffect } from 'react';

interface Listing {
  id: string | number;
  title: string;
  price: string | number;
  location: string;
  city: string;
  description: string;
  category: string;
  subcategory: string;
  isPremium: boolean;
  imageUrl?: string;
  images?: string[] | string;
  createdAt: string;
  views: number;
  condition: string;
  status: "active" | "pending" | "sold" | "expired" | "onaylandı" | undefined;
  premium?: boolean;
  premiumFeatures?: string[];
}

export default function TestCategoryPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('elektronik');

  useEffect(() => {
    const fetchCategoryListings = async () => {
      try {
        console.log('Fetching category listings for:', category);
        const response = await fetch(`/api/listings?category=${category}`);
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Category listings data:', data);
          console.log('Data type:', typeof data);
          console.log('Is array:', Array.isArray(data));
          console.log('Data length:', data.length);
          
          if (Array.isArray(data)) {
            setListings(data);
          } else {
            setError('API array döndürmedi');
            setListings([]);
          }
        } else {
          setError(`API Error: ${response.status}`);
          setListings([]);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError(`Fetch Error: ${error}`);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryListings();
  }, [category]);

  const categories = [
    'elektronik',
    'ev-bahce',
    'arac-vasita',
    'emlak',
    'is-makineleri',
    'hizmetler'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Kategori ilanları yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-2xl mb-4">❌ Hata</div>
          <p className="text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Kategori Test Sayfası
        </h1>
        
        {/* Kategori Seçici */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Kategori Seçin</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setLoading(true);
                }}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  category === cat
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* API Bilgileri */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">API Bilgileri</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Seçili Kategori:</strong> {category}
            </div>
            <div>
              <strong>Toplam İlan:</strong> {listings.length}
            </div>
            <div>
              <strong>Alt Kategoriler:</strong> {[...new Set(listings.map(l => l.subcategory))].join(', ')}
            </div>
            <div>
              <strong>Şehirler:</strong> {[...new Set(listings.map(l => l.city))].join(', ')}
            </div>
          </div>
        </div>

        {/* İlanlar */}
        {listings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-2xl mb-4">📭</div>
            <p className="text-lg text-gray-600">
              {category} kategorisinde henüz ilan bulunmuyor
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {category.charAt(0).toUpperCase() + category.slice(1)} İlanları ({listings.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.slice(0, 12).map((listing) => (
                <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {listing.images && Array.isArray(listing.images) && listing.images[0] ? (
                      <img 
                        src={listing.images[0]} 
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-500 text-4xl">📷</div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {listing.title}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl font-bold text-green-600">
                        ₺{typeof listing.price === 'string' ? parseFloat(listing.price).toLocaleString() : listing.price.toLocaleString()}
                      </span>
                      {listing.premium && (
                        <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                          PREMIUM
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-2">
                      {listing.location}, {listing.city}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{listing.category} / {listing.subcategory}</span>
                      <span>👁️ {listing.views || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 