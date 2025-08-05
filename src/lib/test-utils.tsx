import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'

// Test wrapper component
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      {children}
    </ThemeProvider>
  )
}

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Mock data generators
export const mockListing = {
  id: '1',
  title: 'Test İlan',
  description: 'Test açıklama',
  price: 1000,
  category: 'elektronik',
  subcategory: 'telefon',
  location: 'İstanbul',
  condition: 'yeni',
  images: ['/test-image.jpg'],
  userId: 'user1',
  status: 'active',
  views: 10,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
}

export const mockUser = {
  id: 'user1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  phone: '+905551234567',
  location: 'İstanbul',
  createdAt: '2024-01-01T00:00:00.000Z',
}

export const mockCategory = {
  id: '1',
  name: 'Elektronik',
  slug: 'elektronik',
  description: 'Elektronik ürünler',
  icon: 'phone',
  order: 1,
  isActive: true,
  subcategories: [
    {
      id: '1-1',
      name: 'Telefon',
      slug: 'telefon',
      description: 'Telefonlar',
      order: 1,
      isActive: true,
    },
  ],
}

export const mockMessage = {
  id: '1',
  senderId: 'user1',
  recipientId: 'user2',
  content: 'Test mesaj',
  listingId: '1',
  isRead: false,
  createdAt: '2024-01-01T00:00:00.000Z',
}

export const mockNotification = {
  id: '1',
  userId: 'user1',
  title: 'Test Bildirim',
  message: 'Test mesaj',
  type: 'message',
  isRead: false,
  createdAt: '2024-01-01T00:00:00.000Z',
}

// Mock API responses
export const mockApiResponse = {
  success: true,
  data: null,
  message: 'Success',
}

export const mockApiError = {
  success: false,
  error: 'Test error',
  message: 'Error occurred',
}

// Test utilities
export const waitForElementToBeRemoved = (element: HTMLElement) => {
  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      if (!document.contains(element)) {
        observer.disconnect()
        resolve(true)
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
  })
}

export const mockFetch = (response: any, status = 200) => {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
    })
  )
}

export const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

export const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

// Form testing utilities
export const fillForm = async (form: HTMLElement, data: Record<string, any>) => {
  const { fireEvent } = await import('@testing-library/react')
  
  Object.entries(data).forEach(([name, value]) => {
    const input = form.querySelector(`[name="${name}"]`) as HTMLInputElement
    if (input) {
      fireEvent.change(input, { target: { value } })
    }
  })
}

export const submitForm = async (form: HTMLElement) => {
  const { fireEvent } = await import('@testing-library/react')
  const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement
  if (submitButton) {
    fireEvent.click(submitButton)
  }
}

// Async utilities
export const waitFor = (callback: () => void, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    
    const check = () => {
      try {
        callback()
        resolve(true)
      } catch (error) {
        if (Date.now() - startTime > timeout) {
          reject(error)
        } else {
          setTimeout(check, 10)
        }
      }
    }
    
    check()
  })
}

// Export everything
export * from '@testing-library/react'
export { customRender as render } 