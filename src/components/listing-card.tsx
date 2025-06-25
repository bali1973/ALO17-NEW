import { Listing } from "@/lib/listings"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  const [imageError, setImageError] = useState(false)

  const getDefaultImage = () => {
    return `https://picsum.photos/seed/${listing.id}/500/300`
  }

  return (
    <Link href={`/ilan/${listing.id}`}>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative h-48">
          <Image
            src={imageError ? getDefaultImage() : listing.imageUrl}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            onError={() => setImageError(true)}
            unoptimized
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-500">{listing.location}</span>
            <span className="text-sm text-gray-500">{listing.condition}</span>
          </div>
          <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg text-blue-600">
              {listing.price}
            </span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              İncele
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
} 