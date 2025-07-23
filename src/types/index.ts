export interface Listing {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  subcategory: string;
  city: string;
  images?: string[];
  isPremium?: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
} 