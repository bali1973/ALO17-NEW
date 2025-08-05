import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const STRATEGIES_FILE = join(process.cwd(), 'public', 'pricing-strategies.json');

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

// Dosyayı oku
function readStrategies(): PricingStrategy[] {
  if (!existsSync(STRATEGIES_FILE)) {
    const defaultStrategies: PricingStrategy[] = [
      {
        id: '1',
        name: 'Dinamik Premium Fiyatlandırma',
        type: 'dynamic',
        description: 'Kullanıcı davranışlarına göre otomatik fiyat optimizasyonu',
        isActive: true,
        rules: [
          { id: '1', condition: 'Yüksek trafik', action: 'Fiyat artır', value: 15, priority: 1 },
          { id: '2', condition: 'Düşük dönüşüm', action: 'Fiyat azalt', value: 10, priority: 2 }
        ],
        performance: {
          revenue: 125000,
          conversionRate: 8.5,
          userSatisfaction: 4.2,
          marketShare: 12.5,
          roi: 245
        },
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15'
      },
      {
        id: '2',
        name: 'Sezonsal Kampanya Stratejisi',
        type: 'seasonal',
        description: 'Mevsimsel değişimlere göre fiyat ayarlaması',
        isActive: true,
        rules: [
          { id: '3', condition: 'Yaz sezonu', action: 'İndirim uygula', value: 20, priority: 1 },
          { id: '4', condition: 'Kış sezonu', action: 'Premium artır', value: 25, priority: 2 }
        ],
        performance: {
          revenue: 89000,
          conversionRate: 12.3,
          userSatisfaction: 4.5,
          marketShare: 8.7,
          roi: 189
        },
        createdAt: '2024-01-01',
        updatedAt: '2024-01-10'
      }
    ];
    writeFileSync(STRATEGIES_FILE, JSON.stringify(defaultStrategies, null, 2));
    return defaultStrategies;
  }
  
  const data = readFileSync(STRATEGIES_FILE, 'utf-8');
  return JSON.parse(data);
}

// Dosyaya yaz
function writeStrategies(strategies: PricingStrategy[]): void {
  writeFileSync(STRATEGIES_FILE, JSON.stringify(strategies, null, 2));
}

export async function GET() {
  try {
    const strategies = readStrategies();
    return NextResponse.json(strategies);
  } catch (error) {
    console.error('Stratejiler getirme hatası:', error);
    return NextResponse.json({ error: 'Stratejiler getirilemedi' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const strategies = readStrategies();
    
    const newStrategy: PricingStrategy = {
      id: Date.now().toString(),
      name: body.name,
      type: body.type,
      description: body.description,
      isActive: body.isActive || true,
      rules: body.rules || [],
      performance: {
        revenue: 0,
        conversionRate: 0,
        userSatisfaction: 0,
        marketShare: 0,
        roi: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    strategies.push(newStrategy);
    writeStrategies(strategies);
    
    return NextResponse.json(newStrategy);
  } catch (error) {
    console.error('Strateji ekleme hatası:', error);
    return NextResponse.json({ error: 'Strateji eklenemedi' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const strategies = readStrategies();
    
    const index = strategies.findIndex(s => s.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Strateji bulunamadı' }, { status: 404 });
    }
    
    strategies[index] = {
      ...strategies[index],
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    writeStrategies(strategies);
    return NextResponse.json(strategies[index]);
  } catch (error) {
    console.error('Strateji güncelleme hatası:', error);
    return NextResponse.json({ error: 'Strateji güncellenemedi' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Strateji ID gerekli' }, { status: 400 });
    }
    
    const strategies = readStrategies();
    const filteredStrategies = strategies.filter(s => s.id !== id);
    
    if (filteredStrategies.length === strategies.length) {
      return NextResponse.json({ error: 'Strateji bulunamadı' }, { status: 404 });
    }
    
    writeStrategies(filteredStrategies);
    return NextResponse.json({ message: 'Strateji silindi' });
  } catch (error) {
    console.error('Strateji silme hatası:', error);
    return NextResponse.json({ error: 'Strateji silinemedi' }, { status: 500 });
  }
} 