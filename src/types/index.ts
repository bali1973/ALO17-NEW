export interface Listing {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  subcategory: string;
  city: string;
  location?: string;
  imageUrl?: string;
  views?: number;
  condition?: string;
  images?: string[];
  isPremium?: boolean;
  isUrgent?: boolean;
  isFeatured?: boolean;
  premiumFeatures?: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
} 