'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Star, Clock, TrendingUp } from 'lucide-react';
import { listings } from '@/lib/listings';

interface FeaturedAdsProps {
  category?: string;
  subcategory?: string;
  limit?: number;
  title?: string;
}

// Premium özelliklerle genişletilmiş öne çıkan ilanlar
const featuredListings = [
  {
    id: 1,
    title: 'Sahibinden Satılık Lüks Daire - Deniz Manzaralı',
    price: '2.500.000',
    location: 'Çanakkale',
    image: '/images/listings/iphone-14-pro-max-1.jpg',
    category: 'emlak',
    subcategory: 'daire',
    createdAt: '2024-03-20',
    isPremium: true,
    premiumFeatures: ['featured', 'urgent', 'highlighted'],
    views: 245,
    isUrgent: true,
    isFeatured: true
  },
  {
    id: 2,
    title: '2019 Model BMW 320i - Temiz - Garantili',
    price: '850.000',
    location: 'İstanbul',
    image: '/images/listings/iphone-14-pro-max-1.jpg',
    category: 'arac',
    subcategory: 'otomobil',
    createdAt: '2024-03-19',
    isPremium: false,
    premiumFeatures: [],
    views: 89,
    isUrgent: false,
    isFeatured: false
  },
  {
    id: 3,
    title: 'iPhone 14 Pro Max - 256GB - Yeni Gibi',
    price: '45.000',
    location: 'Ankara',
    image: '/images/listings/iphone-14-pro-max-1.jpg',
    category: 'elektronik',
    subcategory: 'telefon',
    createdAt: '2024-03-18',
    isPremium: true,
    premiumFeatures: ['featured', 'highlighted'],
    views: 156,
    isUrgent: false,
    isFeatured: true
  },
  {
    id: 4,
    title: 'Villa Kiralık - Havuzlu - Deniz Manzaralı',
    price: '15.000',
    location: 'İzmir',
    image: '/images/listings/iphone-14-pro-max-1.jpg',
    category: 'emlak',
    subcategory: 'villa',
    createdAt: '2024-03-17',
    isPremium: true,
    premiumFeatures: ['urgent', 'top'],
    views: 312,
    isUrgent: true,
    isFeatured: false
  },
  {
    id: 5,
    title: 'MacBook Pro M2 - 16GB RAM - 512GB SSD',
    price: '65.000',
    location: 'Bursa',
    image: '/images/listings/iphone-14-pro-max-1.jpg',
    category: 'elektronik',
    subcategory: 'bilgisayar',
    createdAt: '2024-03-16',
    isPremium: false,
    premiumFeatures: [],
    views: 67,
    isUrgent: false,
    isFeatured: false
  },
  {
    id: 6,
    title: 'Audi A4 2.0 TDI - 2020 Model - Temiz',
    price: '1.200.000',
    location: 'Antalya',
    image: '/images/listings/iphone-14-pro-max-1.jpg',
    category: 'arac',
    subcategory: 'otomobil',
    createdAt: '2024-03-15',
    isPremium: true,
    premiumFeatures: ['featured', 'urgent', 'top'],
    views: 423,
    isUrgent: true,
    isFeatured: true
  }
];

export function FeaturedAds({ category, subcategory, limit = 6, title }: FeaturedAdsProps) {
  const filteredAds = featuredListings.filter(ad => {
    if (category && subcategory) {
      return ad.category.toLowerCase() === category.toLowerCase() && 
             ad.subcategory.toLowerCase() === subcategory.toLowerCase();
    } else if (category) {
      return ad.category.toLowerCase() === category.toLowerCase();
    }
    return true;
  });

  const displayAds = filteredAds.slice(0, limit);

  const getPremiumFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'featured':
        return <Star className="w-3 h-3 text-yellow-500" />;
      case 'urgent':
        return <Clock className="w-3 h-3 text-red-500" />;
      case 'highlighted':
        return <Sparkles className="w-3 h-3 text-blue-500" />;
      case 'top':
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      default:
        return null;
    }
  };

  const getPremiumFeatureText = (feature: string) => {
    switch (feature) {
      case 'featured':
        return 'Öne Çıkan';
      case 'urgent':
        return 'Acil';
      case 'highlighted':
        return 'Vurgulanmış';
      case 'top':
        return 'Üst Sıralarda';
      default:
        return '';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold">{title || "Öne Çıkan İlanlar"}</h2>
          <Sparkles className="w-6 h-6 text-yellow-500" />
        </div>
        {category && subcategory && (
          <Link href={`/kategori/${category.toLowerCase()}/${subcategory.toLowerCase()}`} className="text-alo-orange hover:text-orange-600 font-medium">
            Tümünü Gör
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayAds.map((ad) => (
          <div
            key={ad.id}
            className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 ${
              ad.isPremium ? 'ring-2 ring-yellow-200 hover:ring-yellow-300' : ''
            } ${ad.isUrgent ? 'border-l-4 border-red-500' : ''}`}
          >
            <div className="relative h-48">
              <img
                src={ad.image}
                alt={ad.title}
                className="w-full h-full object-cover"
              />
              
              {/* Premium Rozetleri */}
              <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                {ad.isPremium && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Premium
                  </span>
                )}
                {ad.isUrgent && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <Clock className="w-3 h-3 mr-1" />
                    Acil
                  </span>
                )}
                {ad.isFeatured && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Star className="w-3 h-3 mr-1" />
                    Öne Çıkan
                  </span>
                )}
              </div>

              {/* Görüntülenme Sayısı */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                {ad.views} görüntülenme
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{ad.title}</h3>
              <p className="text-xl font-bold text-alo-orange mb-2">
                {parseInt(ad.price).toLocaleString('tr-TR')} ₺
              </p>
              
              <div className="flex items-center justify-between text-gray-500 mb-2">
                <div className="flex items-center">
                  <span className="text-sm">{ad.location}</span>
                </div>
                <span className="text-xs">
                  {new Date(ad.createdAt).toLocaleDateString('tr-TR')}
                </span>
              </div>

              {/* Premium Özellikler */}
              {ad.premiumFeatures.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {ad.premiumFeatures.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {getPremiumFeatureIcon(feature)}
                      <span className="ml-1">{getPremiumFeatureText(feature)}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 