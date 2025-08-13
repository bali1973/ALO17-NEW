import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminAccess } from '@/lib/admin-auth';

// OAuth ayarlarını getir
export async function GET(request: NextRequest) {
  try {
    // Admin yetkisini kontrol et
    const adminCheck = await verifyAdminAccess(request);
    if (!adminCheck.success) {
      return NextResponse.json({ error: 'Admin yetkisi gerekli' }, { status: 403 });
    }

    // Tüm OAuth ayarlarını getir
    const oauthSettings = await prisma.oAuthSettings.findMany({
      orderBy: { provider: 'asc' }
    });

    return NextResponse.json({ oauthSettings });
  } catch (error) {
    console.error('OAuth settings fetch error:', error);
    return NextResponse.json({ error: 'OAuth ayarları getirilemedi' }, { status: 500 });
  }
}

// OAuth ayarlarını güncelle veya oluştur
export async function POST(request: NextRequest) {
  try {
    // Admin yetkisini kontrol et
    const adminCheck = await verifyAdminAccess(request);
    if (!adminCheck.success) {
      return NextResponse.json({ error: 'Admin yetkisi gerekli' }, { status: 403 });
    }

    const body = await request.json();
    const { provider, clientId, clientSecret, redirectUri, isEnabled, teamId, keyId, scope } = body;

    // Gerekli alanları kontrol et
    if (!provider || !clientId || !clientSecret || !redirectUri) {
      return NextResponse.json({ error: 'Gerekli alanlar eksik' }, { status: 400 });
    }

    // Provider'ı kontrol et
    const validProviders = ['google', 'facebook', 'apple'];
    if (!validProviders.includes(provider)) {
      return NextResponse.json({ error: 'Geçersiz provider' }, { status: 400 });
    }

    // Mevcut ayarı güncelle veya yeni oluştur
    const oauthSetting = await prisma.oAuthSettings.upsert({
      where: { provider },
      update: {
        clientId,
        clientSecret,
        redirectUri,
        isEnabled,
        teamId: provider === 'apple' ? teamId : null,
        keyId: provider === 'apple' ? keyId : null,
        scope: scope || getDefaultScope(provider)
      },
      create: {
        provider,
        clientId,
        clientSecret,
        redirectUri,
        isEnabled,
        teamId: provider === 'apple' ? teamId : null,
        keyId: provider === 'apple' ? keyId : null,
        scope: scope || getDefaultScope(provider)
      }
    });

    return NextResponse.json({ 
      message: 'OAuth ayarları güncellendi', 
      oauthSetting 
    });
  } catch (error) {
    console.error('OAuth settings update error:', error);
    return NextResponse.json({ error: 'OAuth ayarları güncellenemedi' }, { status: 500 });
  }
}

// OAuth ayarını sil
export async function DELETE(request: NextRequest) {
  try {
    // Admin yetkisini kontrol et
    const adminCheck = await verifyAdminAccess(request);
    if (!adminCheck.success) {
      return NextResponse.json({ error: 'Admin yetkisi gerekli' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider');

    if (!provider) {
      return NextResponse.json({ error: 'Provider belirtilmedi' }, { status: 400 });
    }

    // OAuth ayarını sil
    await prisma.oAuthSettings.delete({
      where: { provider }
    });

    return NextResponse.json({ message: 'OAuth ayarı silindi' });
  } catch (error) {
    console.error('OAuth settings delete error:', error);
    return NextResponse.json({ error: 'OAuth ayarı silinemedi' }, { status: 500 });
  }
}

// Varsayılan scope'ları getir
function getDefaultScope(provider: string): string {
  switch (provider) {
    case 'google':
      return 'email profile';
    case 'facebook':
      return 'email public_profile';
    case 'apple':
      return 'email name';
    default:
      return 'email';
  }
}
