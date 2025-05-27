'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

// Örnek veri
const listing = {
  id: 1,
  title: 'iPhone 14 Pro Max 256GB',
  price: '45.000',
  location: 'Konak, İzmir',
  description: 'Sıfır, kutulu, garantili iPhone 14 Pro Max 256GB. Apple Türkiye garantisi devam ediyor. Faturalı, kutusu ve tüm aksesuarları mevcut. Pazarlık payı vardır.',
  category: 'Elektronik',
  subCategory: 'Telefon',
  features: [
    '256GB Depolama',
    'A15 Bionic İşlemci',
    '6.7 inç Super Retina XDR Ekran',
    '48MP Ana Kamera',
    '12MP Ultra Geniş Kamera',
    '12MP Telefoto Kamera',
    'Face ID',
    '5G Desteği',
  ],
  images: [
    'https://placehold.co/800x600/1e293b/ffffff?text=iPhone+14+Pro+Max+1&font=roboto',
    'https://placehold.co/800x600/1e293b/ffffff?text=iPhone+14+Pro+Max+2&font=roboto',
    'https://placehold.co/800x600/1e293b/ffffff?text=iPhone+14+Pro+Max+3&font=roboto',
  ],
  seller: {
    name: 'Ahmet Yılmaz',
    phone: '+90 555 123 4567',
    email: 'ahmet@example.com',
    memberSince: '2023',
    listings: 5,
  },
  createdAt: '2024-02-20',
  views: 1234,
  condition: 'Yeni',
  brand: 'Apple',
  model: 'iPhone 14 Pro Max',
  year: '2024'
};

export default function ListingDetail() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/" className="text-gray-700 hover:text-alo-orange">
              Ana Sayfa
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <Link href={`/kategori/${listing.category.toLowerCase()}`} className="text-gray-700 hover:text-alo-orange">
                {listing.category}
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-500">{listing.title}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Kolon - İlan Detayları */}
        <div className="lg:col-span-2 space-y-8">
          {/* İlan Başlığı ve Fiyat */}
          <div>
            <h1 className="text-3xl font-bold text-alo-dark mb-4">{listing.title}</h1>
            <p className="text-2xl font-bold text-alo-red">{listing.price} TL</p>
          </div>

          {/* Fotoğraf Galerisi */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
              {listing.images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={image}
                    alt={`${listing.title} - Fotoğraf ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* İlan Detayları */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-alo-dark">İlan Detayları</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {listing.features.map((feature, index) => (
                <div key={index} className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-alo-orange rounded-full mr-2"></span>
                  {feature}
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-alo-dark mb-2">Açıklama</h3>
              <p className="text-gray-600 whitespace-pre-line">{listing.description}</p>
            </div>
          </div>
        </div>

        {/* Sağ Kolon - Satıcı Bilgileri */}
        <div className="space-y-8">
          {/* Satıcı Kartı */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-alo-dark mb-4">Satıcı Bilgileri</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-alo-light-blue rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {listing.seller.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-alo-dark">{listing.seller.name}</p>
                  <p className="text-sm text-gray-500">Üyelik: {listing.seller.memberSince}</p>
                </div>
              </div>

              <div className="space-y-2">
                <a
                  href={`tel:${listing.seller.phone}`}
                  className="flex items-center text-gray-600 hover:text-alo-orange"
                >
                  <PhoneIcon className="w-5 h-5 mr-2" />
                  {listing.seller.phone}
                </a>
                <a
                  href={`mailto:${listing.seller.email}`}
                  className="flex items-center text-gray-600 hover:text-alo-orange"
                >
                  <EnvelopeIcon className="w-5 h-5 mr-2" />
                  {listing.seller.email}
                </a>
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="w-5 h-5 mr-2" />
                  {listing.location}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Satıcının {listing.seller.listings} ilanı daha var
                </p>
              </div>
            </div>
          </div>

          {/* Güvenli Alışveriş */}
          <div className="bg-alo-light rounded-xl p-6">
            <h3 className="text-lg font-semibold text-alo-dark mb-4">Güvenli Alışveriş</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-alo-orange mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">Satıcı bilgilerini kontrol edin</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-alo-orange mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">Ürünü görmeden ödeme yapmayın</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-alo-orange mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">Şüpheli durumları bize bildirin</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 