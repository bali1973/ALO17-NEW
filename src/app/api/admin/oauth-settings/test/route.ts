import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminAccess } from '@/lib/admin-auth';
import { OAuthService } from '@/lib/oauth-service';

// OAuth ayarlarını test et
export async function POST(request: NextRequest) {
  try {
    // Admin yetkisini kontrol et
    const adminCheck = await verifyAdminAccess(request);
    if (!adminCheck.success) {
      return NextResponse.json({ error: 'Admin yetkisi gerekli' }, { status: 403 });
    }

    const body = await request.json();
    const { provider } = body;

    if (!provider) {
      return NextResponse.json({ error: 'Provider belirtilmedi' }, { status: 400 });
    }

    // OAuth ayarlarını getir
    const oauthSetting = await prisma.oAuthSettings.findUnique({
      where: { provider }
    });

    if (!oauthSetting) {
      return NextResponse.json({ error: 'OAuth ayarları bulunamadı' }, { status: 404 });
    }

    if (!oauthSetting.isEnabled) {
      return NextResponse.json({ error: 'OAuth provider devre dışı' }, { status: 400 });
    }

    try {
      // OAuth URL'ini test et
      let authUrl = '';
      
      switch (provider) {
        case 'google':
          authUrl = OAuthService.getGoogleAuthUrl();
          break;
        case 'facebook':
          authUrl = OAuthService.getFacebookAuthUrl();
          break;
        case 'apple':
          authUrl = OAuthService.getAppleAuthUrl();
          break;
        default:
          throw new Error(`Desteklenmeyen provider: ${provider}`);
      }

      return NextResponse.json({ 
        success: true,
        message: `${provider} OAuth URL başarıyla oluşturuldu`,
        authUrl,
        testUrl: `/api/auth/${provider}`
      });
    } catch (error) {
      return NextResponse.json({ 
        success: false,
        error: `${provider} OAuth test hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`,
        details: error instanceof Error ? error.stack : undefined
      }, { status: 400 });
    }
  } catch (error) {
    console.error('OAuth test error:', error);
    return NextResponse.json({ error: 'OAuth test hatası' }, { status: 500 });
  }
}
