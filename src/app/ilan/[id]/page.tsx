'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Providers';
import useSWR from 'swr';
import { Listing } from '@/types/listings';
import {
  MapPin,
  Calendar,
  Eye,
  Heart,
  Share2,
  Phone,
  Mail,
  MessageCircle,
  AlertTriangle,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';

interface IlanDetayPageProps {
  params: Promise<{ id: string }>;
}

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) {
    throw new Error('İlan bulunamadı veya silinmiş olabilir. Lütfen geçerli bir ilan ID giriniz.');
  }
  return res.json();
});

export default function IlanDetayPage({ params }: IlanDetayPageProps) {
  const resolvedParams = React.use(params);
  const { data: ilan, error: ilanError } = useSWR<Listing>(`/api/listings/${resolvedParams.id}`, fetcher);
  const { data: similarListings, error: similarError } = useSWR<Listing[]>(`/api/listings/${resolvedParams.id}/similar`, fetcher);

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [favMsg, setFavMsg] = useState<string | null>(null);
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [modalInfo, setModalInfo] = useState<string | null>(null);
  const router = useRouter();
  const { session } = useAuth();

  // Görsel alanı: string veya dizi olabilir
  let images: string[] = [];
  if (ilan?.images) {
    if (typeof ilan.images === 'string') {
      try {
        const parsed = JSON.parse(ilan.images);
        if (Array.isArray(parsed)) images = parsed;
        else images = [ilan.images];
      } catch {
        images = [ilan.images];
      }
    } else if (Array.isArray(ilan.images)) {
      images = ilan.images;
    }
  }

  // Eğer hiç görsel yoksa placeholder kullan
  if (images.length === 0) {
    images = ['/images/placeholder.svg'];
  }



  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  // Özellikler alanı: string veya dizi olabilir
  let features: string[] = [];
  if (ilan?.features) {
    if (typeof ilan.features === 'string') {
      try {
        const parsed = JSON.parse(ilan.features);
        if (Array.isArray(parsed)) features = parsed;
        else features = [ilan.features];
      } catch {
        features = ilan.features.split(',').map(f => f.trim());
      }
    } else if (Array.isArray(ilan.features)) {
      features = ilan.features;
    }
  }

  // Favorilere ekle fonksiyonu
  const handleAddFavorite = () => {
    if (!session) {
      router.push(`/giris?redirect=/ilan/${resolvedParams.id}`);
      return;
    }
    if (!ilan) return;
    try {
      const key = 'frequentlyUsed';
      let favs: number[] = [];
      if (typeof window !== 'undefined') {
        favs = JSON.parse(localStorage.getItem(key) || '[]');
        const ilanId = typeof ilan.id === 'string' ? parseInt(ilan.id) : ilan.id;
        if (favs.includes(ilanId)) {
          setFavMsg('Bu ilan zaten favorilerde!');
          return;
        }
        favs.unshift(ilanId);
        localStorage.setItem(key, JSON.stringify(favs));
        setFavMsg('Favorilere eklendi!');
      }
    } catch {
      setFavMsg('Favorilere eklenirken hata oluştu.');
    }
    setTimeout(() => setFavMsg(null), 2000);
  };

  // Mesaj gönder fonksiyonu
  const handleSendMessage = async () => {
    if (!session) {
      router.push(`/giris?redirect=/ilan/${resolvedParams.id}`);
      return;
    }
    if (!messageContent.trim()) {
      setModalInfo('Mesaj boş olamaz!');
      return;
    }
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: session.user.name || session.user.email,
          senderEmail: session.user.email,
          receiver: ilan?.email || 'bilinmiyor',
          content: messageContent,
          subject: `İlan Hakkında: ${ilan?.title || 'İlan'}`,
          type: 'listing',
          date: new Date().toISOString(),
        })
      });
      if (res.ok) {
        setModalInfo('Mesaj gönderildi!');
        setMessageContent('');
        setTimeout(() => { setShowMsgModal(false); setModalInfo(null); }, 1500);
      } else {
        setModalInfo('Mesaj gönderilemedi!');
      }
    } catch {
      setModalInfo('Mesaj gönderilemedi!');
    }
  };

  // Paylaş fonksiyonları
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: ilan?.title || 'İlan',
        text: ilan?.description || 'Bu ilanı inceleyin',
        url: window.location.href
      });
    } else {
      // Fallback: URL'yi panoya kopyala
      navigator.clipboard.writeText(window.location.href);
      alert('Link panoya kopyalandı!');
    }
  };

  // Rapor gönder fonksiyonu
  const handleSendReport = () => {
    if (!session) {
      router.push(`/giris?redirect=/ilan/${resolvedParams.id}`);
      return;
    }
    // Yeni rapor sayfasına yönlendir
    const reportUrl = `/rapor-gonder?listingId=${resolvedParams.id}&listingTitle=${encodeURIComponent(ilan?.title || '')}`;
    router.push(reportUrl);
  };

  const shareToFacebook = () => {
    const shareUrl = window.location.href;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareToInstagram = () => {
    const shareUrl = window.location.href;
    const instagramUrl = `https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`;
    window.open(instagramUrl, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const shareUrl = window.location.href;
    const message = `${ilan?.title || 'İlan'}\n\n${ilan?.description || ''}\n\n${shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const shareUrl = window.location.href;
    const message = `${ilan?.title || 'İlan'}\n\n${shareUrl}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  if (ilanError) return <div className="p-8 text-red-600 font-semibold">{ilanError.message || 'İlan bulunamadı.'}</div>;
  if (!ilan) return <div className="p-8">Yükleniyor...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Görseller */}
        <div className="md:w-1/2">
          {images.length > 0 ? (
            <div className="flex flex-col gap-4">
              {/* Ana Resim */}
              <div className="w-full h-96 relative">
                <Image
                  src={selectedImage || '/images/placeholder.svg'}
                  alt={ilan.title || 'İlan görseli'}
                  fill
                  className="rounded-lg object-cover"
                  unoptimized
                />
              </div>
              {/* Küçük Resimler */}
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className={`w-20 h-20 relative rounded-md cursor-pointer border-2 ${selectedImage === img ? 'border-blue-500' : 'border-transparent'}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <Image
                      src={img}
                      alt={`${ilan.title || 'İlan'} - ${i + 1}`}
                      fill
                      className="rounded-md object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-200 w-full h-64 flex items-center justify-center rounded-lg">
              <div className="text-gray-500 text-center">
                <div className="text-4xl mb-2">📷</div>
                <div>Görsel yok</div>
              </div>
            </div>
          )}
        </div>
        {/* Bilgiler */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <h1 className="text-2xl font-bold mb-2">{ilan.title}</h1>
          <div className="text-lg text-gray-700 font-semibold">Fiyat: {ilan.price} TL</div>
          <div className="text-gray-500">{ilan.description}</div>
          <div className="flex flex-wrap gap-2 mt-2">
            {features.length > 0 && features.map((f, i) => (
              <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{f}</span>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div><b>Durum:</b> {ilan.condition || '-'}</div>
            <div><b>Konum:</b> {ilan.location || '-'}</div>
            <div><b>Kategori:</b> {ilan.category || '-'}</div>
            <div><b>Alt Kategori:</b> {ilan.subcategory || '-'}</div>
            <div><b>Marka:</b> {ilan.brand || '-'}</div>
            <div><b>Model:</b> {ilan.model || '-'}</div>
            <div><b>Yıl:</b> {ilan.year || '-'}</div>
            <div><b>İlan Durumu:</b> {ilan.status || '-'}</div>
            <div><b>Premium:</b> {ilan.isPremium ? 'Evet' : 'Hayır'}</div>
            <div><b>Görüntülenme:</b> {ilan.views ?? '-'}</div>
            <div><b>Eklenme:</b> {ilan.createdAt ? new Date(ilan.createdAt).toLocaleString('tr-TR') : '-'}</div>
            <div><b>Güncelleme:</b> {ilan.updatedAt ? new Date(ilan.updatedAt).toLocaleString('tr-TR') : '-'}</div>
          </div>
          <div className="mt-4 text-sm">
            <b>Kullanıcı:</b> {typeof ilan.user === 'string' ? ilan.user : ilan.user?.name || ilan.userId || '-'}<br />
            <b>E-posta:</b> {ilan.email || '-'}
          </div>
          {/* İşlevsel butonlar */}
          <div className="flex gap-2 mt-6">
            <button
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
              onClick={handleAddFavorite}
              title={session ? '' : 'Bu işlemi yapmak için giriş yapmalısınız.'}
            >Favorilere Ekle</button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          onClick={() => {
              if (!session) {
                router.push(`/giris?redirect=/ilan/${resolvedParams.id}`);
                return;
              }
              setShowMsgModal(true);
            }}
              title={session ? '' : 'Bu işlemi yapmak için giriş yapmalısınız.'}
            >Mesaj Gönder</button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              onClick={handleSendReport}
              title={session ? '' : 'Bu işlemi yapmak için giriş yapmalısınız.'}
            >İlanı Bildir</button>
            <div className="relative group">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2"
                onClick={handleShare}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Paylaş
              </button>

              {/* Sosyal Medya Dropdown */}
              <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="flex gap-2">
                  <button
                    onClick={shareToFacebook}
                    className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    title="Facebook'ta Paylaş"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>

                  <button
                    onClick={shareToInstagram}
                    className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded hover:from-purple-600 hover:to-pink-600 transition-colors"
                    title="Instagram'da Paylaş"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </button>

                  <button
                    onClick={shareToWhatsApp}
                    className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    title="WhatsApp'ta Paylaş"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </button>

                  <button
                    onClick={shareToTwitter}
                    className="p-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors"
                    title="Twitter'da Paylaş"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {favMsg && <div className="mt-2 text-green-600 font-semibold">{favMsg}</div>}
        </div>
      </div>
      {/* Benzer İlanlar */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Benzer İlanlar</h2>
          <div className="text-sm text-gray-500">
            {similarListings && similarListings.length > 0 && (
              <span>{similarListings.length} ilan bulundu</span>
            )}
          </div>
        </div>
        {similarError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
            <div className="flex items-center">
              <span className="text-xl mr-2">⚠️</span>
              <span>Benzer ilanlar yüklenirken bir hata oluştu.</span>
            </div>
          </div>
        )}
        {!similarListings && !similarError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded mb-3"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {similarListings && similarListings.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Benzer İlan Bulunamadı</h3>
            <p className="text-gray-500 mb-4">
              Bu kategori için henüz benzer ilan bulunmuyor. Diğer kategorilerde arama yapabilirsiniz.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span className="mr-2">🏠</span>
              Ana Sayfaya Dön
            </Link>
          </div>
        )}
        {similarListings && similarListings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {similarListings.slice(0, 6).map((listing) => (
              <Link key={listing.id} href={`/ilan/${listing.id}`} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
                {/* Resim Bölümü */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {listing.images && Array.isArray(listing.images) && listing.images.length > 0 ? (
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-gray-400 text-4xl">📷</div>
                    </div>
                  )}

                  {/* Premium Badge */}
                  {listing.premium && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                      PREMIUM
                    </div>
                  )}

                  {/* Fiyat Badge */}
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-70 text-white text-sm font-bold rounded">
                    {typeof listing.price === 'number'
                      ? listing.price.toLocaleString('tr-TR')
                      : listing.price} ₺
                  </div>
                </div>

                {/* İçerik Bölümü */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {listing.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {listing.description}
                  </p>

                  {/* Meta Bilgiler */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center">
                      <span className="mr-2">📍</span>
                      <span>{listing.city || listing.location || 'Bilinmiyor'}</span>
                    </div>
                    {listing.views && (
                      <div className="flex items-center">
                        <span className="mr-1">👁️</span>
                        <span>{listing.views}</span>
                      </div>
                    )}
                  </div>

                  {/* Detay Butonu */}
                  <div className="text-center">
                    <span className="inline-flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
                      Detayları Gör
                      <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      {/* Mesaj Gönder Modalı */}
      {showMsgModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative">
            <button onClick={() => setShowMsgModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">&times;</button>
            <h2 className="text-xl font-bold mb-4">Mesaj Gönder</h2>
            <textarea value={messageContent} onChange={e => setMessageContent(e.target.value)} className="w-full border rounded p-2 mb-4" rows={4} placeholder="Mesajınızı yazın..." />
            <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">Gönder</button>
            {modalInfo && <div className="mt-2 text-green-600">{modalInfo}</div>}
          </div>
        </div>
      )}
    </div>
  );
} 