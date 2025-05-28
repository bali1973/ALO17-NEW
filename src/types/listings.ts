// İlan Tipleri
export const listingTypes = {
  FREE: 'free',
  PREMIUM: 'premium',
} as const;

// İlan Durumları
export const listingStatus = {
  DRAFT: 'draft',
  PENDING_PAYMENT: 'pending_payment',
  ACTIVE: 'active',
  EXPIRED: 'expired',
  SOLD: 'sold',
} as const;

// İlan Tipi
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
  type: typeof listingTypes[keyof typeof listingTypes];
  status: typeof listingStatus[keyof typeof listingStatus];
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
    expiresAt: string | null;
    isHighlighted: boolean;
    isFeatured: boolean;
    isUrgent: boolean;
  };
};

// Kategori Tipi
export type Category = {
  id: number;
  name: string;
  icon: string;
  slug: string;
  subcategories: {
    id: number;
    name: string;
    slug: string;
  }[];
};

// Alt Kategori Tipi
export type Subcategory = {
  id: number;
  name: string;
  slug: string;
}; 