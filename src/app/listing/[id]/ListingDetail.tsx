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
  // Elektronik - Telefon
  {
    id: '1',
    title: 'iPhone 14 Pro Max 256GB',
    price: 45000,
    location: 'Konak, İzmir',
    category: 'Elektronik',
    subcategory: 'Telefon',
    description: 'Sıfır, kutusunda iPhone 14 Pro Max 256GB. Faturalı ve garantili.',
    images: [
      'https://images.unsplash.com/photo-1678652197831-2d1808eecd76?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1678652197831-2d1808eecd76?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1678652197831-2d1808eecd76?w=800&auto=format&fit=crop&q=60'
    ],
    date: '2024-03-20',
    condition: 'Sıfır',
    type: 'Satılık',
    status: 'active',
    showPhone: false,
    isFavorite: false,
    views: 245,
    favorites: 12,
    seller: {
      id: '1',
      name: 'Ahmet Yılmaz',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=60',
      rating: 4.8,
      memberSince: '2023-01-15',
      location: 'İstanbul',
      phone: ''
    },
    premiumFeatures: {
      isFeatured: true,
      isUrgent: false,
      isVerified: true
    }
  },
  // Spor - Fitness
  {
    id: '2',
    title: 'Profesyonel Fitness Ekipmanları Seti',
    price: 25000,
    location: 'Karşıyaka, İzmir',
    category: 'Spor',
    subcategory: 'Fitness',
    description: 'Tam donanımlı fitness ekipmanları seti. Dumbbell seti, bench press, squat rack ve ağırlık plakaları dahil.',
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60'
    ],
    date: '2024-03-19',
    condition: 'İkinci El',
    type: 'Satılık',
    status: 'active',
    showPhone: false,
    isFavorite: false,
    views: 180,
    favorites: 8,
    seller: {
      id: '2',
      name: 'Mehmet Demir',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60',
      rating: 4.5,
      memberSince: '2023-03-10',
      location: 'İzmir',
      phone: ''
    },
    premiumFeatures: {
      isFeatured: false,
      isUrgent: true,
      isVerified: true
    }
  },
  // Ev & Yaşam - Mobilya
  {
    id: '3',
    title: 'Modern L Koltuk Takımı',
    price: 12000,
    location: 'Bornova, İzmir',
    category: 'Ev & Yaşam',
    subcategory: 'Mobilya',
    description: 'Yeni, kullanılmamış L koltuk takımı. Gri renk, modern tasarım. Faturalı ve garantili.',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60'
    ],
    date: '2024-03-18',
    condition: 'Yeni',
    type: 'Satılık',
    status: 'active',
    showPhone: false,
    isFavorite: false,
    views: 320,
    favorites: 15,
    seller: {
      id: '3',
      name: 'Ayşe Kaya',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60',
      rating: 4.9,
      memberSince: '2023-02-01',
      location: 'Ankara',
      phone: ''
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
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [error, setError] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    // URL'den ilan ID'sini al
    const listingId = params?.id as string | undefined;
    if (!listingId) return;
    // Örnek veriden ilanı bul
    const foundListing = featuredListings.find(l => l.id === listingId);
    if (foundListing) {
      setListing(foundListing);
    }
  }, [params]);

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
    e.currentTarget.src = '/images/placeholder.svg';
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!senderName.trim() || !senderEmail.trim() || !message.trim()) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
      setError('Geçerli bir e-posta adresi girin.');
      return;
    }

    try {
      // Burada mesaj gönderme API'si çağrılacak
      // Örnek olarak başarılı gönderim simüle ediyoruz
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessageSent(true);
      setMessage('');
      setSenderName('');
      setSenderEmail('');
      setShowMessageForm(false);
    } catch (err) {
      setError('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
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
        {/* Paylaş yazısı ve ikonları */}
        <div className="mt-4">
          <button
            className="text-blue-600 font-semibold underline text-sm hover:text-blue-800 transition"
            onClick={() => setShowShareMenu((v) => !v)}
          >
            Paylaş
          </button>
          {showShareMenu && (
            <div className="flex items-center gap-3 mt-2 animate-fade-in">
              {/* Facebook */}
              <button
                aria-label="Facebook'ta paylaş"
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/ilan/' + listing.id)}&t=${encodeURIComponent(listing.title)}`, '_blank', 'noopener,noreferrer');
                }}
                className="bg-[#1877F2] hover:bg-[#145db2] rounded-full p-1 transition-colors"
              >
                <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
              </button>
              {/* Twitter */}
              <button
                aria-label="Twitter'da paylaş"
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin + '/ilan/' + listing.id)}&text=${encodeURIComponent(listing.title)}`, '_blank', 'noopener,noreferrer');
                }}
                className="bg-[#1DA1F2] hover:bg-[#0d8ddb] rounded-full p-1 transition-colors"
              >
                <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.916 4.916 0 0 0 16.616 3c-2.72 0-4.924 2.206-4.924 4.924 0 .386.044.763.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.724-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.212c9.057 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 24 4.557z"/></svg>
              </button>
              {/* WhatsApp */}
              <button
                aria-label="WhatsApp'ta paylaş"
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  window.open(`https://wa.me/?text=${encodeURIComponent(listing.title + ' ' + window.location.origin + '/ilan/' + listing.id)}`, '_blank', 'noopener,noreferrer');
                }}
                className="bg-[#25D366] hover:bg-[#1da851] rounded-full p-1 transition-colors"
              >
                <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M20.52 3.48A11.78 11.78 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.56 4.19 1.62 6.01L0 24l6.18-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.68-.5-5.26-1.44l-.38-.22-3.67.97.98-3.58-.25-.37A9.93 9.93 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.6c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.97.95-.97 2.3 0 1.35.99 2.65 1.13 2.83.14.18 1.95 2.98 4.74 4.06.66.28 1.18.45 1.58.58.66.21 1.26.18 1.73.11.53-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.18-.53-.32z"/></svg>
              </button>
              {/* Instagram */}
              <button
                aria-label="Instagram'da paylaş"
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  const shareUrl = `${window.location.origin}/ilan/${listing.id}`;
                  navigator.clipboard.writeText(shareUrl);
                  alert('İlan linki panoya kopyalandı! Instagram uygulamasında paylaşabilirsiniz.');
                }}
                className="bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:opacity-90 rounded-full p-1 transition-colors"
              >
                <svg width="16" height="16" fill="white" viewBox="0 0 448 512"><path d="M224,202.66A53.34,53.34,0,1,0,277.34,256,53.38,53.38,0,0,0,224,202.66Zm124.71-41a54,54,0,0,0-30.36-30.36C293.19,120,256,118.13,224,118.13s-69.19,1.87-94.35,13.17a54,54,0,0,0-30.36,30.36C120,162.81,118.13,200,118.13,232s1.87,69.19,13.17,94.35a54,54,0,0,0,30.36,30.36C162.81,392,200,393.87,232,393.87s69.19-1.87,94.35-13.17a54,54,0,0,0,30.36-30.36C392,349.19,393.87,312,393.87,280S392,162.81,348.71,161.66ZM224,338a82,82,0,1,1,82-82A82,82,0,0,1,224,338Zm85.4-148.6a19.2,19.2,0,1,1-19.2-19.2A19.2,19.2,0,0,1,309.4,189.4ZM398.8,80A64,64,0,0,0,368,51.2C346.6,32,320.4,32,224,32S101.4,32,80,51.2A64,64,0,0,0,51.2,80C32,101.4,32,127.6,32,224s0,122.6,19.2,144A64,64,0,0,0,80,460.8C101.4,480,127.6,480,224,480s122.6,0,144-19.2a64,64,0,0,0,28.8-28.8C480,422.6,480,396.4,480,300S480,101.4,398.8,80ZM224,400c-88.22,0-160-71.78-160-160S135.78,80,224,80s160,71.78,160,160S312.22,400,224,400Z" /></svg>
              </button>
            </div>
          )}
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
              {listing.showPhone && (
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
              )}
            </div>

            <div className="mt-6 space-y-4">
              {!showMessageForm ? (
                <button
                  onClick={() => setShowMessageForm(true)}
                  className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Mesaj Gönder
                </button>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-4">
                  {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                  )}
                  {messageSent && (
                    <div className="text-green-500 text-sm">Mesajınız başarıyla gönderildi.</div>
                  )}
                  <div>
                    <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 mb-1">
                      Adınız Soyadınız
                    </label>
                    <input
                      type="text"
                      id="senderName"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Adınız Soyadınız"
                    />
                  </div>
                  <div>
                    <label htmlFor="senderEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      E-posta Adresiniz
                    </label>
                    <input
                      type="email"
                      id="senderEmail"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="ornek@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Mesajınız
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="İlan sahibine mesajınızı yazın..."
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      Gönder
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMessageForm(false);
                        setError('');
                        setMessageSent(false);
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      İptal
                    </button>
                  </div>
                </form>
              )}
            </div>
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