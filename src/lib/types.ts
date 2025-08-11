// Merkezi tip tanımları

// User tipleri
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  phone?: string;
  isVerified: boolean;
  isActive: boolean;
}

// Session tipi
export interface Session {
  user: User;
  expires: string;
}

// Listing tipleri
export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  subcategory?: string;
  images: string | string[];
  features: string | string[];
  condition: string;
  brand?: string;
  model?: string;
  year?: string;
  mileage?: string;
  color?: string;
  fuelType?: string;
  gearType?: string;
  engineDisplacement?: string;
  enginePower?: string;
  traction?: string;
  warranty?: boolean;
  exchange?: boolean;
  fromWho?: string;
  status: 'active' | 'pending' | 'sold' | 'expired' | 'onaylandı' | 'rejected';
  isPremium: boolean;
  premiumFeatures?: string;
  premiumUntil?: Date;
  premiumPlan?: string;
  views: number;
  approvedAt?: Date;
  rejectedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: User;
}

// Category tipleri
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  order: number;
  subcategories: Subcategory[];
  createdAt: string;
  updatedAt: string;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  categoryId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// API Response tipleri
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Search ve Filter tipleri
export interface SearchFilters {
  query?: string;
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  city?: string;
  sortBy?: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'views' | 'premium';
  page?: number;
  limit?: number;
}

// Notification tipleri
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationCount {
  unreadCount: number;
  totalNotifications: number;
}

// Premium plan tipleri
export interface PremiumPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // gün cinsinden
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Payment tipleri
export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

// Message tipleri
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  listingId?: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  sender: User;
  receiver: User;
  listing?: Listing;
}

// Report tipleri
export interface Report {
  id: string;
  reporterId: string;
  listingId?: string;
  userId?: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
  updatedAt: string;
  reporter: User;
  listing?: Listing;
  reportedUser?: User;
}

// Analytics tipleri
export interface AnalyticsData {
  totalUsers: number;
  totalListings: number;
  activeListings: number;
  pendingListings: number;
  totalViews: number;
  premiumUsers: number;
  premiumListings: number;
  totalRevenue: number;
  monthlyGrowth: {
    users: number;
    listings: number;
    revenue: number;
  };
  topCategories: Array<{
    name: string;
    count: number;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}

// Form tipleri
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  agreeToTerms: boolean;
}

export interface ListingForm {
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  city: string;
  location: string;
  condition: 'new' | 'used' | 'refurbished';
  images: File[];
  isPremium?: boolean;
  premiumFeatures?: string[];
}

// Error tipleri
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Utility tipleri
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

// Component prop tipleri
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

// Event tipleri
export interface FormEvent {
  preventDefault: () => void;
  target: {
    value: string;
    name: string;
  };
}

export interface ClickEvent {
  preventDefault: () => void;
  stopPropagation: () => void;
  target: HTMLElement;
}

// Generic utility tipleri
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
}; 