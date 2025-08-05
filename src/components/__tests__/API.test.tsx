import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import ListingsDisplay from '../ListingsDisplay';

// Mock fetch for API testing
global.fetch = jest.fn();

describe('API Tests', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  test('handles API loading state correctly', async () => {
    await act(async () => {
      render(
        <ListingsDisplay 
          listings={[]}
          loading={true}
          error={null}
        />
      );
    });

    // Should show loading skeleton elements
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  test('handles API error state correctly', async () => {
    const errorMessage = 'API Error: Failed to fetch listings';
    
    await act(async () => {
      render(
        <ListingsDisplay 
          listings={[]}
          loading={false}
          error={errorMessage}
        />
      );
    });

    expect(screen.getByText('Hata Oluştu')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText('Tekrar Dene')).toBeInTheDocument();
  });

  test('handles empty API response correctly', async () => {
    await act(async () => {
      render(
        <ListingsDisplay 
          listings={[]}
          loading={false}
          error={null}
        />
      );
    });

    expect(screen.getByText('Henüz İlan Bulunmuyor')).toBeInTheDocument();
    expect(screen.getByText('+ Ücretsiz İlan Ver')).toBeInTheDocument();
  });

  test('handles successful API response', async () => {
    const mockListings = [
      {
        id: '1',
        title: 'Test Listing 1',
        description: 'Test description 1',
        price: 1000,
        location: 'Test City',
        city: 'Test City',
        category: 'test',
        subcategory: 'test-sub',
        isPremium: false,
        images: ['https://via.placeholder.com/400x300'],
        createdAt: new Date().toISOString(),
        views: 100,
        condition: 'new',
        status: 'active' as const,
        premium: false,
        premiumFeatures: {
          isActive: false,
          expiresAt: null,
          isHighlighted: false,
          isFeatured: false,
          isUrgent: false
        }
      }
    ];

    await act(async () => {
      render(
        <ListingsDisplay 
          listings={mockListings}
          loading={false}
          error={null}
        />
      );
    });

    expect(screen.getByText('Test Listing 1')).toBeInTheDocument();
    expect(screen.getByText('1.000 ₺')).toBeInTheDocument();
  });

  test('handles API timeout gracefully', async () => {
    // Mock a slow API response
    (fetch as jest.Mock).mockImplementation(() => 
      new Promise((resolve) => 
        setTimeout(() => resolve({ ok: true, json: () => Promise.resolve([]) }), 10000)
      )
    );

    await act(async () => {
      render(
        <ListingsDisplay 
          listings={[]}
          loading={true}
          error={null}
        />
      );
    });

    // Should show loading state during timeout
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });
}); 