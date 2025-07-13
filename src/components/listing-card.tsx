import Link from "next/link"
import { useState, useEffect } from "react"
import { OptimizedImage } from "@/components/optimized-image"
import { Heart, Eye, Clock, Star, MapPin, Tag, Zap, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from '@/components/ToastProvider';

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
    setIsFavorite(getFavoriteIds().includes(listing.id));
    if (typeof window !== 'undefined') {
      const freq = JSON.parse(localStorage.getItem('frequentlyUsed') || '[]');
      setIsFrequent(freq.includes(listing.id));
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
          <OptimizedImage
            src={getImageUrl(listing.imageUrl)}
            alt={listing.title}
            width={400}
            height={300}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            fallbackSrc="/images/placeholder.jpg"
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