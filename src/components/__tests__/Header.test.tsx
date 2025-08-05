import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Header from '../Header'
import { mockUser } from '@/lib/test-utils'

// Mock useAuth hook
jest.mock('@/components/Providers', () => ({
  useAuth: () => ({
    session: null,
    setSession: jest.fn(),
    isLoading: false,
  }),
}))

// Mock fetch
global.fetch = jest.fn()

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ unreadCount: 0, totalNotifications: 0 }),
    })
  })

  it('should render logo and navigation', () => {
    render(<Header />)
    
    expect(screen.getByText('Alo17')).toBeInTheDocument()
    expect(screen.getByTitle('Menüyü Aç')).toBeInTheDocument()
  })

  it('should render language switcher', () => {
    render(<Header />)
    
    expect(screen.getByRole('button', { name: /türkçe/i })).toBeInTheDocument()
  })

  it('should render premium link', () => {
    render(<Header />)
    
    const premiumLink = screen.getByRole('link', { name: /premium/i })
    expect(premiumLink).toBeInTheDocument()
    expect(premiumLink).toHaveAttribute('href', '/premium-ozellikler')
  })

  it('should render "İlan Ver" link', () => {
    render(<Header />)
    
    const ilanVerLink = screen.getByRole('link', { name: /ücretsiz ilan ver/i })
    expect(ilanVerLink).toBeInTheDocument()
    expect(ilanVerLink).toHaveAttribute('href', '/ilan-ver')
  })

  it('should render advanced search link', () => {
    render(<Header />)
    
    const advancedSearchLink = screen.getByRole('link', { name: /gelişmiş/i })
    expect(advancedSearchLink).toBeInTheDocument()
    expect(advancedSearchLink).toHaveAttribute('href', '/gelismis-arama')
  })

  it('should toggle mobile menu when hamburger is clicked', () => {
    render(<Header />)
    
    const hamburgerButton = screen.getByTitle('Menüyü Aç')
    fireEvent.click(hamburgerButton)
    
    // Mobile menu should be visible
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('should fetch notification count for authenticated user', async () => {
    // Mock authenticated user
    jest.doMock('@/components/Providers', () => ({
      useAuth: () => ({
        session: { user: mockUser },
        setSession: jest.fn(),
        isLoading: false,
      }),
    }))

    render(<Header />)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/notifications/unread/count')
      )
    })
  })

  it('should display notification count badge', async () => {
    // Mock authenticated user with notifications
    jest.doMock('@/components/Providers', () => ({
      useAuth: () => ({
        session: { user: mockUser },
        setSession: jest.fn(),
        isLoading: false,
      }),
    }))

    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ unreadCount: 5, totalNotifications: 10 }),
    })

    render(<Header />)
    
    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })

  it('should display "99+" for high notification counts', async () => {
    // Mock authenticated user with many notifications
    jest.doMock('@/components/Providers', () => ({
      useAuth: () => ({
        session: { user: mockUser },
        setSession: jest.fn(),
        isLoading: false,
      }),
    }))

    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ unreadCount: 150, totalNotifications: 200 }),
    })

    render(<Header />)
    
    await waitFor(() => {
      expect(screen.getByText('99+')).toBeInTheDocument()
    })
  })

  it('should handle notification fetch errors gracefully', async () => {
    // Mock authenticated user
    jest.doMock('@/components/Providers', () => ({
      useAuth: () => ({
        session: { user: mockUser },
        setSession: jest.fn(),
        isLoading: false,
      }),
    }))

    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    render(<Header />)
    
    // Should not crash and should still render
    expect(screen.getByText('Alo17')).toBeInTheDocument()
  })

  it('should render user-specific links when authenticated', () => {
    // Mock authenticated user
    jest.doMock('@/components/Providers', () => ({
      useAuth: () => ({
        session: { user: mockUser },
        setSession: jest.fn(),
        isLoading: false,
      }),
    }))

    render(<Header />)
    
    expect(screen.getByRole('link', { name: /bildirimler/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /mesajlarım/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /rapor gönder/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /mesajlaşma/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /analitikler/i })).toBeInTheDocument()
  })

  it('should not render user-specific links when not authenticated', () => {
    render(<Header />)
    
    expect(screen.queryByRole('link', { name: /bildirimler/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /mesajlarım/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /rapor gönder/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /mesajlaşma/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /analitikler/i })).not.toBeInTheDocument()
  })

  it('should show loading state when auth is loading', () => {
    // Mock loading state
    jest.doMock('@/components/Providers', () => ({
      useAuth: () => ({
        session: null,
        setSession: jest.fn(),
        isLoading: true,
      }),
    }))

    render(<Header />)
    
    // Should still render basic elements
    expect(screen.getByText('Alo17')).toBeInTheDocument()
  })

  it('should have correct accessibility attributes', () => {
    render(<Header />)
    
    const hamburgerButton = screen.getByTitle('Menüyü Aç')
    expect(hamburgerButton).toHaveAttribute('aria-label', 'Menüyü Aç')
    
    const logo = screen.getByRole('link', { name: /alo17/i })
    expect(logo).toHaveAttribute('href', '/')
  })

  it('should have responsive design classes', () => {
    render(<Header />)
    
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('bg-white', 'border-b', 'shadow-sm', 'sticky', 'top-0', 'z-50')
    
    const container = header.querySelector('.max-w-7xl')
    expect(container).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8')
  })
}) 