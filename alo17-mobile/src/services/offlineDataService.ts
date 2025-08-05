import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface OfflineAction {
  id: string;
  type: 'CREATE_LISTING' | 'UPDATE_LISTING' | 'DELETE_LISTING' | 'SEND_MESSAGE' | 'UPDATE_PROFILE';
  data: any;
  timestamp: number;
  retryCount: number;
}

interface CachedData {
  key: string;
  data: any;
  timestamp: number;
  expiresAt: number;
}

class OfflineDataService {
  private static instance: OfflineDataService;
  private isOnline = true;
  private syncQueue: OfflineAction[] = [];
  private syncInProgress = false;

  static getInstance(): OfflineDataService {
    if (!OfflineDataService.instance) {
      OfflineDataService.instance = new OfflineDataService();
    }
    return OfflineDataService.instance;
  }

  async initialize() {
    // İnternet bağlantısını dinle
    this.setupNetworkListener();
    
    // Offline aksiyonları yükle
    await this.loadOfflineActions();
    
    // İlk senkronizasyonu başlat
    this.syncOfflineActions();
  }

  private setupNetworkListener() {
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;

      if (wasOffline && this.isOnline) {
        // Çevrimiçi olduğunda senkronizasyonu başlat
        this.syncOfflineActions();
      }
    });
  }

  // Veri önbellekleme
  async cacheData(key: string, data: any, ttlMinutes: number = 60) {
    try {
      const cachedData: CachedData = {
        key,
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + (ttlMinutes * 60 * 1000),
      };

      await AsyncStorage.setItem(`cache_${key}`, JSON.stringify(cachedData));
    } catch (error) {
      console.error('Error caching data:', error);
    }
  }

  async getCachedData(key: string): Promise<any | null> {
    try {
      const cached = await AsyncStorage.getItem(`cache_${key}`);
      if (!cached) return null;

      const cachedData: CachedData = JSON.parse(cached);
      
      // Önbellek süresi dolmuş mu kontrol et
      if (Date.now() > cachedData.expiresAt) {
        await this.removeCachedData(key);
        return null;
      }

      return cachedData.data;
    } catch (error) {
      console.error('Error getting cached data:', error);
      return null;
    }
  }

  async removeCachedData(key: string) {
    try {
      await AsyncStorage.removeItem(`cache_${key}`);
    } catch (error) {
      console.error('Error removing cached data:', error);
    }
  }

  async clearAllCachedData() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith('cache_'));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Error clearing cached data:', error);
    }
  }

  // Offline aksiyon yönetimi
  async addOfflineAction(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>) {
    try {
      const offlineAction: OfflineAction = {
        ...action,
        id: Date.now().toString(),
        timestamp: Date.now(),
        retryCount: 0,
      };

      this.syncQueue.push(offlineAction);
      await this.saveOfflineActions();

      // Çevrimiçiyse hemen senkronize et
      if (this.isOnline) {
        this.syncOfflineActions();
      }
    } catch (error) {
      console.error('Error adding offline action:', error);
    }
  }

  private async loadOfflineActions() {
    try {
      const actions = await AsyncStorage.getItem('offlineActions');
      this.syncQueue = actions ? JSON.parse(actions) : [];
    } catch (error) {
      console.error('Error loading offline actions:', error);
      this.syncQueue = [];
    }
  }

  private async saveOfflineActions() {
    try {
      await AsyncStorage.setItem('offlineActions', JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Error saving offline actions:', error);
    }
  }

  private async syncOfflineActions() {
    if (this.syncInProgress || !this.isOnline || this.syncQueue.length === 0) {
      return;
    }

    this.syncInProgress = true;

    try {
      const actionsToSync = [...this.syncQueue];
      
      for (const action of actionsToSync) {
        try {
          await this.executeOfflineAction(action);
          
          // Başarılı aksiyonu kuyruktan kaldır
          this.syncQueue = this.syncQueue.filter(a => a.id !== action.id);
        } catch (error) {
          console.error('Error executing offline action:', error);
          
          // Yeniden deneme sayısını artır
          action.retryCount++;
          
          // Maksimum 3 kez dene
          if (action.retryCount >= 3) {
            this.syncQueue = this.syncQueue.filter(a => a.id !== action.id);
          }
        }
      }

      await this.saveOfflineActions();
    } finally {
      this.syncInProgress = false;
    }
  }

  private async executeOfflineAction(action: OfflineAction) {
    const { type, data } = action;

    switch (type) {
      case 'CREATE_LISTING':
        await this.createListingOffline(data);
        break;
      case 'UPDATE_LISTING':
        await this.updateListingOffline(data);
        break;
      case 'DELETE_LISTING':
        await this.deleteListingOffline(data);
        break;
      case 'SEND_MESSAGE':
        await this.sendMessageOffline(data);
        break;
      case 'UPDATE_PROFILE':
        await this.updateProfileOffline(data);
        break;
      default:
        throw new Error(`Unknown offline action type: ${type}`);
    }
  }

  private async createListingOffline(data: any) {
    const response = await fetch('http://localhost:3000/api/listings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create listing');
    }
  }

  private async updateListingOffline(data: any) {
    const { id, ...updateData } = data;
    const response = await fetch(`http://localhost:3000/api/listings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error('Failed to update listing');
    }
  }

  private async deleteListingOffline(data: any) {
    const response = await fetch(`http://localhost:3000/api/listings/${data.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete listing');
    }
  }

  private async sendMessageOffline(data: any) {
    const response = await fetch('http://localhost:3000/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }
  }

  private async updateProfileOffline(data: any) {
    const response = await fetch('http://localhost:3000/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
  }

  // İlan verilerini offline olarak sakla
  async saveListingsOffline(listings: any[]) {
    try {
      await AsyncStorage.setItem('offlineListings', JSON.stringify({
        data: listings,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Error saving listings offline:', error);
    }
  }

  async getOfflineListings(): Promise<any[]> {
    try {
      const cached = await AsyncStorage.getItem('offlineListings');
      if (!cached) return [];

      const { data, timestamp } = JSON.parse(cached);
      
      // 24 saat geçerli
      if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
        await AsyncStorage.removeItem('offlineListings');
        return [];
      }

      return data;
    } catch (error) {
      console.error('Error getting offline listings:', error);
      return [];
    }
  }

  // Kullanıcı verilerini offline olarak sakla
  async saveUserDataOffline(userData: any) {
    try {
      await AsyncStorage.setItem('offlineUserData', JSON.stringify({
        data: userData,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Error saving user data offline:', error);
    }
  }

  async getOfflineUserData(): Promise<any | null> {
    try {
      const cached = await AsyncStorage.getItem('offlineUserData');
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      
      // 7 gün geçerli
      if (Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) {
        await AsyncStorage.removeItem('offlineUserData');
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting offline user data:', error);
      return null;
    }
  }

  // Favori ilanları offline olarak sakla
  async saveFavoritesOffline(favorites: any[]) {
    try {
      await AsyncStorage.setItem('offlineFavorites', JSON.stringify({
        data: favorites,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Error saving favorites offline:', error);
    }
  }

  async getOfflineFavorites(): Promise<any[]> {
    try {
      const cached = await AsyncStorage.getItem('offlineFavorites');
      if (!cached) return [];

      const { data, timestamp } = JSON.parse(cached);
      
      // 7 gün geçerli
      if (Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) {
        await AsyncStorage.removeItem('offlineFavorites');
        return [];
      }

      return data;
    } catch (error) {
      console.error('Error getting offline favorites:', error);
      return [];
    }
  }

  // Offline durumunu kontrol et
  isOffline(): boolean {
    return !this.isOnline;
  }

  // Senkronizasyon durumunu kontrol et
  isSyncing(): boolean {
    return this.syncInProgress;
  }

  // Bekleyen aksiyon sayısını al
  getPendingActionsCount(): number {
    return this.syncQueue.length;
  }

  // Manuel senkronizasyon başlat
  async forceSync() {
    if (this.isOnline) {
      await this.syncOfflineActions();
    }
  }

  // Tüm offline verileri temizle
  async clearAllOfflineData() {
    try {
      await AsyncStorage.multiRemove([
        'offlineActions',
        'offlineListings',
        'offlineUserData',
        'offlineFavorites',
      ]);
      
      this.syncQueue = [];
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  }
}

export default OfflineDataService.getInstance(); 