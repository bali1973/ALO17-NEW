# Alo17 - Netlify Deployment Rehberi

## 🚀 Netlify'da Deployment

### Ön Gereksinimler
- Netlify hesabı
- GitHub repository'si
- Node.js 18+

### Deployment Adımları

#### 1. Netlify Dashboard'da Site Oluşturma
1. Netlify dashboard'a git
2. "New site from Git" butonuna tıkla
3. GitHub'ı seç ve alo17 repository'sini seç
4. Branch: `main` (veya `master`)
5. Build command: `npm run build:netlify`
6. Publish directory: `.next`

#### 2. Environment Variables
Netlify dashboard'da şu environment variables'ları ekle:

```
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://alo17.netlify.app
NEXT_TELEMETRY_DISABLED=1
```

#### 3. Build Settings
- **Build command**: `npm run build:netlify`
- **Publish directory**: `.next`
- **Node version**: 18

### 📁 Önemli Dosyalar

#### Konfigürasyon Dosyaları
- `netlify.toml` - Netlify ayarları
- `next.config.js` - Next.js konfigürasyonu
- `package.json` - Build scriptleri

#### Veri Dosyaları
- `public/categories.json` - Kategori verileri
- `public/listings.json` - İlan verileri
- `public/users.json` - Kullanıcı verileri

### 🔧 Teknik Detaylar

#### Mock Prisma Client
- `src/lib/prisma.ts` - Gerçek Prisma yerine JSON dosyaları kullanır
- Netlify'da veritabanı bağlantısı olmadığı için mock client kullanılır

#### API Routes
- Tüm API'lar JSON dosya tabanlı çalışır
- Veritabanı bağımlılığı yok
- Netlify Functions ile uyumlu

#### Build Optimizasyonu
- `next.config.js` - Netlify için optimize edildi
- `output: 'standalone'` - Netlify için gerekli
- `images.unoptimized: true` - Netlify'da image optimization devre dışı

### 🚨 Bilinen Sorunlar ve Çözümler

#### 1. Build Hataları
```bash
# Cache temizle
rm -rf .next
npm run build:netlify
```

#### 2. API Route Hataları
- Tüm API'lar JSON dosya tabanlı
- Veritabanı bağlantısı gerekmez
- Mock Prisma client kullanılır

#### 3. Image Loading Sorunları
- `next.config.js`'de `images.unoptimized: true` ayarı
- Picsum.photos kullanılıyor

### 📊 Deployment Durumu

#### ✅ Tamamlanan
- [x] Netlify konfigürasyonu
- [x] Mock Prisma client
- [x] JSON tabanlı veri sistemi
- [x] Build optimizasyonu
- [x] Environment variables

#### 🔄 Devam Eden
- [ ] Test deployment
- [ ] Performance optimization
- [ ] Error monitoring

### 🔗 URL'ler
- **Production**: https://alo17.netlify.app
- **Admin Panel**: https://alo17.netlify.app/admin
- **Kategoriler**: https://alo17.netlify.app/tum-kategoriler

### 📞 Destek
Sorun yaşarsanız:
1. Netlify build loglarını kontrol edin
2. Environment variables'ları doğrulayın
3. Build cache'ini temizleyin
4. Node.js versiyonunu kontrol edin

---

*Son güncelleme: 17 Haziran 2025* 