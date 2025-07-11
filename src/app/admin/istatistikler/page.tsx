'use client';

import { useState } from 'react';
import {
  ChartBarIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { 
  StatCard, 
  MetricGrid, 
  ChartGrid, 
  BarChart, 
  LineChart, 
  PieChart,
  ChartData,
  LineChartData 
} from '@/components/ui/charts';

// Örnek istatistik verileri
const stats = {
  totalUsers: 1234,
  totalListings: 5678,
  activeListings: 4321,
  pendingListings: 1357,
  totalMessages: 8901,
  totalViews: 123456,
  premiumUsers: 89,
  premiumListings: 234,
  premiumRevenue: 45600,
  monthlyGrowth: 12.5,
  weeklyGrowth: -2.3,
  dailyActiveUsers: 456,
  conversionRate: 3.2,
};

// Chart data
const categoryData: ChartData[] = [
  { label: 'Emlak', value: 2345, color: '#3b82f6' },
  { label: 'Vasıta', value: 1234, color: '#10b981' },
  { label: 'Elektronik', value: 987, color: '#f59e0b' },
  { label: 'İş', value: 654, color: '#8b5cf6' },
  { label: 'Diğer', value: 458, color: '#ef4444' },
];

const monthlyTrendData: LineChartData[] = [
  { label: 'Ocak', value: 1200, date: '2024-01-01' },
  { label: 'Şubat', value: 1250, date: '2024-02-01' },
  { label: 'Mart', value: 1300, date: '2024-03-01' },
  { label: 'Nisan', value: 1350, date: '2024-04-01' },
  { label: 'Mayıs', value: 1400, date: '2024-05-01' },
  { label: 'Haziran', value: 1450, date: '2024-06-01' },
];

const revenueData: LineChartData[] = [
  { label: 'Ocak', value: 42000, date: '2024-01-01' },
  { label: 'Şubat', value: 44000, date: '2024-02-01' },
  { label: 'Mart', value: 46000, date: '2024-03-01' },
  { label: 'Nisan', value: 48000, date: '2024-04-01' },
  { label: 'Mayıs', value: 50000, date: '2024-05-01' },
  { label: 'Haziran', value: 52000, date: '2024-06-01' },
];

const listingStatusData: ChartData[] = [
  { label: 'Aktif', value: 4321, color: '#10b981' },
  { label: 'Bekleyen', value: 1357, color: '#f59e0b' },
  { label: 'Reddedilen', value: 234, color: '#ef4444' },
];

const userActivityData: ChartData[] = [
  { label: 'Günlük Aktif', value: 456, color: '#3b82f6' },
  { label: 'Haftalık Aktif', value: 1234, color: '#8b5cf6' },
  { label: 'Aylık Aktif', value: 2345, color: '#10b981' },
];

export default function StatisticsPage() {
  const [timeRange, setTimeRange] = useState('month');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold text-gray-900">İstatistikler</h1>
        <p className="mt-2 text-sm text-gray-700">
          Platform performansını ve kullanıcı aktivitelerini takip edin.
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Zaman Aralığı</h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="week">Son 7 Gün</option>
              <option value="month">Son 30 Gün</option>
              <option value="quarter">Son 3 Ay</option>
              <option value="year">Son 1 Yıl</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <MetricGrid>
        <StatCard
          title="Toplam Kullanıcı"
          value={stats.totalUsers}
          change={stats.monthlyGrowth}
          changeLabel="geçen aya göre"
          icon={<UserGroupIcon className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Toplam İlan"
          value={stats.totalListings}
          change={8.2}
          changeLabel="geçen aya göre"
          icon={<ClipboardDocumentListIcon className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Toplam Mesaj"
          value={stats.totalMessages}
          change={15.7}
          changeLabel="geçen aya göre"
          icon={<ChatBubbleLeftRightIcon className="h-6 w-6" />}
          color="purple"
        />
        <StatCard
          title="Premium Gelir"
          value={`${stats.premiumRevenue.toLocaleString('tr-TR')} ₺`}
          change={stats.weeklyGrowth}
          changeLabel="geçen haftaya göre"
          icon={<CurrencyDollarIcon className="h-6 w-6" />}
          color="yellow"
        />
      </MetricGrid>

      {/* Additional Metrics */}
      <MetricGrid>
        <StatCard
          title="Günlük Aktif Kullanıcı"
          value={stats.dailyActiveUsers}
          change={5.2}
          changeLabel="geçen güne göre"
          icon={<EyeIcon className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Bekleyen İlanlar"
          value={stats.pendingListings}
          icon={<ClockIcon className="h-6 w-6" />}
          color="yellow"
        />
        <StatCard
          title="Premium Kullanıcılar"
          value={stats.premiumUsers}
          change={2.1}
          changeLabel="geçen aya göre"
          icon={<StarIcon className="h-6 w-6" />}
          color="yellow"
        />
        <StatCard
          title="Dönüşüm Oranı"
          value={`${stats.conversionRate}%`}
          change={0.5}
          changeLabel="geçen aya göre"
          icon={<ChartBarIcon className="h-6 w-6" />}
          color="green"
        />
      </MetricGrid>

      {/* Charts */}
      <ChartGrid cols={2}>
        <LineChart
          data={monthlyTrendData}
          title="Kullanıcı Büyüme Trendi"
          color="#3b82f6"
        />
        <LineChart
          data={revenueData}
          title="Aylık Gelir Trendi"
          color="#10b981"
        />
      </ChartGrid>

      <ChartGrid cols={3}>
        <PieChart
          data={categoryData}
          title="Kategori Dağılımı"
        />
        <BarChart
          data={listingStatusData}
          title="İlan Durumları"
        />
        <BarChart
          data={userActivityData}
          title="Kullanıcı Aktivitesi"
        />
      </ChartGrid>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Premium Stats */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Premium İstatistikler</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Premium Kullanıcılar</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{stats.premiumUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ClipboardDocumentListIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Premium İlanlar</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{stats.premiumListings}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Aylık Gelir</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{stats.premiumRevenue.toLocaleString('tr-TR')} ₺</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ChartBarIcon className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Premium Oranı</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Listing Stats */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">İlan İstatistikleri</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Aktif İlanlar</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{stats.activeListings.toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Bekleyen İlanlar</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{stats.pendingListings.toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <EyeIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Toplam Görüntülenme</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{stats.totalViews.toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ChartBarIcon className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Ortalama Görüntülenme</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {Math.round(stats.totalViews / stats.totalListings).toLocaleString('tr-TR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 