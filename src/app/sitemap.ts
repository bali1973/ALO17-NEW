import { MetadataRoute } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

const LISTINGS_PATH = path.join(process.cwd(), 'public', 'listings.json');
const CATEGORIES_PATH = path.join(process.cwd(), 'public', 'categories.json');

async function readListings() {
  try {
    const data = await fs.readFile(LISTINGS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function readCategories() {
  try {
    const data = await fs.readFile(CATEGORIES_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://alo17.com';
  const currentDate = new Date().toISOString();

  // Statik sayfalar
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/ilanlar`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/kategoriler`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ilan-ver`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/premium`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/hakkimizda`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/iletisim`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/gizlilik-politikasi`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/kullanim-sartlari`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  // İlan sayfaları
  const listings = await readListings();
  const listingPages = listings
    .filter((listing: any) => listing.status === 'active')
    .map((listing: any) => ({
      url: `${baseUrl}/ilan/${listing.id}`,
      lastModified: new Date(listing.updatedAt || listing.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  // Kategori sayfaları
  const categories = await readCategories();
  const categoryPages = categories.map((category: any) => ({
    url: `${baseUrl}/kategori/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Alt kategori sayfaları
  const subcategoryPages = categories
    .flatMap((category: any) => 
      (category.subcategories || []).map((subcategory: any) => ({
        url: `${baseUrl}/kategori/${category.slug}/${subcategory.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    );

  return [
    ...staticPages,
    ...listingPages,
    ...categoryPages,
    ...subcategoryPages,
  ];
} 