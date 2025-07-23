import { useState, useEffect } from 'react';
import {
  saveToStore,
  getFromStore,
  getAllFromStore,
  deleteFromStore,
  clearStore,
} from '@/lib/indexedDB';

interface UseOfflineDataOptions<T> {
  key: string;
  storeName: 'listings' | 'categories' | 'userProfile';
  fetchData?: () => Promise<T>;
  syncInterval?: number;
}

export function useOfflineData<T>({
  key,
  storeName,
  fetchData,
  syncInterval = 5 * 60 * 1000, // 5 dakika
}: UseOfflineDataOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Online/offline durumunu takip et
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Veriyi yükle ve senkronize et
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Önce offline veriyi yükle
        const offlineData = await getFromStore(storeName, key);
        if (offlineData && isMounted) {
          setData(offlineData as T);
          setIsLoading(false);
        }

        // Online ise ve fetchData fonksiyonu varsa, güncel veriyi al
        if (isOnline && fetchData) {
          const freshData = await fetchData();
          if (isMounted) {
            setData(freshData);
            // Güncel veriyi offline storage'a kaydet
            await saveToStore(storeName, freshData);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    // Periyodik senkronizasyon
    let syncInterval: NodeJS.Timeout;
    if (isOnline && fetchData) {
      syncInterval = setInterval(loadData, syncInterval);
    }

    return () => {
      isMounted = false;
      if (syncInterval) {
        clearInterval(syncInterval);
      }
    };
  }, [key, storeName, isOnline, fetchData, syncInterval]);

  // Veriyi güncelle
  const updateData = async (newData: T) => {
    try {
      setData(newData);
      await saveToStore(storeName, newData);
    } catch (err) {
      setError(err as Error);
    }
  };

  // Veriyi sil
  const removeData = async () => {
    try {
      setData(null);
      await deleteFromStore(storeName, key);
    } catch (err) {
      setError(err as Error);
    }
  };

  return {
    data,
    isLoading,
    error,
    isOnline,
    updateData,
    removeData,
  };
} 