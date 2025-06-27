# Render Environment Variables Setup

Bu dosyada Render'da ayarlanması gereken environment variables'lar listelenmiştir.

## Zorunlu Environment Variables

### 1. NODE_ENV
**Key:** `NODE_ENV`
**Value:** `production`

### 2. PORT
**Key:** `PORT`
**Value:** `10000`

### 3. DATABASE_URL
**Key:** `DATABASE_URL`
**Value:** `file:./dev.db`

### 4. NEXTAUTH_SECRET
**Key:** `NEXTAUTH_SECRET`
**Value:** `alo17-super-secret-key-2025-make-it-very-long-and-secure-12345`

### 5. NEXTAUTH_URL
**Key:** `NEXTAUTH_URL`
**Value:** `https://alo17-new-27-06.onrender.com`

### 6. NEXT_PUBLIC_BASE_URL
**Key:** `NEXT_PUBLIC_BASE_URL`
**Value:** `https://alo17-new-27-06.onrender.com`

## Opsiyonel Environment Variables (Auth için)

### 7. GOOGLE_CLIENT_ID
**Key:** `GOOGLE_CLIENT_ID`
**Value:** `your-google-client-id`

### 8. GOOGLE_CLIENT_SECRET
**Key:** `GOOGLE_CLIENT_SECRET`
**Value:** `your-google-client-secret`

### 9. APPLE_ID
**Key:** `APPLE_ID`
**Value:** `your-apple-client-id`

### 10. APPLE_SECRET
**Key:** `APPLE_SECRET`
**Value:** `your-apple-client-secret`

## Render'da Nasıl Eklenecek

1. Render Dashboard'a gidin: https://dashboard.render.com/web/srv-d1f3mu6mcj7s739bsg9g/environment
2. "Environment" sekmesine tıklayın
3. "Add Environment Variable" butonuna tıklayın
4. Yukarıdaki her bir değişkeni tek tek ekleyin
5. Tüm değişkenler eklendikten sonra "Manual Deploy" yapın

## Önemli Notlar

- `NEXTAUTH_SECRET` güçlü bir şifre olmalı (en az 32 karakter)
- `NEXTAUTH_URL` ve `NEXT_PUBLIC_BASE_URL` doğru URL ile güncellenmiş olmalı
- Google ve Apple auth kullanmayacaksanız, o değişkenleri eklemeyebilirsiniz
- Değişkenler eklendikten sonra mutlaka yeniden deploy yapın 