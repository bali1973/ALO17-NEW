// İlan tipleri ve durumları
export const listingTypes = {
  FREE: 'free',
  PREMIUM: 'premium'
} as const;

export const listingStatus = {
  ACTIVE: 'active',
  PENDING: 'pending',
  SOLD: 'sold',
  EXPIRED: 'expired'
} as const;

// Kategori ve alt kategori tipleri
export type CategorySlug = 'elektronik' | 'spor' | 'ev-yasam' | 'hizmetler';
export type SubCategorySlug = 'telefon' | 'bilgisayar' | 'fitness' | 'tenis' | 'mobilya' | 'beyaz-esya' | 'ozel-ders' | 'temizlik';

// İlan tipi
export interface Listing {
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
}

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