import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const CAMPAIGNS_FILE = join(process.cwd(), 'public', 'pricing-campaigns.json');

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
  createdAt: string;
  updatedAt: string;
}

// Dosyayı oku
function readCampaigns(): Campaign[] {
  if (!existsSync(CAMPAIGNS_FILE)) {
    const defaultCampaigns: Campaign[] = [
      {
        id: '1',
        name: 'Yeni Yıl İndirimi',
        type: 'discount',
        discount: 30,
        startDate: '2024-12-25',
        endDate: '2024-01-05',
        targetAudience: ['yeni-kullanici', 'premium'],
        isActive: true,
        performance: {
          totalRevenue: 45000,
          conversions: 156,
          cost: 5000
        },
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15'
      },
      {
        id: '2',
        name: 'Premium Deneme Kampanyası',
        type: 'trial',
        discount: 100,
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        targetAudience: ['aktif-kullanici'],
        isActive: true,
        performance: {
          totalRevenue: 23000,
          conversions: 89,
          cost: 3000
        },
        createdAt: '2024-01-01',
        updatedAt: '2024-01-10'
      },
      {
        id: '3',
        name: 'Yaz Sezonu İndirimi',
        type: 'discount',
        discount: 25,
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        targetAudience: ['tum-kullanicilar'],
        isActive: false,
        performance: {
          totalRevenue: 67000,
          conversions: 234,
          cost: 8000
        },
        createdAt: '2024-01-01',
        updatedAt: '2024-01-05'
      }
    ];
    writeFileSync(CAMPAIGNS_FILE, JSON.stringify(defaultCampaigns, null, 2));
    return defaultCampaigns;
  }
  
  const data = readFileSync(CAMPAIGNS_FILE, 'utf-8');
  return JSON.parse(data);
}

// Dosyaya yaz
function writeCampaigns(campaigns: Campaign[]): void {
  writeFileSync(CAMPAIGNS_FILE, JSON.stringify(campaigns, null, 2));
}

export async function GET() {
  try {
    const campaigns = readCampaigns();
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Kampanyalar getirme hatası:', error);
    return NextResponse.json({ error: 'Kampanyalar getirilemedi' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const campaigns = readCampaigns();
    
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: body.name,
      type: body.type,
      discount: body.discount,
      startDate: body.startDate,
      endDate: body.endDate,
      targetAudience: body.targetAudience || [],
      isActive: body.isActive || true,
      performance: {
        totalRevenue: 0,
        conversions: 0,
        cost: body.cost || 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    campaigns.push(newCampaign);
    writeCampaigns(campaigns);
    
    return NextResponse.json(newCampaign);
  } catch (error) {
    console.error('Kampanya ekleme hatası:', error);
    return NextResponse.json({ error: 'Kampanya eklenemedi' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const campaigns = readCampaigns();
    
    const index = campaigns.findIndex(c => c.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Kampanya bulunamadı' }, { status: 404 });
    }
    
    campaigns[index] = {
      ...campaigns[index],
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    writeCampaigns(campaigns);
    return NextResponse.json(campaigns[index]);
  } catch (error) {
    console.error('Kampanya güncelleme hatası:', error);
    return NextResponse.json({ error: 'Kampanya güncellenemedi' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Kampanya ID gerekli' }, { status: 400 });
    }
    
    const campaigns = readCampaigns();
    const filteredCampaigns = campaigns.filter(c => c.id !== id);
    
    if (filteredCampaigns.length === campaigns.length) {
      return NextResponse.json({ error: 'Kampanya bulunamadı' }, { status: 404 });
    }
    
    writeCampaigns(filteredCampaigns);
    return NextResponse.json({ message: 'Kampanya silindi' });
  } catch (error) {
    console.error('Kampanya silme hatası:', error);
    return NextResponse.json({ error: 'Kampanya silinemedi' }, { status: 500 });
  }
} 