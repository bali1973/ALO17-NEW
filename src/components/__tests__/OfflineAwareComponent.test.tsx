import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { OfflineAwareComponent } from '../OfflineAwareComponent';
import { useOfflineData } from '@/hooks/useOfflineData';
import '@testing-library/jest-dom';

// Mock useOfflineData hook
jest.mock('@/hooks/useOfflineData', () => ({
  useOfflineData: jest.fn(),
}));

describe('OfflineAwareComponent', () => {
  const mockProps = {
    storeName: 'listings' as const,
    storeKey: 'test-key',
    fetchData: jest.fn(),
    children: (data: any) => <div>{data ? 'Data loaded' : 'No data'}</div>,
  };

  beforeEach(() => {
    (useOfflineData as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      isOnline: true,
      updateData: jest.fn(),
      removeData: jest.fn(),
    });
  });

  it('shows loading state', () => {
    (useOfflineData as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      isOnline: true,
      updateData: jest.fn(),
      removeData: jest.fn(),
    });

    render(<OfflineAwareComponent {...mockProps} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error state', () => {
    (useOfflineData as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Test error'),
      isOnline: true,
      updateData: jest.fn(),
      removeData: jest.fn(),
    });

    render(<OfflineAwareComponent {...mockProps} />);
    expect(screen.getByText(/bir hata oluştu/i)).toBeInTheDocument();
  });

  it('shows offline state', () => {
    (useOfflineData as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      isOnline: false,
      updateData: jest.fn(),
      removeData: jest.fn(),
    });

    render(<OfflineAwareComponent {...mockProps} />);
    expect(screen.getByText(/çevrimdışı mod/i)).toBeInTheDocument();
  });

  it('renders children with data', () => {
    (useOfflineData as jest.Mock).mockReturnValue({
      data: { test: 'data' },
      isLoading: false,
      error: null,
      isOnline: true,
      updateData: jest.fn(),
      removeData: jest.fn(),
    });

    render(<OfflineAwareComponent {...mockProps} />);
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });

  it('renders children without data', () => {
    (useOfflineData as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      isOnline: true,
      updateData: jest.fn(),
      removeData: jest.fn(),
    });

    render(<OfflineAwareComponent {...mockProps} />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });
}); 