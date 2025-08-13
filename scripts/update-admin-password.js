const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updateAdminPassword() {
  try {
    // Admin kullanıcısını bul
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@alo17.com' }
    });

    if (!adminUser) {
      console.log('❌ Admin kullanıcısı bulunamadı');
      return;
    }

    console.log('✅ Admin kullanıcısı bulundu:', adminUser.email);

    // Yeni şifreyi hash'le
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Şifreyi güncelle
    await prisma.user.update({
      where: { email: 'admin@alo17.com' },
      data: { password: hashedPassword }
    });

    console.log('✅ Admin şifresi güncellendi');
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 Yeni Şifre:', newPassword);
    console.log('👤 Rol:', adminUser.role);

  } catch (error) {
    console.error('❌ Admin şifresi güncellenirken hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword();
