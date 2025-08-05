import { NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '@/lib/notificationService';
import { promises as fs } from 'fs';
import path from 'path';

// Kullanıcının bildirimlerini getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı ID gerekli' }, { status: 400 });
    }

    const notifications = await NotificationService.getUserNotifications(userId, limit);

    return NextResponse.json({
      success: true,
      notifications,
      total: notifications.length
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json({ 
      error: 'Bildirimler alınırken hata oluştu' 
    }, { status: 500 });
  }
}

// Bildirimi okundu olarak işaretle
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId, userId } = body;

    if (!notificationId || !userId) {
      return NextResponse.json({ error: 'Bildirim ID ve kullanıcı ID gerekli' }, { status: 400 });
    }

    const success = await NotificationService.markNotificationAsRead(notificationId, userId);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Bildirim bulunamadı' }, { status: 404 });
    }

  } catch (error) {
    console.error('Mark notification as read error:', error);
    return NextResponse.json({ 
      error: 'Bildirim güncellenirken hata oluştu' 
    }, { status: 500 });
  }
}

// Bildirim aboneliği oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      email, 
      category, 
      subcategory, 
      keywords, 
      priceRange, 
      location, 
      frequency = 'instant',
      emailEnabled = true,
      pushEnabled = false,
      pushToken = null
    } = body;

    if (!userId || !email) {
      return NextResponse.json({ error: 'Kullanıcı ID ve email gerekli' }, { status: 400 });
    }

    // Abonelik dosyasını oku
    const subscriptionsPath = path.join(process.cwd(), 'public', 'notificationSubscriptions.json');
    let subscriptions = [];
    
    try {
      const data = await fs.readFile(subscriptionsPath, 'utf-8');
      subscriptions = JSON.parse(data);
    } catch (error) {
      // Dosya yoksa boş array ile başla
      subscriptions = [];
    }

    // Aynı kullanıcı ve kriterlerle abonelik var mı kontrol et
    const existingSubscription = subscriptions.find((sub: any) => 
      sub.userId === userId && 
      sub.category === category && 
      sub.subcategory === subcategory &&
      sub.frequency === frequency
    );

    if (existingSubscription) {
      return NextResponse.json({ 
        error: 'Bu kriterlerle zaten bir aboneliğiniz var' 
      }, { status: 409 });
    }

    // Yeni abonelik oluştur
    const newSubscription = {
      id: Date.now().toString(),
      userId,
      email,
      category,
      subcategory,
      keywords: keywords ? JSON.stringify(keywords) : null,
      priceRange: priceRange ? JSON.stringify(priceRange) : null,
      location,
      frequency,
      emailEnabled,
      pushEnabled,
      pushToken,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    subscriptions.push(newSubscription);

    // Dosyaya kaydet
    await fs.writeFile(subscriptionsPath, JSON.stringify(subscriptions, null, 2));

    return NextResponse.json({
      success: true,
      subscription: newSubscription
    });

  } catch (error) {
    console.error('Create subscription error:', error);
    return NextResponse.json({ 
      error: 'Abonelik oluşturulurken hata oluştu' 
    }, { status: 500 });
  }
}

// Bildirim aboneliğini güncelle
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriptionId, updates } = body;

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Abonelik ID gerekli' }, { status: 400 });
    }

    // Abonelik dosyasını oku
    const subscriptionsPath = path.join(process.cwd(), 'public', 'notificationSubscriptions.json');
    const data = await fs.readFile(subscriptionsPath, 'utf-8');
    const subscriptions = JSON.parse(data);

    // Aboneliği bul ve güncelle
    const subscriptionIndex = subscriptions.findIndex((sub: any) => sub.id === subscriptionId);
    
    if (subscriptionIndex === -1) {
      return NextResponse.json({ error: 'Abonelik bulunamadı' }, { status: 404 });
    }

    subscriptions[subscriptionIndex] = {
      ...subscriptions[subscriptionIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Dosyaya kaydet
    await fs.writeFile(subscriptionsPath, JSON.stringify(subscriptions, null, 2));

    return NextResponse.json({
      success: true,
      subscription: subscriptions[subscriptionIndex]
    });

  } catch (error) {
    console.error('Update subscription error:', error);
    return NextResponse.json({ 
      error: 'Abonelik güncellenirken hata oluştu' 
    }, { status: 500 });
  }
}

// Bildirim aboneliğini sil
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('id');

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Abonelik ID gerekli' }, { status: 400 });
    }

    // Abonelik dosyasını oku
    const subscriptionsPath = path.join(process.cwd(), 'public', 'notificationSubscriptions.json');
    const data = await fs.readFile(subscriptionsPath, 'utf-8');
    const subscriptions = JSON.parse(data);

    // Aboneliği bul ve sil
    const subscriptionIndex = subscriptions.findIndex((sub: any) => sub.id === subscriptionId);
    
    if (subscriptionIndex === -1) {
      return NextResponse.json({ error: 'Abonelik bulunamadı' }, { status: 404 });
    }

    const deletedSubscription = subscriptions[subscriptionIndex];
    subscriptions.splice(subscriptionIndex, 1);

    // Dosyaya kaydet
    await fs.writeFile(subscriptionsPath, JSON.stringify(subscriptions, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Abonelik başarıyla silindi'
    });

  } catch (error) {
    console.error('Delete subscription error:', error);
    return NextResponse.json({ 
      error: 'Abonelik silinirken hata oluştu' 
    }, { status: 500 });
  }
} 