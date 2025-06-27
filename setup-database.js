const https = require('https');
const http = require('http');

console.log('🚀 Alo17 için ücretsiz PostgreSQL veritabanı kurulumu...');
console.log('');
console.log('📋 Adımlar:');
console.log('1. https://neon.tech adresine gidin');
console.log('2. "Sign Up" ile ücretsiz hesap oluşturun');
console.log('3. "New Project" oluşturun');
console.log('4. Connection string\'i kopyalayın');
console.log('5. Bu script\'e yapıştırın');
console.log('');

// Neon'da otomatik hesap oluşturma (bu mümkün değil, manuel yapılması gerekiyor)
console.log('⚠️  Neon hesabı manuel olarak oluşturulmalıdır.');
console.log('🔗 https://neon.tech adresine gidin ve ücretsiz hesap oluşturun');
console.log('');

// Vercel CLI ile environment variable ekleme
console.log('📝 Vercel\'e environment variable eklemek için:');
console.log('vercel env add DATABASE_URL production');
console.log('');

console.log('🎯 Alternatif çözüm:');
console.log('1. Local SQLite kullanarak test edin');
console.log('2. Sonra canlı veritabanına geçin');
console.log('');

// Local SQLite için .env.local oluştur
const fs = require('fs');
const path = require('path');

const envContent = `DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="alo17-secret-key-2025-very-secure-and-long"
NEXTAUTH_URL="http://localhost:3004"
`;

try {
  fs.writeFileSync('.env.local', envContent);
  console.log('✅ .env.local dosyası oluşturuldu');
  console.log('🔧 Local SQLite veritabanı hazır');
} catch (error) {
  console.log('❌ .env.local dosyası oluşturulamadı:', error.message);
}

console.log('');
console.log('🚀 Şimdi local test yapabilirsiniz:');
console.log('npm run seed');
console.log('npm run dev');
console.log('');
console.log('🌐 http://localhost:3004/giris adresinde test kullanıcıları ile giriş yapabilirsiniz'); 