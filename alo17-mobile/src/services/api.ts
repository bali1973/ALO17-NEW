import { Alert } from 'react-native';

const API_BASE_URL = 'http://localhost:3000/api'; // Port 3000'e güncellendi

interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, success: true };
    } catch (error) {
      console.error('API Error:', error);
      return { 
        error: error instanceof Error ? error.message : 'Unknown error', 
        success: false 
      };
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Listings endpoints
  async getListings(params?: {
    category?: string;
    subcategory?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: 'newest' | 'oldest' | 'price' | 'views' | 'premium';
    priceMin?: number;
    priceMax?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.subcategory) queryParams.append('subcategory', params.subcategory);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.priceMin) queryParams.append('priceMin', params.priceMin.toString());
    if (params?.priceMax) queryParams.append('priceMax', params.priceMax.toString());

    const endpoint = `/listings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async getListing(id: string) {
    return this.request(`/listings/${id}`);
  }

  async getSimilarListings(id: string) {
    return this.request(`/listings/${id}/similar`);
  }

  async createListing(listingData: {
    title: string;
    description: string;
    price: number;
    category: string;
    subcategory?: string;
    location: string;
    condition: string;
    images?: string[];
    features?: string[];
  }) {
    return this.request('/listings', {
      method: 'POST',
      body: JSON.stringify(listingData),
    });
  }

  async updateListing(id: string, listingData: Partial<{
    title: string;
    description: string;
    price: number;
    category: string;
    subcategory: string;
    location: string;
    condition: string;
    images: string[];
    features: string[];
  }>) {
    return this.request(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(listingData),
    });
  }

  async deleteListing(id: string) {
    return this.request(`/listings/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories endpoints
  async getCategories() {
    return this.request('/categories');
  }

  async getCategory(slug: string) {
    return this.request(`/categories/${slug}`);
  }

  async getSubcategories(categorySlug: string) {
    return this.request(`/categories/${categorySlug}/subcategories`);
  }

  // Messages endpoints
  async getMessages() {
    return this.request('/messages');
  }

  async sendMessage(messageData: {
    recipientId: string;
    content: string;
    listingId?: string;
  }) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async markMessageAsRead(messageId: string) {
    return this.request(`/messages/${messageId}/read`, {
      method: 'PUT',
    });
  }

  // User profile endpoints
  async getUserProfile() {
    return this.request('/user/profile');
  }

  async updateProfile(profileData: {
    name?: string;
    phone?: string;
    avatar?: string;
    location?: string;
  }) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Favorites endpoints
  async getFavorites() {
    return this.request('/user/favorites');
  }

  async addToFavorites(listingId: string) {
    return this.request('/user/favorites', {
      method: 'POST',
      body: JSON.stringify({ listingId }),
    });
  }

  async removeFromFavorites(listingId: string) {
    return this.request(`/user/favorites/${listingId}`, {
      method: 'DELETE',
    });
  }

  // Notifications endpoints
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async getUnreadNotificationCount() {
    return this.request('/notifications/unread/count');
  }

  // Search endpoints
  async search(query: string, filters?: {
    category?: string;
    subcategory?: string;
    priceMin?: number;
    priceMax?: number;
    location?: string;
    condition?: string;
  }) {
    const searchData = { query, filters };
    return this.request('/search', {
      method: 'POST',
      body: JSON.stringify(searchData),
    });
  }

  // Reports endpoints
  async reportListing(listingId: string, reason: string, description?: string) {
    return this.request('/reports', {
      method: 'POST',
      body: JSON.stringify({ listingId, reason, description }),
    });
  }

  async getReports() {
    return this.request('/reports');
  }

  // Premium features
  async getPremiumPlans() {
    return this.request('/premium/plans');
  }

  async upgradeToPremium(planId: string) {
    return this.request('/premium/upgrade', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });
  }

  // Analytics
  async trackListingView(listingId: string) {
    return this.request('/analytics/view', {
      method: 'POST',
      body: JSON.stringify({ listingId }),
    });
  }

  async trackSearch(query: string) {
    return this.request('/analytics/search', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }

  // Error handling
  handleError(error: string, title: string = 'Hata') {
    Alert.alert(title, error);
  }

  // Offline support
  async isOnline(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${API_BASE_URL}/health`, { 
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export default new ApiService(); 