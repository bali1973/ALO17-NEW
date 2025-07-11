'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { listingTypes, listingStatus, Listing } from '@/types/listings';
import MessagesBox from './mesajlar/MessagesBox';

// Örnek veri
const user = {
  name: 'Ahmet Yılmaz',
  email: 'ahmet@example.com',
  phone: '+90 555 123 4567',
  location: 'Kadıköy, İstanbul',
  memberSince: '2023',
  avatar: '/images/avatar.jpg',
};

const listings = [
  {
    id: 1,
    title: 'Sahibinden Satılık Lüks Daire',
    price: '2.450.000',
    location: 'Kadıköy, İstanbul',
    category: 'Ev & Yaşam',
    subcategory: 'Daire',
    description: 'Sahibinden satılık lüks daire. 3+1, 180m², deniz manzaralı.',
    images: ['/images/listing1.jpg'],
    date: '2024-02-20',
    condition: 'Yeni',
    type: listingTypes.PREMIUM,
    status: listingStatus.ACTIVE,
    showPhone: true,
    isFavorite: false,
    views: 1234,
    favorites: 5,
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
  {
    id: 2,
    title: '2019 Model BMW 320i',
    price: '1.850.000',
    location: 'Beşiktaş, İstanbul',
    category: 'Otomobil',
    subcategory: 'BMW',
    description: '2019 model BMW 320i. Otomatik, benzin, 45.000 km.',
    images: ['/images/listing2.jpg'],
    date: '2024-02-19',
    condition: 'İkinci El',
    type: listingTypes.PREMIUM,
    status: listingStatus.PENDING,
    showPhone: true,
    isFavorite: false,
    views: 856,
    favorites: 3,
    seller: {
      name: 'Ahmet Yılmaz',
      rating: 4.8,
      memberSince: '2023-01-15',
      phone: '0532 123 4567',
      isVerified: true,
    },
    premiumFeatures: {
      isActive: true,
      expiresAt: '2024-04-19',
      isHighlighted: false,
      isFeatured: false,
      isUrgent: true,
    },
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('listings');

  const handleDeleteListing = (id: number) => {
    if (window.confirm('Bu ilanı silmek istediğinizden emin misiniz?')) {
      // API'ye silme isteği gönderilecek
      console.log('Delete listing:', id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profil Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    fill
                    className="rounded-full object-cover"
                  />
                  <button className="absolute bottom-0 right-0 p-2 bg-alo-orange text-white rounded-full hover:bg-alo-light-orange">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-xl font-semibold text-alo-dark">{user.name}</h2>
                <p className="text-sm text-gray-500">Üyelik: {user.memberSince}</p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center text-gray-600">
                  <EnvelopeIcon className="w-5 h-5 mr-2" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <PhoneIcon className="w-5 h-5 mr-2" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="w-5 h-5 mr-2" />
                  <span>{user.location}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  href="/profil/duzenle"
                  className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-alo-orange hover:text-alo-light-orange"
                >
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Profili Düzenle
                </Link>
              </div>
            </div>
          </div>

          {/* Ana İçerik */}
          <div className="lg:col-span-3">
            {/* Sekmeler */}
            <div className="bg-white rounded-xl shadow-sm mb-6">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('listings')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'listings'
                      ? 'text-alo-orange border-b-2 border-alo-orange'
                      : 'text-gray-500 hover:text-alo-orange'
                  }`}
                >
                  İlanlarım
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'favorites'
                      ? 'text-alo-orange border-b-2 border-alo-orange'
                      : 'text-gray-500 hover:text-alo-orange'
                  }`}
                >
                  Favorilerim
                </button>
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'messages'
                      ? 'text-alo-orange border-b-2 border-alo-orange'
                      : 'text-gray-500 hover:text-alo-orange'
                  }`}
                >
                  Mesajlarım
                </button>
              </nav>
            </div>

            {/* İlanlarım */}
            {activeTab === 'listings' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-alo-dark">İlanlarım</h3>
                  <Link
                    href="/ilan-ver"
                    className="flex items-center px-4 py-2 bg-alo-orange text-white rounded-lg hover:bg-alo-light-orange"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Yeni İlan Ver
                  </Link>
                </div>

                <div className="space-y-4">
                  {listings.map((listing) => (
                    <div
                      key={listing.id}
                      className="bg-white rounded-xl shadow-sm overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="relative w-full md:w-48 h-48">
                          <Image
                            src={listing.images[0]}
                            alt={listing.title}
                            width={200}
                            height={150}
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-alo-dark mb-2">
                                {listing.title}
                              </h4>
                              <p className="text-xl font-bold text-alo-red mb-2">
                                {listing.price} TL
                              </p>
                              <div className="flex items-center text-sm text-gray-500 mb-2">
                                <MapPinIcon className="w-4 h-4 mr-1" />
                                {listing.location}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <span className="mr-4">
                                  {new Date(listing.date).toLocaleDateString('tr-TR')}
                                </span>
                                <span>{listing.views} görüntülenme</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Link
                                href={`/ilan/${listing.id}/duzenle`}
                                className="p-2 text-gray-500 hover:text-alo-orange"
                              >
                                <PencilIcon className="w-5 h-5" />
                              </Link>
                              <button
                                onClick={() => handleDeleteListing(listing.id)}
                                className="p-2 text-gray-500 hover:text-alo-red"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                          <div className="mt-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                listing.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {listing.status === 'active' ? 'Aktif' : 'Onay Bekliyor'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Favorilerim */}
            {activeTab === 'favorites' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-alo-dark mb-4">Favorilerim</h3>
                <p className="text-gray-500">Henüz favori ilanınız bulunmuyor.</p>
              </div>
            )}

            {/* Mesajlarım */}
            {activeTab === 'messages' && (
              <MessagesBox />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 