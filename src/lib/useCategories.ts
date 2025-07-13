import { useEffect, useState } from 'react';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  count?: number;
  subCategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  icon?: string;
  subCategories?: SubCategory[];
}

// Kategori güncelleme event'i için custom event
const CATEGORY_UPDATE_EVENT = 'categories-updated';

export const triggerCategoryUpdate = () => {
  // LocalStorage'a timestamp ekle
  localStorage.setItem('categories-last-updated', Date.now().toString());
  // Custom event tetikle
  window.dispatchEvent(new CustomEvent(CATEGORY_UPDATE_EVENT));
};

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Önce API endpoint'ini dene
      const apiResponse = await fetch('/api/categories');
      if (apiResponse.ok) {
        const data = await apiResponse.json();
        setCategories(data);
        setLoading(false);
        return;
      }
      
      // API başarısız olursa JSON dosyasını dene
      const jsonResponse = await fetch('/categories.json');
      if (jsonResponse.ok) {
        const data = await jsonResponse.json();
        setCategories(data);
        setLoading(false);
        return;
      }
      
      // Her ikisi de başarısız olursa hata ver
      throw new Error('Kategoriler yüklenemedi');
    } catch (err) {
      console.error('Kategoriler yüklenirken hata:', err);
      setError('Kategoriler yüklenemedi');
      setLoading(false);
    }
  };

  useEffect(() => {
    // İlk yükleme
    fetchCategories();

    // Kategori güncelleme event'ini dinle
    const handleCategoryUpdate = () => {
      console.log('Kategori güncelleme eventi alındı, kategoriler yenileniyor...');
      fetchCategories();
    };

    // LocalStorage değişikliklerini dinle
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'categories-last-updated') {
        const newTimestamp = parseInt(e.newValue || '0');
        if (newTimestamp > lastUpdate) {
          console.log('LocalStorage kategori güncellemesi algılandı');
          setLastUpdate(newTimestamp);
          fetchCategories();
        }
      }
    };

    // Event listener'ları ekle
    window.addEventListener(CATEGORY_UPDATE_EVENT, handleCategoryUpdate);
    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener(CATEGORY_UPDATE_EVENT, handleCategoryUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [lastUpdate]);

  return { categories, loading, error, refetch: fetchCategories };
} 