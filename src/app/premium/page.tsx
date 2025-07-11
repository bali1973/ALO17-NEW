'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Star, Clock, TrendingUp, CheckCircle, Info, Zap, Crown, Shield } from 'lucide-react';
import { getPremiumPlans } from '@/lib/utils';

export default function PremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>('30days');
  const [premiumPlans, setPremiumPlans] = useState<Record<string, { name: string; price: number; days: number }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: 'Öne Çıkan Rozet',
      description: 'İlanınız premium rozeti ile işaretlenir'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-500" />,
      title: 'Öncelikli Sıralama',
      description: 'Arama sonuçlarında üst sıralarda görünür'
    },
    {
      icon: <Star className="w-6 h-6 text-blue-500" />,
      title: 'Daha Fazla Görüntülenme',
      description: 'İlanınız daha fazla kişiye ulaşır'
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-500" />,
      title: 'Güvenilir Satıcı',
      description: 'Premium satıcı rozeti kazanın'
    },
    {
      icon: <Crown className="w-6 h-6 text-orange-500" />,
      title: 'Özel Destek',
      description: '7/24 öncelikli müşteri desteği'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-pink-500" />,
      title: 'Maksimum 5 Resim',
      description: 'İlanınızda 5 resme kadar yükleyin'
    }
  ];

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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Premium Planlar
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            İlanınızı daha fazla kişiye ulaştırmak ve satış şansınızı artırmak için premium planlarımızı keşfedin
          </p>
        </div>

        {/* Premium Özellikler */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Premium Avantajları</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Karşılaştırması */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Ücretsiz Plan */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ücretsiz Plan</h3>
              <div className="text-3xl font-bold text-green-600 mb-2">0₺</div>
              <p className="text-gray-600">30 gün ücretsiz premium</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-sm">30 gün ücretsiz premium</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-sm">Maksimum 5 resim</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-sm">Temel özellikler</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-sm">Standart sıralama</span>
              </li>
            </ul>
            <button className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Mevcut Plan
            </button>
          </div>

          {/* Premium Planlar */}
          {Object.entries(premiumPlans).map(([key, plan]) => (
            <div key={key} className={`bg-white rounded-lg shadow-sm p-6 border-2 transition-all ${
              selectedPlan === key 
                ? 'border-alo-orange shadow-lg' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <div className="text-center mb-6">
                <div className="flex justify-center mb-2">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-alo-orange mb-2">{plan.price}₺</div>
                <p className="text-gray-600">{plan.days} gün premium</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">{plan.days} gün premium</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">Maksimum 5 resim</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">Öne çıkan rozet</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">Öncelikli sıralama</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">Daha fazla görüntülenme</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">Premium satıcı rozeti</span>
                </li>
              </ul>
              <button 
                onClick={() => handlePlanSelection(key)}
                className={`w-full py-3 px-4 rounded-lg transition-colors ${
                  selectedPlan === key
                    ? 'bg-alo-orange text-white hover:bg-orange-600'
                    : 'border border-alo-orange text-alo-orange hover:bg-orange-50'
                }`}
              >
                {selectedPlan === key ? 'Seçili Plan' : 'Plan Seç'}
              </button>
            </div>
          ))}
        </div>

        {/* Seçili Plan Özeti */}
        {selectedPlan !== 'free' && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Seçili Plan: {premiumPlans[selectedPlan]?.name}
                </h3>
                <p className="text-gray-600">
                  {premiumPlans[selectedPlan]?.days} gün premium özellikler
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-alo-orange">
                  {premiumPlans[selectedPlan]?.price}₺
                </div>
                <button
                  onClick={handlePurchase}
                  className="mt-2 bg-alo-orange text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Satın Al
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SSS */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Sık Sorulan Sorular</h2>
          <div className="space-y-6">
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
          </div>
        </div>
      </div>
    </div>
  );
} 