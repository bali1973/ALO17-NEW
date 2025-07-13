#!/bin/bash

# Alo17 Netlify Deployment Script
echo "🚀 Alo17 Netlify Deployment başlatılıyor..."

# 1. Cache temizle
echo "🧹 Cache temizleniyor..."
rm -rf .next
rm -rf node_modules/.cache

# 2. Bağımlılıkları yükle
echo "📦 Bağımlılıklar yükleniyor..."
npm install

# 3. Build al
echo "🔨 Production build alınıyor..."
npm run build:netlify

# 4. Build kontrolü
if [ $? -eq 0 ]; then
    echo "✅ Build başarılı!"
    echo "📁 Build dosyaları .next/ klasöründe hazır"
    echo ""
    echo "🎯 Netlify'da deploy etmek için:"
    echo "1. Netlify dashboard'a git"
    echo "2. 'New site from Git' seç"
    echo "3. Repository'yi seç"
    echo "4. Build command: npm run build:netlify"
    echo "5. Publish directory: .next"
    echo ""
    echo "🔧 Environment Variables:"
    echo "NODE_ENV=production"
    echo "NEXT_PUBLIC_BASE_URL=https://alo17.netlify.app"
    echo "NEXT_TELEMETRY_DISABLED=1"
else
    echo "❌ Build başarısız!"
    exit 1
fi 