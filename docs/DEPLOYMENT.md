# Alo17 Deployment Guide

Bu dokümantasyon Alo17 uygulamasının farklı ortamlara nasıl deploy edileceğini açıklar.

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Docker ve Docker Compose
- Node.js 18+
- Git
- SSL sertifikaları (production için)

### 1. Repository'yi Klonlayın

```bash
git clone https://github.com/your-username/alo17.git
cd alo17
```

### 2. Environment Dosyalarını Hazırlayın

```bash
# Production için
cp env.production.example .env.production
# Staging için
cp env.staging.example .env.staging
# Development için
cp env.development.example .env.development
```

### 3. Environment Değişkenlerini Düzenleyin

`.env.production` dosyasını açın ve gerekli değerleri doldurun:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"

# Payment
STRIPE_SECRET_KEY="sk_live_..."
PAYTR_MERCHANT_ID="your_merchant_id"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

## 🐳 Docker ile Deployment

### Development Ortamı

```bash
# Development ortamını başlat
./scripts/deploy.sh development

# Veya manuel olarak
docker-compose up -d
```

### Staging Ortamı

```bash
# Staging ortamını deploy et
./scripts/deploy.sh staging v1.0.0

# Veya manuel olarak
docker-compose -f docker-compose.staging.yml up -d
```

### Production Ortamı

```bash
# Production ortamını deploy et
./scripts/deploy.sh production v1.0.0

# Veya manuel olarak
docker-compose -f docker-compose.prod.yml up -d
```

## ☁️ Cloud Platform Deployment

### Vercel Deployment

1. **Vercel CLI Kurulumu**
```bash
npm i -g vercel
```

2. **Proje Bağlama**
```bash
vercel link
```

3. **Environment Variables Ayarlama**
```bash
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
# ... diğer environment variables
```

4. **Deploy Etme**
```bash
vercel --prod
```

### AWS Deployment

1. **AWS CLI Kurulumu**
```bash
aws configure
```

2. **ECS Cluster Oluşturma**
```bash
aws ecs create-cluster --cluster-name alo17-cluster
```

3. **Task Definition Oluşturma**
```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

4. **Service Oluşturma**
```bash
aws ecs create-service --cluster alo17-cluster --service-name alo17-service --task-definition alo17:1
```

### Google Cloud Platform

1. **gcloud CLI Kurulumu**
```bash
gcloud auth login
gcloud config set project your-project-id
```

2. **Container Registry'e Push**
```bash
docker tag alo17-web gcr.io/your-project-id/alo17-web
docker push gcr.io/your-project-id/alo17-web
```

3. **Cloud Run Deployment**
```bash
gcloud run deploy alo17-web \
  --image gcr.io/your-project-id/alo17-web \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 🔧 Manuel Deployment

### 1. Build

```bash
npm install
npm run build
```

### 2. Database Migration

```bash
npx prisma migrate deploy
npx prisma generate
```

### 3. Start Application

```bash
npm start
```

## 📊 Monitoring ve Logging

### Grafana Dashboard

- URL: `http://your-domain:3001`
- Default credentials: `admin/admin`

### Prometheus Metrics

- URL: `http://your-domain:9090`
- Endpoint: `/api/metrics`

### ELK Stack

- Kibana: `http://your-domain:5601`
- Elasticsearch: `http://your-domain:9200`

## 🔒 SSL Sertifikası

### Let's Encrypt ile Otomatik SSL

```bash
# Certbot kurulumu
sudo apt-get install certbot

# SSL sertifikası alma
sudo certbot certonly --standalone -d your-domain.com

# Nginx konfigürasyonu
sudo cp nginx/nginx.conf /etc/nginx/nginx.conf
sudo systemctl reload nginx
```

### Manuel SSL Sertifikası

1. SSL sertifikanızı alın
2. `/etc/nginx/ssl/` dizinine yerleştirin
3. Nginx konfigürasyonunu güncelleyin

## 🔄 CI/CD Pipeline

### GitHub Actions

Her `main` branch'e push yapıldığında otomatik deployment:

1. **Tests** - Unit ve E2E testler
2. **Build** - Docker image build
3. **Deploy** - Production'a deploy
4. **Monitor** - Health check

### Manual Trigger

```bash
# Specific version deploy
./scripts/deploy.sh production v1.2.3

# Rollback
./scripts/deploy.sh rollback v1.2.2
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Error

```bash
# Database container'ını kontrol et
docker-compose logs postgres

# Connection string'i kontrol et
echo $DATABASE_URL
```

#### 2. Port Conflict

```bash
# Kullanılan portları kontrol et
netstat -tulpn | grep :3000

# Port'u değiştir
export PORT=3001
```

#### 3. Memory Issues

```bash
# Docker memory limit'ini artır
docker-compose up -d --memory=2g

# Node.js memory limit'ini artır
export NODE_OPTIONS="--max-old-space-size=2048"
```

### Health Check

```bash
# Application health
curl http://localhost/health

# Database health
docker-compose exec postgres pg_isready

# Redis health
docker-compose exec redis redis-cli ping
```

### Logs

```bash
# Application logs
docker-compose logs -f alo17-web

# Database logs
docker-compose logs -f postgres

# Nginx logs
docker-compose logs -f nginx
```

## 📈 Performance Optimization

### 1. Caching

```bash
# Redis cache'i etkinleştir
export CACHE_ENABLED=true
export REDIS_URL=redis://localhost:6379
```

### 2. CDN

```bash
# CDN URL'ini ayarla
export CDN_URL=https://cdn.your-domain.com
export CDN_ENABLED=true
```

### 3. Compression

```bash
# Gzip compression'ı etkinleştir
export COMPRESSION_ENABLED=true
```

## 🔐 Security Checklist

- [ ] Environment variables güvenli
- [ ] SSL sertifikası aktif
- [ ] Firewall kuralları ayarlandı
- [ ] Database backup aktif
- [ ] Monitoring aktif
- [ ] Rate limiting aktif
- [ ] Security headers aktif

## 📞 Support

Deployment ile ilgili sorunlar için:

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/your-username/alo17/issues)
- **Email**: support@alo17.com

## 📝 Changelog

### v1.0.0
- Initial deployment setup
- Docker containerization
- CI/CD pipeline
- Monitoring integration 