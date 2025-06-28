import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.log('🔧 DATABASE_URL not found, using SQLite for testing...')
  }

  try {
    // Clear existing data
    await prisma.coupon.deleteMany()
    await prisma.userFavorite.deleteMany()
    await prisma.listing.deleteMany()
    await prisma.subCategory.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()

    // Create users
    const adminPassword = await hash('admin123', 12)
    const userPassword = await hash('user123', 12)
    const testPassword = await hash('test123', 12)

    const admin = await prisma.user.create({
      data: {
        email: 'admin@alo17.com',
        name: 'Admin User',
        password: adminPassword,
        role: 'admin',
      },
    })

    const user = await prisma.user.create({
      data: {
        email: 'user@alo17.com',
        name: 'Normal User',
        password: userPassword,
      },
    })

    const testUser = await prisma.user.create({
      data: {
        email: 'test@alo17.com',
        name: 'Test User',
        password: testPassword,
      },
    })

    // Create categories
    const elektronik = await prisma.category.create({
      data: {
        name: 'Elektronik',
        slug: 'elektronik',
      },
    })

    const evBahce = await prisma.category.create({
      data: {
        name: 'Ev & Bahçe',
        slug: 'ev-bahce',
      },
    })

    const giyim = await prisma.category.create({
      data: {
        name: 'Giyim',
        slug: 'giyim',
      },
    })

    // Create subcategories
    const telefon = await prisma.subCategory.create({
      data: {
        name: 'Telefon',
        slug: 'telefon',
        categoryId: elektronik.id,
      },
    })

    const bilgisayar = await prisma.subCategory.create({
      data: {
        name: 'Bilgisayar',
        slug: 'bilgisayar',
        categoryId: elektronik.id,
      },
    })

    // Create listings
    await prisma.listing.create({
      data: {
        title: 'iPhone 14 Pro Max - Yeni',
        description: '128GB, Uzay Grisi, Garantili, Kutusunda',
        price: 45000,
        images: '["/images/listings/iphone-14-pro-max-1.jpg"]',
        features: '["256GB", "Uzay Grisi", "Garantili"]',
        condition: 'Yeni',
        location: 'İstanbul',
        category: 'elektronik',
        subCategory: 'telefon',
        brand: 'Apple',
        model: 'iPhone 14 Pro Max',
        year: '2023',
        isPremium: true,
        userId: admin.id,
      },
    })

    await prisma.listing.create({
      data: {
        title: 'MacBook Air M2 - İkinci El',
        description: '13 inç, 8GB RAM, 256GB SSD, Mükemmel durumda',
        price: 25000,
        images: '["/images/listings/placeholder.jpg"]',
        features: '["8GB RAM", "256GB SSD", "M2 Chip"]',
        condition: 'İkinci El',
        location: 'Ankara',
        category: 'elektronik',
        subCategory: 'bilgisayar',
        brand: 'Apple',
        model: 'MacBook Air M2',
        year: '2022',
        isPremium: false,
        userId: user.id,
      },
    })

    // Create coupon
    await prisma.coupon.create({
      data: {
        code: 'WELCOME10',
        discount: 10,
        maxUses: 100,
        expiresAt: new Date('2025-12-31'),
      },
    })

    // Premium Planlar
    const premiumPlans = [
      { name: 'Ücretsiz Plan', key: 'free', price: 0, days: 30 },
      { name: '30 Gün Premium', key: '30days', price: 99, days: 30 },
      { name: '90 Gün Premium', key: '90days', price: 249, days: 90 },
      { name: '365 Gün Premium', key: '365days', price: 799, days: 365 },
    ];

    for (const plan of premiumPlans) {
      await prisma.premiumPlan.upsert({
        where: { key: plan.key },
        update: plan,
        create: plan,
      });
    }

    console.log('✅ Database seeded successfully!')
    console.log('')
    console.log('📋 Created users:')
    console.log('👑 Admin:', admin.email, '/ admin123')
    console.log('👤 User:', user.email, '/ user123')
    console.log('🧪 Test:', testUser.email, '/ test123')
    console.log('')
    console.log('📋 Created categories:', 3)
    console.log('📋 Created subcategories:', 2)
    console.log('📋 Created listings:', 2)
    console.log('📋 Created coupon: WELCOME10 (10% discount)')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 