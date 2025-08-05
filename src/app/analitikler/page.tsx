'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Providers';

import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MessageCircle, 
  Heart, 
  Calendar, 
  Filter,
  Download,
  Share2,
  RefreshCw,
  Target,
  Users,
  MapPin,
  Clock,
  Star,
  Zap,
  Activity,
  PieChart,
  LineChart,
  BarChart,
  AreaChart
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalViews: number;
    totalMessages: number;
    totalFavorites: number;
    conversionRate: number;
    avgResponseTime: number;
    listingPerformance: number;
  };
  views: {
    daily: { date: string; views: number }[];
    weekly: { week: string; views: number }[];
    monthly: { month: string; views: number }[];
  };
  listings: {
    performance: { id: string; title: string; views: number; messages: number; favorites: number }[];
    categories: { category: string; count: number; views: number }[];
    locations: { location: string; count: number; views: number }[];
  };
  engagement: {
    messages: { date: string; count: number }[];
    favorites: { date: string; count: number }[];
    responseRate: { date: string; rate: number }[];
  };
  demographics: {
    ageGroups: { age: string; percentage: number }[];
    locations: { location: string; percentage: number }[];
    devices: { device: string; percentage: number }[];
  };
}

interface TimeRange {
  label: string;
  value: string;
  days: number;
}

export default function AnalyticsPage() {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  
  
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');
  const [selectedListing, setSelectedListing] = useState<string>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  const timeRanges: TimeRange[] = [
    { label: 'Son 7 Gün', value: '7', days: 7 },
    { label: 'Son 30 Gün', value: '30', days: 30 },
    { label: 'Son 90 Gün', value: '90', days: 90 },
    { label: 'Son 1 Yıl', value: '365', days: 365 }
  ];

  useEffect(() => {
    if (isLoading) return;
    if (!session) {
      router.push('/giris?redirect=/analitikler');
      return;
    }
    
    loadAnalyticsData();
  }, [session, isLoading, router, timeRange, refreshKey]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?userId=${session?.user.email}&timeRange=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Analitik verileri yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleExport = (type: 'pdf' | 'csv' | 'excel') => {
    // Export işlemi simülasyonu
    alert(`${type.toUpperCase()} formatında rapor indiriliyor...`);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('tr-TR').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (trend < 0) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analitikler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analitikler</h1>
              <p className="mt-2 text-gray-600">
                İlan performansınızı ve kullanıcı etkileşimlerinizi takip edin
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {timeRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Yenile"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {analyticsData ? (
          <>
            {/* Genel Bakış Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Toplam Görüntülenme</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(analyticsData.overview.totalViews)}
                    </p>
                    <div className="flex items-center mt-2">
                      {getTrendIcon(12.5)}
                      <span className="text-sm text-green-600 ml-1">+12.5%</span>
                      <span className="text-xs text-gray-500 ml-1">geçen döneme göre</span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Toplam Mesaj</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(analyticsData.overview.totalMessages)}
                    </p>
                    <div className="flex items-center mt-2">
                      {getTrendIcon(8.2)}
                      <span className="text-sm text-green-600 ml-1">+8.2%</span>
                      <span className="text-xs text-gray-500 ml-1">geçen döneme göre</span>
                    </div>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Dönüşüm Oranı</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPercentage(analyticsData.overview.conversionRate)}
                    </p>
                    <div className="flex items-center mt-2">
                      {getTrendIcon(2.1)}
                      <span className="text-sm text-green-600 ml-1">+2.1%</span>
                      <span className="text-xs text-gray-500 ml-1">geçen döneme göre</span>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ortalama Yanıt Süresi</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData.overview.avgResponseTime} saat
                    </p>
                    <div className="flex items-center mt-2">
                      {getTrendIcon(-0.5)}
                      <span className="text-sm text-green-600 ml-1">-0.5 saat</span>
                      <span className="text-xs text-gray-500 ml-1">geçen döneme göre</span>
                    </div>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Grafikler */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Görüntülenme Trendi */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Görüntülenme Trendi</h3>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg">Günlük</button>
                    <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">Haftalık</button>
                    <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">Aylık</button>
                  </div>
                </div>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Görüntülenme grafiği</p>
                    <p className="text-sm text-gray-400">Son {timeRange} günlük veri</p>
                  </div>
                </div>
              </div>

              {/* Kategori Performansı */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Kategori Performansı</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm">Detaylar</button>
                </div>
                <div className="space-y-4">
                  {analyticsData.listings.categories.slice(0, 5).map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                        <span className="text-sm font-medium text-gray-700">{category.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{formatNumber(category.views)}</p>
                        <p className="text-xs text-gray-500">{category.count} ilan</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detaylı Analizler */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* En İyi Performans Gösteren İlanlar */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">En İyi Performans</h3>
                <div className="space-y-4">
                  {analyticsData.listings.performance.slice(0, 5).map((listing, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{listing.title}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500">{listing.views} görüntülenme</span>
                          <span className="text-xs text-gray-500">{listing.messages} mesaj</span>
                          <span className="text-xs text-gray-500">{listing.favorites} favori</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Demografik Veriler */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Demografik Veriler</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Yaş Grupları</h4>
                    <div className="space-y-2">
                      {analyticsData.demographics.ageGroups.map((age, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{age.age}</span>
                          <span className="text-sm font-medium text-gray-900">{age.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Cihaz Kullanımı</h4>
                    <div className="space-y-2">
                      {analyticsData.demographics.devices.map((device, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{device.device}</span>
                          <span className="text-sm font-medium text-gray-900">{device.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Etkileşim Analizi */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Etkileşim Analizi</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Mesaj Yanıt Oranı</span>
                      <span className="text-sm font-semibold text-green-600">94%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Favori Alma Oranı</span>
                      <span className="text-sm font-semibold text-blue-600">67%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Görüntülenme Artışı</span>
                      <span className="text-sm font-semibold text-purple-600">+23%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Raporlama Araçları */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Raporlama Araçları</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Excel
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    CSV
                  </button>
                  <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    <Share2 className="w-4 h-4 mr-2" />
                    Paylaş
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Haftalık Rapor</h4>
                  <p className="text-sm text-gray-600 mb-3">Her hafta otomatik olarak e-posta ile gönderilir</p>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Ayarları Düzenle
                  </button>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Performans Uyarıları</h4>
                  <p className="text-sm text-gray-600 mb-3">Düşük performans durumunda bildirim alın</p>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Uyarıları Yönet
                  </button>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Rekabet Analizi</h4>
                  <p className="text-sm text-gray-600 mb-3">Rakip ilanların performansını karşılaştırın</p>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Analizi Görüntüle
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analitik Verileri Yok</h3>
            <p className="text-gray-500 mb-4">Henüz yeterli veri toplanmamış. İlanlarınızı yayınlayarak analitikleri görmeye başlayın.</p>
            <button
              onClick={() => router.push('/ilan-ver')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Zap className="w-4 h-4 mr-2" />
              İlan Ver
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 
