import React from 'react';
import { useOfflineData } from '@/hooks/useOfflineData';
import { WifiOff } from 'lucide-react';

interface Props {
  storeName: 'listings' | 'categories' | 'userProfile';
  storeKey: string;
  fetchData: () => Promise<any>;
  children: (data: any) => React.ReactNode;
}

export const OfflineAwareComponent: React.FC<Props> = ({
  storeName,
  storeKey,
  fetchData,
  children,
}) => {
  const {
    data,
    isLoading,
    error,
    isOnline,
    updateData,
    removeData,
  } = useOfflineData({
    key: storeKey,
    storeName,
    fetchData,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4" role="status" aria-label="Yükleniyor">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        <p>Bir hata oluştu: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      {!isOnline && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 flex items-center gap-2">
          <WifiOff className="w-5 h-5 text-yellow-600" />
          <span className="text-yellow-700">
            Çevrimdışı moddasınız. Veriler son senkronizasyondan gelmektedir.
          </span>
        </div>
      )}
      {children(data)}
    </div>
  );
}; 