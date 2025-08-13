# OAuth Kurulum Rehberi

Bu rehber, Google, Facebook ve Apple ile giriş özelliğini kurmak için gerekli adımları açıklar.

## 🚀 Kurulum Adımları

### 1. Environment Variables

`.env` dosyasına aşağıdaki değişkenleri ekleyin:

```env
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3004/api/auth/google/callback"

# Facebook OAuth
FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"
FACEBOOK_REDIRECT_URI="http://localhost:3004/api/auth/facebook/callback"

# Apple OAuth
APPLE_CLIENT_ID="your-apple-client-id"
APPLE_CLIENT_SECRET="your-apple-client-secret"
APPLE_REDIRECT_URI="http://localhost:3004/api/auth/apple/callback"
APPLE_TEAM_ID="your-apple-team-id"
APPLE_KEY_ID="your-apple-key-id"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3004"
```

### 2. Google OAuth Kurulumu

1. [Google Cloud Console](https://console.cloud.google.com/)'a gidin
2. Yeni proje oluşturun veya mevcut projeyi seçin
3. "APIs & Services" > "Credentials" bölümüne gidin
4. "Create Credentials" > "OAuth 2.0 Client IDs" seçin
5. Application type: "Web application" seçin
6. Authorized redirect URIs: `http://localhost:3004/api/auth/google/callback` ekleyin
7. Client ID ve Client Secret'ı kopyalayın

### 3. Facebook OAuth Kurulumu

1. [Facebook Developers](https://developers.facebook.com/)'a gidin
2. Yeni uygulama oluşturun
3. "Facebook Login" ürününü ekleyin
4. "Settings" > "Basic" bölümünde App ID ve App Secret'ı kopyalayın
5. "Facebook Login" > "Settings" bölümünde Valid OAuth Redirect URIs: `http://localhost:3004/api/auth/facebook/callback` ekleyin

### 4. Apple OAuth Kurulumu

1. [Apple Developer](https://developer.apple.com/) hesabına girin
2. "Certificates, Identifiers & Profiles" bölümüne gidin
3. "Identifiers" > "App IDs" bölümünde yeni App ID oluşturun
4. "Sign In with Apple" capability'sini etkinleştirin
5. "Keys" bölümünde yeni key oluşturun
6. Key ID, Team ID ve Client ID'yi kopyalayın

## 🔧 Veritabanı Kurulumu

OAuth hesapları için veritabanı şeması otomatik olarak oluşturulacaktır:

```bash
npx prisma migrate dev --name add-oauth-accounts
```

## 📱 Kullanım

### Frontend

Giriş sayfasında sosyal medya butonları otomatik olarak görünecektir:

```tsx
// Sosyal medya giriş butonları
<button onClick={() => handleSocialLogin('Google')}>
  Google ile giriş yap
</button>

<button onClick={() => handleSocialLogin('Facebook')}>
  Facebook ile giriş yap
</button>

<button onClick={() => handleSocialLogin('Apple')}>
  Apple ile giriş yap
</button>
```

### Backend

OAuth callback'ler otomatik olarak işlenecek ve kullanıcı veritabanında oluşturulacak/güncellenecektir.

## 🔒 Güvenlik

- Access token'lar güvenlik nedeniyle veritabanında saklanmaz
- Tüm OAuth işlemleri HTTPS üzerinden yapılır
- JWT token'lar güvenli şekilde oluşturulur

## 🐛 Sorun Giderme

### Yaygın Hatalar

1. **"Invalid redirect URI"**: OAuth provider'da redirect URI'nin doğru ayarlandığından emin olun
2. **"Client ID not found"**: Environment variables'ın doğru ayarlandığından emin olun
3. **"Database connection error"**: Prisma migration'ın çalıştırıldığından emin olun

### Debug

OAuth işlemlerini debug etmek için console log'ları kontrol edin:

```bash
npm run dev
```

## 📚 Ek Kaynaklar

- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login](https://developers.facebook.com/docs/facebook-login/)
- [Sign in with Apple](https://developer.apple.com/sign-in-with-apple/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Prisma Documentation](https://www.prisma.io/docs/)
