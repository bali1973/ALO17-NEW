'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/Providers';
import { 
  BellIcon, 
  BellSlashIcon, 
  TrashIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface Subscription {
  id: string;
  email: string;
  category: string | null;
  subcategory: string | null;
  keywords: string | null;
  priceRange: string | null;
  location: string | null;
  frequency: string;
  isActive: boolean;
  createdAt: string;
}

export default function NotificationManagementPage() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      loadSubscriptions();
    }
  }, [user]);

  const loadSubscriptions = async () => {
    try {
      const response = await fetch('/api/notifications/subscription');
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.subscriptions || []);
      }
    } catch (error) {
      console.error('Abonelikler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (subscriptionId: string) => {
    try {
      const subscription = subscriptions.find(s => s.id === subscriptionId);
      if (!subscription) return;

      const response = await fetch('/api/notifications/subscription', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: subscription.category,
          subcategory: subscription.subcategory
        }),
      });

      if (response.ok) {
        setSubscriptions(prev => prev.filter(s => s.id !== subscriptionId));
        setMessage('Abonelik iptal edildi.');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Abonelik iptal edilemedi.');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Bir hata oluştu.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'instant': return 'Anında';
      case 'daily': return 'Günlük';
      case 'weekly': return 'Haftalık';
      default: return frequency;
    }
  };

  const getCategoryText = (category: string | null, subcategory: string | null) => {
    if (!category) return 'Tüm Kategoriler';
    if (subcategory) return `${category} > ${subcategory}`;
    return category;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Bildirim Yönetimi</h1>
            <p className="text-gray-600 mb-4">Bu sayfayı görüntülemek için giriş yapmanız gerekiyor.</p>
            <a
              href="/giris"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Giriş Yap
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <BellIcon className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Bildirim Yönetimi</h1>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {message}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Abonelikler yükleniyor...</p>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-8">
              <BellSlashIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Aboneliğiniz Yok</h3>
              <p className="text-gray-600 mb-4">
                Kategori sayfalarından yeni ilanlardan haberdar olmak için abone olabilirsiniz.
              </p>
              <a
                href="/tum-kategoriler"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Kategorileri Görüntüle
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Aktif Abonelikler ({subscriptions.length})
              </h2>
              
              {subscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <BellIcon className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="font-semibold text-gray-900">
                          {getCategoryText(subscription.category, subscription.subcategory)}
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          <span>Bildirim: {getFrequencyText(subscription.frequency)}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="mr-2">📧</span>
                          <span>{subscription.email}</span>
                        </div>
                        
                        {subscription.location && (
                          <div className="flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-2" />
                            <span>Konum: {subscription.location}</span>
                          </div>
                        )}
                        
                        {subscription.priceRange && (
                          <div className="flex items-center">
                            <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                            <span>Fiyat: {subscription.priceRange}</span>
                          </div>
                        )}
                        
                        {subscription.keywords && (
                          <div className="flex items-center">
                            <span className="mr-2">🔍</span>
                            <span>Anahtar Kelimeler: {subscription.keywords}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3 text-xs text-gray-500">
                        Abone olma tarihi: {formatDate(subscription.createdAt)}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleUnsubscribe(subscription.id)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Aboneliği iptal et"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Bildirim Ayarları Hakkında</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Anında:</strong> Yeni ilan eklendiğinde hemen e-posta alırsınız</li>
              <li>• <strong>Günlük:</strong> Her gün özet e-posta alırsınız</li>
              <li>• <strong>Haftalık:</strong> Her hafta özet e-posta alırsınız</li>
              <li>• Aboneliklerinizi istediğiniz zaman iptal edebilirsiniz</li>
              <li>• E-posta adresinizi değiştirmek için yeni abonelik oluşturun</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 
