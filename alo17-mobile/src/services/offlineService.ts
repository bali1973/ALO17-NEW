import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from 'react-native-netinfo';
import { Alert } from 'react-native';

export interface OfflineAction {
  id: string;
  type: 'CREATE_LISTING' | 'SEND_MESSAGE' | 'UPDATE_PROFILE' | 'ADD_FAVORITE' | 'REMOVE_FAVORITE';
  data: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

export interface CachedData {
  key: string;
  data: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class OfflineService {
  private isOnline = true;
  private actionQueue: OfflineAction[] = [];
  private cache: Map<string, CachedData> = new Map();
  private syncInProgress = false;
  private listeners: Map<string, Function[]> = new Map();

  // Servisi başlat
  async initialize() {
    // Ağ durumunu dinle
    this.setupNetworkListener();
    
    // Kaydedilmiş kuyruğu yükle
    await this.loadActionQueue();
    
    // Cache'i yükle
    await this.loadCache();
    
    // Senkronizasyonu başlat
    this.startSync();
    
    console.log('Offline servisi başlatıldı');
  }

  // Ağ durumu dinleyicisi
  private setupNetworkListener() {
    NetInfo.addEventListener(state => {
      const wasOnline = this.isOnline;
      this.isOnline = state.isConnected === true;
      
      if (!wasOnline && this.isOnline) {
        console.log('İnternet bağlantısı geri geldi');
        this.onNetworkRestored();
      } else if (wasOnline && !this.isOnline) {
        console.log('İnternet bağlantısı kesildi');
        this.onNetworkLost();
      }
      
      this.triggerListeners('network-status-change', { isOnline: this.isOnline });
    });
  }

  // İnternet geri geldiğinde
  private async onNetworkRestored() {
    Alert.alert('Bağlantı Geri Geldi', 'İnternet bağlantınız geri geldi. Veriler senkronize ediliyor...');
    
    // Kuyruktaki işlemleri çalıştır
    await this.processActionQueue();
    
    // Cache'i güncelle
    await this.refreshCache();
  }

  // İnternet kesildiğinde
  private onNetworkLost() {
    Alert.alert('Bağlantı Kesildi', 'İnternet bağlantınız kesildi. Uygulama offline modda çalışıyor.');
  }

  // Kuyruğa işlem ekle
  async addToQueue(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>) {
    const offlineAction: OfflineAction = {
      ...action,
      id: this.generateId(),
      timestamp: Date.now(),
      retryCount: 0,
    };

    this.actionQueue.push(offlineAction);
    await this.saveActionQueue();
    
    console.log('İşlem kuyruğa eklendi:', offlineAction);
    
    // Eğer online ise hemen çalıştır
    if (this.isOnline) {
      this.processActionQueue();
    }
  }

  // Kuyruktaki işlemleri çalıştır
  private async processActionQueue() {
    if (this.syncInProgress || this.actionQueue.length === 0) return;
    
    this.syncInProgress = true;
    
    try {
      const actionsToProcess = [...this.actionQueue];
      
      for (const action of actionsToProcess) {
        try {
          await this.executeAction(action);
          
          // Başarılı işlemi kuyruktan çıkar
          this.actionQueue = this.actionQueue.filter(a => a.id !== action.id);
          await this.saveActionQueue();
          
          console.log('İşlem başarıyla tamamlandı:', action.id);
        } catch (error) {
          console.error('İşlem hatası:', error);
          
          // Retry sayısını artır
          action.retryCount++;
          
          if (action.retryCount >= action.maxRetries) {
            // Maksimum deneme sayısına ulaştı, kuyruktan çıkar
            this.actionQueue = this.actionQueue.filter(a => a.id !== action.id);
            await this.saveActionQueue();
            
            Alert.alert('Hata', `İşlem başarısız: ${action.type}`);
          }
        }
      }
    } finally {
      this.syncInProgress = false;
    }
  }

  // İşlemi çalıştır
  private async executeAction(action: OfflineAction) {
    switch (action.type) {
      case 'CREATE_LISTING':
        // İlan oluşturma API çağrısı
        // await listingsAPI.create(action.data);
        break;
        
      case 'SEND_MESSAGE':
        // Mesaj gönderme API çağrısı
        // await messagesAPI.sendMessage(action.data.conversationId, action.data.content);
        break;
        
      case 'UPDATE_PROFILE':
        // Profil güncelleme API çağrısı
        // await usersAPI.updateProfile(action.data);
        break;
        
      case 'ADD_FAVORITE':
        // Favori ekleme API çağrısı
        // await favoritesAPI.add(action.data.listingId);
        break;
        
      case 'REMOVE_FAVORITE':
        // Favori çıkarma API çağrısı
        // await favoritesAPI.remove(action.data.listingId);
        break;
        
      default:
        throw new Error(`Bilinmeyen işlem türü: ${action.type}`);
    }
  }

  // Cache'e veri ekle
  async setCache(key: string, data: any, ttl: number = 24 * 60 * 60 * 1000) { // Varsayılan 24 saat
    const cachedData: CachedData = {
      key,
      data,
      timestamp: Date.now(),
      ttl,
    };
    
    this.cache.set(key, cachedData);
    await this.saveCache();
  }

  // Cache'den veri al
  async getCache(key: string): Promise<any | null> {
    const cachedData = this.cache.get(key);
    
    if (!cachedData) return null;
    
    // TTL kontrolü
    if (Date.now() - cachedData.timestamp > cachedData.ttl) {
      this.cache.delete(key);
      await this.saveCache();
      return null;
    }
    
    return cachedData.data;
  }

  // Cache'i temizle
  async clearCache() {
    this.cache.clear();
    await AsyncStorage.removeItem('offline-cache');
  }

  // Cache'i yenile
  private async refreshCache() {
    if (!this.isOnline) return;
    
    // Önemli verileri yeniden yükle
    try {
      // İlanları yenile
      // const listings = await listingsAPI.getAll();
      // await this.setCache('listings', listings, 30 * 60 * 1000); // 30 dakika
      
      // Kategorileri yenile
      // const categories = await categoriesAPI.getAll();
      // await this.setCache('categories', categories, 60 * 60 * 1000); // 1 saat
      
      console.log('Cache yenilendi');
    } catch (error) {
      console.error('Cache yenileme hatası:', error);
    }
  }

  // Kuyruğu kaydet
  private async saveActionQueue() {
    try {
      await AsyncStorage.setItem('offline-queue', JSON.stringify(this.actionQueue));
    } catch (error) {
      console.error('Kuyruk kaydetme hatası:', error);
    }
  }

  // Kuyruğu yükle
  private async loadActionQueue() {
    try {
      const queueData = await AsyncStorage.getItem('offline-queue');
      if (queueData) {
        this.actionQueue = JSON.parse(queueData);
      }
    } catch (error) {
      console.error('Kuyruk yükleme hatası:', error);
    }
  }

  // Cache'i kaydet
  private async saveCache() {
    try {
      const cacheData = Array.from(this.cache.entries());
      await AsyncStorage.setItem('offline-cache', JSON.stringify(cacheData));
    } catch (error) {
      console.error('Cache kaydetme hatası:', error);
    }
  }

  // Cache'i yükle
  private async loadCache() {
    try {
      const cacheData = await AsyncStorage.getItem('offline-cache');
      if (cacheData) {
        const entries = JSON.parse(cacheData);
        this.cache = new Map(entries);
      }
    } catch (error) {
      console.error('Cache yükleme hatası:', error);
    }
  }

  // Senkronizasyonu başlat
  private startSync() {
    // Her 5 dakikada bir senkronizasyon
    setInterval(() => {
      if (this.isOnline && this.actionQueue.length > 0) {
        this.processActionQueue();
      }
    }, 5 * 60 * 1000);
  }

  // Event listener ekle
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  // Event listener kaldır
  off(event: string, callback?: Function) {
    if (!callback) {
      this.listeners.delete(event);
    } else {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  }

  // Listener'ları tetikle
  private triggerListeners(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Offline listener hatası:', error);
        }
      });
    }
  }

  // ID oluştur
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Online durumu kontrol et
  isNetworkOnline(): boolean {
    return this.isOnline;
  }

  // Kuyruk durumunu al
  getQueueStatus() {
    return {
      pendingActions: this.actionQueue.length,
      syncInProgress: this.syncInProgress,
    };
  }

  // Cache durumunu al
  getCacheStatus() {
    return {
      cacheSize: this.cache.size,
      cacheKeys: Array.from(this.cache.keys()),
    };
  }
}

export default new OfflineService(); 