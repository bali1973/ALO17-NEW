import React from 'react';
import CategoryFilters from './CategoryFilters';
import Link from 'next/link';
import Breadcrumb, { BreadcrumbSegment } from './Breadcrumb';

interface Subcategory {
  slug: string;
  name: string;
  subCategories?: Subcategory[];
}

interface CategoryLayoutProps {
  subcategories: Subcategory[];
  activeSlug: string;
  categorySlug: string;
  children: React.ReactNode;
  extraSidebarContent?: React.ReactNode;
  breadcrumbSegments: BreadcrumbSegment[];
}

const CategoryLayout: React.FC<CategoryLayoutProps> = ({
  subcategories,
  activeSlug,
  categorySlug,
  children,
  extraSidebarContent,
  breadcrumbSegments,
}) => {
  const activeSubcategory = subcategories.find(s => s.slug === activeSlug);
  const displaySubcategories = activeSubcategory?.subCategories && activeSubcategory.subCategories.length > 0
    ? activeSubcategory.subCategories
    : subcategories;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb segments={breadcrumbSegments} />
      <div className="flex flex-col md:flex-row gap-8 mt-4">
        <aside className="w-full md:w-80 flex-shrink-0 mb-8 md:mb-0">
          <div className="sticky top-24 space-y-6">
            {displaySubcategories && displaySubcategories.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">Alt Kategoriler</h3>
                <ul className="space-y-2">
                  {/* Tümü linki */}
                  <li>
                    <Link
                      href={`/kategori/${categorySlug}`}
                      className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeSlug === ""
                          ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                      }`}
                    >
                      📁 Tümü
                    </Link>
                  </li>
                  {displaySubcategories.map((sub) => (
                    <li key={sub.slug}>
                      <Link
                        href={`/kategori/${categorySlug}/${sub.slug}`}
                        className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeSlug === sub.slug
                            ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                        }`}
                      >
                        📂 {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* <CategoryFilters
              city={city}
              onCityChange={setCity}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              premiumOnly={premiumOnly}
              onPremiumOnlyChange={setPremiumOnly}
            /> */}
            
            {extraSidebarContent && (
              <div className="bg-white rounded-lg shadow p-4">
                {extraSidebarContent}
              </div>
            )}
          </div>
        </aside>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CategoryLayout; 