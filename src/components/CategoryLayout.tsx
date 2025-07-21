import React from 'react';
import CategoryFilters from './CategoryFilters';
import Link from 'next/link';

interface Subcategory {
  slug: string;
  name: string;
}

interface CategoryLayoutProps {
  subcategories: Subcategory[];
  activeSlug: string;
  categoryBasePath: string;
  city: string;
  onCityChange: (v: string) => void;
  priceRange: string;
  onPriceRangeChange: (v: string) => void;
  premiumOnly: boolean;
  onPremiumOnlyChange: (v: boolean) => void;
  children: React.ReactNode;
  extraSidebarContent?: React.ReactNode; // Marka, yıldız, vs. gibi ek filtreler için
}

const CategoryLayout: React.FC<CategoryLayoutProps> = ({
  subcategories,
  activeSlug,
  categoryBasePath,
  city,
  onCityChange,
  priceRange,
  onPriceRangeChange,
  premiumOnly,
  onPremiumOnlyChange,
  children,
  extraSidebarContent
}) => {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-80 flex-shrink-0 mb-8 md:mb-0">
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Alt Kategoriler</h2>
          <ul className="space-y-2">
            {subcategories.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/${categoryBasePath}/${cat.slug}`}
                  className={`block px-3 py-2 rounded transition ${cat.slug === activeSlug ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'hover:bg-gray-100'}`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-yellow-100 rounded-lg shadow p-4 mb-6 border border-blue-200">
          <CategoryFilters
            city={city}
            onCityChange={onCityChange}
            priceRange={priceRange}
            onPriceRangeChange={onPriceRangeChange}
            premiumOnly={premiumOnly}
            onPremiumOnlyChange={onPremiumOnlyChange}
          />
        </div>
        {extraSidebarContent && (
          <div className="bg-white rounded-lg shadow p-4 mt-4">
            {extraSidebarContent}
          </div>
        )}
      </aside>
      {/* Main */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default CategoryLayout; 