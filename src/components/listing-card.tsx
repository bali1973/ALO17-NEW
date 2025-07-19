import Link from "next/link"
import { useState, useEffect } from "react"
import { OptimizedImage } from "@/components/optimized-image"
import { Heart, Eye, Clock, Star, MapPin, Tag, Zap, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from '@/components/ToastProvider';
import Image from 'next/image';

interface Listing {
  id: number
  title: string
  price: string | number
  location: string
  description: string
  category: string
  subcategory: string
  isPremium: boolean
  imageUrl: string
  createdAt: Date
  views: number
  condition: string
  brand?: string
  model?: string
  year?: number | null
  seller?: {
    name: string
    email: string
  }
  isUrgent?: boolean
  isFeatured?: boolean
  premiumFeatures?: string[]
}

interface ListingCardProps {
  listing: Listing
}

function getFavoriteIds() {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('favorites') || '[]');
}
function setFavoriteIds(ids: number[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('favorites', JSON.stringify(ids));
}

export function ListingCard({ listing }: ListingCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isFrequent, setIsFrequent] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        setIsFavorite(getFavoriteIds().includes(listing.id));
        const freq = JSON.parse(localStorage.getItem('frequentlyUsed') || '[]');
        setIsFrequent(freq.includes(listing.id));
      } catch (e) {
        setIsFavorite(false);
        setIsFrequent(false);
        showToast('Favori veya sık kullanılanlar yüklenemedi', 'error');
      }
    }
  }, [listing.id]);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    let favs = getFavoriteIds();
    if (favs.includes(listing.id)) {
      favs = favs.filter((id: any) => id !== listing.id);
      setIsFavorite(false);
      showToast('Favorilerden çıkarıldı', 'info');
    } else {
      favs.push(listing.id);
      setIsFavorite(true);
      showToast('Favorilere eklendi', 'success');
    }
    setFavoriteIds(favs);
  };

  const handleFrequent = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;
    let freq = JSON.parse(localStorage.getItem('frequentlyUsed') || '[]');
    if (freq.includes(listing.id)) {
      freq = freq.filter((id: any) => id !== listing.id);
      setIsFrequent(false);
      showToast('Sık kullanılanlardan çıkarıldı', 'info');
    } else {
      freq.unshift(listing.id);
      if (freq.length > 20) freq = freq.slice(0, 20);
      setIsFrequent(true);
      showToast('Sık kullanılanlara eklendi', 'success');
    }
    localStorage.setItem('frequentlyUsed', JSON.stringify(freq));
  };

  const formatPrice = (price: string | number) => {
    const num = typeof price === 'string' ? parseFloat(price.replace(/[^\d.-]/g, '')) : price
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(num)
  }

  const getTimeAgo = (date: Date | string) => {
    const now = new Date()
    let targetDate: Date
    if (date instanceof Date) {
      targetDate = date
    } else if (typeof date === 'string') {
      targetDate = new Date(date)
    } else {
      return 'Bilinmeyen tarih'
    }
    if (isNaN(targetDate.getTime())) {
      return 'Bilinmeyen tarih'
    }
    const diffInHours = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60 * 60))
    if (diffInHours < 1) return 'Az önce'
    if (diffInHours < 24) return `${diffInHours} saat önce`
    if (diffInHours < 48) return 'Dün'
    return `${Math.floor(diffInHours / 24)} gün önce`
  }

  // Rozetleri modern ve renkli göster
  const renderBadges = () => {
    const badges = []
    if (listing.isPremium) {
      badges.push(
        <span key="premium" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 shadow-sm mr-1">
          <Star className="w-3 h-3 mr-1" /> Premium
        </span>
      )
    }
    if (listing.isUrgent || (listing.premiumFeatures && listing.premiumFeatures.includes('urgent'))) {
      badges.push(
        <span key="urgent" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 shadow-sm mr-1">
          <Zap className="w-3 h-3 mr-1" /> Acil
        </span>
      )
    }
    if (listing.isFeatured || (listing.premiumFeatures && listing.premiumFeatures.includes('featured'))) {
      badges.push(
        <span key="featured" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 shadow-sm mr-1">
          <TrendingUp className="w-3 h-3 mr-1" /> Öne Çıkan
        </span>
      )
    }
    if (listing.premiumFeatures && listing.premiumFeatures.includes('highlighted')) {
      badges.push(
        <span key="highlighted" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 shadow-sm mr-1">
          <Star className="w-3 h-3 mr-1" /> Vurgulu
        </span>
      )
    }
    return badges.length > 0 ? (
      <div className="absolute top-3 left-3 flex flex-wrap z-10">{badges}</div>
    ) : null
  }

  // Görsel oranı ve fallback iyileştirildi
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl || typeof imageUrl !== 'string') {
      return '/images/placeholder.jpg';
    }
    const trimmedUrl = imageUrl.trim();
    if (trimmedUrl === '') {
      return '/images/placeholder.jpg';
    }
    if (trimmedUrl.startsWith('[') && trimmedUrl.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmedUrl);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : '/images/placeholder.jpg';
      } catch (error) {
        return '/images/placeholder.jpg';
      }
    }
    return trimmedUrl;
  }

  return (
    <div
      className={cn(
        "group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 focus-within:ring-2 focus-within:ring-blue-300",
        listing.isPremium && "ring-2 ring-yellow-200"
      )}
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/ilan/${listing.id}`} tabIndex={-1} className="block focus:outline-none">
        <div className="relative aspect-[4/3] bg-gray-50">
          <Image
            src={listing.imageUrl && listing.imageUrl.trim() !== '' ? listing.imageUrl : '/images/placeholder.jpg'}
            alt={listing.title}
            width={400}
            height={300}
            className="w-full h-48 object-cover rounded-t-lg"
            loading="lazy"
          />
          {renderBadges()}
          {/* Favori ve sık kullanılan butonları */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            {/* Favori butonu */}
            <button
              aria-label={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
              onClick={handleFavorite}
              className={cn(
                "p-2 rounded-full shadow-md border border-white/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400",
                isFavorite
                  ? "bg-red-500 text-white scale-110 animate-pulse"
                  : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white"
              )}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleFavorite(e as any); }}
            >
              <Heart className={cn("w-5 h-5", isFavorite && "fill-current animate-heartbeat")} />
            </button>
            {/* Sık kullanılan butonu */}
            <button
              aria-label={isFrequent ? "Sık kullanılanlardan çıkar" : "Sık kullanılanlara ekle"}
              onClick={handleFrequent}
              className={cn(
                "p-2 rounded-full shadow-md border border-white/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400",
                isFrequent
                  ? "bg-yellow-400 text-white scale-110 animate-pulse"
                  : "bg-white/80 text-yellow-500 hover:bg-yellow-400 hover:text-white"
              )}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleFrequent(e as any); }}
            >
              <Star className={cn("w-5 h-5", isFrequent && "fill-current animate-heartbeat")} />
            </button>
          </div>
          {/* Hover overlay */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-all">
              <span className="bg-white/90 text-gray-800 px-4 py-2 rounded-lg font-medium shadow">İncele</span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col gap-2">
          {/* Lokasyon ve zaman */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{listing.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{getTimeAgo(listing.createdAt)}</span>
            </div>
          </div>
          {/* Başlık */}
          <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {listing.title}
          </h3>
          {/* Açıklama */}
          <p className="text-gray-600 text-sm line-clamp-2 mb-1">{listing.description}</p>
          {/* Durum etiketi */}
          <div className="flex items-center gap-2 mb-1">
            <Tag className="w-4 h-4 text-gray-400" />
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {listing.condition}
            </span>
          </div>
          {/* Fiyat ve görüntüleme */}
          <div className="flex items-center justify-between mt-2">
            <span className="font-extrabold text-xl md:text-2xl text-blue-600">
              {formatPrice(listing.price)}
            </span>
            <div className="flex items-center text-xs text-gray-500">
              <Eye className="w-4 h-4 mr-1" />
              {listing.views || 0}
            </div>
          </div>
          {/* Paylaş butonu ve sosyal medya ikonları */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-gray-500">Paylaş:</span>
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
              <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
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
              <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.916 4.916 0 0 0 16.616 3c-2.72 0-4.924 2.206-4.924 4.924 0 .386.044.763.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.724-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.212c9.057 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 24 4.557z"/></svg>
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
              <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M20.52 3.48A11.78 11.78 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.56 4.19 1.62 6.01L0 24l6.18-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.68-.5-5.26-1.44l-.38-.22-3.67.97.98-3.58-.25-.37A9.93 9.93 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.6c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.97.95-.97 2.3 0 1.35.99 2.65 1.13 2.83.14.18 1.95 2.98 4.74 4.06.66.28 1.18.45 1.58.58.66.21 1.26.18 1.73.11.53-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.18-.53-.32z"/></svg>
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
              <svg width="20" height="20" fill="white" viewBox="0 0 448 512"><path d="M224,202.66A53.34,53.34,0,1,0,277.34,256,53.38,53.38,0,0,0,224,202.66Zm124.71-41a54,54,0,0,0-30.36-30.36C293.19,120,256,118.13,224,118.13s-69.19,1.87-94.35,13.17a54,54,0,0,0-30.36,30.36C120,162.81,118.13,200,118.13,232s1.87,69.19,13.17,94.35a54,54,0,0,0,30.36,30.36C162.81,392,200,393.87,232,393.87s69.19-1.87,94.35-13.17a54,54,0,0,0,30.36-30.36C392,349.19,393.87,312,393.87,280S392,162.81,348.71,161.66ZM224,338a82,82,0,1,1,82-82A82,82,0,0,1,224,338Zm85.4-148.6a19.2,19.2,0,1,1-19.2-19.2A19.2,19.2,0,0,1,309.4,189.4ZM398.8,80A64,64,0,0,0,368,51.2C346.6,32,320.4,32,224,32S101.4,32,80,51.2A64,64,0,0,0,51.2,80C32,101.4,32,127.6,32,224s0,122.6,19.2,144A64,64,0,0,0,80,460.8C101.4,480,127.6,480,224,480s122.6,0,144-19.2a64,64,0,0,0,28.8-28.8C480,422.6,480,396.4,480,300S480,101.4,398.8,80ZM224,400c-88.22,0-160-71.78-160-160S135.78,80,224,80s160,71.78,160,160S312.22,400,224,400Z" /></svg>
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}

export function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 animate-pulse overflow-hidden">
      <div className="relative aspect-[4/3] bg-gray-200">
        <div className="absolute top-3 left-3 w-20 h-6 bg-gray-300 rounded-full" />
        <div className="absolute top-3 right-3 w-8 h-8 bg-gray-300 rounded-full" />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between mb-1">
          <div className="w-20 h-4 bg-gray-200 rounded" />
          <div className="w-16 h-4 bg-gray-200 rounded" />
        </div>
        <div className="w-3/4 h-6 bg-gray-200 rounded mb-1" />
        <div className="w-1/2 h-4 bg-gray-200 rounded mb-1" />
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-4 bg-gray-200 rounded" />
          <div className="w-12 h-4 bg-gray-200 rounded" />
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="w-24 h-6 bg-gray-200 rounded" />
          <div className="w-10 h-4 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  )
}

// Favori animasyonu için ek CSS (tailwind.config.js'e eklenmeli):
// 'heartbeat': '0.25s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate',
// .animate-heartbeat { animation: heartbeat 0.25s cubic-bezier(0.4,0,0.6,1) infinite alternate; } 