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

const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjQwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Hw7Zyc2VsIFlvayA8L3RleHQ+PC9zdmc+';

// Örnek veri
const listings = [
  {
    id: '1',
    title: 'Örnek İlan 1',
    price: '1000 TL',
    location: 'İstanbul',
    description: 'Bu bir örnek ilan açıklamasıdır.',
    category: 'elektronik',
    subCategory: 'telefon',
    isPremium: false,
    premiumUntil: null,
    features: ['Özellik 1', 'Özellik 2'],
    images: ['https://picsum.photos/seed/1/500/300'],
    seller: {
      id: '1',
      name: 'Satıcı 1',
      email: 'satici1@example.com',
      phone: '1234567890',
    },
    createdAt: new Date(),
    views: 0,
    condition: 'Yeni',
    brand: 'Marka 1',
    model: 'Model 1',
    year: 2023,
  },
  {
    id: '2',
    title: 'Örnek İlan 2',
    price: '2000 TL',
    location: 'Ankara',
    description: 'Bu bir örnek ilan açıklamasıdır.',
    category: 'elektronik',
    subCategory: 'bilgisayar',
    isPremium: false,
    premiumUntil: null,
    features: ['Özellik 1', 'Özellik 2'],
    images: ['https://picsum.photos/seed/2/500/300'],
    seller: {
      id: '2',
      name: 'Satıcı 2',
      email: 'satici2@example.com',
      phone: '0987654321',
    },
    createdAt: new Date(),
    views: 0,
    condition: 'İkinci El',
    brand: 'Marka 2',
    model: 'Model 2',
    year: 2022,
  },
  {
    id: '3',
    title: 'Örnek İlan 3',
    price: '3000 TL',
    location: 'İzmir',
    description: 'Bu bir örnek ilan açıklamasıdır.',
    category: 'elektronik',
    subCategory: 'tablet',
    isPremium: false,
    premiumUntil: null,
    features: ['Özellik 1', 'Özellik 2'],
    images: ['https://picsum.photos/seed/3/500/300'],
    seller: {
      id: '3',
      name: 'Satıcı 3',
      email: 'satici3@example.com',
      phone: '5555555555',
    },
    createdAt: new Date(),
    views: 0,
    condition: 'Yeni',
    brand: 'Marka 3',
    model: 'Model 3',
    year: 2021,
  },
];

export default function IlanDetayPage() {
  const params = useParams();
  const { session } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [error, setError] = useState('');

  const listing = params ? listings.find(l => l.id === params.id) : undefined;

  useEffect(() => {
    if (listing) {
      const likedListings = JSON.parse(localStorage.getItem('likedListings') || '[]');
      setIsLiked(likedListings.includes(listing.id));
    }
  }, [listing]);

  const handleLike = () => {
    if (!listing) return;

    const likedListings = JSON.parse(localStorage.getItem('likedListings') || '[]');
    let newLikedListings;

    if (isLiked) {
      newLikedListings = likedListings.filter((id: string) => id !== listing.id);
    } else {
      newLikedListings = [...likedListings, listing.id];
    }

    localStorage.setItem('likedListings', JSON.stringify(newLikedListings));
    setIsLiked(!isLiked);
  };

  const handleContact = () => {
    if (!session) {
      return;
    }
    setShowContact(!showContact);
  };

  const handleShare = (platform: string) => {
    if (!listing) return;

    const shareUrl = window.location.href;
    const shareText = `${listing.title} - ${listing.price}`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'instagram':
        // Instagram için doğrudan paylaşım linki yok, kullanıcıyı Instagram'a yönlendiriyoruz
        window.open('https://www.instagram.com', '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank');
        break;
    }
    setShowShareMenu(false);
  };

  const getDefaultImage = () => {
    if (!listing) return placeholderImage;
    return `https://picsum.photos/seed/${listing.id}/500/300`;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessageSent(false);
    if (!senderName.trim() || !senderEmail.trim() || !message.trim()) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
      setError('Geçerli bir e-posta adresi girin.');
      return;
    }
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: listing?.seller.email,
          listingId: listing?.id,
          message,
          senderName,
          senderEmail,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessageSent(true);
        setMessage('');
        setSenderName('');
        setSenderEmail('');
        setShowMessageForm(false);
      } else {
        setError(data.error || 'Mesaj gönderilemedi.');
      }
    } catch (err) {
      setError('Mesaj gönderilirken bir hata oluştu.');
    }
  };

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">İlan bulunamadı</h1>
        </div>
      </div>
    );
  }

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
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* İlan Başlığı ve Fiyat */}
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{listing.title}</h1>
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold text-blue-600">{listing.price}</span>
                <span className="text-sm text-gray-500">{listing.location}</span>
              </div>
            </div>

            {/* İlan Görselleri */}
            <div className="p-6 border-b">
              <div className="relative h-[500px] mb-4">
                <Image
                  src={imageError ? getDefaultImage() : listing.images[selectedImage]}
                  alt={listing.title}
                  fill
                  className="object-contain rounded-lg"
                  onError={() => setImageError(true)}
                  unoptimized
                />
              </div>
              <div className="grid grid-cols-5 gap-4">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                    title={`${listing.title} - Görsel ${index + 1}`}
                  >
                    <Image
                      src={imageError ? getDefaultImage() : image}
                      alt={`${listing.title} - Görsel ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={() => setImageError(true)}
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* İlan Detayları */}
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold mb-4">İlan Detayları</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Kategori</p>
                  <p className="font-medium">{listing.category}</p>
                </div>
                <div>
                  <p className="text-gray-600">Alt Kategori</p>
                  <p className="font-medium">{listing.subCategory}</p>
                </div>
                <div>
                  <p className="text-gray-600">Durum</p>
                  <p className="font-medium">{listing.condition}</p>
                </div>
                <div>
                  <p className="text-gray-600">Marka</p>
                  <p className="font-medium">{listing.brand}</p>
                </div>
                <div>
                  <p className="text-gray-600">Model</p>
                  <p className="font-medium">{listing.model}</p>
                </div>
                <div>
                  <p className="text-gray-600">Yıl</p>
                  <p className="font-medium">{listing.year}</p>
                </div>
              </div>
            </div>

            {/* İlan Açıklaması */}
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold mb-4">İlan Açıklaması</h2>
              <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
            </div>
          </div>
        </div>

        {/* Sağ Kolon - Satıcı Bilgileri ve Butonlar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-4">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">{listing.seller.name}</p>
                  <p className="text-sm text-gray-500">{listing.location}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{listing.seller.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{listing.seller.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{listing.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">
                    {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setShowMessageForm(!showMessageForm)}
                  className="w-full bg-alo-orange text-white px-4 py-3 rounded-md hover:bg-orange-600 transition-colors flex items-center justify-between"
                >
                  <span>Mesaj Gönder</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                {showMessageForm && (
                  <form onSubmit={handleSendMessage} className="space-y-3 bg-gray-50 p-4 rounded-lg mt-2">
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {messageSent && <div className="text-green-500 text-sm">Mesajınız başarıyla gönderildi.</div>}
                    <div>
                      <input
                        type="text"
                        placeholder="Adınız Soyadınız"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={senderName}
                        onChange={e => setSenderName(e.target.value)}
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="E-posta Adresiniz"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={senderEmail}
                        onChange={e => setSenderEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <textarea
                        placeholder="Mesajınız"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        rows={4}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
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

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-md transition-colors ${
                      isLiked 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{isLiked ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}</span>
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>İlanı Paylaş</span>
                    </button>
                    {showShareMenu && (
                      <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-10 min-w-[200px]">
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => handleShare('facebook')}
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors p-2 rounded hover:bg-blue-50"
                          >
                            <Facebook className="w-5 h-5" />
                            <span>Facebook</span>
                          </button>
                          <button
                            onClick={() => handleShare('twitter')}
                            className="flex items-center space-x-2 text-blue-400 hover:text-blue-500 transition-colors p-2 rounded hover:bg-blue-50"
                          >
                            <Twitter className="w-5 h-5" />
                            <span>Twitter</span>
                          </button>
                          <button
                            onClick={() => handleShare('instagram')}
                            className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 transition-colors p-2 rounded hover:bg-pink-50"
                          >
                            <Instagram className="w-5 h-5" />
                            <span>Instagram</span>
                          </button>
                          <button
                            onClick={() => handleShare('whatsapp')}
                            className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors p-2 rounded hover:bg-green-50"
                          >
                            <MessageCircle className="w-5 h-5" />
                            <span>WhatsApp</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button className="w-full flex items-center justify-between px-4 py-3 bg-orange-100 text-orange-600 rounded-md hover:bg-orange-200 transition-colors">
                  <span>Bir Usulsüzlüğü Bildirin</span>
                  <AlertTriangle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 