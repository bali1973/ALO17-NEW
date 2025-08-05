# Alo17 API Dokümantasyonu

Bu dokümantasyon Alo17 uygulamasının REST API endpoint'lerini açıklar.

## 🔗 Base URL

```
Production: https://alo17.com/api
Staging: https://staging.alo17.com/api
Development: http://localhost:3004/api
```

## 🔐 Authentication

API'yi kullanmak için JWT token gereklidir. Token'ı header'da gönderin:

```
Authorization: Bearer <your-jwt-token>
```

## 📋 İçindekiler

- [Authentication](#authentication)
- [Users](#users)
- [Listings](#listings)
- [Categories](#categories)
- [Messages](#messages)
- [Notifications](#notifications)
- [Reports](#reports)
- [Premium Features](#premium-features)
- [Search](#search)
- [Analytics](#analytics)
- [Admin](#admin)

---

## 👤 Users

### Get Current User
```http
GET /api/user/profile
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+905551234567",
    "location": "İstanbul",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update User Profile
```http
PUT /api/user/profile
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "+905551234567",
  "location": "İstanbul"
}
```

### Get User Stats
```http
GET /api/user/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalListings": 15,
    "activeListings": 12,
    "totalViews": 1250,
    "totalMessages": 45,
    "totalFavorites": 23,
    "membershipDate": "2024-01-01T00:00:00.000Z",
    "lastActive": "2024-01-15T10:30:00.000Z"
  }
}
```

### Get User Listings
```http
GET /api/user/listings?page=1&limit=10&status=active
```

---

## 🏠 Listings

### Get All Listings
```http
GET /api/listings?page=1&limit=20&category=elektronik&priceMin=100&priceMax=1000&search=iphone
```

**Query Parameters:**
- `page` (number): Sayfa numarası
- `limit` (number): Sayfa başına kayıt sayısı
- `category` (string): Kategori filtresi
- `subcategory` (string): Alt kategori filtresi
- `priceMin` (number): Minimum fiyat
- `priceMax` (number): Maksimum fiyat
- `location` (string): Konum filtresi
- `condition` (string): Durum filtresi (yeni, az kullanılmış, eski)
- `search` (string): Arama terimi
- `sortBy` (string): Sıralama (price, date, views)
- `sortOrder` (string): Sıralama yönü (asc, desc)

**Response:**
```json
{
  "success": true,
  "listings": [
    {
      "id": "listing_123",
      "title": "iPhone 13 Pro",
      "description": "Yeni iPhone 13 Pro satılık",
      "price": 15000,
      "category": "elektronik",
      "subcategory": "telefon",
      "location": "İstanbul",
      "condition": "yeni",
      "images": ["/uploads/image1.jpg"],
      "userId": "user_123",
      "status": "active",
      "views": 45,
      "createdAt": "2024-01-01T00:00:00.000Z"
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

### Get Single Listing
```http
GET /api/listings/{id}
```

### Create Listing
```http
POST /api/listings
Content-Type: application/json

{
  "title": "iPhone 13 Pro",
  "description": "Yeni iPhone 13 Pro satılık",
  "price": 15000,
  "category": "elektronik",
  "subcategory": "telefon",
  "location": "İstanbul",
  "condition": "yeni",
  "images": ["/uploads/image1.jpg"]
}
```

### Update Listing
```http
PUT /api/listings/{id}
Content-Type: application/json

{
  "title": "iPhone 13 Pro - Güncellenmiş",
  "price": 14000
}
```

### Delete Listing
```http
DELETE /api/listings/{id}
```

### Upload Images
```http
POST /api/listings/{id}/images
Content-Type: multipart/form-data

{
  "images": [File1, File2, File3]
}
```

---

## 📂 Categories

### Get All Categories
```http
GET /api/categories
```

**Response:**
```json
{
  "success": true,
  "categories": [
    {
      "id": "cat_1",
      "name": "Elektronik",
      "slug": "elektronik",
      "description": "Elektronik ürünler",
      "icon": "phone",
      "order": 1,
      "isActive": true,
      "subcategories": [
        {
          "id": "sub_1",
          "name": "Telefon",
          "slug": "telefon",
          "description": "Telefonlar",
          "order": 1,
          "isActive": true
        }
      ]
    }
  ]
}
```

### Get Category by Slug
```http
GET /api/categories/{slug}
```

### Get Category Listings
```http
GET /api/categories/{slug}/listings?page=1&limit=20
```

---

## 💬 Messages

### Get Conversations
```http
GET /api/messages/conversations
```

**Response:**
```json
{
  "success": true,
  "conversations": [
    {
      "id": "conv_123",
      "participant": {
        "id": "user_456",
        "name": "Jane Doe",
        "avatar": "/images/avatar.jpg"
      },
      "lastMessage": {
        "content": "Merhaba, ilan hakkında bilgi alabilir miyim?",
        "timestamp": "2024-01-15T10:30:00.000Z",
        "isRead": false
      },
      "unreadCount": 2,
      "listing": {
        "id": "listing_123",
        "title": "iPhone 13 Pro",
        "image": "/uploads/image1.jpg"
      }
    }
  ]
}
```

### Get Message History
```http
GET /api/messages/history?userId={userId}&page=1&limit=50
```

### Send Message
```http
POST /api/messages/send
Content-Type: application/json

{
  "recipientId": "user_456",
  "content": "Merhaba, ilan hakkında bilgi alabilir miyim?",
  "listingId": "listing_123"
}
```

### Mark Message as Read
```http
PUT /api/messages/read
Content-Type: application/json

{
  "messageId": "msg_123"
}
```

---

## 🔔 Notifications

### Get Notifications
```http
GET /api/notifications?page=1&limit=20&type=message
```

**Response:**
```json
{
  "success": true,
  "notifications": [
    {
      "id": "notif_123",
      "title": "Yeni Mesaj",
      "message": "iPhone 13 Pro ilanınız için yeni mesaj var",
      "type": "message",
      "isRead": false,
      "data": {
        "listingId": "listing_123",
        "senderId": "user_456"
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 50
  }
}
```

### Get Unread Count
```http
GET /api/notifications/unread/count
```

### Mark as Read
```http
PUT /api/notifications/{id}/read
```

### Get Notification Preferences
```http
GET /api/notifications/preferences
```

### Update Notification Preferences
```http
PUT /api/notifications/preferences
Content-Type: application/json

{
  "email": true,
  "push": true,
  "sms": false,
  "inApp": true,
  "messageNotifications": true,
  "listingNotifications": true,
  "marketingNotifications": false,
  "frequency": "immediate",
  "silentHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

---

## 🚨 Reports

### Get Reports (Admin)
```http
GET /api/admin/reports?page=1&limit=20&status=pending
```

### Create Report
```http
POST /api/reports
Content-Type: application/json

{
  "type": "listing_complaint",
  "subject": "Yanıltıcı İlan",
  "description": "İlan açıklaması gerçekle uyuşmuyor",
  "priority": "medium",
  "listingId": "listing_123",
  "listingTitle": "iPhone 13 Pro"
}
```

### Update Report Status (Admin)
```http
PUT /api/admin/reports/{id}
Content-Type: application/json

{
  "status": "resolved",
  "adminNotes": "Sorun çözüldü"
}
```

---

## ⭐ Premium Features

### Get Premium Plans
```http
GET /api/premium/plans
```

### Get User Premium Status
```http
GET /api/premium/status
```

### Purchase Premium Plan
```http
POST /api/premium/purchase
Content-Type: application/json

{
  "planId": "plan_monthly",
  "paymentMethod": "paytr"
}
```

### Get Premium Features
```http
GET /api/premium/features
```

---

## 🔍 Search

### Advanced Search
```http
POST /api/search/advanced
Content-Type: application/json

{
  "query": "iphone",
  "filters": {
    "category": "elektronik",
    "priceRange": {
      "min": 1000,
      "max": 20000
    },
    "location": "İstanbul",
    "condition": "yeni"
  },
  "sortBy": "relevance",
  "page": 1,
  "limit": 20
}
```

### Get Search Suggestions
```http
GET /api/search/suggestions?q=iph
```

---

## 📊 Analytics

### Get User Analytics
```http
GET /api/analytics?timeRange=30d
```

**Query Parameters:**
- `timeRange` (string): 7d, 30d, 90d, 1y

**Response:**
```json
{
  "success": true,
  "analytics": {
    "overview": {
      "totalViews": 1250,
      "totalMessages": 45,
      "conversionRate": 3.6,
      "avgResponseTime": 2.5
    },
    "viewTrends": [
      {
        "date": "2024-01-01",
        "views": 45
      }
    ],
    "topListings": [
      {
        "id": "listing_123",
        "title": "iPhone 13 Pro",
        "views": 150,
        "messages": 8
      }
    ],
    "categoryPerformance": [
      {
        "category": "elektronik",
        "views": 450,
        "listings": 25
      }
    ]
  }
}
```

---

## 👨‍💼 Admin

### Get Dashboard Stats
```http
GET /api/admin/dashboard
```

### Get Users (Admin)
```http
GET /api/admin/users?page=1&limit=20&role=user
```

### Update User (Admin)
```http
PUT /api/admin/users/{id}
Content-Type: application/json

{
  "role": "moderator",
  "isActive": true
}
```

### Get Security Events
```http
GET /api/admin/security/events?type=login_attempt&severity=high
```

### Get Performance Metrics
```http
GET /api/admin/performance/metrics?name=FCP&startTime=1642233600000
```

---

## 🚨 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "title": "Title is required",
    "price": "Price must be a positive number"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## 📝 Rate Limiting

API rate limiting kuralları:

- **Authenticated users**: 100 requests/minute
- **Unauthenticated users**: 20 requests/minute
- **Admin endpoints**: 1000 requests/minute

Rate limit aşıldığında `429 Too Many Requests` hatası döner.

---

## 🔗 WebSocket Events

### Connection
```javascript
const socket = io('https://alo17.com', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Events

#### New Message
```javascript
socket.on('new_message', (data) => {
  console.log('New message:', data);
});
```

#### Message Read
```javascript
socket.on('message_read', (data) => {
  console.log('Message read:', data);
});
```

#### New Notification
```javascript
socket.on('new_notification', (data) => {
  console.log('New notification:', data);
});
```

#### Listing View
```javascript
socket.on('listing_view', (data) => {
  console.log('Listing viewed:', data);
});
```

---

## 📚 SDK ve Örnekler

### JavaScript SDK
```javascript
import { Alo17API } from '@alo17/sdk';

const api = new Alo17API({
  baseURL: 'https://alo17.com/api',
  token: 'your-jwt-token'
});

// Get listings
const listings = await api.listings.getAll({
  category: 'elektronik',
  page: 1,
  limit: 20
});

// Create listing
const newListing = await api.listings.create({
  title: 'iPhone 13 Pro',
  price: 15000,
  category: 'elektronik'
});
```

### cURL Örnekleri

#### Get Listings
```bash
curl -X GET "https://alo17.com/api/listings?category=elektronik&page=1&limit=20" \
  -H "Authorization: Bearer your-jwt-token"
```

#### Create Listing
```bash
curl -X POST "https://alo17.com/api/listings" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "iPhone 13 Pro",
    "description": "Yeni iPhone 13 Pro satılık",
    "price": 15000,
    "category": "elektronik"
  }'
```

---

## 📞 Support

API ile ilgili sorular için:

- **Documentation**: [docs/API.md](docs/API.md)
- **Issues**: [GitHub Issues](https://github.com/your-username/alo17/issues)
- **Email**: api-support@alo17.com
- **Discord**: [Alo17 Developers](https://discord.gg/alo17) 