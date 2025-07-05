import { Listing } from "@/lib/listings"
import Link from "next/link"
import { useState } from "react"
import { OptimizedImage } from "@/components/optimized-image"
import { Heart, Eye, Clock, Star, MapPin, Tag } from "lucide-react"
import { cn } from "@/lib/utils"

interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const formatPrice = (price: string) => {
    const num = parseFloat(price.replace(/[^\d.-]/g, ''))
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(num)
  }

  const getTimeAgo = (date: string) => {
    const now = new Date()
    const created = new Date(date)
    const diffInHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Az önce'
    if (diffInHours < 24) return `${diffInHours} saat önce`
    if (diffInHours < 48) return 'Dün'
    return `${Math.floor(diffInHours / 24)} gün önce`
  }

  return (
    <div 
      className={cn(
        "group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1",
        listing.isPremium && "ring-2 ring-yellow-200"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/ilan/${listing.id}`}>
        <div className="relative h-48 overflow-hidden">
          <OptimizedImage
            src={listing.imageUrl}
            alt={listing.title}
            width={400}
            height={192}
            className="object-cover group-hover:scale-105 transition-transform duration-300 w-full h-full"
            fallbackSrc="/images/placeholder.jpg"
          />
          
          {/* Premium Badge */}
          {listing.isPremium && (
            <div className="absolute top-2 left-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <Star className="w-3 h-3 mr-1" />
                Premium
              </span>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsFavorite(!isFavorite)
            }}
            className={cn(
              "absolute top-2 right-2 p-2 rounded-full transition-all duration-200",
              isFavorite 
                ? "bg-red-500 text-white" 
                : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white"
            )}
          >
            <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
          </button>

          {/* Overlay on hover */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <span className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium">
                İncele
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          {/* Location and Time */}
          <div className="flex items-center justify-between mb-2 text-sm text-gray-500">
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {listing.location}
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {getTimeAgo(listing.createdAt.toString())}
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {listing.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {listing.description}
          </p>

          {/* Condition Badge */}
          <div className="flex items-center mb-3">
            <Tag className="w-3 h-3 mr-1 text-gray-400" />
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {listing.condition}
            </span>
          </div>

          {/* Price and Views */}
          <div className="flex items-center justify-between">
            <span className="font-bold text-xl text-blue-600">
              {formatPrice(listing.price)}
            </span>
            <div className="flex items-center text-sm text-gray-500">
              <Eye className="w-3 h-3 mr-1" />
              {listing.views || 0}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
} 