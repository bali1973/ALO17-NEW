import { NextRequest, NextResponse } from 'next/server';
import { OAuthService } from '@/lib/oauth-service';

export async function GET(request: NextRequest) {
  try {
    // Google OAuth URL'ini oluştur
    const authUrl = await OAuthService.getGoogleAuthUrl();
    
    // Kullanıcıyı Google OAuth sayfasına yönlendir
    return NextResponse.redirect(authUrl);
    
  } catch (error) {
    console.error('Google OAuth init error:', error);
    
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/giris?error=${encodeURIComponent('Google girişi başlatılamadı')}`
    );
  }
}
