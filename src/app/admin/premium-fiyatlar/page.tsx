'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Save, DollarSign, Calendar, Package } from 'lucide-react';

interface PremiumPlan {
  id: string;
  name: string;
  key: string;
  price: number;
  days: number;
}

export default function PremiumFiyatlarPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [plans, setPlans] = useState<PremiumPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris?callbackUrl=/admin/premium-fiyatlar');
    } else if (status === 'authenticated' && (session?.user as any)?.role !== 'admin') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchPlans();
    }
  }, [status, session, router]);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/premium-plans');
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      }
    } catch (error) {
      console.error('Premium planları getirme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (key: string, newPrice: number) => {
    setPlans(prev => prev.map(plan => 
      plan.key === key ? { ...plan, price: newPrice } : plan
    ));
  };

  const handleNameChange = (key: string, newName: string) => {
    setPlans(prev => prev.map(plan => 
      plan.key === key ? { ...plan, name: newName } : plan
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/premium-plans', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plans }),
      });

      if (response.ok) {
        setMessage('Premium planlar başarıyla güncellendi!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const error = await response.json();
        setMessage(error.message || 'Güncelleme sırasında bir hata oluştu');
      }
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      setMessage('Güncelleme sırasında bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-alo-orange mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Premium Fiyat Yönetimi</h1>
          <p className="text-gray-600 mt-2">Premium ilan planlarının fiyatlarını düzenleyin</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('başarıyla') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid gap-6">
            {plans.map((plan) => (
              <div key={plan.key} className="border rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-alo-orange bg-opacity-10 rounded-lg">
                    <Package className="w-6 h-6 text-alo-orange" />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={plan.name}
                      onChange={(e) => handleNameChange(plan.key, e.target.value)}
                      className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-alo-orange rounded px-2 py-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Fiyat (₺)
                    </label>
                    <input
                      type="number"
                      value={plan.price}
                      onChange={(e) => handlePriceChange(plan.key, parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Süre (Gün)
                    </label>
                    <input
                      type="number"
                      value={plan.days}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Süre değiştirilemez</p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Plan Anahtarı:</strong> {plan.key}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-alo-orange text-white rounded-md hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Değişiklikleri Kaydet
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Bilgi</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Fiyat değişiklikleri anında tüm kullanıcılara yansır</li>
            <li>• Ücretsiz plan (free) fiyatı 0 olarak kalmalıdır</li>
            <li>• Plan anahtarları değiştirilemez</li>
            <li>• Süre değerleri değiştirilemez</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 