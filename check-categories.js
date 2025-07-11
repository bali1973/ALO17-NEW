const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany({
    include: { subCategories: true },
  });
  console.log('Category tablosundaki kayıtlar:');
  console.dir(categories, { depth: null });
  console.log('Toplam kategori:', categories.length);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect()); 