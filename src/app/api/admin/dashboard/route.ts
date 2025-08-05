import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const USERS_PATH = path.join(process.cwd(), 'public', 'users.json');
const LISTINGS_PATH = path.join(process.cwd(), 'public', 'listings.json');
const MESSAGES_PATH = path.join(process.cwd(), 'public', 'messages.json');
const REPORTS_PATH = path.join(process.cwd(), 'public', 'raporlar.json');
const CATEGORIES_PATH = path.join(process.cwd(), 'public', 'categories.json');

async function readData(filePath: string) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function getTimeRangeFilter(timeRange: string) {
  const now = new Date();
  const filters = {
    today: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    month: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    quarter: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
    year: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
  };
  return filters[timeRange as keyof typeof filters] || filters.week;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'week';

    const users = await readData(USERS_PATH);
    const listings = await readData(LISTINGS_PATH);
    const messages = await readData(MESSAGES_PATH);
    const reports = await readData(REPORTS_PATH);
    const categories = await readData(CATEGORIES_PATH);

    const timeFilter = getTimeRangeFilter(timeRange);
    const previousTimeFilter = new Date(timeFilter.getTime() - (timeFilter.getTime() - new Date().getTime()));

    // Kullanıcı istatistikleri
    const totalUsers = users.length;
    const activeUsers = users.filter((user: any) => user.status !== 'inactive').length;
    const newUsers = users.filter((user: any) => new Date(user.createdAt) >= timeFilter).length;
    const premiumUsers = users.filter((user: any) => user.role === 'premium').length;
    const previousNewUsers = users.filter((user: any) => {
      const userDate = new Date(user.createdAt);
      return userDate >= previousTimeFilter && userDate < timeFilter;
    }).length;
    const userGrowth = calculateGrowth(newUsers, previousNewUsers);

    // İlan istatistikleri
    const totalListings = listings.length;
    const activeListings = listings.filter((listing: any) => listing.status === 'active').length;
    const pendingListings = listings.filter((listing: any) => listing.status === 'pending').length;
    const expiredListings = listings.filter((listing: any) => listing.status === 'expired').length;
    const newListings = listings.filter((listing: any) => new Date(listing.createdAt) >= timeFilter).length;
    const previousNewListings = listings.filter((listing: any) => {
      const listingDate = new Date(listing.createdAt);
      return listingDate >= previousTimeFilter && listingDate < timeFilter;
    }).length;
    const listingGrowth = calculateGrowth(newListings, previousNewListings);

    // Mesaj istatistikleri
    const totalMessages = messages.length;
    const unreadMessages = messages.filter((msg: any) => !msg.isRead).length;
    const todayMessages = messages.filter((msg: any) => new Date(msg.timestamp) >= timeFilter).length;
    const previousTodayMessages = messages.filter((msg: any) => {
      const msgDate = new Date(msg.timestamp);
      return msgDate >= previousTimeFilter && msgDate < timeFilter;
    }).length;
    const messageGrowth = calculateGrowth(todayMessages, previousTodayMessages);

    // Gelir istatistikleri (örnek veriler)
    const totalRevenue = 125000;
    const monthlyRevenue = 15000;
    const weeklyRevenue = 3500;
    const revenueGrowth = 8.5;

    // Görüntülenme istatistikleri (örnek veriler)
    const totalViews = 456789;
    const todayViews = 1234;
    const averageViews = 5678;
    const viewsGrowth = 12.3;

    // Rapor istatistikleri
    const totalReports = reports.length;
    const openReports = reports.filter((report: any) => report.status === 'Açık').length;
    const resolvedReports = reports.filter((report: any) => report.status === 'Çözüldü').length;
    const newReports = reports.filter((report: any) => new Date(report.date) >= timeFilter).length;
    const previousNewReports = reports.filter((report: any) => {
      const reportDate = new Date(report.date);
      return reportDate >= previousTimeFilter && reportDate < timeFilter;
    }).length;
    const reportGrowth = calculateGrowth(newReports, previousNewReports);

    // Kategori istatistikleri
    const categoryStats = categories.map((category: any) => {
      const categoryListings = listings.filter((listing: any) => listing.category === category.name);
      const previousCategoryListings = listings.filter((listing: any) => {
        const listingDate = new Date(listing.createdAt);
        return listing.category === category.name && 
               listingDate >= previousTimeFilter && 
               listingDate < timeFilter;
      });
      
      return {
        name: category.name,
        count: categoryListings.length,
        growth: calculateGrowth(categoryListings.length, previousCategoryListings.length),
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
      };
    }).sort((a: any, b: any) => b.count - a.count).slice(0, 5);

    // Son aktiviteler
    const recentActivity = [
      {
        id: '1',
        type: 'user',
        action: 'Yeni kullanıcı kaydoldu',
        user: 'Ahmet Yılmaz',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        status: 'success'
      },
      {
        id: '2',
        type: 'listing',
        action: 'Yeni ilan eklendi',
        user: 'Mehmet Demir',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        status: 'info'
      },
      {
        id: '3',
        type: 'report',
        action: 'Yeni rapor gönderildi',
        user: 'Fatma Kaya',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: 'warning'
      },
      {
        id: '4',
        type: 'payment',
        action: 'Premium ödeme alındı',
        user: 'Ali Özkan',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        status: 'success'
      },
      {
        id: '5',
        type: 'message',
        action: 'Yeni mesaj gönderildi',
        user: 'Ayşe Çelik',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        status: 'info'
      }
    ];

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        new: newUsers,
        premium: premiumUsers,
        growth: userGrowth
      },
      listings: {
        total: totalListings,
        active: activeListings,
        pending: pendingListings,
        expired: expiredListings,
        growth: listingGrowth
      },
      messages: {
        total: totalMessages,
        unread: unreadMessages,
        today: todayMessages,
        growth: messageGrowth
      },
      revenue: {
        total: totalRevenue,
        monthly: monthlyRevenue,
        weekly: weeklyRevenue,
        growth: revenueGrowth
      },
      views: {
        total: totalViews,
        today: todayViews,
        average: averageViews,
        growth: viewsGrowth
      },
      reports: {
        total: totalReports,
        open: openReports,
        resolved: resolvedReports,
        growth: reportGrowth
      }
    };

    return NextResponse.json({
      success: true,
      stats,
      recentActivity,
      topCategories: categoryStats
    });

  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json({ 
      error: 'Dashboard verileri alınırken hata oluştu',
      stats: {},
      recentActivity: [],
      topCategories: []
    }, { status: 500 });
  }
} 