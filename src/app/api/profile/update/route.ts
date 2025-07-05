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

export async function POST(request: NextRequest) {
  try {
    const session = getClientSession(request);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const location = formData.get('location') as string;
    const avatarFile = formData.get('avatar') as File | null;

    // Validasyon
    if (!name || !email) {
      return NextResponse.json({ error: 'Ad ve e-posta alanları zorunludur' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Geçerli bir e-posta adresi girin' }, { status: 400 });
    }

    // E-posta adresi değişmişse, başka kullanıcı tarafından kullanılıp kullanılmadığını kontrol et
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      
      if (existingUser) {
        return NextResponse.json({ error: 'Bu e-posta adresi zaten kullanılıyor' }, { status: 400 });
      }
    }

    // Avatar dosyası varsa işle (şimdilik basit bir yaklaşım)
    let avatarUrl = session.user.image || '';
    
    if (avatarFile) {
      // Gerçek uygulamada dosyayı cloud storage'a yükleyebilirsiniz
      // Şimdilik base64 olarak saklayacağız (test amaçlı)
      const bytes = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      avatarUrl = `data:${avatarFile.type};base64,${base64}`;
    }

    // Kullanıcı bilgilerini güncelle
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        email,
        phone,
        location,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Profil başarıyla güncellendi',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: avatarUrl,
      }
    });

  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    return NextResponse.json({ error: 'Profil güncellenirken hata oluştu' }, { status: 500 });
  }
} 