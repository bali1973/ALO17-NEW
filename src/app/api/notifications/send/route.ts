import { NextResponse } from 'next/server';
import { getMessaging } from 'firebase-admin/messaging';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Firebase Admin başlatma
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(request: Request) {
  try {
    const { userId, type, data } = await request.json();

    // FCM token'ı veritabanından al
    // Bu kısmı kendi veritabanı yapınıza göre uyarlamanız gerekiyor
    const userFcmToken = await getUserFcmToken(userId);

    if (!userFcmToken) {
      return NextResponse.json(
        { error: 'User FCM token not found' },
        { status: 404 }
      );
    }

    // Bildirim mesajını oluştur
    const message = {
      notification: {
        title: getNotificationTitle(type),
        body: getNotificationBody(type, data),
      },
      data: {
        type,
        ...data,
      },
      token: userFcmToken,
    };

    // Bildirimi gönder
    const response = await getMessaging().send(message);

    return NextResponse.json({ success: true, messageId: response });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

// Helper fonksiyonlar
function getNotificationTitle(type: string): string {
  const titles = {
    NEW_MESSAGE: 'Yeni Mesaj',
    LISTING_UPDATE: 'İlan Güncellendi',
    PRICE_UPDATE: 'Fiyat Güncellendi',
    PREMIUM_EXPIRY: 'Premium Üyelik',
    LISTING_APPROVED: 'İlan Onaylandı',
    LISTING_REJECTED: 'İlan Reddedildi',
  };
  return titles[type as keyof typeof titles] || 'Bildirim';
}

function getNotificationBody(type: string, data: any): string {
  switch (type) {
    case 'NEW_MESSAGE':
      return `${data.senderName} size yeni bir mesaj gönderdi`;
    case 'LISTING_UPDATE':
      return `"${data.listingTitle}" ilanınız güncellendi`;
    case 'PRICE_UPDATE':
      return `"${data.listingTitle}" ilanının fiyatı güncellendi`;
    case 'PREMIUM_EXPIRY':
      return 'Premium üyeliğinizin süresi yakında dolacak';
    case 'LISTING_APPROVED':
      return `"${data.listingTitle}" ilanınız onaylandı`;
    case 'LISTING_REJECTED':
      return `"${data.listingTitle}" ilanınız reddedildi`;
    default:
      return 'Yeni bir bildiriminiz var';
  }
}

// Kullanıcının FCM token'ını getir
async function getUserFcmToken(userId: string): Promise<string | null> {
  // Bu fonksiyonu kendi veritabanı yapınıza göre implemente edin
  // Örnek: return await prisma.user.findUnique({ where: { id: userId } }).fcmToken;
  return null;
} 