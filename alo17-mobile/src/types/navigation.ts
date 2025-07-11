export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  ListingDetail: { listingId: string };
  Chat: { chatId: string; recipientId: string; recipientName: string };
  Favorites: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  CreateListing: undefined;
  Messages: undefined;
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