import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchComponent } from '../SearchComponent';
import { useCategories } from '@/lib/useCategories';
import '@testing-library/jest-dom';

// Mock useCategories hook
jest.mock('@/lib/useCategories', () => ({
  useCategories: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        success: true,
        results: [
          {
            id: '1',
            title: 'Test İlan',
            description: 'Test Açıklama',
            price: 1000,
            category: 'elektronik',
            subcategory: 'telefon',
            condition: 'new',
            city: 'İstanbul',
            isPremium: false,
            createdAt: new Date(),
            views: 0,
            imageUrl: '/test.jpg',
            score: 1,
          },
        ],
      }),
  })
) as jest.Mock;

describe('SearchComponent', () => {
  const mockCategories = [
    { slug: 'elektronik', name: 'Elektronik' },
    { slug: 'emlak', name: 'Emlak' },
  ];

  beforeEach(() => {
    (useCategories as jest.Mock).mockReturnValue({
      categories: mockCategories,
      loading: false,
      error: null,
    });
    (global.fetch as jest.Mock).mockClear();
  });

  it('shows loading state during search', async () => {
    render(<SearchComponent />);

    const searchInput = screen.getByPlaceholderText('Ne aramıştınız?');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  it('displays search results', async () => {
    render(<SearchComponent />);

    const searchInput = screen.getByPlaceholderText('Ne aramıştınız?');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    await waitFor(() => {
      expect(screen.getByText('Test İlan')).toBeInTheDocument();
      expect(screen.getByText('Test Açıklama')).toBeInTheDocument();
      expect(screen.getByText('1.000 ₺')).toBeInTheDocument();
    });
  });

  it('shows no results message when search returns empty', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            results: [],
          }),
      })
    );

    render(<SearchComponent />);

    const searchInput = screen.getByPlaceholderText('Ne aramıştınız?');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    await waitFor(() => {
      expect(screen.getByText('Sonuç bulunamadı')).toBeInTheDocument();
    });
  });

  it('applies filters correctly', async () => {
    render(<SearchComponent />);

    // Open filters
    const filterButton = screen.getByRole('button', { name: /filtre/i });
    fireEvent.click(filterButton);

    // Select category
    const categorySelect = screen.getByLabelText('Kategori');
    fireEvent.change(categorySelect, { target: { value: 'elektronik' } });

    // Set price range
    const minPriceInput = screen.getByPlaceholderText('Min');
    fireEvent.change(minPriceInput, { target: { value: '500' } });

    const maxPriceInput = screen.getByPlaceholderText('Max');
    fireEvent.change(maxPriceInput, { target: { value: '2000' } });

    // Select condition
    const conditionSelect = screen.getByLabelText('Durum');
    fireEvent.change(conditionSelect, { target: { value: 'new' } });

    // Enter city
    const cityInput = screen.getByPlaceholderText('Şehir ara...');
    fireEvent.change(cityInput, { target: { value: 'İstanbul' } });

    // Check premium only
    const premiumCheckbox = screen.getByLabelText('Sadece Premium İlanlar');
    fireEvent.click(premiumCheckbox);

    // Select sort option
    const sortSelect = screen.getByLabelText('Sıralama');
    fireEvent.change(sortSelect, { target: { value: 'price_asc' } });

    // Trigger search
    const searchInput = screen.getByPlaceholderText('Ne aramıştınız?');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    await waitFor(() => {
      const fetchCalls = (global.fetch as jest.Mock).mock.calls;
      const lastCall = fetchCalls[fetchCalls.length - 1][0];
      expect(lastCall).toContain('q=test');
      expect(lastCall).toContain('category=elektronik');
      expect(lastCall).toContain('minPrice=500');
      expect(lastCall).toContain('maxPrice=2000');
      expect(lastCall).toContain('condition=new');
      expect(lastCall).toContain('city=%C4%B0stanbul'); // İstanbul'un URL-encoded hali
      expect(lastCall).toContain('premiumOnly=true');
      expect(lastCall).toContain('sortBy=price_asc');
    });
  });

  it('clears filters when clear button is clicked', async () => {
    render(<SearchComponent />);

    // Open filters
    const filterButton = screen.getByRole('button', { name: /filtre/i });
    fireEvent.click(filterButton);

    // Set some filters
    const categorySelect = screen.getByLabelText('Kategori');
    fireEvent.change(categorySelect, { target: { value: 'elektronik' } });

    const minPriceInput = screen.getByPlaceholderText('Min');
    fireEvent.change(minPriceInput, { target: { value: '500' } });

    // Clear filters
    const clearButton = screen.getByText('Filtreleri Temizle');
    fireEvent.click(clearButton);

    await waitFor(() => {
      // Filtre değerlerinin sıfırlandığını kontrol et
      expect(categorySelect).toHaveValue('');
      expect(minPriceInput).toHaveValue('');
      
      // API çağrısını kontrol et
      const fetchCalls = (global.fetch as jest.Mock).mock.calls;
      const lastCall = fetchCalls[fetchCalls.length - 1][0];
      expect(lastCall).not.toContain('category=');
      expect(lastCall).not.toContain('minPrice=');
    });
  });
}); 