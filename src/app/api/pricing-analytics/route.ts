import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const PREMIUM_PLANS_FILE = join(process.cwd(), 'public', 'premium-plans.json');
const PREMIUM_FEATURES_FILE = join(process.cwd(), 'public', 'premium-features.json');
const PREMIUM_FEATURE_PRICES_FILE = join(process.cwd(), 'public', 'premium-feature-prices.json');

interface AnalyticsData {
  totalRevenue: number;
  monthlyGrowth: number;
  conversionRate: number;
  averageOrderValue: number;
  premiumAdoption: number;
  topPerformingFeatures: Array<{
    name: string;
    revenue: number;
    growth: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    growth: number;
  }>;
  featurePerformance: Array<{
    name: string;
    revenue: number;
    usage: number;
    conversionRate: number;
  }>;
  userSegments: Array<{
    segment: string;
    count: number;
    revenue: number;
    averageValue: number;
  }>;
  pricingInsights: Array<{
    insight: string;
    impact: string;
    recommendation: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

// Mock data generator
function generateAnalyticsData(): AnalyticsData {
  const currentDate = new Date();
  const months = [];
  
  // Son 12 ay için veri oluştur
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    months.push({
      month: date.toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }),
      revenue: Math.floor(Math.random() * 50000) + 20000,
      growth: Math.floor(Math.random() * 30) - 5
    });
  }

  return {
    totalRevenue: 245000,
    monthlyGrowth: 15.7,
    conversionRate: 9.8,
    averageOrderValue: 156,
    premiumAdoption: 23.5,
    topPerformingFeatures: [
      { name: 'Öne Çıkan İlan', revenue: 45000, growth: 12.5 },
      { name: 'Premium Plan', revenue: 89000, growth: 18.3 },
      { name: 'Acil İlan', revenue: 32000, growth: 8.7 },
      { name: 'Güvenilir Satıcı Rozeti', revenue: 28000, growth: 15.2 },
      { name: 'Gelişmiş Analitikler', revenue: 19000, growth: 22.1 }
    ],
    revenueByMonth: months,
    featurePerformance: [
      { name: 'Öne Çıkan İlan', revenue: 45000, usage: 156, conversionRate: 8.5 },
      { name: 'Premium Plan', revenue: 89000, usage: 234, conversionRate: 12.3 },
      { name: 'Acil İlan', revenue: 32000, usage: 89, conversionRate: 6.7 },
      { name: 'Güvenilir Satıcı Rozeti', revenue: 28000, usage: 123, conversionRate: 9.1 },
      { name: 'Gelişmiş Analitikler', revenue: 19000, usage: 67, conversionRate: 14.2 },
      { name: 'Özel Destek', revenue: 15000, usage: 45, conversionRate: 11.8 }
    ],
    userSegments: [
      { segment: 'Yeni Kullanıcılar', count: 1250, revenue: 45000, averageValue: 36 },
      { segment: 'Aktif Kullanıcılar', count: 890, revenue: 89000, averageValue: 100 },
      { segment: 'Premium Kullanıcılar', count: 234, revenue: 67000, averageValue: 286 },
      { segment: 'VIP Kullanıcılar', count: 45, revenue: 44000, averageValue: 978 }
    ],
    pricingInsights: [
      {
        insight: 'Premium kullanıcı memnuniyeti yüksek',
        impact: 'Fiyat %15 artırılabilir',
        recommendation: 'Premium plan fiyatlarını kademeli olarak artırın',
        priority: 'high'
      },
      {
        insight: 'Yeni kullanıcı dönüşüm oranı düşük',
        impact: 'İlk ay %50 indirim ile çekim artırılabilir',
        recommendation: 'Yeni kullanıcılar için özel kampanya başlatın',
        priority: 'high'
      },
      {
        insight: 'Acil İlan özelliği düşük kullanımda',
        impact: 'Fiyat %20 azaltılabilir',
        recommendation: 'Acil İlan fiyatını düşürün ve promosyon yapın',
        priority: 'medium'
      },
      {
        insight: 'Gelişmiş Analitikler yüksek dönüşüm oranına sahip',
        impact: 'Fiyat %10 artırılabilir',
        recommendation: 'Analitik özelliğinin fiyatını artırın',
        priority: 'medium'
      },
      {
        insight: 'Sezonsal kampanyalar başarılı',
        impact: 'Daha fazla sezonsal kampanya planlanabilir',
        recommendation: 'Her sezon için özel kampanyalar oluşturun',
        priority: 'low'
      }
    ]
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '12months';
    
    const analyticsData = generateAnalyticsData();
    
    // Period'a göre filtreleme
    let filteredData = analyticsData;
    if (period === '6months') {
      filteredData = {
        ...analyticsData,
        revenueByMonth: analyticsData.revenueByMonth.slice(-6)
      };
    } else if (period === '3months') {
      filteredData = {
        ...analyticsData,
        revenueByMonth: analyticsData.revenueByMonth.slice(-3)
      };
    }
    
    return NextResponse.json(filteredData);
  } catch (error) {
    console.error('Analitik veri getirme hatası:', error);
    return NextResponse.json({ error: 'Analitik veriler getirilemedi' }, { status: 500 });
  }
}

// Performans tahminleri için endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, value, feature } = body;
    
    // Basit tahmin algoritması
    let prediction = {
      estimatedRevenue: 0,
      estimatedConversion: 0,
      confidence: 0,
      recommendation: ''
    };
    
    switch (action) {
      case 'price_increase':
        prediction = {
          estimatedRevenue: Math.floor(value * 1.15), // %15 artış
          estimatedConversion: Math.max(0, value * 0.85), // %15 azalma
          confidence: 0.75,
          recommendation: 'Fiyat artırımı geliri artırabilir ancak dönüşümü azaltabilir'
        };
        break;
      case 'price_decrease':
        prediction = {
          estimatedRevenue: Math.floor(value * 0.85), // %15 azalma
          estimatedConversion: Math.floor(value * 1.25), // %25 artış
          confidence: 0.80,
          recommendation: 'Fiyat düşürme dönüşümü artırabilir ancak geliri azaltabilir'
        };
        break;
      case 'discount_campaign':
        prediction = {
          estimatedRevenue: Math.floor(value * 1.30), // %30 artış
          estimatedConversion: Math.floor(value * 1.40), // %40 artış
          confidence: 0.85,
          recommendation: 'İndirim kampanyası hem geliri hem dönüşümü artırabilir'
        };
        break;
      default:
        prediction = {
          estimatedRevenue: value,
          estimatedConversion: value * 0.9,
          confidence: 0.5,
          recommendation: 'Değişikliğin etkisi belirsiz'
        };
    }
    
    return NextResponse.json(prediction);
  } catch (error) {
    console.error('Tahmin hesaplama hatası:', error);
    return NextResponse.json({ error: 'Tahmin hesaplanamadı' }, { status: 500 });
  }
} 