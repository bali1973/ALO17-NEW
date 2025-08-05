import { prisma } from '@/lib/prisma';
import CategoryLayout from '@/components/CategoryLayout';
import { notFound } from 'next/navigation';
import ListingsDisplay from '@/components/ListingsDisplay';
import Breadcrumb from '@/components/Breadcrumb';

export const revalidate = 3600;

async function getCategoryData(slug: string, subSlug: string, subSubSlug: string) {
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { category: null, subcategory: null, subSubCategory: null, listings: [] };

  const subcategory = category.subCategories?.find((sub: any) => sub.slug === subSlug);
  if (!subcategory) return { category, subcategory: null, subSubCategory: null, listings: [] };

  const subSubCategory = subcategory.subCategories?.find((sub: any) => sub.slug === subSubSlug);
  if (!subSubCategory) return { category, subcategory, subSubCategory: null, listings: [] };

  const listings = await prisma.listing.findMany({
    where: {
      category: category.slug,
      subcategory: subcategory.slug,
    },
    orderBy: { createdAt: 'desc' },
  });

  return { category, subcategory, subSubCategory, listings };
}

export async function generateStaticParams() {
  const categories = await prisma.category.findMany();
  const params: { slug: string; subSlug: string; subSubSlug: string }[] = [];
  categories.forEach((category: any) => {
    if (category.subCategories) {
      category.subCategories.forEach((subCategory: any) => {
        if (subCategory.subCategories) {
          subCategory.subCategories.forEach((subSubCategory: any) => {
            params.push({
              slug: category.slug,
              subSlug: subCategory.slug,
              subSubSlug: subSubCategory.slug,
            });
          });
        }
      });
    }
  });
  return params;
}

export default async function SubSubCategoryPage({ params }: { params: Promise<{ slug: string; subSlug: string; subSubSlug: string }> }) {
  const { slug, subSlug, subSubSlug } = await params;
  const { category, subcategory, subSubCategory, listings } = await getCategoryData(slug, subSlug, subSubSlug);

  if (!category || !subcategory || !subSubCategory) {
    return notFound();
  }

  const breadcrumbSegments = [
    { name: category.name, href: `/kategori/${category.slug}` },
    { name: subcategory.name, href: `/kategori/${category.slug}/${subcategory.slug}` },
    { name: subSubCategory.name },
  ];

  return (
    <CategoryLayout
      subcategories={subcategory.subCategories || []}
      activeSlug={subSubSlug}
      categorySlug={slug}
      breadcrumbSegments={breadcrumbSegments}
    >
      <ListingsDisplay 
        listings={listings} 
        showPagination={true}
        itemsPerPage={12}
      />
    </CategoryLayout>
  );
} 