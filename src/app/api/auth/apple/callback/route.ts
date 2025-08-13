import { NextRequest, NextResponse } from 'next/server';
import { OAuthService } from '@/lib/oauth-service';
import { prisma } from '@/lib/prisma';
import { signJwtAccessToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const code = formData.get('code') as string;
    const error = formData.get('error') as string;

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/giris?error=${encodeURIComponent('Apple girişi iptal edildi')}`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/giris?error=${encodeURIComponent('Apple giriş kodu bulunamadı')}`
      );
    }

    // Apple OAuth işlemini tamamla
    const oauthUser = await OAuthService.processOAuthLogin('apple', code);

    // Kullanıcıyı veritabanında bul veya oluştur
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: oauthUser.email },
          { 
            oauthAccounts: {
              some: {
                provider: 'apple',
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
              provider: 'apple',
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
      const existingOAuth = user.oauthAccounts.find(acc => acc.provider === 'apple');
      
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
            provider: 'apple',
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
    redirectUrl.searchParams.set('provider', 'apple');
    redirectUrl.searchParams.set('token', accessToken);

    return NextResponse.redirect(redirectUrl.toString());

  } catch (error) {
    console.error('Apple OAuth callback error:', error);
    
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/giris?error=${encodeURIComponent('Apple girişi sırasında hata oluştu')}`
    );
  }
}
