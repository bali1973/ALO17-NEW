import { prisma } from './prisma';
import { oauthConfig } from './oauth-config';
import { OAuthUser, OAuthTokenResponse } from './oauth-config';

export class OAuthService {
  // Google OAuth URL'ini oluştur
  static async getGoogleAuthUrl(): Promise<string> {
    const settings = await this.getOAuthSettings('google');
    if (!settings || !settings.isEnabled) {
      throw new Error('Google OAuth devre dışı');
    }

    const params = new URLSearchParams({
      client_id: settings.clientId,
      redirect_uri: settings.redirectUri,
      scope: settings.scope,
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent'
    });

    return `${oauthConfig.google.authUrl}?${params.toString()}`;
  }

  // Facebook OAuth URL'ini oluştur
  static async getFacebookAuthUrl(): Promise<string> {
    const settings = await this.getOAuthSettings('facebook');
    if (!settings || !settings.isEnabled) {
      throw new Error('Facebook OAuth devre dışı');
    }

    const params = new URLSearchParams({
      client_id: settings.clientId,
      redirect_uri: settings.redirectUri,
      scope: settings.scope,
      response_type: 'code'
    });

    return `${oauthConfig.facebook.authUrl}?${params.toString()}`;
  }

  // Apple OAuth URL'ini oluştur
  static async getAppleAuthUrl(): Promise<string> {
    const settings = await this.getOAuthSettings('apple');
    if (!settings || !settings.isEnabled) {
      throw new Error('Apple OAuth devre dışı');
    }

    const params = new URLSearchParams({
      client_id: settings.clientId,
      redirect_uri: settings.redirectUri,
      scope: settings.scope,
      response_type: 'code',
      response_mode: 'form_post'
    });

    return `${oauthConfig.apple.authUrl}?${params.toString()}`;
  }

  // OAuth ayarlarını veritabanından getir
  private static async getOAuthSettings(provider: string) {
    try {
      return await prisma.oAuthSettings.findUnique({
        where: { provider }
      });
    } catch (error) {
      console.error(`OAuth settings fetch error for ${provider}:`, error);
      return null;
    }
  }

  // OAuth giriş işlemini işle
  static async processOAuthLogin(
    provider: 'google' | 'facebook' | 'apple',
    code: string
  ): Promise<OAuthUser> {
    try {
      const settings = await this.getOAuthSettings(provider);
      if (!settings || !settings.isEnabled) {
        throw new Error(`${provider} OAuth devre dışı`);
      }

      // Authorization code'u access token ile değiştir
      const tokenResponse = await this.exchangeCodeForToken(provider, code, settings);
      
      // Access token ile kullanıcı bilgilerini getir
      const userInfo = await this.getUserInfo(provider, tokenResponse.access_token);
      
      return {
        ...userInfo,
        provider
      };
    } catch (error) {
      console.error(`${provider} OAuth login error:`, error);
      throw error;
    }
  }

  // Authorization code'u access token ile değiştir
  private static async exchangeCodeForToken(
    provider: string,
    code: string,
    settings: any
  ): Promise<OAuthTokenResponse> {
    const tokenData = {
      client_id: settings.clientId,
      client_secret: settings.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: settings.redirectUri
    };

    let response;
    switch (provider) {
      case 'google':
        response = await fetch(oauthConfig.google.tokenUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(tokenData)
        });
        break;
      case 'facebook':
        response = await fetch(oauthConfig.facebook.tokenUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(tokenData)
        });
        break;
      case 'apple':
        // Apple için JWT token oluştur
        const jwtToken = this.createAppleJWT(settings);
        const appleTokenData = {
          ...tokenData,
          client_secret: jwtToken
        };
        response = await fetch(oauthConfig.apple.tokenUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(appleTokenData)
        });
        break;
      default:
        throw new Error(`Desteklenmeyen provider: ${provider}`);
    }

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    return await response.json();
  }

  // Kullanıcı bilgilerini getir
  private static async getUserInfo(provider: string, accessToken: string): Promise<OAuthUser> {
    let userInfoUrl = '';
    
    switch (provider) {
      case 'google':
        userInfoUrl = oauthConfig.google.userInfoUrl;
        break;
      case 'facebook':
        userInfoUrl = oauthConfig.facebook.userInfoUrl;
        break;
      case 'apple':
        // Apple için ID token'dan bilgileri çıkar
        return this.parseAppleUserInfo(accessToken);
      default:
        throw new Error(`Desteklenmeyen provider: ${provider}`);
    }

    const response = await fetch(userInfoUrl, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!response.ok) {
      throw new Error(`User info fetch failed: ${response.statusText}`);
    }

    const userData = await response.json();
    
    return {
      id: userData.id || userData.sub,
      email: userData.email,
      name: userData.name || userData.given_name || 'Unknown',
      picture: userData.picture,
      provider: provider as 'google' | 'facebook' | 'apple'
    };
  }

  // Apple JWT token oluştur (basit implementasyon)
  private static createAppleJWT(settings: any): string {
    // Gerçek uygulamada JWT library kullanılmalı
    // Bu basit bir örnek
    return `apple_jwt_${settings.clientId}_${Date.now()}`;
  }

  // Apple ID token'dan kullanıcı bilgilerini çıkar
  private static parseAppleUserInfo(idToken: string): OAuthUser {
    // Gerçek uygulamada JWT decode edilmeli
    // Bu basit bir örnek
    return {
      id: `apple_${Date.now()}`,
      email: 'apple_user@example.com',
      name: 'Apple User',
      provider: 'apple'
    };
  }
}
