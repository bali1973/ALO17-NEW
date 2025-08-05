import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const FEATURES_PATH = path.join(process.cwd(), 'public', 'premium-features.json');

async function readFeatures() {
  try {
    const data = await fs.readFile(FEATURES_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeFeatures(features: any[]) {
  await fs.writeFile(FEATURES_PATH, JSON.stringify(features, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const features = await readFeatures();
    
    return NextResponse.json({
      success: true,
      features
    });

  } catch (error) {
    console.error('Get features error:', error);
    return NextResponse.json({ 
      error: 'Özellikler alınırken hata oluştu',
      features: []
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, icon, price, category, priority } = body;

    if (!name || !description || !icon || !price || !category) {
      return NextResponse.json({ error: 'Tüm alanlar gerekli' }, { status: 400 });
    }

    const features = await readFeatures();
    
    const newFeature = {
      id: `feature_${Date.now()}`,
      name,
      description,
      icon,
      price: parseFloat(price),
      category,
      priority: priority || 0,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    features.push(newFeature);
    await writeFeatures(features);

    return NextResponse.json({
      success: true,
      feature: newFeature
    });

  } catch (error) {
    console.error('Create feature error:', error);
    return NextResponse.json({ 
      error: 'Özellik oluşturulurken hata oluştu' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, icon, price, category, priority, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Özellik ID gerekli' }, { status: 400 });
    }

    const features = await readFeatures();
    const featureIndex = features.findIndex((f: any) => f.id === id);
    
    if (featureIndex === -1) {
      return NextResponse.json({ error: 'Özellik bulunamadı' }, { status: 404 });
    }

    features[featureIndex] = {
      ...features[featureIndex],
      name: name || features[featureIndex].name,
      description: description || features[featureIndex].description,
      icon: icon || features[featureIndex].icon,
      price: price ? parseFloat(price) : features[featureIndex].price,
      category: category || features[featureIndex].category,
      priority: priority !== undefined ? priority : features[featureIndex].priority,
      isActive: isActive !== undefined ? isActive : features[featureIndex].isActive,
      updatedAt: new Date().toISOString()
    };

    await writeFeatures(features);

    return NextResponse.json({
      success: true,
      feature: features[featureIndex]
    });

  } catch (error) {
    console.error('Update feature error:', error);
    return NextResponse.json({ 
      error: 'Özellik güncellenirken hata oluştu' 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Özellik ID gerekli' }, { status: 400 });
    }

    const features = await readFeatures();
    const featureIndex = features.findIndex((f: any) => f.id === id);
    
    if (featureIndex === -1) {
      return NextResponse.json({ error: 'Özellik bulunamadı' }, { status: 404 });
    }

    features.splice(featureIndex, 1);
    await writeFeatures(features);

    return NextResponse.json({
      success: true,
      message: 'Özellik başarıyla silindi'
    });

  } catch (error) {
    console.error('Delete feature error:', error);
    return NextResponse.json({ 
      error: 'Özellik silinirken hata oluştu' 
    }, { status: 500 });
  }
} 