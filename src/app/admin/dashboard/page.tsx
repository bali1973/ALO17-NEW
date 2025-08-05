'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/Providers';
import { useRouter } from 'next/navigation';
import {
  Users,
  FileText,
  MessageCircle,
  Eye,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  Activity,
  Calendar,
  MapPin,
  ShoppingCart,
  Settings,
  Bell,
  Shield,
  Database,
  Zap
} from 'lucide-react';

interface DashboardStats {
  users: {
    total: number;
    active: number;
    new: number;
    premium: number;
    growth: number;
  };
  listings: {
    total: number;
    active: number;
    pending: number;
    expired: number;
    growth: number;
  };
  messages: {
    total: number;
    unread: number;
    today: number;
    growth: number;
  };
  revenue: {
    total: number;
    monthly: number;
    weekly: number;
    growth: number;
  };
  views: {
    total: number;
    today: number;
    average: number;
    growth: number;
  };
  reports: {
    total: number;
    open: number;
    resolved: number;
    growth: number;
  };
}

interface RecentActivity {
  id: string;
  type: 'user' | 'listing' | 'message' | 'report' | 'payment';
  action: string;
  user: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

interface TopCategory {
  name: string;
  count: number;
  growth: number;
  color: string;
}

export default function AdminDashboardPage() {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  
  const [stats, setStats] = useState<DashboardStats>({
    users: { total: 0, active: 0, new: 0, premium: 0, growth: 0 },
    listings: { total: 0, active: 0, pending: 0, expired: 0, growth: 0 },
    messages: { total: 0, unread: 0, today: 0, growth: 0 },
    revenue: { total: 0, monthly: 0, weekly: 0, growth: 0 },
    views: { total: 0, today: 0, average: 0, growth: 0 },
    reports: { total: 0, open: 0, resolved: 0, growth: 0 }
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [topCategories, setTopCategories] = useState<TopCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    if (isLoading) return;
    if (!session || session.user.role !== 'admin') {
      router.push('/giris');
      return;
    }
    
    loadDashboardData();
  }, [session, isLoading, router, timeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/dashboard?timeRange=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentActivity(data.recentActivity);
        setTopCategories(data.topCategories);
      }
    } catch (error) {
      console.error('Dashboard verileri yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <Users className="w-4 h-4" />;
      case 'listing':
        return <FileText className="w-4 h-4" />;
      case 'message':
        return <MessageCircle className="w-4 h-4" />;
      case 'report':
        return <AlertTriangle className="w-4 h-4" />;
      case 'payment':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('tr-TR').format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes} dakika önce`;
    } else if (diffHours < 24) {
      return `${diffHours} saat önce`;
    } else {
      return `${diffDays} gün önce`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Dashboard yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Platform performansını ve kullanıcı aktivitelerini takip edin
          </p>
        </div>

        {/* Zaman Aralığı Seçici */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Zaman Aralığı</h2>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="today">Bugün</option>
                <option value="week">Son 7 Gün</option>
                <option value="month">Son 30 Gün</option>
                <option value="quarter">Son 3 Ay</option>
                <option value="year">Son 1 Yıl</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ana İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {/* Kullanıcılar */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.users.total)}</p>
                <div className="flex items-center mt-2">
                  {stats.users.growth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${stats.users.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(stats.users.growth)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* İlanlar */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam İlan</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.listings.total)}</p>
                <div className="flex items-center mt-2">
                  {stats.listings.growth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${stats.listings.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(stats.listings.growth)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Mesajlar */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Mesaj</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.messages.total)}</p>
                <div className="flex items-center mt-2">
                  {stats.messages.growth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${stats.messages.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(stats.messages.growth)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Gelir */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.revenue.total)}</p>
                <div className="flex items-center mt-2">
                  {stats.revenue.growth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${stats.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(stats.revenue.growth)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Görüntülenme */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Görüntülenme</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.views.total)}</p>
                <div className="flex items-center mt-2">
                  {stats.views.growth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${stats.views.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(stats.views.growth)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Eye className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Raporlar */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Rapor</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.reports.total)}</p>
                <div className="flex items-center mt-2">
                  {stats.reports.growth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${stats.reports.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(stats.reports.growth)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Detaylı İstatistikler */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Kullanıcı Detayları */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Kullanıcı İstatistikleri</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Aktif Kullanıcılar</span>
                <span className="font-semibold">{formatNumber(stats.users.active)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Yeni Kullanıcılar</span>
                <span className="font-semibold text-green-600">{formatNumber(stats.users.new)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Premium Kullanıcılar</span>
                <span className="font-semibold text-yellow-600">{formatNumber(stats.users.premium)}</span>
              </div>
            </div>
          </div>

          {/* İlan Detayları */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">İlan İstatistikleri</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Aktif İlanlar</span>
                <span className="font-semibold text-green-600">{formatNumber(stats.listings.active)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Bekleyen İlanlar</span>
                <span className="font-semibold text-yellow-600">{formatNumber(stats.listings.pending)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Süresi Dolmuş</span>
                <span className="font-semibold text-red-600">{formatNumber(stats.listings.expired)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alt Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Son Aktiviteler */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Son Aktiviteler</h3>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Henüz aktivite yok</p>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.user} • {formatTime(activity.timestamp)}</p>
                    </div>
                    {getStatusIcon(activity.status)}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* En Popüler Kategoriler */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">En Popüler Kategoriler</h3>
            <div className="space-y-4">
              {topCategories.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Veri yok</p>
              ) : (
                topCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-800">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatNumber(category.count)}</p>
                      <p className={`text-xs ${category.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {category.growth >= 0 ? '+' : ''}{category.growth}%
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Hızlı Erişim */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Hızlı Erişim</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <button
              onClick={() => router.push('/admin/kullanicilar')}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-800">Kullanıcılar</span>
            </button>
            
            <button
              onClick={() => router.push('/admin/ilanlar')}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-800">İlanlar</span>
            </button>
            
            <button
              onClick={() => router.push('/admin/mesajlar')}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <MessageCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-800">Mesajlar</span>
            </button>
            
            <button
              onClick={() => router.push('/admin/raporlar')}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-800">Raporlar</span>
            </button>
            
            <button
              onClick={() => router.push('/admin/istatistikler')}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <BarChart3 className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-800">İstatistikler</span>
            </button>
            
            <button
              onClick={() => router.push('/admin/ayarlar')}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <Settings className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-800">Ayarlar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
