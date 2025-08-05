import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import path from 'path';
import fs from 'fs/promises';

type SubCategoryData = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
};

type CategoryData = {
  id: string;
  name: string;
  slug: string;
  subCategories: SubCategoryData[];
};

export async function POST(req: Request) {
  const authToken = req.headers.get('Authorization')?.split(' ')[1];

  if (authToken !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
  }

  try {
    const jsonPath = path.join(process.cwd(), 'src', 'app', 'api', 'categories', 'categories.json');
    const jsonFile = await fs.readFile(jsonPath, 'utf-8');
    const categoriesFromFile: CategoryData[] = JSON.parse(jsonFile);

    let createdCategories = 0;
    let createdSubCategories = 0;

    for (const catFromFile of categoriesFromFile) {
      const existingCategory = await prisma.category.findUnique({
        where: { slug: catFromFile.slug },
      });

      let categoryId: string;

      if (!existingCategory) {
        const newCategory = await prisma.category.create({
          data: {
            name: catFromFile.name,
            slug: catFromFile.slug,
          },
        });
        categoryId = newCategory.id;
        createdCategories++;
      } else {
        categoryId = existingCategory.id;
      }

      for (const subCatFromFile of catFromFile.subCategories) {
        const existingSubCategory = await prisma.subCategory.findFirst({
          where: {
            slug: subCatFromFile.slug,
            categoryId: categoryId,
          },
        });

        if (!existingSubCategory) {
          await prisma.subCategory.create({
            data: {
              name: subCatFromFile.name,
              slug: subCatFromFile.slug,
              categoryId: categoryId,
            },
          });
          createdSubCategories++;
        }
      }
    }

    return NextResponse.json({
      message: 'Senkronizasyon tamamlandı.',
      createdCategories,
      createdSubCategories,
    });
  } catch (error) {
    console.error('Senkronizasyon hatası:', error);
    return NextResponse.json({ error: 'Senkronizasyon sırasında bir hata oluştu.' }, { status: 500 });
  }
} 