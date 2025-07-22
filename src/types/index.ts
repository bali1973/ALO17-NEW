export interface Listing {
  id: string;
  title: string;
  description: string;
  price: string | number;
  category: string;
  subCategory?: string;
  city: string;
  images?: string[];
  isPremium?: boolean;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
} 