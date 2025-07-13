'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/Providers';
import { Heart, Phone, Mail, Share2, Facebook, Twitter, Instagram, MessageCircle, ChevronRight, Eye, BarChart, MessageSquare, AlertTriangle, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
// import { listings } from '@/lib/listings';

const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjQwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Hw7Zyc2VsIFlvayA8L3RleHQ+PC9zdmc+';

interface IlanDetayPageProps {
  params: { id: string };
};

// Statik ilan verisi (örnek)
const listings = [
  { id: '1', title: 'Örnek İlan 1', price: '1000 TL' },
  { id: '2', title: 'Örnek İlan 2', price: '2000 TL' },
  { id: '3', title: 'Örnek İlan 3', price: '3000 TL' },
];

export default function IlanDetayPage({ params }: IlanDetayPageProps) {
  const ilan = listings.find(l => l.id === params.id);

  // Son görüntülenenler: localStorage'a ekle
  useEffect(() => {
    if (!ilan) return;
    if (typeof window === 'undefined') return;
    let recents = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    recents = recents.filter((id: string) => id !== ilan.id); // Çiftleri engelle
    recents.unshift(ilan.id);
    if (recents.length > 20) recents = recents.slice(0, 20);
    localStorage.setItem('recentlyViewed', JSON.stringify(recents));
  }, [ilan]);

  if (!ilan) {
    return <div className="p-8">İlan bulunamadı.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{ilan.title}</h1>
      <div className="text-lg text-gray-700">Fiyat: {ilan.price}</div>
      <div className="text-gray-500 mt-4">Statik export için örnek ilan detay sayfası.</div>
    </div>
  );
} 