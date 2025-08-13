import { NextRequest, NextResponse } from 'next/server';
import { OAuthService } from '@/lib/oauth-service';
import { prisma } from '@/lib/prisma';
import { signJwtAccessToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/giris?error=${encodeURIComponent('Google girişi iptal edildi')}`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/giris?error=${encodeURIComponent('Google giriş kodu bulunamadı')}`
      );
    }

    // Google OAuth işlemini tamamla
    const oauthUser = await OAuthService.processOAuthLogin('google', code);

    // Kullanıcıyı veritabanında bul veya oluştur
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: oauthUser.email },
          { 
            oauthAccounts: {
              some: {
                provider: 'google',
                providerId: oauthUser.id
              }
            }
          }
        ]
      },
      include: {
        oauthAccounts: true
      }
    });

    if (!user) {
      // Yeni kullanıcı oluştur
      user = await prisma.user.create({
        data: {
          email: oauthUser.email,
          name: oauthUser.name,
          avatar: oauthUser.picture,
          emailVerified: true,
          oauthAccounts: {
            create: {
              provider: 'google',
              providerId: oauthUser.id,
              accessToken: '', // Güvenlik için saklanmıyor
              refreshToken: '', // Güvenlik için saklanmıyor
              expiresAt: new Date(Date.now() + 3600 * 1000) // 1 saat
            }
          }
        },
        include: {
          oauthAccounts: true
        }
      });
    } else {
      // Mevcut kullanıcının OAuth hesabını güncelle
      const existingOAuth = user.oauthAccounts.find(acc => acc.provider === 'google');
      
      if (existingOAuth) {
        await prisma.oauthAccount.update({
          where: { id: existingOAuth.id },
          data: {
            providerId: oauthUser.id,
            expiresAt: new Date(Date.now() + 3600 * 1000)
          }
        });
      } else {
        // Yeni OAuth hesabı ekle
        await prisma.oauthAccount.create({
          data: {
            userId: user.id,
            provider: 'google',
            providerId: oauthUser.id,
            accessToken: '',
            refreshToken: '',
            expiresAt: new Date(Date.now() + 3600 * 1000)
          }
        });
      }
    }

    // JWT token oluştur
    const accessToken = signJwtAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Başarılı giriş sonrası yönlendirme
    const redirectUrl = new URL('/giris', process.env.NEXT_PUBLIC_APP_URL);
    redirectUrl.searchParams.set('oauth_success', 'true');
    redirectUrl.searchParams.set('provider', 'google');
    redirectUrl.searchParams.set('token', accessToken);

    return NextResponse.redirect(redirectUrl.toString());

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/giris?error=${encodeURIComponent('Google girişi sırasında hata oluştu')}`
    );
  }
}
