'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/Providers';

import { Check, Star, Crown, Zap, Shield, TrendingUp, Sparkles, CheckCircle, X, FileText, MessageCircle, BarChart3, Bell, Settings } from 'lucide-react';
import { getPremiumPlans } from '@/lib/utils';
import { FrequentlyUsed } from '@/components/FrequentlyUsed';

export default function PremiumPage() {
  const { session } = useAuth();
  
  const [selectedPlan, setSelectedPlan] = useState<string>('30days');
  const [premiumPlans, setPremiumPlans] = useState<Record<string, { name: string; price: number; days: number }>>({});
  const [loading, setLoading] = useState(true);
  const [allListings, setAllListings] = useState<any[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        setAllListings(data);
        setListingsLoading(false);
      })
      .catch(() => setListingsLoading(false));
    fetchPremiumPlans();
  }, []);

  const fetchPremiumPlans = async () => {
    try {
      const plans = await getPremiumPlans();
      setPremiumPlans(plans);
    } catch (error) {
      console.error('Premium planları getirme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  // Detaylı özellik listesi
  const allFeatures = [
    {
      id: 'feature_1',
      icon: <Crown className="w-5 h-5 text-yellow-500" />,
      title: 'Öne Çıkan Rozet',
      description: 'İlanınız premium rozeti ile işaretlenir ve daha fazla dikkat çeker',
      price: 15.00,
      category: 'listing'
    },
    {
      id: 'feature_2',
      icon: <TrendingUp className="w-5 h-5 text-green-500" />,
      title: 'Öncelikli Sıralama',
      description: 'Arama sonuçlarında üst sıralarda görünürsünüz',
      price: 25.00,
      category: 'listing'
    },
    {
      id: 'feature_3',
      icon: <Shield className="w-5 h-5 text-purple-500" />,
      title: 'Güvenilir Satıcı Rozeti',
      description: 'Premium satıcı rozeti kazanın ve güven oluşturun',
      price: 20.00,
      category: 'profile'
    },
    {
      id: 'feature_4',
      icon: <Sparkles className="w-5 h-5 text-pink-500" />,
      title: 'Maksimum 5 Resim',
      description: 'İlanınızda 5 resme kadar yükleyebilirsiniz',
      price: 10.00,
      category: 'listing'
    },
    {
      id: 'feature_5',
      icon: <FileText className="w-5 h-5 text-blue-500" />,
      title: 'Maksimum 5 İlan',
      description: 'Aynı anda 5 adet ilan yayınlayabilirsiniz',
      price: 30.00,
      category: 'listing'
    },
    {
      id: 'feature_6',
      icon: <MessageCircle className="w-5 h-5 text-indigo-500" />,
      title: 'Özel Destek',
      description: '7/24 öncelikli müşteri desteği alın',
      price: 35.00,
      category: 'communication'
    },
    {
      id: 'feature_7',
      icon: <BarChart3 className="w-5 h-5 text-teal-500" />,
      title: 'Gelişmiş Analitikler',
      description: 'İlan performansınızı detaylı olarak takip edin',
      price: 20.00,
      category: 'analytics'
    },
    {
      id: 'feature_8',
      icon: <Bell className="w-5 h-5 text-orange-500" />,
      title: 'Özel Bildirimler',
      description: 'Özel bildirim tercihleri ve gelişmiş uyarılar',
      price: 15.00,
      category: 'communication'
    },
    {
      id: 'feature_9',
      icon: <Settings className="w-5 h-5 text-gray-500" />,
      title: 'Profil Özelleştirme',
      description: 'Profilinizi özelleştirin ve daha profesyonel görünün',
      price: 12.00,
      category: 'profile'
    },
    {
      id: 'feature_10',
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      title: 'Hızlı İlan Yayınlama',
      description: 'İlanlarınızı daha hızlı yayınlayın',
      price: 18.00,
      category: 'listing'
    }
  ];

  // Plan özellikleri
  const planFeatures = {
    '30days': ['feature_1', 'feature_2', 'feature_3', 'feature_4'],
    '90days': ['feature_1', 'feature_2', 'feature_3', 'feature_4', 'feature_5', 'feature_6'],
    '365days': ['feature_1', 'feature_2', 'feature_3', 'feature_4', 'feature_5', 'feature_6', 'feature_7', 'feature_8', 'feature_9', 'feature_10']
  };

  const handlePlanSelection = (planKey: string) => {
    setSelectedPlan(planKey);
  };

  const handlePurchase = () => {
    const plan = premiumPlans[selectedPlan];
    if (!plan) return;
    
    const confirmPurchase = confirm(
      `${plan.name} premium plan için ${plan.price}₺ ödeme yapılacak. Devam etmek istiyor musunuz?`
    );
    
    if (confirmPurchase) {
      // Burada ödeme işlemi başlatılacak
      alert('Ödeme sayfasına yönlendiriliyorsunuz...');
    }
  };

  const getSelectedPlanFeatures = () => {
    const featureIds = planFeatures[selectedPlan as keyof typeof planFeatures] || [];
    return allFeatures.filter(feature => featureIds.includes(feature.id));
  };

  const getPlanFeatures = (planKey: string) => {
    const featureIds = planFeatures[planKey as keyof typeof planFeatures] || [];
    return allFeatures.filter(feature => featureIds.includes(feature.id));
  };

  const calculatePlanValue = (planKey: string) => {
    const featureIds = planFeatures[planKey as keyof typeof planFeatures] || [];
    return allFeatures
      .filter(feature => featureIds.includes(feature.id))
      .reduce((total, feature) => total + feature.price, 0);
  };

  const calculateDiscount = (planKey: string) => {
    const plan = premiumPlans[planKey];
    if (!plan) return 0;
    
    const totalValue = calculatePlanValue(planKey);
    const discount = ((totalValue - plan.price) / totalValue) * 100;
    return Math.round(discount);
  };

  const isFeatureIncluded = (featureId: string, planKey: string) => {
    const featureIds = planFeatures[planKey as keyof typeof planFeatures] || [];
    return featureIds.includes(featureId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-alo-orange mx-auto"></div>
          <p className="mt-4 text-gray-600">Premium planlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Premium Planlar
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            İlanınızı daha fazla kişiye ulaştırmak ve satış şansınızı artırmak için premium planlarımızı keşfedin
          </p>
        </div>

        {/* Plan Karşılaştırması */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Aylık Premium */}
          <div className={`bg-white rounded-xl shadow-lg p-8 border-2 transition-all ${
            selectedPlan === '30days' 
              ? 'border-alo-orange shadow-xl scale-105' 
              : 'border-gray-200 hover:border-gray-300'
          }`}>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Aylık Premium</h3>
              <div className="text-4xl font-bold text-alo-orange mb-2">49.99₺</div>
              <p className="text-gray-600 mb-4">30 günlük premium üyelik</p>
              <div className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full inline-block">
                4 özellik dahil
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Değer:</span>
                <span className="text-sm font-semibold text-green-600">{calculatePlanValue('30days')}₺</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tasarruf:</span>
                <span className="text-sm font-semibold text-green-600">%{calculateDiscount('30days')}</span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Dahil Olan Özellikler:</h4>
            </div>

            <ul className="space-y-3 mb-6">
              {getPlanFeatures('30days').map((feature) => (
                <li key={feature.id} className="flex items-start p-2 bg-green-50 rounded-lg border border-green-100">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">{feature.title}</span>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                    <span className="text-xs text-green-600 font-medium">{feature.price}₺ değerinde</span>
                  </div>
                </li>
              ))}
            </ul>
            
            <button 
              onClick={() => handlePlanSelection('30days')}
              className={`w-full py-3 px-4 rounded-lg transition-colors font-medium ${
                selectedPlan === '30days'
                  ? 'bg-alo-orange text-white hover:bg-orange-600'
                  : 'border border-alo-orange text-alo-orange hover:bg-orange-50'
              }`}
            >
              {selectedPlan === '30days' ? 'Seçili Plan' : 'Plan Seç'}
            </button>
          </div>

          {/* 3 Aylık Premium - POPÜLER */}
          <div className={`bg-white rounded-xl shadow-lg p-8 border-2 transition-all relative ${
            selectedPlan === '90days' 
              ? 'border-alo-orange shadow-xl scale-105' 
              : 'border-gray-200 hover:border-gray-300'
          }`}>
            {/* POPÜLER Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                POPÜLER
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">3 Aylık Premium</h3>
              <div className="text-4xl font-bold text-alo-orange mb-2">129.99₺</div>
              <p className="text-gray-600 mb-4">90 günlük premium üyelik</p>
              <div className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full inline-block">
                6 özellik dahil
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Değer:</span>
                <span className="text-sm font-semibold text-green-600">{calculatePlanValue('90days')}₺</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tasarruf:</span>
                <span className="text-sm font-semibold text-green-600">%{calculateDiscount('90days')}</span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Dahil Olan Özellikler:</h4>
            </div>

            <ul className="space-y-3 mb-6">
              {getPlanFeatures('90days').map((feature) => (
                <li key={feature.id} className="flex items-start p-2 bg-green-50 rounded-lg border border-green-100">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">{feature.title}</span>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                    <span className="text-xs text-green-600 font-medium">{feature.price}₺ değerinde</span>
                  </div>
                </li>
              ))}
            </ul>
            
            <button 
              onClick={() => handlePlanSelection('90days')}
              className={`w-full py-3 px-4 rounded-lg transition-colors font-medium ${
                selectedPlan === '90days'
                  ? 'bg-alo-orange text-white hover:bg-orange-600'
                  : 'border border-alo-orange text-alo-orange hover:bg-orange-50'
              }`}
            >
              {selectedPlan === '90days' ? 'Seçili Plan' : 'Plan Seç'}
            </button>
          </div>

          {/* Yıllık Premium */}
          <div className={`bg-white rounded-xl shadow-lg p-8 border-2 transition-all ${
            selectedPlan === '365days' 
              ? 'border-alo-orange shadow-xl scale-105' 
              : 'border-gray-200 hover:border-gray-300'
          }`}>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Yıllık Premium</h3>
              <div className="text-4xl font-bold text-alo-orange mb-2">399.99₺</div>
              <p className="text-gray-600 mb-4">365 günlük premium üyelik</p>
              <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full inline-block">
                10 özellik dahil
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Değer:</span>
                <span className="text-sm font-semibold text-green-600">{calculatePlanValue('365days')}₺</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tasarruf:</span>
                <span className="text-sm font-semibold text-green-600">%{calculateDiscount('365days')}</span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Dahil Olan Özellikler:</h4>
            </div>

            <ul className="space-y-3 mb-6">
              {getPlanFeatures('365days').map((feature) => (
                <li key={feature.id} className="flex items-start p-2 bg-green-50 rounded-lg border border-green-100">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">{feature.title}</span>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                    <span className="text-xs text-green-600 font-medium">{feature.price}₺ değerinde</span>
                  </div>
                </li>
              ))}
            </ul>
            
            <button 
              onClick={() => handlePlanSelection('365days')}
              className={`w-full py-3 px-4 rounded-lg transition-colors font-medium ${
                selectedPlan === '365days'
                  ? 'bg-alo-orange text-white hover:bg-orange-600'
                  : 'border border-alo-orange text-alo-orange hover:bg-orange-50'
              }`}
            >
              {selectedPlan === '365days' ? 'Seçili Plan' : 'Plan Seç'}
            </button>
          </div>
        </div>

        {/* Seçili Plan Özeti */}
        {selectedPlan !== 'free' && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Seçili Plan: {premiumPlans[selectedPlan]?.name}
                </h3>
                <p className="text-gray-600">
                  {premiumPlans[selectedPlan]?.days} gün premium özellikler • {getPlanFeatures(selectedPlan).length} özellik dahil
                </p>
                <p className="text-sm text-green-600 font-medium">
                  Toplam değer: {calculatePlanValue(selectedPlan)}₺ • %{calculateDiscount(selectedPlan)} tasarruf
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-alo-orange">
                  {premiumPlans[selectedPlan]?.price}₺
                </div>
                <button
                  onClick={handlePurchase}
                  className="mt-3 bg-alo-orange text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  Satın Al
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tüm Özellikler Tablosu */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Tüm Premium Özellikler</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Özellik</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Aylık</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">3 Aylık</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Yıllık</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Değer</th>
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature) => (
                  <tr key={feature.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="mr-3">{feature.icon}</div>
                        <div>
                          <div className="font-medium text-gray-900">{feature.title}</div>
                          <div className="text-sm text-gray-500">{feature.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      {planFeatures['30days'].includes(feature.id) ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {planFeatures['90days'].includes(feature.id) ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {planFeatures['365days'].includes(feature.id) ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-3 px-4 font-semibold text-gray-900">
                      {feature.price}₺
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SSS */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Sık Sorulan Sorular</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Premium plan ne zaman aktif olur?</h3>
              <p className="text-gray-600">Ödeme tamamlandıktan hemen sonra premium özellikleriniz aktif hale gelir.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Premium sürem dolduğunda ne olur?</h3>
              <p className="text-gray-600">Premium süreniz dolduğunda ilanlarınız normal ilanlar olarak devam eder, ancak premium özellikler kaybolur.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Premium planı iptal edebilir miyim?</h3>
              <p className="text-gray-600">Premium planlar otomatik yenilenmez. Süreniz dolduğunda manuel olarak yeniden satın almanız gerekir.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Kaç tane premium ilan verebilirim?</h3>
              <p className="text-gray-600">Premium planınız aktif olduğu sürece sınırsız sayıda premium ilan verebilirsiniz.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Hangi ödeme yöntemleri kabul ediliyor?</h3>
              <p className="text-gray-600">Kredi kartı, banka kartı ve mobil ödeme yöntemlerini kabul ediyoruz.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Premium özellikler geri ödenebilir mi?</h3>
              <p className="text-gray-600">Premium özellikler kullanıldıktan sonra geri ödeme yapılmaz. Satın almadan önce dikkatli düşünün.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
