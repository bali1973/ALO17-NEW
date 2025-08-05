'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './Providers';
import { useRouter } from 'next/navigation';
import { 
  BellIcon, 
  BellSlashIcon, 
  MagnifyingGlassIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface NotificationSubscriptionProps {
  category?: string;
  subcategory?: string;
  onClose?: () => void;
  initialShowForm?: boolean;
}

interface SubscriptionForm {
  email: string;
  category: string;
  subcategory: string;
  keywords: string;
  priceMin: string;
  priceMax: string;
  location: string;
  frequency: 'instant' | 'daily' | 'weekly';
}

export default function NotificationSubscription({ 
  category = '', 
  subcategory = '',
  onClose,
  initialShowForm = false
}: NotificationSubscriptionProps) {
  const { session } = useAuth();
  const router = useRouter();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(initialShowForm);
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);

  const [form, setForm] = useState<SubscriptionForm>({
    email: session?.user?.email || '',
    category: category,
    subcategory: subcategory,
    keywords: '',
    priceMin: '',
    priceMax: '',
    location: '',
    frequency: 'instant'
  });

  useEffect(() => {
    loadCategories();
    checkSubscription();
  }, [category, subcategory]);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    }
  };

  const loadSubcategories = async (categorySlug: string) => {
    try {
      const response = await fetch(`/api/categories/${categorySlug}/subcategories`);
      const data = await response.json();
      setSubcategories(data);
    } catch (error) {
      console.error('Alt kategoriler yüklenemedi:', error);
    }
  };

  const checkSubscription = async () => {
    // Email ile abonelik kontrolü
    if (!form.email) return;
    
    try {
      const response = await fetch(`/api/notifications/subscription/check?email=${encodeURIComponent(form.email)}&category=${category}&subcategory=${subcategory}`);
      const data = await response.json();
      setIsSubscribed(data.isSubscribed);
    } catch (error) {
      console.error('Abonelik kontrolü yapılamadı:', error);
    }
  };

  const handleSubscribe = async () => {
    // Email validasyonu
    if (!form.email || !form.email.includes('@')) {
      setMessage('Lütfen geçerli bir email adresi girin.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/notifications/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          category: form.category,
          subcategory: form.subcategory,
          keywords: form.keywords ? form.keywords.split(',').map(k => k.trim()) : [],
          priceRange: form.priceMin || form.priceMax ? {
            min: form.priceMin ? parseInt(form.priceMin) : undefined,
            max: form.priceMax ? parseInt(form.priceMax) : undefined
          } : undefined,
          location: form.location,
          frequency: form.frequency
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubscribed(true);
        setMessage('Abonelik başarıyla oluşturuldu! Yeni ilanlardan anında haberdar olacaksınız.');
        setShowForm(false);
      } else {
        setMessage(data.error || 'Abonelik oluşturulamadı.');
      }
    } catch (error) {
      setMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/notifications/subscription', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: category,
          subcategory: subcategory
        }),
      });

      if (response.ok) {
        setIsSubscribed(false);
        setMessage('Abonelik iptal edildi.');
      } else {
        setMessage('Abonelik iptal edilemedi.');
      }
    } catch (error) {
      setMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (categorySlug: string) => {
    setForm(prev => ({ ...prev, category: categorySlug, subcategory: '' }));
    if (categorySlug) {
      loadSubcategories(categorySlug);
    } else {
      setSubcategories([]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      )}

      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <BellIcon className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Yeni İlanlardan Haberdar Ol
        </h3>
        <p className="text-sm text-gray-600">
          Bu kategorideki yeni ilanlardan anında haberdar olmak için abone olun.
        </p>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          message.includes('başarıyla') || message.includes('iptal')
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {isSubscribed ? (
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <CheckIcon className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-600 font-medium">Abone Olundu</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Bu kategorideki yeni ilanlardan haberdar olacaksınız.
          </p>
          <button
            onClick={handleUnsubscribe}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <BellSlashIcon className="h-4 w-4 mr-2" />
            {isLoading ? 'İptal Ediliyor...' : 'Aboneliği İptal Et'}
          </button>
        </div>
      ) : showForm ? (
        <form onSubmit={(e) => { e.preventDefault(); handleSubscribe(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-posta Adresi
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <select
              value={form.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {form.category && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alt Kategori
              </label>
              <select
                value={form.subcategory}
                onChange={(e) => setForm(prev => ({ ...prev, subcategory: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tüm Alt Kategoriler</option>
                {subcategories.map((subcat) => (
                  <option key={subcat.slug} value={subcat.slug}>
                    {subcat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Anahtar Kelimeler
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={form.keywords}
                onChange={(e) => setForm(prev => ({ ...prev, keywords: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="telefon, iphone, samsung (virgülle ayırın)"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Fiyat
              </label>
              <div className="relative">
                <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={form.priceMin}
                  onChange={(e) => setForm(prev => ({ ...prev, priceMin: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Fiyat
              </label>
              <div className="relative">
                <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={form.priceMax}
                  onChange={(e) => setForm(prev => ({ ...prev, priceMax: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10000"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konum
            </label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="İstanbul, Ankara, İzmir..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bildirim Sıklığı
            </label>
            <select
              value={form.frequency}
              onChange={(e) => setForm(prev => ({ ...prev, frequency: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="instant">Anında</option>
              <option value="daily">Günlük Özet</option>
              <option value="weekly">Haftalık Özet</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <BellIcon className="h-4 w-4 mr-2" />
              {isLoading ? 'Abone Olunuyor...' : 'Abone Ol'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center">
          <button
            onClick={() => router.push('/bildirim-tercihleri')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            <BellIcon className="h-5 w-5 mr-2" />
            Detayları Görüntüle
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Bildirim tercihlerinizi yönetmek için tıklayın
          </p>
        </div>
      )}
    </div>
  );
} 