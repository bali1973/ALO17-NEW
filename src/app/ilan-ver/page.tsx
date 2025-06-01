'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { listingTypes } from '@/types/listings';

const PREMIUM_PRICE = 149.00;
const YEARLY_DISCOUNT = 10; // Yıllık premium için %10 indirim

export default function CreateListing() {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    category: '',
    subcategory: '',
    condition: '',
    images: [] as string[],
    type: listingTypes.FREE,
    isYearly: false, // Yıllık premium seçeneği
  });
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const handleCouponValidation = async () => {
    if (!couponCode) {
      setError('Kupon kodu girin');
      return;
    }

    setIsValidatingCoupon(true);
    setError('');

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: couponCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setCouponDiscount(data.discount);
      setError('');
    } catch (error) {
      setCouponDiscount(null);
      setError(error instanceof Error ? error.message : 'Kupon doğrulanamadı');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          couponCode: couponDiscount ? couponCode : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'İlan oluşturulamadı');
      }

      if (formData.type === listingTypes.PREMIUM) {
        const params = new URLSearchParams({
          listingId: data.id,
          amount: calculateFinalPrice().toString(),
          isYearly: formData.isYearly.toString(),
          ...(couponCode && { couponCode }),
        });
        router.push(`/odeme?${params.toString()}`);
      } else {
        router.push(`/ilan/${data.id}`);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateFinalPrice = () => {
    if (formData.type !== listingTypes.PREMIUM) {
      return PREMIUM_PRICE;
    }

    let finalPrice = PREMIUM_PRICE;
    
    // Yıllık premium için %10 indirim
    if (formData.isYearly) {
      finalPrice = finalPrice * (1 - YEARLY_DISCOUNT / 100);
    }
    
    // Kupon indirimi varsa uygula
    if (couponDiscount) {
      finalPrice = finalPrice * (1 - couponDiscount / 100);
    }

    return finalPrice;
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-alo-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-alo-dark mb-4">
              İlan Vermek İçin Giriş Yapmalısınız
            </h2>
            <p className="text-gray-600 mb-6">
              İlan vermek ve alışveriş yapmak için lütfen giriş yapın veya hesap oluşturun.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => router.push('/login')}
                className="bg-alo-orange text-white px-6 py-2 rounded-lg hover:bg-alo-dark-orange"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => router.push('/register')}
                className="bg-white text-alo-orange border border-alo-orange px-6 py-2 rounded-lg hover:bg-alo-light"
              >
                Kayıt Ol
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-alo-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-alo-dark mb-8">Yeni İlan Oluştur</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                İlan Başlığı
              </label>
              <input
                type="text"
                id="title"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-alo-orange focus:border-alo-orange"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                İlan Açıklaması
              </label>
              <textarea
                id="description"
                rows={4}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-alo-orange focus:border-alo-orange"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Fiyat (TL)
                </label>
                <input
                  type="number"
                  id="price"
                  required
                  min="0"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-alo-orange focus:border-alo-orange"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Konum
                </label>
                <input
                  type="text"
                  id="location"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-alo-orange focus:border-alo-orange"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Kategori
                </label>
                <select
                  id="category"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-alo-orange focus:border-alo-orange"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Kategori Seçin</option>
                  {/* Kategoriler buraya eklenecek */}
                </select>
              </div>

              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                  Ürün Durumu
                </label>
                <select
                  id="condition"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-alo-orange focus:border-alo-orange"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                >
                  <option value="">Durum Seçin</option>
                  <option value="Yeni">Yeni</option>
                  <option value="İkinci El">İkinci El</option>
                  <option value="Az Kullanılmış">Az Kullanılmış</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İlan Tipi
              </label>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value={listingTypes.FREE}
                    checked={formData.type === listingTypes.FREE}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as typeof listingTypes.FREE, isYearly: false })}
                    className="h-4 w-4 text-alo-orange focus:ring-alo-orange border-gray-300"
                  />
                  <span className="ml-2">Ücretsiz İlan</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value={listingTypes.PREMIUM}
                      checked={formData.type === listingTypes.PREMIUM}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as typeof listingTypes.PREMIUM })}
                      className="h-4 w-4 text-alo-orange focus:ring-alo-orange border-gray-300"
                    />
                    <span className="ml-2">
                      Premium İlan ({calculateFinalPrice().toFixed(2)} TL)
                      {formData.isYearly && (
                        <span className="ml-2 text-green-600">
                          (%{YEARLY_DISCOUNT} yıllık indirim)
                        </span>
                      )}
                      {couponDiscount && (
                        <span className="ml-2 text-green-600">
                          (%{couponDiscount} kupon indirimi)
                        </span>
                      )}
                    </span>
                  </label>
                  {formData.type === listingTypes.PREMIUM && (
                    <div className="ml-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.isYearly}
                          onChange={(e) => setFormData({ ...formData, isYearly: e.target.checked })}
                          className="h-4 w-4 text-alo-orange focus:ring-alo-orange border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Yıllık Premium (%{YEARLY_DISCOUNT} indirim)
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {formData.type === listingTypes.PREMIUM && (
                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Kupon kodu"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-alo-orange focus:border-alo-orange"
                    />
                    <button
                      type="button"
                      onClick={handleCouponValidation}
                      disabled={isValidatingCoupon}
                      className="px-4 py-2 bg-alo-orange text-white rounded-lg hover:bg-alo-dark-orange disabled:opacity-50"
                    >
                      {isValidatingCoupon ? 'Kontrol Ediliyor...' : 'Kupon Kullan'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-alo-orange hover:bg-alo-dark-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-alo-orange disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'İlan Oluşturuluyor...' : 'İlanı Yayınla'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 