# API Dokümantasyonu

Alo17.tr platformunun RESTful API dokümantasyonu.

## 🔗 Base URL

```
Production: https://alo17-new-27-06.onrender.com/api
Development: http://localhost:3000/api
```

## 🔐 Authentication

Çoğu endpoint için JWT token gereklidir. Token'ı `Authorization` header'ında gönderin:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📋 API Endpoints

### Authentication

#### POST /api/auth/login
Kullanıcı girişi

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

#### POST /api/auth/register
Kullanıcı kaydı

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "phone": "+90555123456"
}
```

### Categories

#### GET /api/categories
Tüm kategorileri getir

**Response:**
```json
[
  {
    "id": "1",
    "name": "Elektronik",
    "slug": "elektronik",
    "order": 0,
    "count": 15,
    "subCategories": [
      {
        "id": "1-1",
        "name": "Bilgisayarlar",
        "slug": "bilgisayarlar",
        "categoryId": "1"
      }
    ]
  }
]
```

#### GET /api/categories/:slug
Belirli kategoriyi getir

**Parameters:**
- `slug`: Kategori slug'ı

### Listings

#### GET /api/listings
İlanları listele

**Query Parameters:**
- `category`: Kategori filtresi
- `city`: Şehir filtresi
- `minPrice`: Minimum fiyat
- `maxPrice`: Maksimum fiyat
- `premiumOnly`: Sadece premium ilanlar (true/false)
- `page`: Sayfa numarası (default: 1)
- `limit`: Sayfa başına ilan sayısı (default: 20)

**Response:**
```json
{
  "listings": [
    {
      "id": "listing_id",
      "title": "İlan Başlığı",
      "description": "İlan açıklaması",
      "price": "1000",
      "category": "elektronik",
      "subcategory": "bilgisayarlar",
      "city": "İstanbul",
      "images": ["image1.jpg", "image2.jpg"],
      "isPremium": false,
      "userId": "user_id",
      "createdAt": "2025-01-28T10:00:00Z",
      "updatedAt": "2025-01-28T10:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### GET /api/listings/:id
Belirli ilanı getir

**Parameters:**
- `id`: İlan ID'si

#### POST /api/listings
Yeni ilan oluştur (Auth gerekli)

**Request Body:**
```json
{
  "title": "İlan Başlığı",
  "description": "İlan açıklaması",
  "price": "1000",
  "category": "elektronik",
  "subcategory": "bilgisayarlar",
  "city": "İstanbul",
  "images": ["image1.jpg", "image2.jpg"]
}
```

#### PUT /api/listings/:id
İlanı güncelle (Auth gerekli)

#### DELETE /api/listings/:id
İlanı sil (Auth gerekli)

### Search

#### GET /api/search
İlan ara

**Query Parameters:**
- `q`: Arama terimi
- `category`: Kategori filtresi
- `city`: Şehir filtresi
- `minPrice`: Minimum fiyat
- `maxPrice`: Maksimum fiyat
- `condition`: Ürün durumu
- `premiumOnly`: Sadece premium ilanlar
- `sortBy`: Sıralama (newest, oldest, price_asc, price_desc)

### Notifications

#### POST /api/notifications/send
Bildirim gönder (Admin gerekli)

**Request Body:**
```json
{
  "userId": "user_id",
  "type": "NEW_MESSAGE",
  "data": {
    "senderName": "John Doe",
    "message": "Yeni mesajınız var"
  }
}
```

## 🚨 Error Responses

API hataları tutarlı format kullanır:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### HTTP Status Codes

- `200`: Başarılı
- `201`: Oluşturuldu
- `400`: Geçersiz istek
- `401`: Yetkisiz
- `403`: Yasak
- `404`: Bulunamadı
- `429`: Çok fazla istek
- `500`: Sunucu hatası

## 🔒 Rate Limiting

API'de rate limiting aktif:
- **Genel**: 100 istek/dakika
- **Authentication**: 5 istek/dakika
- **Search**: 50 istek/dakika

## 📝 Örnek Kullanım

### JavaScript/TypeScript

```typescript
// İlan listesi getir
const response = await fetch('/api/listings?category=elektronik&city=İstanbul');
const data = await response.json();

// Yeni ilan oluştur
const newListing = await fetch('/api/listings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'iPhone 15',
    description: 'Sıfır kutusunda iPhone 15',
    price: '45000',
    category: 'elektronik',
    subcategory: 'telefon',
    city: 'İstanbul'
  })
});
```

### cURL

```bash
# İlan listesi
curl -X GET "https://alo17-new-27-06.onrender.com/api/listings?category=elektronik"

# Yeni ilan
curl -X POST "https://alo17-new-27-06.onrender.com/api/listings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "iPhone 15",
    "description": "Sıfır kutusunda",
    "price": "45000",
    "category": "elektronik",
    "city": "İstanbul"
  }'
```

## 🔄 Versioning

API versiyonlama header ile yapılır:

```
Accept: application/vnd.alo17.v1+json
```

Şu anki versiyon: v1

## 📊 Response Caching

Belirli endpoint'ler cache'lenir:
- Categories: 5 dakika
- Listings: 2 dakika
- Search results: 1 dakika

Cache'i bypass etmek için `Cache-Control: no-cache` header'ı kullanın.

## 🐛 Hata Ayıklama

Development ortamında detaylı hata mesajları döner. Production'da güvenlik için sınırlı bilgi verilir.

Debug mode için `X-Debug: true` header'ı kullanın (sadece development).

## 📞 Destek

API ile ilgili sorunlar için:
- Email: api-support@alo17.tr
- GitHub Issues: [ALO17-NEW Issues](https://github.com/bali1973/ALO17-NEW/issues) 