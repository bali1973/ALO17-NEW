import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface PendingAction {
  id: string;
  type: 'create_listing' | 'send_message' | 'report_listing' | 'update_profile';
  data: any;
  timestamp: number;
}

class OfflineStorage {
  private readonly PREFIX = 'alo17_';
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 saat

  // Cache operations
  async saveToCache<T>(key: string, data: T, ttl?: number): Promise<void> {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttl || this.CACHE_TTL
      };
      
      await AsyncStorage.setItem(
        this.PREFIX + key,
        JSON.stringify(item)
      );
    } catch (error) {
      console.error('Cache save error:', error);
    }
  }

  async getFromCache<T>(key: string): Promise<T | null> {
    try {
      const itemStr = await AsyncStorage.getItem(this.PREFIX + key);
      if (!itemStr) return null;

      const item: CacheItem<T> = JSON.parse(itemStr);
      
      // TTL kontrolü
      if (Date.now() - item.timestamp > item.ttl) {
        await this.removeFromCache(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async removeFromCache(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.PREFIX + key);
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  }

  async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  // Listings cache
  async saveListings(listings: any[], category?: string): Promise<void> {
    const key = category ? `listings_${category}` : 'listings_all';
    await this.saveToCache(key, listings);
  }

  async getListings(category?: string): Promise<any[] | null> {
    const key = category ? `listings_${category}` : 'listings_all';
    return this.getFromCache<any[]>(key);
  }

  async saveListing(listing: any): Promise<void> {
    await this.saveToCache(`listing_${listing.id}`, listing);
  }

  async getListing(id: string): Promise<any | null> {
    return this.getFromCache<any>(`listing_${id}`);
  }

  // Categories cache
  async saveCategories(categories: any[]): Promise<void> {
    await this.saveToCache('categories', categories);
  }

  async getCategories(): Promise<any[] | null> {
    return this.getFromCache<any[]>('categories');
  }

  // User profile cache
  async saveUserProfile(profile: any): Promise<void> {
    await this.saveToCache('user_profile', profile);
  }

  async getUserProfile(): Promise<any | null> {
    return this.getFromCache<any>('user_profile');
  }

  // Favorites cache
  async saveFavorites(favorites: string[]): Promise<void> {
    await this.saveToCache('favorites', favorites);
  }

  async getFavorites(): Promise<string[] | null> {
    return this.getFromCache<string[]>('favorites');
  }

  async addToFavorites(listingId: string): Promise<void> {
    const favorites = await this.getFavorites() || [];
    if (!favorites.includes(listingId)) {
      favorites.push(listingId);
      await this.saveFavorites(favorites);
    }
  }

  async removeFromFavorites(listingId: string): Promise<void> {
    const favorites = await this.getFavorites() || [];
    const updatedFavorites = favorites.filter(id => id !== listingId);
    await this.saveFavorites(updatedFavorites);
  }

  // Pending actions
  async savePendingAction(action: PendingAction): Promise<void> {
    try {
      const pendingActions = await this.getPendingActions();
      pendingActions.push(action);
      await this.saveToCache('pending_actions', pendingActions);
    } catch (error) {
      console.error('Save pending action error:', error);
    }
  }

  async getPendingActions(): Promise<PendingAction[]> {
    try {
      return await this.getFromCache<PendingAction[]>('pending_actions') || [];
    } catch (error) {
      console.error('Get pending actions error:', error);
      return [];
    }
  }

  async removePendingAction(actionId: string): Promise<void> {
    try {
      const pendingActions = await this.getPendingActions();
      const updatedActions = pendingActions.filter(action => action.id !== actionId);
      await this.saveToCache('pending_actions', updatedActions);
    } catch (error) {
      console.error('Remove pending action error:', error);
    }
  }

  async clearPendingActions(): Promise<void> {
    await this.removeFromCache('pending_actions');
  }

  // Search history
  async saveSearchHistory(query: string): Promise<void> {
    try {
      const history = await this.getSearchHistory();
      const updatedHistory = [query, ...history.filter(item => item !== query)].slice(0, 10);
      await this.saveToCache('search_history', updatedHistory);
    } catch (error) {
      console.error('Save search history error:', error);
    }
  }

  async getSearchHistory(): Promise<string[]> {
    try {
      return await this.getFromCache<string[]>('search_history') || [];
    } catch (error) {
      console.error('Get search history error:', error);
      return [];
    }
  }

  async clearSearchHistory(): Promise<void> {
    await this.removeFromCache('search_history');
  }

  // Settings
  async saveSettings(settings: any): Promise<void> {
    await this.saveToCache('settings', settings);
  }

  async getSettings(): Promise<any | null> {
    return this.getFromCache<any>('settings');
  }

  // Cache statistics
  async getCacheStats(): Promise<{
    totalKeys: number;
    totalSize: number;
    categories: number;
    listings: number;
    pendingActions: number;
  }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.PREFIX));
      
      let totalSize = 0;
      let categories = 0;
      let listings = 0;
      let pendingActions = 0;

      for (const key of cacheKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
          
          if (key.includes('categories')) categories++;
          if (key.includes('listings')) listings++;
          if (key.includes('pending_actions')) pendingActions++;
        }
      }

      return {
        totalKeys: cacheKeys.length,
        totalSize,
        categories,
        listings,
        pendingActions
      };
    } catch (error) {
      console.error('Get cache stats error:', error);
      return {
        totalKeys: 0,
        totalSize: 0,
        categories: 0,
        listings: 0,
        pendingActions: 0
      };
    }
  }

  // Cache cleanup
  async cleanupExpiredCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.PREFIX));
      
      for (const key of cacheKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          try {
            const item = JSON.parse(value);
            if (item.timestamp && Date.now() - item.timestamp > item.ttl) {
              await AsyncStorage.removeItem(key);
            }
          } catch {
            // Invalid JSON, remove the key
            await AsyncStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.error('Cache cleanup error:', error);
    }
  }

  // Export/Import data
  async exportData(): Promise<string> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.PREFIX));
      
      const data: Record<string, any> = {};
      for (const key of cacheKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          data[key] = value;
        }
      }
      
      return JSON.stringify(data);
    } catch (error) {
      console.error('Export data error:', error);
      return '{}';
    }
  }

  async importData(dataStr: string): Promise<void> {
    try {
      const data = JSON.parse(dataStr);
      
      for (const [key, value] of Object.entries(data)) {
        if (key.startsWith(this.PREFIX)) {
          await AsyncStorage.setItem(key, value as string);
        }
      }
    } catch (error) {
      console.error('Import data error:', error);
    }
  }
}

export default new OfflineStorage(); 