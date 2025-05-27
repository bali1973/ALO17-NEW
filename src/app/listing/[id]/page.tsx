'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Örnek veriler (gerçek uygulamada API'den gelecek)
const featuredListings = [
  {
    id: 1,
    title: 'iPhone 14 Pro Max 256GB',
    price: '45.000',
    location: 'Konak, İzmir',
    category: 'Elektronik',
    subcategory: 'Telefon',
    description: 'Sıfır, kutusunda iPhone 14 Pro Max 256GB. Faturalı ve garantili.',
    images: [
      'https://placehold.co/600x400/e2e8f0/1e293b?text=iPhone+14+Pro+Max+1',
      'https://placehold.co/600x400/e2e8f0/1e293b?text=iPhone+14+Pro+Max+2',
      'https://placehold.co/600x400/e2e8f0/1e293b?text=iPhone+14+Pro+Max+3',
      'https://placehold.co/600x400/e2e8f0/1e293b?text=iPhone+14+Pro+Max+4',
      'https://placehold.co/600x400/e2e8f0/1e293b?text=iPhone+14+Pro+Max+5',
    ],
    date: '2024-03-20',
    condition: 'Sıfır',
    type: 'premium',
    status: 'active',
    showPhone: true,
    isFavorite: false,
    views: 245,
    favorites: 12,
    seller: {
      name: 'Ahmet Yılmaz',
      rating: 4.8,
      memberSince: '2023-01-15',
      phone: '0532 123 4567',
      isVerified: true,
    },
    premiumFeatures: {
      isActive: true,
      expiresAt: '2024-04-20',
      isHighlighted: true,
      isFeatured: true,
      isUrgent: false,
    },
  },
  // ... diğer örnek ilanlar ...
];

export default function ListingDetailPage() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    // Gerçek uygulamada API'den ilan detayları çekilecek
    const foundListing = featuredListings.find(l => l.id === Number(params.id));
    if (foundListing) {
      setListing(foundListing);
      setIsFavorite(foundListing.isFavorite || false);
    }
  }, [params.id]);

  if (!listing) {
    return (
      <div className="min-h-screen bg-alo-light flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-alo-dark mb-4">İlan Bulunamadı</h1>
          <Link href="/" className="text-alo-orange hover:text-alo-light-orange">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    // API çağrısı yapılacak
  };

  const handleShowPhone = () => {
    setShowPhone(true);
    // API çağrısı yapılacak (telefon görüntülenme sayısı artırılacak)
  };

  return (
    <main className="min-h-screen bg-alo-light py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex text-sm text-gray-600">
            <Link href="/" className="hover:text-alo-orange">Ana Sayfa</Link>
            <span className="mx-2">/</span>
            <Link href={`/kategori/${listing.category.toLowerCase()}`} className="hover:text-alo-orange">
              {listing.category}
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/kategori/${listing.category.toLowerCase()}/${listing.subcategory.toLowerCase()}`} className="hover:text-alo-orange">
              {listing.subcategory}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-alo-dark">{listing.title}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Kolon - İlan Detayları */}
          <div className="lg:col-span-2">
            {/* İlan Başlığı ve Fiyat */}
            <div className="bg-white rounded-xl p-6 shadow-md mb-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-alo-dark">{listing.title}</h1>
                <button
                  onClick={handleFavoriteToggle}
                  className={`p-2 rounded-full ${
                    isFavorite ? 'text-alo-red' : 'text-gray-400'
                  } hover:bg-gray-100`}
                >
                  <svg className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <p className="text-3xl font-bold text-alo-red mb-4">{listing.price} TL</p>
              <div className="flex items-center text-gray-600 text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                {listing.location}
              </div>
            </div>

            {/* İlan Görselleri */}
            <div className="bg-white rounded-xl p-6 shadow-md mb-6">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="h-96"
              >
                {listing.images?.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={`${listing.title} - ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* İlan Açıklaması */}
            <div className="bg-white rounded-xl p-6 shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">İlan Açıklaması</h2>
              <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
            </div>

            {/* İlan Detayları */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4">İlan Detayları</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Kategori</p>
                  <p className="font-semibold">{listing.category}</p>
                </div>
                <div>
                  <p className="text-gray-600">Alt Kategori</p>
                  <p className="font-semibold">{listing.subcategory}</p>
                </div>
                <div>
                  <p className="text-gray-600">Durum</p>
                  <p className="font-semibold">{listing.condition}</p>
                </div>
                <div>
                  <p className="text-gray-600">İlan Tarihi</p>
                  <p className="font-semibold">{new Date(listing.date).toLocaleDateString('tr-TR')}</p>
                </div>
                {listing.premiumFeatures?.isActive && (
                  <>
                    <div>
                      <p className="text-gray-600">Premium İlan</p>
                      <p className="font-semibold text-alo-orange">Aktif</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Bitiş Tarihi</p>
                      <p className="font-semibold">{new Date(listing.premiumFeatures.expiresAt).toLocaleDateString('tr-TR')}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sağ Kolon - Satıcı Bilgileri */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-md sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Satıcı Bilgileri</h2>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-alo-light-blue rounded-full flex items-center justify-center text-alo-blue font-bold text-xl mr-4">
                  {listing.seller.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{listing.seller.name}</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {listing.seller.rating}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 text-sm">Üyelik Tarihi</p>
                  <p className="font-semibold">{new Date(listing.seller.memberSince).toLocaleDateString('tr-TR')}</p>
                </div>
                {listing.seller.isVerified && (
                  <div className="flex items-center text-green-600">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Doğrulanmış Satıcı
                  </div>
                )}
                {listing.showPhone && (
                  <button
                    onClick={handleShowPhone}
                    className="w-full bg-alo-orange text-white py-3 rounded-lg font-semibold hover:bg-alo-light-orange transition-colors"
                  >
                    {showPhone ? listing.seller.phone : 'Telefonu Göster'}
                  </button>
                )}
                <button className="w-full border border-alo-orange text-alo-orange py-3 rounded-lg font-semibold hover:bg-alo-orange hover:text-white transition-colors">
                  Mesaj Gönder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 