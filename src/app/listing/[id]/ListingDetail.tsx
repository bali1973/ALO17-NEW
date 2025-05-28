'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

export type Listing = {
  id: string;
  title: string;
  price: number;
  location: string;
  category: string;
  subcategory: string;
  description: string;
  images: string[];
  date: string;
  condition: string;
  type: string;
  status: string;
  showPhone: boolean;
  isFavorite: boolean;
  views: number;
  favorites: number;
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    memberSince: string;
    location: string;
    phone: string;
  };
  premiumFeatures: {
    isFeatured: boolean;
    isUrgent: boolean;
    isVerified: boolean;
  };
};

// Örnek veri
const featuredListings: Listing[] = [
  {
    id: '1',
    title: 'iPhone 14 Pro Max 256GB',
    price: 45000,
    location: 'İstanbul',
    category: 'Elektronik',
    subcategory: 'Telefon',
    description: 'Sıfır, kutusunda iPhone 14 Pro Max 256GB. Apple Türkiye garantili, faturası mevcut.',
    images: [
      '/images/listings/iphone-14-pro-max-1.jpg',
      '/images/listings/iphone-14-pro-max-2.jpg',
      '/images/listings/iphone-14-pro-max-3.jpg',
      '/images/listings/iphone-14-pro-max-4.jpg',
      '/images/listings/iphone-14-pro-max-5.jpg'
    ],
    date: '2024-02-20',
    condition: 'Yeni',
    type: 'Satılık',
    status: 'active',
    showPhone: false,
    isFavorite: false,
    views: 150,
    favorites: 12,
    seller: {
      id: '1',
      name: 'Ahmet Yılmaz',
      avatar: '/images/avatars/user1.jpg',
      rating: 4.8,
      memberSince: '2023-01-15',
      location: 'İstanbul',
      phone: '0532 123 4567'
    },
    premiumFeatures: {
      isFeatured: true,
      isUrgent: false,
      isVerified: true
    }
  }
];

export default function ListingDetail() {
  const params = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [showPhone, setShowPhone] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  useEffect(() => {
    // URL'den ilan ID'sini al
    const listingId = params.id as string;
    
    // Örnek veriden ilanı bul
    const foundListing = featuredListings.find(l => l.id === listingId);
    if (foundListing) {
      setListing(foundListing);
    }
  }, [params.id]);

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800">İlan bulunamadı</h1>
          <p className="mt-2 text-gray-600">Aradığınız ilan mevcut değil veya kaldırılmış olabilir.</p>
        </div>
      </div>
    );
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/images/placeholder.jpg';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* İlan Başlığı ve Fiyat */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-2xl font-semibold text-primary">
            {listing.price.toLocaleString('tr-TR')} TL
          </span>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {listing.views} görüntülenme
            </span>
            <button
              className={`flex items-center space-x-1 ${
                listing.isFavorite ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              <svg
                className="w-5 h-5"
                fill={listing.isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{listing.favorites}</span>
            </button>
          </div>
        </div>
      </div>

      {/* İlan Detayları Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Kolon - Resimler */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Swiper
              modules={[Navigation, Pagination, Autoplay, Thumbs]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              thumbs={{ swiper: thumbsSwiper }}
              className="h-[400px]"
            >
              {listing.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="relative w-full h-full">
                    <Image
                      src={image}
                      alt={`${listing.title} - Resim ${index + 1}`}
                      fill
                      className="object-contain"
                      onError={handleImageError}
                      priority={index === 0}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Küçük Resimler */}
            <Swiper
              modules={[Thumbs]}
              watchSlidesProgress
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={5}
              className="h-20 mt-2"
            >
              {listing.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="relative w-full h-full cursor-pointer">
                    <Image
                      src={image}
                      alt={`${listing.title} - Küçük Resim ${index + 1}`}
                      fill
                      className="object-cover rounded"
                      onError={handleImageError}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Sağ Kolon - Satıcı Bilgileri */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative w-16 h-16">
                <Image
                  src={listing.seller.avatar}
                  alt={listing.seller.name}
                  fill
                  className="rounded-full object-cover"
                  onError={handleImageError}
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{listing.seller.name}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {listing.seller.rating}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{listing.seller.memberSince}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Konum:</span>
                <span className="font-medium">{listing.seller.location}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Üyelik:</span>
                <span className="font-medium">{listing.seller.memberSince}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Telefon:</span>
                {showPhone ? (
                  <span className="font-medium">{listing.seller.phone}</span>
                ) : (
                  <button
                    onClick={() => setShowPhone(true)}
                    className="text-primary hover:text-primary-dark"
                  >
                    Telefonu Göster
                  </button>
                )}
              </div>
            </div>

            <button className="w-full mt-6 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors">
              Mesaj Gönder
            </button>
          </div>
        </div>
      </div>

      {/* İlan Açıklaması */}
      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">İlan Açıklaması</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
        </div>
      </div>

      {/* İlan Detayları */}
      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">İlan Detayları</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-sm text-gray-600">Kategori</span>
            <p className="font-medium">{listing.category}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Alt Kategori</span>
            <p className="font-medium">{listing.subcategory}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Durum</span>
            <p className="font-medium">{listing.condition}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">İlan Tarihi</span>
            <p className="font-medium">{listing.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 