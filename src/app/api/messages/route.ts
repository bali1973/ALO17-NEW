import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Client-side auth için basit session kontrolü
const getClientSession = (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  try {
    const token = authHeader.substring(7);
    const session = JSON.parse(token);
    return session;
  } catch {
    return null;
  }
};

// Mesaj gönderme
export async function POST(request: NextRequest) {
  try {
    const session = getClientSession(request);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 });
    }

    const { receiverId, listingId, message, senderName, senderEmail } = await request.json();

    if (!message || !senderName || !senderEmail) {
      return NextResponse.json({ error: 'Tüm alanları doldurun' }, { status: 400 });
    }

    // Mesajı veritabanına kaydet
    const newMessage = await prisma.message.create({
      data: {
        content: message,
        senderName,
        senderEmail,
        receiverId,
        listingId,
        senderId: session.user.email, // Gönderen kullanıcının email'i
        isRead: false,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Mesaj başarıyla gönderildi',
      data: newMessage 
    });

  } catch (error) {
    console.error('Mesaj gönderme hatası:', error);
    return NextResponse.json({ error: 'Mesaj gönderilirken hata oluştu' }, { status: 500 });
  }
}

// Mesajları listeleme
export async function GET(request: NextRequest) {
  try {
    const session = getClientSession(request);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'sent' veya 'received'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    let messages;

    if (type === 'sent') {
      // Gönderilen mesajlar
      messages = await prisma.message.findMany({
        where: {
          senderId: session.user.email,
        },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              price: true,
              images: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      });
    } else {
      // Alınan mesajlar
      messages = await prisma.message.findMany({
        where: {
          receiverId: session.user.email,
        },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              price: true,
              images: true,
            },
          },
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      });
    }

    // Toplam mesaj sayısını al
    const total = await prisma.message.count({
      where: type === 'sent' 
        ? { senderId: session.user.email }
        : { receiverId: session.user.email },
    });

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Mesaj listeleme hatası:', error);
    return NextResponse.json({ error: 'Mesajlar yüklenirken hata oluştu' }, { status: 500 });
  }
} 