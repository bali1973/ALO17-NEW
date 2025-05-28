import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// Tip tanımı
export type Listing = {
  id: number;
  title: string;
  price: string;
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
    name: string;
    rating: number;
    memberSince: string;
    phone: string;
    isVerified: boolean;
  };
  premiumFeatures: {
    isActive: boolean;
    expiresAt: string;
    isHighlighted: boolean;
    isFeatured: boolean;
    isUrgent: boolean;
  };
};

const featuredListings: Listing[] = [
  // Elektronik - Telefon
  {
    id: 1,
    title: "iPhone 14 Pro Max 256GB",
    price: "45.000",
    location: "Konak, İzmir",
    category: "Elektronik",
    subcategory: "Telefon",
    description: "Sıfır, kutusunda iPhone 14 Pro Max 256GB. Faturalı ve garantili.",
    images: [
      "/images/listings/iphone-14-pro-max-1.jpg"
    ],
    date: "2024-03-20",
    condition: "Sıfır",
    type: "premium",
    status: "active",
    showPhone: true,
    isFavorite: false,
    views: 245,
    favorites: 12,
    seller: {
      name: "Ahmet Yılmaz",
      rating: 4.8,
      memberSince: "2023-01-15",
      phone: "0532 123 4567",
      isVerified: true,
    },
    premiumFeatures: {
      isActive: true,
      expiresAt: "2024-04-20",
      isHighlighted: true,
      isFeatured: true,
      isUrgent: false,
    },
  },
  // Elektronik - Bilgisayar
  {
    id: 2,
    title: "MacBook Pro 16'' M1 Max",
    price: "75.000",
    location: "Kadıköy, İstanbul",
    category: "Elektronik",
    subcategory: "Bilgisayar",
    description: "2022 model, 32GB RAM, 1TB SSD, kutulu ve faturalı.",
    images: [
      "/images/listings/macbook-pro-16-m1-max.jpg"
    ],
    date: "2024-03-18",
    condition: "İkinci El",
    type: "standart",
    status: "active",
    showPhone: true,
    isFavorite: false,
    views: 120,
    favorites: 8,
    seller: {
      name: "Mehmet Kaya",
      rating: 4.6,
      memberSince: "2022-11-10",
      phone: "0553 987 6543",
      isVerified: false,
    },
    premiumFeatures: {
      isActive: false,
      expiresAt: "",
      isHighlighted: false,
      isFeatured: false,
      isUrgent: false,
    },
  },
];

const ListingDetailPage = () => {
  const params = useParams();
  const [listing, setListing] = useState<Listing | null>(null);

  useEffect(() => {
    if (params?.id) {
      const found = featuredListings.find((l) => l.id === Number(params.id));
      setListing(found || null);
    }
  }, [params]);

  if (!listing) return <div>İlan bulunamadı.</div>;

  return (
    <div>
      <h1>{listing.title}</h1>
      {/* Diğer detaylar ve görseller buraya eklenecek */}
    </div>
  );
};

export default ListingDetailPage; 