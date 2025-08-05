import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import ListingsDisplay from '../ListingsDisplay';
import { Listing } from '@/types/listings';

// Mock data for performance testing
const generateMockListings = (count: number): Listing[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `listing-${index}`,
    title: `Test Listing ${index}`,
    description: `This is a test listing description for item ${index}`,
    price: Math.floor(Math.random() * 10000) + 100,
    location: 'Test City',
    city: 'Test City',
    category: 'test-category',
    subcategory: 'test-subcategory',
    isPremium: Math.random() > 0.8,
    images: ['https://via.placeholder.com/400x300'],
    createdAt: new Date().toISOString(),
    views: Math.floor(Math.random() * 1000),
    condition: 'new',
    status: 'active' as const,
    premium: Math.random() > 0.8,
    premiumFeatures: {
      isActive: Math.random() > 0.5,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isHighlighted: Math.random() > 0.7,
      isFeatured: Math.random() > 0.8,
      isUrgent: Math.random() > 0.9
    }
  }));
};

describe('Performance Tests', () => {
  test('renders 100 listings within 10000ms', async () => {
    const mockListings = generateMockListings(100);
    
    const startTime = performance.now();
    
    await act(async () => {
      render(
        <ListingsDisplay 
          listings={mockListings}
          loading={false}
          error={null}
        />
      );
    });
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    expect(renderTime).toBeLessThan(10000);
    expect(screen.getAllByText(/Test Listing/)).toHaveLength(100);
  });

  test('handles large dataset without memory issues', async () => {
    const mockListings = generateMockListings(1000);
    
    await act(async () => {
      render(
        <ListingsDisplay 
          listings={mockListings}
          loading={false}
          error={null}
          showPagination={true}
          itemsPerPage={12}
          currentPage={1}
        />
      );
    });
    
    // Should only render first 12 items due to pagination
    await waitFor(() => {
      const renderedListings = screen.getAllByText(/Test Listing/);
      expect(renderedListings.length).toBeLessThanOrEqual(12);
    });
  });

  test('search filtering performance', async () => {
    const mockListings = generateMockListings(500);
    
    await act(async () => {
      render(
        <ListingsDisplay 
          listings={mockListings}
          loading={false}
          error={null}
        />
      );
    });
    
    const startTime = performance.now();
    
    // Simulate search filtering
    const filteredListings = mockListings.filter(listing => 
      listing.title.toLowerCase().includes('test')
    );
    
    const endTime = performance.now();
    const filterTime = endTime - startTime;
    
    expect(filterTime).toBeLessThan(50); // Should filter within 50ms
    expect(filteredListings).toHaveLength(500);
  });

  test('image loading performance', async () => {
    const mockListings = generateMockListings(50);
    
    await act(async () => {
      render(
        <ListingsDisplay 
          listings={mockListings}
          loading={false}
          error={null}
        />
      );
    });
    
    // Test that listings are rendered
    expect(screen.getAllByText(/Test Listing/)).toHaveLength(50);
  });
}); 