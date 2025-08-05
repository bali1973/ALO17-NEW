'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Providers';
import { 
  Crown, 
  Star, 
  Zap, 
  TrendingUp, 
  Shield, 
  Sparkles, 
  CheckCircle, 
  X, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  Clock,
  Users,
  FileText,
  MessageCircle,
  Bell,
  Settings,
  CreditCard,
  Gift,
  Award,
  Target,
  Rocket,
  BarChart3,
  DollarSign
} from 'lucide-react';

interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  isActive: boolean;
  category: 'listing' | 'profile' | 'analytics' | 'communication';
  priority: number;
}

interface PremiumPlan {
  id: string;
  name: string;
  duration: number;
  price: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
}

interface UserPremiumStatus {
  isPremium: boolean;
  planId: string | null;
  startDate: string | null;
  endDate: string | null;
  features: string[];
  remainingDays: number;
}

// Premium özellikler - Component dışında tanımlanıyor
const allFeatures: PremiumFeature[] = [
  {
    id: 'feature_1',
    name: 'Öne Çıkan Rozet',
    description: 'İlanınız premium rozeti ile işaretlenir ve daha fazla dikkat çeker',
    price: 15.00,
    isActive: true,
    category: 'listing',
    priority: 1,
    icon: 'crown'
  },
  {
    id: 'feature_2',
    name: 'Öncelikli Sıralama',
    description: 'Arama sonuçlarında üst sıralarda görünürsünüz',
    price: 25.00,
    isActive: true,
    category: 'listing',
    priority: 2,
    icon: 'trendingUp'
  },
  {
    id: 'feature_3',
    name: 'Güvenilir Satıcı Rozeti',
    description: 'Premium satıcı rozeti kazanın ve güven oluşturun',
    price: 20.00,
    isActive: true,
    category: 'profile',
    priority: 3,
    icon: 'shield'
  },
  {
    id: 'feature_4',
    name: 'Maksimum 5 Resim',
    description: 'İlanınızda 5 resme kadar yükleyebilirsiniz',
    price: 10.00,
    isActive: true,
    category: 'listing',
    priority: 4,
    icon: 'sparkles'
  },
  {
    id: 'feature_5',
    name: 'Maksimum 5 İlan',
    description: 'Aynı anda 5 adet ilan yayınlayabilirsiniz',
    price: 30.00,
    isActive: true,
    category: 'listing',
    priority: 5,
    icon: 'fileText'
  },

  {
    id: 'feature_7',
    name: 'Gelişmiş Analitikler',
    description: 'İlan performansınızı detaylı olarak takip edin',
    price: 20.00,
    isActive: true,
    category: 'analytics',
    priority: 7,
    icon: 'barChart3'
  },
  {
    id: 'feature_8',
    name: 'Özel Bildirimler',
    description: 'Özel bildirim tercihleri ve gelişmiş uyarılar',
    price: 15.00,
    isActive: true,
    category: 'communication',
    priority: 8,
    icon: 'bell'
  },
  {
    id: 'feature_9',
    name: 'Profil Özelleştirme',
    description: 'Profilinizi özelleştirin ve daha profesyonel görünün',
    price: 12.00,
    isActive: true,
    category: 'profile',
    priority: 9,
    icon: 'settings'
  },
  {
    id: 'feature_10',
    name: 'Hızlı İlan Yayınlama',
    description: 'İlanlarınızı daha hızlı yayınlayın',
    price: 18.00,
    isActive: true,
    category: 'listing',
    priority: 10,
    icon: 'zap'
  }
];

export default function PremiumOzelliklerPage() {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  
  const [userPremiumStatus, setUserPremiumStatus] = useState<UserPremiumStatus>({
    isPremium: false,
    planId: null,
    startDate: null,
    endDate: null,
    features: [],
    remainingDays: 0
  });
  
  const [premiumFeatures, setPremiumFeatures] = useState<PremiumFeature[]>(allFeatures);
  const [premiumPlans, setPremiumPlans] = useState<PremiumPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    
    if (session) {
      loadPremiumData();
    } else {
      loadPublicPremiumData();
    }
  }, [session, isLoading, router]);

  const loadPremiumData = async () => {
    setLoading(true);
    try {
      // Kullanıcının premium durumunu al
      const statusResponse = await fetch(`/api/premium/status?userId=${session?.user.email}`);
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        setUserPremiumStatus(statusData);
      }

      // Premium planları al
      const plansResponse = await fetch('/api/premium-plans');
      if (plansResponse.ok) {
        const plansData = await plansResponse.json();
        setPremiumPlans(plansData);
      }
    } catch (error) {
      console.error('Premium verileri yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPublicPremiumData = async () => {
    setLoading(true);
    try {
      const plansResponse = await fetch('/api/premium-plans');
      if (plansResponse.ok) {
        const plansData = await plansResponse.json();
        setPremiumPlans(plansData);
      }
    } catch (error) {
      console.error('Premium verileri yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);
    const plan = premiumPlans.find(p => p.id === planId);
    if (plan) {
      setSelectedFeatures(plan.features);
    }
  };

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const calculateTotalPrice = () => {
    const planPrice = premiumPlans.find(p => p.id === selectedPlan)?.price || 0;
    const featuresPrice = selectedFeatures.reduce((total, featureId) => {
      const feature = premiumFeatures.find(f => f.id === featureId);
      return total + (feature?.price || 0);
    }, 0);
    return planPrice + featuresPrice;
  };

  const calculatePlanValue = (planFeatures: string[]) => {
    return allFeatures
      .filter(feature => planFeatures.includes(feature.id))
      .reduce((total, feature) => total + feature.price, 0);
  };

  const handlePurchase = async () => {
    if (!selectedPlan) {
      alert('Lütfen bir plan seçin');
      return;
    }

    if (!session) {
      router.push('/giris?redirect=/premium-ozellikler');
      return;
    }

    const totalPrice = calculateTotalPrice();
    const plan = premiumPlans.find(p => p.id === selectedPlan);
    
    const confirmPurchase = confirm(
      `${plan?.name} planı ve seçili özellikler için ${totalPrice}₺ ödeme yapılacak. Devam etmek istiyor musunuz?`
    );
    
    if (confirmPurchase) {
      try {
        const response = await fetch('/api/premium/purchase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: session?.user.email,
            planId: selectedPlan,
            featureIds: selectedFeatures,
            totalPrice
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.paymentUrl) {
            window.location.href = data.paymentUrl;
          } else {
            alert('Ödeme başarıyla tamamlandı!');
            loadPremiumData();
          }
        } else {
          alert('Ödeme işlemi başlatılamadı');
        }
      } catch (error) {
        alert('Bir hata oluştu');
      }
    }
  };

  const getFeatureIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      crown: <Crown className="w-5 h-5" />,
      trendingUp: <TrendingUp className="w-5 h-5" />,
      shield: <Shield className="w-5 h-5" />,
      sparkles: <Sparkles className="w-5 h-5" />,
      fileText: <FileText className="w-5 h-5" />,
      messageCircle: <MessageCircle className="w-5 h-5" />,
      barChart3: <BarChart3 className="w-5 h-5" />,
      bell: <Bell className="w-5 h-5" />,
      settings: <Settings className="w-5 h-5" />,
      zap: <Zap className="w-5 h-5" />
    };
    return iconMap[iconName] || <Sparkles className="w-5 h-5" />;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      listing: 'bg-blue-100 text-blue-600',
      profile: 'bg-green-100 text-green-600',
      analytics: 'bg-orange-100 text-orange-600',
      communication: 'bg-purple-100 text-purple-600'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      listing: 'İlan Özellikleri',
      profile: 'Profil Özellikleri',
      analytics: 'Analitik Özellikleri',
      communication: 'İletişim Özellikleri'
    };
    return labels[category as keyof typeof labels] || category;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-alo-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Premium Özellikler
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Premium üyelik ile özel özelliklere erişin ve deneyiminizi geliştirin
          </p>
        </div>

        {/* Kullanıcı Premium Durumu */}
        {session && userPremiumStatus.isPremium && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 mb-8 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Premium Üyeliğiniz Aktif</h2>
                <p className="mb-2">
                  Premium üyeliğiniz {userPremiumStatus.remainingDays} gün daha geçerli
                </p>
                <p className="text-sm opacity-90">
                  Bitiş tarihi: {userPremiumStatus.endDate ? new Date(userPremiumStatus.endDate).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{userPremiumStatus.remainingDays}</div>
                <div className="text-sm">Gün Kaldı</div>
              </div>
            </div>
          </div>
        )}

        {/* Plan Karşılaştırması */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {premiumPlans.map((plan) => (
            <div key={plan.id} className={`bg-white rounded-xl shadow-lg p-8 border-2 transition-all ${
              selectedPlan === plan.id 
                ? 'border-alo-orange shadow-xl scale-105' 
                : 'border-gray-200 hover:border-gray-300'
            } ${plan.isPopular ? 'relative' : ''}`}>
              
              {/* POPÜLER Badge */}
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    POPÜLER
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <Sparkles className="w-6 h-6 text-alo-orange mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-alo-orange mb-2">{plan.price}₺</div>
                <p className="text-gray-600 mb-4">{plan.duration} günlük premium üyelik</p>
                <div className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full inline-block">
                  {plan.features.length} özellik dahil
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Değer:</span>
                  <span className="text-sm font-semibold text-green-600">{calculatePlanValue(plan.features)}₺</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tasarruf:</span>
                  <span className="text-sm font-semibold text-green-600">
                    %{Math.round(((calculatePlanValue(plan.features) - plan.price) / calculatePlanValue(plan.features)) * 100)}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Dahil Olan Özellikler:</h4>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((featureId) => {
                  const feature = allFeatures.find(f => f.id === featureId);
                  if (!feature) return null;
                  
                  return (
                    <li key={featureId} className="flex items-start p-2 bg-green-50 rounded-lg border border-green-100">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-sm font-medium text-gray-900">{feature.name}</span>
                        <p className="text-xs text-gray-500">{feature.description}</p>
                        <span className="text-xs text-green-600 font-medium">{feature.price}₺ değerinde</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
              
              <button 
                onClick={() => handlePlanSelection(plan.id)}
                className={`w-full py-3 px-4 rounded-lg transition-colors font-medium ${
                  selectedPlan === plan.id
                    ? 'bg-alo-orange text-white hover:bg-orange-600'
                    : 'border border-alo-orange text-alo-orange hover:bg-orange-50'
                }`}
              >
                {selectedPlan === plan.id ? 'Seçili Plan' : 'Plan Seç'}
              </button>
            </div>
          ))}
        </div>

        {/* Seçili Plan Özeti */}
        {selectedPlan && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Seçili Plan: {premiumPlans.find(p => p.id === selectedPlan)?.name}
                </h3>
                <p className="text-gray-600">
                  {premiumPlans.find(p => p.id === selectedPlan)?.duration} gün premium özellikler • {selectedFeatures.length} özellik dahil
                </p>
                <p className="text-sm text-green-600 font-medium">
                  Toplam değer: {calculateTotalPrice()}₺
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-alo-orange">
                  {calculateTotalPrice()}₺
                </div>
                <button
                  onClick={handlePurchase}
                  className="mt-3 bg-alo-orange text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  {session ? 'Satın Al' : 'Giriş Yap ve Satın Al'}
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
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Kategori</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Değer</th>
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature) => (
                  <tr key={feature.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="mr-3">{getFeatureIcon(feature.icon)}</div>
                        <div>
                          <div className="font-medium text-gray-900">{feature.name}</div>
                          <div className="text-sm text-gray-500">{feature.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(feature.category)}`}>
                        {getCategoryLabel(feature.category)}
                      </span>
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

        {/* Premium Avantajları */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Premium Avantajları</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Daha Fazla Görünürlük</h3>
              <p className="text-gray-600">
                İlanlarınız arama sonuçlarında üst sıralarda görünür ve daha fazla kişiye ulaşır
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Güvenilirlik</h3>
              <p className="text-gray-600">
                Premium rozeti ile güvenilir satıcı olarak tanınır ve güven kazanırsınız
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Özel Özellikler</h3>
              <p className="text-gray-600">
                Daha fazla ilan, gelişmiş analitikler ve özel destek hizmetlerine erişim
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
