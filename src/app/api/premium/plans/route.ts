import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const PLANS_PATH = path.join(process.cwd(), 'public', 'premium-plans.json');

async function readPlans() {
  try {
    const data = await fs.readFile(PLANS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writePlans(plans: any[]) {
  await fs.writeFile(PLANS_PATH, JSON.stringify(plans, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const plans = await readPlans();
    
    return NextResponse.json({
      success: true,
      plans
    });

  } catch (error) {
    console.error('Get plans error:', error);
    return NextResponse.json({ 
      error: 'Planlar alınırken hata oluştu',
      plans: []
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, duration, price, features, isPopular } = body;

    if (!name || !duration || !price) {
      return NextResponse.json({ error: 'Temel alanlar gerekli' }, { status: 400 });
    }

    const plans = await readPlans();
    
    const newPlan = {
      id: `plan_${Date.now()}`,
      name,
      duration: parseInt(duration),
      price: parseFloat(price),
      features: features || [],
      isPopular: isPopular || false,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    plans.push(newPlan);
    await writePlans(plans);

    return NextResponse.json({
      success: true,
      plan: newPlan
    });

  } catch (error) {
    console.error('Create plan error:', error);
    return NextResponse.json({ 
      error: 'Plan oluşturulurken hata oluştu' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, duration, price, features, isPopular, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Plan ID gerekli' }, { status: 400 });
    }

    const plans = await readPlans();
    const planIndex = plans.findIndex((p: any) => p.id === id);
    
    if (planIndex === -1) {
      return NextResponse.json({ error: 'Plan bulunamadı' }, { status: 404 });
    }

    plans[planIndex] = {
      ...plans[planIndex],
      name: name || plans[planIndex].name,
      duration: duration ? parseInt(duration) : plans[planIndex].duration,
      price: price ? parseFloat(price) : plans[planIndex].price,
      features: features || plans[planIndex].features,
      isPopular: isPopular !== undefined ? isPopular : plans[planIndex].isPopular,
      isActive: isActive !== undefined ? isActive : plans[planIndex].isActive,
      updatedAt: new Date().toISOString()
    };

    await writePlans(plans);

    return NextResponse.json({
      success: true,
      plan: plans[planIndex]
    });

  } catch (error) {
    console.error('Update plan error:', error);
    return NextResponse.json({ 
      error: 'Plan güncellenirken hata oluştu' 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Plan ID gerekli' }, { status: 400 });
    }

    const plans = await readPlans();
    const planIndex = plans.findIndex((p: any) => p.id === id);
    
    if (planIndex === -1) {
      return NextResponse.json({ error: 'Plan bulunamadı' }, { status: 404 });
    }

    plans.splice(planIndex, 1);
    await writePlans(plans);

    return NextResponse.json({
      success: true,
      message: 'Plan başarıyla silindi'
    });

  } catch (error) {
    console.error('Delete plan error:', error);
    return NextResponse.json({ 
      error: 'Plan silinirken hata oluştu' 
    }, { status: 500 });
  }
} 