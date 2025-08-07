export type RootStackParamList = {
  Main: undefined;
  ListingDetail: { listingId: string };
  Login: undefined;
  Register: undefined;
  Payment: {
    plan?: {
      id: string;
      name: string;
      description: string;
      price: number;
      currency: string;
      duration: number;
      features: string[];
      isPopular?: boolean;
    };
    amount?: number;
    description?: string;
  };
  PaymentSuccess: {
    token: string;
    amount: number;
  };
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Categories: undefined;
  Create: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  ListingDetail: { listingId: string };
  CategoryList: { categoryId: string; categoryName: string };
  SearchResults: { query: string };
};

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  EditProfile: undefined;
  MyListings: undefined;
  Favorites: undefined;
  Settings: undefined;
  Help: undefined;
  About: undefined;
}; 