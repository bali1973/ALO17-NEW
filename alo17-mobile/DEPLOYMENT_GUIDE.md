# 🚀 Alo17 Mobile Production Deployment Guide

Bu rehber, Alo17 mobil uygulamasını production ortamına deploy etmek için gerekli adımları içerir.

## 📋 Ön Gereksinimler

### 1. PayTR Hesabı Kurulumu

1. **PayTR Hesabı Oluşturma**
   - [PayTR](https://www.paytr.com) sitesine gidin
   - "Üye Ol" butonuna tıklayın
   - Gerekli bilgileri doldurun ve hesabınızı oluşturun

2. **Merchant Bilgilerini Alma**
   - PayTR panelinize giriş yapın
   - "Entegrasyon" > "API Bilgileri" bölümüne gidin
   - Aşağıdaki bilgileri not edin:
     - Merchant ID
     - Merchant Key
     - Merchant Salt

3. **Test Hesabı Oluşturma**
   - Test modunda çalışmak için ayrı bir test hesabı oluşturun
   - Test kartları ile ödeme testleri yapın

### 2. Firebase Projesi Kurulumu

1. **Firebase Console'a Giriş**
   - [Firebase Console](https://console.firebase.google.com) adresine gidin
   - Google hesabınızla giriş yapın

2. **Yeni Proje Oluşturma**
   - "Proje Ekle" butonuna tıklayın
   - Proje adı: `alo17-app`
   - Google Analytics'i etkinleştirin

3. **Android Uygulaması Ekleme**
   - "Android" simgesine tıklayın
   - Package name: `com.alo17.mobile`
   - `google-services.json` dosyasını indirin
   - `android/app/` klasörüne yerleştirin

4. **iOS Uygulaması Ekleme**
   - "iOS" simgesine tıklayın
   - Bundle ID: `com.alo17.mobile`
   - `GoogleService-Info.plist` dosyasını indirin
   - `ios/Alo17Mobile/` klasörüne yerleştirin

5. **Cloud Messaging Kurulumu**
   - "Cloud Messaging" bölümüne gidin
   - Server key'i not edin
   - Topic'leri oluşturun

### 3. Socket.io Sunucu Kurulumu

1. **Sunucu Hazırlama**
   ```bash
   # Ubuntu/Debian sunucu
   sudo apt update
   sudo apt install nodejs npm nginx
   ```

2. **Socket.io Sunucu Kurulumu**
   ```bash
   # Proje klasörü oluşturma
   mkdir /var/www/alo17-socket
   cd /var/www/alo17-socket
   
   # Node.js projesi başlatma
   npm init -y
   npm install express socket.io cors helmet
   ```

3. **Nginx Konfigürasyonu**
   ```nginx
   # /etc/nginx/sites-available/alo17-socket
   server {
       listen 80;
       server_name socket.alo17.com;
       
       location / {
           proxy_pass http://localhost:3004;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔧 Konfigürasyon

### 1. Environment Variables

1. **Production Environment Dosyası Oluşturma**
   ```bash
   cp env.production.example .env.production
   ```

2. **Gerekli Değerleri Doldurma**
   ```env
   # PayTR Configuration
   PAYTR_MERCHANT_ID=your_actual_merchant_id
   PAYTR_MERCHANT_KEY=your_actual_merchant_key
   PAYTR_MERCHANT_SALT=your_actual_merchant_salt
   
   # Firebase Configuration
   FIREBASE_API_KEY=your_actual_firebase_api_key
   FCM_SERVER_KEY=your_actual_fcm_server_key
   
   # Socket.io Configuration
   SOCKET_SERVER_URL=wss://socket.alo17.com
   ```

### 2. App Configuration

1. **app.json Güncelleme**
   - `projectId` değerini gerçek EAS project ID ile değiştirin
   - `owner` değerini Expo hesabınızla değiştirin

2. **eas.json Güncelleme**
   - Apple Developer hesap bilgilerini ekleyin
   - Google Play Console service account key path'ini ekleyin

## 🏗️ Build ve Deploy

### 1. EAS CLI Kurulumu

```bash
npm install -g @expo/eas-cli
eas login
```

### 2. EAS Project Oluşturma

```bash
eas build:configure
```

### 3. Production Build

```bash
# Android Production Build
eas build --platform android --profile production

# iOS Production Build
eas build --platform ios --profile production
```

### 4. App Store Deploy

```bash
# iOS App Store
eas submit --platform ios --profile production

# Android Google Play
eas submit --platform android --profile production
```

## 📱 Test Etme

### 1. PayTR Test

1. **Test Kartları**
   - Kart No: `4355084355084358`
   - Son Kullanma: `12/26`
   - CVV: `000`

2. **Test Senaryoları**
   - Başarılı ödeme
   - Başarısız ödeme
   - İptal edilen ödeme
   - NFC ödeme

### 2. Push Notification Test

1. **Firebase Console'dan Test**
   - Cloud Messaging > Send your first message
   - Topic: `general`
   - Test mesajı gönderin

2. **Uygulama İçi Test**
   - NotificationService.showTestNotification() çağırın
   - Farklı notification türlerini test edin

### 3. Socket.io Test

1. **Bağlantı Testi**
   - Uygulama açıldığında socket bağlantısını kontrol edin
   - Mesaj gönderme/alma testi yapın

2. **Reconnection Testi**
   - İnternet bağlantısını kesin
   - Bağlantı geri geldiğinde otomatik bağlanmayı kontrol edin

## 🔒 Güvenlik

### 1. SSL Sertifikası

```bash
# Let's Encrypt SSL sertifikası
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d alo17.com -d www.alo17.com -d socket.alo17.com
```

### 2. Environment Variables Güvenliği

- `.env.production` dosyasını `.gitignore`'a ekleyin
- Hassas bilgileri environment variables olarak saklayın
- Production sunucuda environment variables'ları güvenli şekilde ayarlayın

### 3. API Güvenliği

- Rate limiting uygulayın
- CORS ayarlarını production için yapılandırın
- JWT token'ları güvenli şekilde yönetin

## 📊 Monitoring

### 1. Sentry Kurulumu

```bash
npm install @sentry/react-native
```

### 2. Analytics Kurulumu

```bash
npm install @react-native-firebase/analytics
```

### 3. Performance Monitoring

- Firebase Performance Monitoring
- React Native Performance Monitor
- Custom performance metrics

## 🚨 Troubleshooting

### Yaygın Sorunlar

1. **Build Hatası**
   ```bash
   # Cache temizleme
   expo r -c
   eas build --clear-cache
   ```

2. **PayTR Bağlantı Hatası**
   - Merchant bilgilerini kontrol edin
   - IP whitelist ayarlarını kontrol edin
   - Test modunu kontrol edin

3. **Push Notification Çalışmıyor**
   - Firebase konfigürasyonunu kontrol edin
   - Device token'ı kontrol edin
   - Notification permissions'ı kontrol edin

4. **Socket.io Bağlantı Hatası**
   - Sunucu URL'ini kontrol edin
   - SSL sertifikasını kontrol edin
   - Firewall ayarlarını kontrol edin

## 📞 Destek

- **PayTR Destek**: support@paytr.com
- **Firebase Destek**: https://firebase.google.com/support
- **Expo Destek**: https://docs.expo.dev/help/
- **Socket.io Destek**: https://socket.io/docs/

## 📝 Checklist

- [ ] PayTR hesabı oluşturuldu
- [ ] Firebase projesi kuruldu
- [ ] Socket.io sunucu hazırlandı
- [ ] Environment variables ayarlandı
- [ ] SSL sertifikası kuruldu
- [ ] Production build yapıldı
- [ ] App Store'da yayınlandı
- [ ] Test edildi
- [ ] Monitoring kuruldu
- [ ] Backup stratejisi hazırlandı

---

**Not**: Bu rehber production deployment için temel adımları içerir. Projenizin özel gereksinimlerine göre ek konfigürasyonlar gerekebilir. 