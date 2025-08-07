import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API base URL - Web uygulamasının URL'si
const API_BASE_URL = 'http://localhost:3004/api';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Token ekleme
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('alo17-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Token getirme hatası:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Hata yönetimi
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token geçersiz, kullanıcıyı logout yap
      try {
        await AsyncStorage.removeItem('alo17-token');
        await AsyncStorage.removeItem('alo17-user');
      } catch (storageError) {
        console.error('Storage temizleme hatası:', storageError);
      }
      // Auth context'e logout sinyali gönder
    }
    return Promise.reject(error);
  }
);

// İlanlar API
export const listingsAPI = {
  // Tüm ilanları getir
  getAll: (params?: {
    category?: string;
    subcategory?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => api.get('/listings', { params }),

  // Tek ilan getir
  getById: (id: string) => api.get(`/listings/${id}`),

  // Yeni ilan oluştur
  create: (data: any) => api.post('/listings', data),

  // İlan güncelle
  update: (id: string, data: any) => api.put(`/listings/${id}`, data),

  // İlan sil
  delete: (id: string) => api.delete(`/listings/${id}`),
};

// Kategoriler API
export const categoriesAPI = {
  // Tüm kategorileri getir
  getAll: () => api.get('/categories'),

  // Kategori oluştur
  create: (data: any) => api.post('/categories', data),
};

// Kullanıcılar API
export const usersAPI = {
  // Giriş yap
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),

  // Kayıt ol
  register: (data: any) => api.post('/auth/register', data),

  // Profil getir
  getProfile: () => api.get('/auth/profile'),

  // Profil güncelle
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

// Mesajlar API
export const messagesAPI = {
  // Mesaj listesi
  getConversations: () => api.get('/messages/conversations'),

  // Chat mesajları
  getMessages: (conversationId: string) => 
    api.get(`/messages/conversations/${conversationId}`),

  // Mesaj gönder
  sendMessage: (conversationId: string, message: string) =>
    api.post(`/messages/conversations/${conversationId}`, { message }),

  // Okunmamış mesaj sayısı
  getUnreadCount: () => api.get('/messages/count'),
};

// Favoriler API
export const favoritesAPI = {
  // Favori listesi
  getAll: () => api.get('/favorites'),

  // Favori ekle
  add: (listingId: string) => api.post('/favorites', { listingId }),

  // Favori çıkar
  remove: (listingId: string) => api.delete(`/favorites/${listingId}`),

  // Favori kontrolü
  check: (listingId: string) => api.get(`/favorites/${listingId}`),
};

export default api; 