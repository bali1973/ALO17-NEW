import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const LISTINGS_PATH = path.join(process.cwd(), 'public', 'listings.json');
const MESSAGES_PATH = path.join(process.cwd(), 'public', 'messages.json');

async function readData(filePath: string) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function generateDateRange(days: number) {
  const dates = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

function generateWeeklyData(days: number) {
  const weeks = [];
  const today = new Date();
  
  for (let i = Math.floor(days / 7) - 1; i >= 0; i--) {
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - (i * 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    weeks.push({
      week: `${weekStart.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })} - ${weekEnd.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })}`,
      startDate: weekStart.toISOString().split('T')[0],
      endDate: weekEnd.toISOString().split('T')[0]
    });
  }
  
  return weeks;
}

function generateMonthlyData(days: number) {
  const months = [];
  const today = new Date();
  
  for (let i = Math.floor(days / 30) - 1; i >= 0; i--) {
    const month = new Date(today);
    month.setMonth(month.getMonth() - i);
    
    months.push({
      month: month.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
      year: month.getFullYear(),
      monthNumber: month.getMonth()
    });
  }
  
  return months;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const timeRange = searchParams.get('timeRange') || '30';

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı ID gerekli' }, { status: 400 });
    }

    const listings = await readData(LISTINGS_PATH);
    const messages = await readData(MESSAGES_PATH);

    // Kullanıcının ilanlarını filtrele
    const userListings = listings.filter((listing: any) => listing.email === userId);
    
    // Kullanıcının mesajlarını filtrele
    const userMessages = messages.filter((msg: any) => 
      msg.senderId === userId || msg.receiverId === userId
    );

    // Tarih aralığını hesapla
    const days = parseInt(timeRange);
    const dateRange = generateDateRange(days);
    const weeklyData = generateWeeklyData(days);
    const monthlyData = generateMonthlyData(days);

    // Genel bakış verileri
    const totalViews = userListings.reduce((sum: number, listing: any) => sum + (listing.views || 0), 0);
    const totalMessages = userMessages.length;
    const totalFavorites = userListings.reduce((sum: number, listing: any) => sum + (listing.favorites || 0), 0);
    const conversionRate = userListings.length > 0 ? (totalMessages / totalViews * 100) : 0;
    const avgResponseTime = 2.3; // Örnek veri
    const listingPerformance = 85.6; // Örnek veri

    // Görüntülenme verileri
    const dailyViews = dateRange.map(date => ({
      date,
      views: Math.floor(Math.random() * 50) + 10
    }));

    const weeklyViews = weeklyData.map(week => ({
      week: week.week,
      views: Math.floor(Math.random() * 300) + 50
    }));

    const monthlyViews = monthlyData.map(month => ({
      month: month.month,
      views: Math.floor(Math.random() * 1000) + 200
    }));

    // İlan performans verileri
    const listingPerformanceData = userListings.slice(0, 10).map((listing: any) => ({
      id: listing.id,
      title: listing.title,
      views: listing.views || Math.floor(Math.random() * 100) + 10,
      messages: Math.floor(Math.random() * 20) + 1,
      favorites: Math.floor(Math.random() * 15) + 1
    }));

    // Kategori verileri
    const categoryData = userListings.reduce((acc: any, listing: any) => {
      const category = listing.category || 'Diğer';
      if (!acc[category]) {
        acc[category] = { count: 0, views: 0 };
      }
      acc[category].count++;
      acc[category].views += listing.views || 0;
      return acc;
    }, {});

    const categories = Object.entries(categoryData).map(([category, data]: [string, any]) => ({
      category,
      count: data.count,
      views: data.views
    }));

    // Lokasyon verileri
    const locationData = userListings.reduce((acc: any, listing: any) => {
      const location = listing.location || 'Belirtilmemiş';
      if (!acc[location]) {
        acc[location] = { count: 0, views: 0 };
      }
      acc[location].count++;
      acc[location].views += listing.views || 0;
      return acc;
    }, {});

    const locations = Object.entries(locationData).map(([location, data]: [string, any]) => ({
      location,
      count: data.count,
      views: data.views
    }));

    // Etkileşim verileri
    const engagementMessages = dateRange.map(date => ({
      date,
      count: Math.floor(Math.random() * 10) + 1
    }));

    const engagementFavorites = dateRange.map(date => ({
      date,
      count: Math.floor(Math.random() * 8) + 1
    }));

    const responseRate = dateRange.map(date => ({
      date,
      rate: Math.floor(Math.random() * 20) + 80
    }));

    // Demografik veriler
    const ageGroups = [
      { age: '18-24', percentage: 25 },
      { age: '25-34', percentage: 35 },
      { age: '35-44', percentage: 20 },
      { age: '45-54', percentage: 15 },
      { age: '55+', percentage: 5 }
    ];

    const deviceData = [
      { device: 'Mobil', percentage: 65 },
      { device: 'Masaüstü', percentage: 25 },
      { device: 'Tablet', percentage: 10 }
    ];

    const locationDemographics = [
      { location: 'İstanbul', percentage: 40 },
      { location: 'Ankara', percentage: 20 },
      { location: 'İzmir', percentage: 15 },
      { location: 'Diğer', percentage: 25 }
    ];

    const analyticsData = {
      overview: {
        totalViews,
        totalMessages,
        totalFavorites,
        conversionRate,
        avgResponseTime,
        listingPerformance
      },
      views: {
        daily: dailyViews,
        weekly: weeklyViews,
        monthly: monthlyViews
      },
      listings: {
        performance: listingPerformanceData,
        categories,
        locations
      },
      engagement: {
        messages: engagementMessages,
        favorites: engagementFavorites,
        responseRate
      },
      demographics: {
        ageGroups,
        locations: locationDemographics,
        devices: deviceData
      }
    };

    return NextResponse.json({
      success: true,
      ...analyticsData
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ 
      error: 'Analitik verileri alınırken hata oluştu'
    }, { status: 500 });
  }
} 