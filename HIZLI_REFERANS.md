# Alo17 - Hızlı Referans

## 🚀 Hızlı Başlangıç

### Projeyi Çalıştırma
```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Build al
npm run build

# Production'da çalıştır
npm start
```

### Önemli URL'ler
- **Ana Site**: https://alo17.netlify.app
- **Admin Panel**: https://alo17.netlify.app/admin
- **Kategoriler**: https://alo17.netlify.app/tum-kategoriler

## 📁 Önemli Dosyalar

### Konfigürasyon
- `netlify.toml` - Netlify ayarları
- `vercel.json` - Vercel ayarları
- `next.config.js` - Next.js ayarları
- `tailwind.config.js` - Tailwind CSS ayarları

### Ana Bileşenler
- `src/lib/useCategories.ts` - Kategori hook'u
- `src/app/admin/kategoriler/page.tsx` - Admin kategori sayfası
- `src/app/admin/ilanlar/page.tsx` - Admin ilan sayfası
- `src/app/page.tsx` - Ana sayfa
- `categories.json` - Kategori verileri

### Mobil Uygulama
- `alo17-mobile/` - React Native projesi

## 🔧 Yaygın Sorunlar ve Çözümler

### 1. Port Çakışması
```bash
# Node.js process'lerini sonlandır
taskkill /f /im node.exe

# Farklı port kullan
npm run dev -- -p 3005
```

### 2. Build Hataları
```bash
# Cache temizle
Remove-Item -Recurse -Force .next
npm run build
```

### 3. PowerShell Komut Sorunları
```bash
# Yanlış
cd /path && npm run dev

# Doğru
cd /path; npm run dev
# veya
cd /path
npm run dev
```

## 📊 Proje Durumu

### ✅ Tamamlanan (%85)
- Kategori sistemi
- Admin paneli
- Web uygulaması
- Deployment

### 🔄 Devam Eden (%10)
- Test coverage
- Performance optimization
- Documentation

### ⏳ Planlanan (%5)
- Ödeme sistemi
- Bildirim sistemi
- Arama özelliği

## 🎯 Hızlı İşlemler

### Kategori Ekleme
1. Admin paneline git
2. Kategoriler sayfasına git
3. "Yeni Kategori Ekle" butonuna tıkla
4. Bilgileri doldur ve kaydet

### İlan Yönetimi
1. Admin panelinde İlanlar sayfasına git
2. Grid veya tablo görünümü seç
3. İlanları onayla/reddet/düzenle

### Deployment
```bash
# Netlify için
npm run build
# Netlify dashboard'dan deploy et

# Vercel için
vercel --prod
```

## 📱 Mobil Uygulama

### Çalıştırma
```bash
cd alo17-mobile
npm install
npx expo start
```

### Özellikler
- Chat ekranı
- Favorites
- CreateListing
- Profile yönetimi

## 🔑 Environment Variables

### Gerekli Değişkenler
```env
DATABASE_URL=file:./dev.db
NODE_ENV=production
```

## 📞 Destek

### Sorun Giderme
1. Cache temizle (.next klasörü)
2. node_modules'ü sil ve yeniden yükle
3. Port çakışması kontrol et
4. PowerShell komutlarını kontrol et

### Loglar
- Build logları: `npm run build`
- Development logları: `npm run dev`

---

*Son güncelleme: 17 Haziran 2025* 