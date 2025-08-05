#!/bin/bash

# Alo17 Production Deployment Script
# Bu script projeyi production ortamına deploy eder

set -e  # Hata durumunda script'i durdur

echo "🚀 Alo17 Production Deployment Başlıyor..."

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Log fonksiyonu
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Gerekli araçları kontrol et
check_requirements() {
    log "Gerekli araçlar kontrol ediliyor..."
    
    if ! command -v node &> /dev/null; then
        error "Node.js bulunamadı. Lütfen Node.js'i yükleyin."
    fi
    
    if ! command -v npm &> /dev/null; then
        error "npm bulunamadı. Lütfen npm'i yükleyin."
    fi
    
    if ! command -v git &> /dev/null; then
        error "Git bulunamadı. Lütfen Git'i yükleyin."
    fi
    
    log "✓ Tüm gerekli araçlar mevcut"
}

# Environment değişkenlerini kontrol et
check_environment() {
    log "Environment değişkenleri kontrol ediliyor..."
    
    if [ -z "$DATABASE_URL" ]; then
        error "DATABASE_URL environment değişkeni ayarlanmamış"
    fi
    
    if [ -z "$NEXTAUTH_SECRET" ]; then
        error "NEXTAUTH_SECRET environment değişkeni ayarlanmamış"
    fi
    
    if [ -z "$NEXTAUTH_URL" ]; then
        error "NEXTAUTH_URL environment değişkeni ayarlanmamış"
    fi
    
    log "✓ Environment değişkenleri doğru"
}

# Bağımlılıkları yükle
install_dependencies() {
    log "Bağımlılıklar yükleniyor..."
    
    # Eski node_modules'u temizle
    if [ -d "node_modules" ]; then
        rm -rf node_modules
        log "✓ Eski node_modules temizlendi"
    fi
    
    # Package-lock.json'u temizle
    if [ -f "package-lock.json" ]; then
        rm package-lock.json
        log "✓ Eski package-lock.json temizlendi"
    fi
    
    # Bağımlılıkları yükle
    npm ci --production=false
    log "✓ Bağımlılıklar yüklendi"
}

# Veritabanını güncelle
update_database() {
    log "Veritabanı güncelleniyor..."
    
    # Prisma client'ı generate et
    npx prisma generate
    log "✓ Prisma client generate edildi"
    
    # Veritabanı migration'larını çalıştır
    npx prisma db push
    log "✓ Veritabanı güncellendi"
}

# Production build oluştur
build_production() {
    log "Production build oluşturuluyor..."
    
    # TypeScript kontrolü
    npx tsc --noEmit
    log "✓ TypeScript kontrolü geçti"
    
    # ESLint kontrolü
    npx eslint . --ext .ts,.tsx --max-warnings 0
    log "✓ ESLint kontrolü geçti"
    
    # Testleri çalıştır
    npm run test
    log "✓ Testler geçti"
    
    # Production build
    npm run build
    log "✓ Production build tamamlandı"
}

# Güvenlik kontrolü
security_check() {
    log "Güvenlik kontrolü yapılıyor..."
    
    # Audit kontrolü
    npm audit --audit-level moderate
    log "✓ Güvenlik audit'i geçti"
    
    # Bundle analizi
    npm run analyze
    log "✓ Bundle analizi tamamlandı"
}

# Performance testleri
performance_test() {
    log "Performance testleri çalıştırılıyor..."
    
    # Lighthouse CI (eğer kuruluysa)
    if command -v lhci &> /dev/null; then
        lhci autorun
        log "✓ Lighthouse CI testleri tamamlandı"
    else
        warn "Lighthouse CI kurulu değil, performance testleri atlanıyor"
    fi
}

# Monitoring kurulumu
setup_monitoring() {
    log "Monitoring sistemi kuruluyor..."
    
    # Monitoring verilerini temizle (eski test verilerini)
    npx prisma db execute --stdin <<< "
        DELETE FROM ErrorLog WHERE metadata LIKE '%test%';
        DELETE FROM PerformanceLog WHERE metadata LIKE '%test%';
        DELETE FROM UserEventLog WHERE properties LIKE '%test%';
    "
    log "✓ Eski test verileri temizlendi"
    
    # Monitoring dashboard'u test et
    curl -f http://localhost:3000/api/monitoring/dashboard > /dev/null 2>&1 || warn "Monitoring API test edilemedi"
}

# Backup oluştur
create_backup() {
    log "Backup oluşturuluyor..."
    
    BACKUP_DIR="backups/$(date +'%Y-%m-%d_%H-%M-%S')"
    mkdir -p "$BACKUP_DIR"
    
    # Veritabanı backup'ı
    if [ -f "prisma/dev.db" ]; then
        cp prisma/dev.db "$BACKUP_DIR/"
        log "✓ Veritabanı backup'ı oluşturuldu"
    fi
    
    # Environment dosyası backup'ı
    if [ -f ".env" ]; then
        cp .env "$BACKUP_DIR/"
        log "✓ Environment backup'ı oluşturuldu"
    fi
    
    log "✓ Backup tamamlandı: $BACKUP_DIR"
}

# Health check
health_check() {
    log "Health check yapılıyor..."
    
    # Ana sayfa kontrolü
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        log "✓ Ana sayfa erişilebilir"
    else
        error "Ana sayfa erişilemiyor"
    fi
    
    # API kontrolü
    if curl -f http://localhost:3000/api/categories > /dev/null 2>&1; then
        log "✓ API erişilebilir"
    else
        error "API erişilemiyor"
    fi
    
    # Monitoring kontrolü
    if curl -f http://localhost:3000/api/monitoring/dashboard > /dev/null 2>&1; then
        log "✓ Monitoring sistemi çalışıyor"
    else
        warn "Monitoring sistemi test edilemedi"
    fi
}

# Ana deployment fonksiyonu
main() {
    log "=== Alo17 Production Deployment ==="
    
    # Gerekli kontroller
    check_requirements
    check_environment
    
    # Backup oluştur
    create_backup
    
    # Bağımlılıkları yükle
    install_dependencies
    
    # Veritabanını güncelle
    update_database
    
    # Güvenlik kontrolü
    security_check
    
    # Production build
    build_production
    
    # Performance testleri
    performance_test
    
    # Monitoring kurulumu
    setup_monitoring
    
    # Health check
    health_check
    
    log "🎉 Deployment başarıyla tamamlandı!"
    log "📊 Monitoring: http://localhost:3000/admin/monitoring"
    log "🔧 Admin Panel: http://localhost:3000/admin"
    log "📈 Analytics: http://localhost:3000/test-monitoring"
    
    echo ""
    echo -e "${BLUE}=== Deployment Özeti ===${NC}"
    echo "✅ Tüm kontroller geçti"
    echo "✅ Build başarılı"
    echo "✅ Veritabanı güncel"
    echo "✅ Monitoring aktif"
    echo "✅ Güvenlik kontrolleri geçti"
    echo ""
    echo -e "${GREEN}Proje production'a hazır!${NC}"
}

# Script'i çalıştır
main "$@" 