const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Admin kullanıcısı var mı kontrol et
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@alo17.com' }
    });

    if (existingAdmin) {
      console.log('✅ Admin kullanıcısı zaten mevcut:', existingAdmin.email);
      return;
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Admin kullanıcısını oluştur
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@alo17.com',
        password: hashedPassword,
        name: 'Admin',
        role: 'admin',
        isVerified: true,
        isActive: true
      }
    });

    console.log('✅ Admin kullanıcısı oluşturuldu:', adminUser.email);
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 Şifre: admin123');
    console.log('👤 Rol:', adminUser.role);

  } catch (error) {
    console.error('❌ Admin kullanıcısı oluşturulurken hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
