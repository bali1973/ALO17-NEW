import { NextRequest, NextResponse } from 'next/server';
import { OAuthService } from '@/lib/oauth-service';

export async function GET(request: NextRequest) {
  try {
    // Apple OAuth URL'ini oluştur
    const authUrl = await OAuthService.getAppleAuthUrl();
    
    // Kullanıcıyı Apple OAuth sayfasına yönlendir
    return NextResponse.redirect(authUrl);
    
  } catch (error) {
    console.error('Apple OAuth init error:', error);
    
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/giris?error=${encodeURIComponent('Apple girişi başlatılamadı')}`
    );
  }
}
