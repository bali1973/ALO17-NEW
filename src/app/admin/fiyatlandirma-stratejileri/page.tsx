'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/Providers';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  BarChart3, 
  Calendar, 
  Users, 
  Star,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Eye,
  Heart,
  MessageCircle,
  Download,
  Upload,
  Settings,
  PieChart,
  LineChart,
  Activity,
  X
} from 'lucide-react';

interface PricingStrategy {
  id: string;
  name: string;
  type: 'dynamic' | 'seasonal' | 'competitive' | 'value-based';
  description: string;
  isActive: boolean;
  rules: PricingRule[];
  performance: StrategyPerformance;
  createdAt: string;
  updatedAt: string;
}

interface PricingRule {
  id: string;
  condition: string;
  action: string;
  value: number;
  priority: number;
}

interface StrategyPerformance {
  revenue: number;
  conversionRate: number;
  userSatisfaction: number;
  marketShare: number;
  roi: number;
}

interface Campaign {
  id: string;
  name: string;
  type: 'discount' | 'bonus' | 'trial' | 'referral';
  discount: number;
  startDate: string;
  endDate: string;
  targetAudience: string[];
  isActive: boolean;
  performance: {
    totalRevenue: number;
    conversions: number;
    cost: number;
  };
}

export default function FiyatlandirmaStratejileriPage() {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  
  const [strategies, setStrategies] = useState<PricingStrategy[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<PricingStrategy | null>(null);
  const [showStrategyForm, setShowStrategyForm] = useState(false);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    monthlyGrowth: 0,
    conversionRate: 0,
    averageOrderValue: 0,
    premiumAdoption: 0,
    topPerformingFeatures: []
  });

  useEffect(() => {
    if (!session) {
      router.push('/giris?callbackUrl=/admin/fiyatlandirma-stratejileri');
    } else if (session.user.role !== 'admin') {
      router.push('/');
    } else {
      fetchData();
    }
  }, [session, router]);

  const fetchData = async () => {
    try {
      // Gerçek API'lerden veri çek
      const [strategiesResponse, campaignsResponse, analyticsResponse] = await Promise.all([
        fetch('/api/pricing-strategies'),
        fetch('/api/pricing-campaigns'),
        fetch('/api/pricing-analytics')
      ]);

      if (strategiesResponse.ok) {
        const strategiesData = await strategiesResponse.json();
        setStrategies(strategiesData);
      }

      if (campaignsResponse.ok) {
        const campaignsData = await campaignsResponse.json();
        setCampaigns(campaignsData);
      }

      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics({
          totalRevenue: analyticsData.totalRevenue,
          monthlyGrowth: analyticsData.monthlyGrowth,
          conversionRate: analyticsData.conversionRate,
          averageOrderValue: analyticsData.averageOrderValue,
          premiumAdoption: analyticsData.premiumAdoption,
          topPerformingFeatures: analyticsData.topPerformingFeatures
        });
      }
    } catch (error) {
      console.error('Veri getirme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStrategyTypeIcon = (type: string) => {
    switch (type) {
      case 'dynamic': return <Activity className="w-5 h-5" />;
      case 'seasonal': return <Calendar className="w-5 h-5" />;
      case 'competitive': return <Target className="w-5 h-5" />;
      case 'value-based': return <Star className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  const getStrategyTypeColor = (type: string) => {
    switch (type) {
      case 'dynamic': return 'bg-blue-100 text-blue-800';
      case 'seasonal': return 'bg-green-100 text-green-800';
      case 'competitive': return 'bg-purple-100 text-purple-800';
      case 'value-based': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Fiyatlandırma stratejileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fiyatlandırma Stratejileri</h1>
              <p className="mt-2 text-gray-600">Dinamik fiyatlandırma, kampanya yönetimi ve performans analizi</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowStrategyForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Yeni Strateji
              </button>
              <button
                onClick={() => setShowCampaignForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Target className="w-4 h-4 mr-2" />
                Yeni Kampanya
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-900">₺{analytics.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{analytics.monthlyGrowth}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Dönüşüm Oranı</p>
                <p className="text-2xl font-bold text-gray-900">%{analytics.conversionRate}</p>
                <p className="text-sm text-green-600">+2.3% geçen aya göre</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Premium Kullanım</p>
                <p className="text-2xl font-bold text-gray-900">%{analytics.premiumAdoption}</p>
                <p className="text-sm text-green-600">+5.2% geçen aya göre</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ortalama Sipariş</p>
                <p className="text-2xl font-bold text-gray-900">₺{analytics.averageOrderValue}</p>
                <p className="text-sm text-green-600">+8.7% geçen aya göre</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stratejiler */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Aktif Fiyatlandırma Stratejileri</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {strategies.map((strategy) => (
                    <div key={strategy.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${getStrategyTypeColor(strategy.type)}`}>
                            {getStrategyTypeIcon(strategy.type)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{strategy.name}</h3>
                            <p className="text-sm text-gray-600">{strategy.description}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                strategy.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {strategy.isActive ? 'Aktif' : 'Pasif'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {strategy.rules.length} kural
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">₺{strategy.performance.revenue.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">ROI: %{strategy.performance.roi}</p>
                        </div>
                      </div>
                      
                      {/* Performance Metrics */}
                      <div className="mt-4 grid grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Dönüşüm</p>
                          <p className="text-sm font-semibold text-gray-900">%{strategy.performance.conversionRate}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Memnuniyet</p>
                          <p className="text-sm font-semibold text-gray-900">{strategy.performance.userSatisfaction}/5</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Pazar Payı</p>
                          <p className="text-sm font-semibold text-gray-900">%{strategy.performance.marketShare}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">ROI</p>
                          <p className="text-sm font-semibold text-green-600">%{strategy.performance.roi}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Kampanyalar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Aktif Kampanyalar</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          campaign.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {campaign.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {campaign.type === 'discount' ? `%${campaign.discount} İndirim` : 
                         campaign.type === 'trial' ? `${campaign.discount}% Deneme` : 
                         campaign.type === 'bonus' ? `${campaign.discount} Bonus` : 'Referans'}
                      </p>
                      <div className="text-sm text-gray-500 mb-3">
                        <p>{new Date(campaign.startDate).toLocaleDateString('tr-TR')} - {new Date(campaign.endDate).toLocaleDateString('tr-TR')}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-gray-500">Gelir</p>
                          <p className="font-semibold">₺{campaign.performance.totalRevenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Dönüşüm</p>
                          <p className="font-semibold">{campaign.performance.conversions}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Maliyet</p>
                          <p className="font-semibold">₺{campaign.performance.cost.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Features */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">En İyi Performans Gösteren Özellikler</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analytics.topPerformingFeatures.map((feature, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{feature.name}</h3>
                    <span className="text-sm text-green-600">+{feature.growth}%</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">₺{feature.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Toplam gelir</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Optimization Recommendations */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Optimizasyon Önerileri</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900">Premium Plan Fiyat Artırımı</h3>
                  <p className="text-sm text-blue-700">Premium kullanıcı memnuniyeti yüksek, fiyat %15 artırılabilir</p>
                  <p className="text-xs text-blue-600 mt-1">Tahmini gelir artışı: ₺12,500/ay</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                <Target className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900">Yeni Kullanıcı Kampanyası</h3>
                  <p className="text-sm text-green-700">İlk ay %50 indirim ile yeni kullanıcı çekimi artırılabilir</p>
                  <p className="text-xs text-green-600 mt-1">Tahmini dönüşüm artışı: %25</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-900">Düşük Performanslı Özellik</h3>
                  <p className="text-sm text-orange-700">"Acil İlan" özelliği düşük kullanımda, fiyat %20 azaltılabilir</p>
                  <p className="text-xs text-orange-600 mt-1">Tahmini kullanım artışı: %40</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Yeni Strateji Modal */}
        {showStrategyForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Yeni Fiyatlandırma Stratejisi</h2>
                <button
                  onClick={() => setShowStrategyForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Strateji Adı
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="Örn: Dinamik Premium Fiyatlandırma"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Strateji Türü
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                    <option value="dynamic">Dinamik Fiyatlandırma</option>
                    <option value="seasonal">Sezonsal Fiyatlandırma</option>
                    <option value="competitive">Rekabetçi Fiyatlandırma</option>
                    <option value="value-based">Değer Bazlı Fiyatlandırma</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="Strateji açıklaması..."
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Stratejiyi aktif et
                  </label>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Strateji Oluştur
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowStrategyForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Yeni Kampanya Modal */}
        {showCampaignForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Yeni Kampanya</h2>
                <button
                  onClick={() => setShowCampaignForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kampanya Adı
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="Örn: Yeni Yıl İndirimi"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kampanya Türü
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                      <option value="discount">İndirim</option>
                      <option value="trial">Deneme</option>
                      <option value="bonus">Bonus</option>
                      <option value="referral">Referans</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      İndirim Oranı (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="30"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Başlangıç Tarihi
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bitiş Tarihi
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hedef Kitle
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Yeni Kullanıcılar</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Aktif Kullanıcılar</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Premium Kullanıcılar</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Tüm Kullanıcılar</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="campaignActive"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                  <label htmlFor="campaignActive" className="ml-2 text-sm text-gray-700">
                    Kampanyayı aktif et
                  </label>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Kampanya Oluştur
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCampaignForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 