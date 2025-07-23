import React from 'react';
import { render, screen } from '@testing-library/react';
import CategoryLayout from '../CategoryLayout';

describe('CategoryLayout', () => {
  const mockProps = {
    subcategories: [
      { slug: 'telefon', name: 'Telefon' },
      { slug: 'tablet', name: 'Tablet' },
    ],
    activeSlug: 'telefon',
    categoryBasePath: 'elektronik',
    city: 'istanbul',
    onCityChange: jest.fn(),
    priceRange: '1000-2000',
    onPriceRangeChange: jest.fn(),
    premiumOnly: false,
    onPremiumOnlyChange: jest.fn(),
    children: <div>Test Content</div>,
  };

  it('renders subcategories correctly', () => {
    render(<CategoryLayout {...mockProps} />);
    
    expect(screen.getByText('Alt Kategoriler')).toBeInTheDocument();
    expect(screen.getByText('Telefon')).toBeInTheDocument();
    expect(screen.getByText('Tablet')).toBeInTheDocument();
  });

  it('highlights active subcategory', () => {
    render(<CategoryLayout {...mockProps} />);
    
    const activeLink = screen.getByText('Telefon').closest('a');
    expect(activeLink).toHaveClass('bg-blue-50', 'text-blue-700');
  });

  it('renders children content', () => {
    render(<CategoryLayout {...mockProps} />);
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders category filters', () => {
    render(<CategoryLayout {...mockProps} />);
    
    expect(screen.getByRole('complementary')).toBeInTheDocument();
  });

  it('renders extra sidebar content when provided', () => {
    const extraContent = <div>Extra Content</div>;
    render(
      <CategoryLayout {...mockProps} extraSidebarContent={extraContent} />
    );
    
    expect(screen.getByText('Extra Content')).toBeInTheDocument();
  });
}); 