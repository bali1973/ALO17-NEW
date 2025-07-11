import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.multiRemove(['user', 'token']);
      // You might want to redirect to login here
    }
    return Promise.reject(error);
  }
);

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    phone?: string;
    avatar?: string;
    isVerified: boolean;
    isPremium: boolean;
    createdAt: string;
  };
  token: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface VerifyTokenResponse {
  user: {
    id: string;
    email: string;
    name: string;
    phone?: string;
    avatar?: string;
    isVerified: boolean;
    isPremium: boolean;
    createdAt: string;
  };
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Giriş yapılırken bir hata oluştu');
    }
  }

  async register(userData: RegisterData): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Kayıt olurken bir hata oluştu');
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async verifyToken(token: string): Promise<VerifyTokenResponse> {
    try {
      const response = await api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      throw new Error('Token doğrulanamadı');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Şifre sıfırlama e-postası gönderilemedi');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post('/auth/reset-password', { token, newPassword });
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Şifre sıfırlanamadı');
    }
  }

  async updateProfile(userData: Partial<{
    name: string;
    phone: string;
    avatar: string;
  }>): Promise<LoginResponse> {
    try {
      const response = await api.put('/auth/profile', userData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Profil güncellenemedi');
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Şifre değiştirilemedi');
    }
  }
}

export const authService = new AuthService(); 