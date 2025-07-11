import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { authService } from '../services/authService';
import { registerForPushNotificationsAsync } from '../services/notificationService';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  isVerified: boolean;
  isPremium: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const storedToken = await AsyncStorage.getItem('token');
      
      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // Verify token with backend
        try {
          const response = await authService.verifyToken(storedToken);
          if (response.user) {
            setUser(response.user);
            await AsyncStorage.setItem('user', JSON.stringify(response.user));
          }
        } catch (error) {
          // Token is invalid, clear storage
          await AsyncStorage.multiRemove(['user', 'token']);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      setUser(response.user);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      await AsyncStorage.setItem('token', response.token);
      // Push token al ve backend'e gönder
      const pushToken = await registerForPushNotificationsAsync();
      if (pushToken) {
        await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'}/api/profile/push-token`,
          { token: pushToken },
          { headers: { Authorization: `Bearer ${response.token}` } }
        );
      }
    } catch (error: any) {
      Alert.alert('Giriş Hatası', error.message || 'Giriş yapılırken bir hata oluştu');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      
      setUser(response.user);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      await AsyncStorage.setItem('token', response.token);
      
    } catch (error: any) {
      Alert.alert('Kayıt Hatası', error.message || 'Kayıt olurken bir hata oluştu');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      await AsyncStorage.multiRemove(['user', 'token']);
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser as User);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 