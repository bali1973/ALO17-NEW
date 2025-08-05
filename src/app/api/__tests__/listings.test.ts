import { NextRequest } from 'next/server'
import { GET, POST } from '../listings/route'
import { promises as fs } from 'fs'
import path from 'path'

// Mock fs module
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}))

const mockFs = fs as jest.Mocked<typeof fs>

describe('Listings API', () => {
  const LISTINGS_PATH = path.join(process.cwd(), 'public', 'listings.json')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/listings', () => {
    it('should return all listings when no filters provided', async () => {
      const mockListings = [
        {
          id: '1',
          title: 'Test İlan 1',
          price: 1000,
          status: 'active',
        },
        {
          id: '2',
          title: 'Test İlan 2',
          price: 2000,
          status: 'active',
        },
      ]

      mockFs.readFile.mockResolvedValue(JSON.stringify(mockListings))

      const request = new NextRequest('http://localhost:3000/api/listings')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.listings).toHaveLength(2)
      expect(data.listings[0].title).toBe('Test İlan 1')
    })

    it('should filter listings by category', async () => {
      const mockListings = [
        {
          id: '1',
          title: 'Test İlan 1',
          category: 'elektronik',
          status: 'active',
        },
        {
          id: '2',
          title: 'Test İlan 2',
          category: 'giyim',
          status: 'active',
        },
      ]

      mockFs.readFile.mockResolvedValue(JSON.stringify(mockListings))

      const request = new NextRequest('http://localhost:3000/api/listings?category=elektronik')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.listings).toHaveLength(1)
      expect(data.listings[0].category).toBe('elektronik')
    })

    it('should filter listings by price range', async () => {
      const mockListings = [
        {
          id: '1',
          title: 'Test İlan 1',
          price: 500,
          status: 'active',
        },
        {
          id: '2',
          title: 'Test İlan 2',
          price: 1500,
          status: 'active',
        },
        {
          id: '3',
          title: 'Test İlan 3',
          price: 2500,
          status: 'active',
        },
      ]

      mockFs.readFile.mockResolvedValue(JSON.stringify(mockListings))

      const request = new NextRequest('http://localhost:3000/api/listings?priceMin=1000&priceMax=2000')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.listings).toHaveLength(1)
      expect(data.listings[0].price).toBe(1500)
    })

    it('should search listings by title', async () => {
      const mockListings = [
        {
          id: '1',
          title: 'iPhone 13 Pro',
          status: 'active',
        },
        {
          id: '2',
          title: 'Samsung Galaxy',
          status: 'active',
        },
      ]

      mockFs.readFile.mockResolvedValue(JSON.stringify(mockListings))

      const request = new NextRequest('http://localhost:3000/api/listings?search=iPhone')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.listings).toHaveLength(1)
      expect(data.listings[0].title).toBe('iPhone 13 Pro')
    })

    it('should sort listings by price', async () => {
      const mockListings = [
        {
          id: '1',
          title: 'Test İlan 1',
          price: 3000,
          status: 'active',
        },
        {
          id: '2',
          title: 'Test İlan 2',
          price: 1000,
          status: 'active',
        },
        {
          id: '3',
          title: 'Test İlan 3',
          price: 2000,
          status: 'active',
        },
      ]

      mockFs.readFile.mockResolvedValue(JSON.stringify(mockListings))

      const request = new NextRequest('http://localhost:3000/api/listings?sortBy=price')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.listings[0].price).toBe(1000)
      expect(data.listings[1].price).toBe(2000)
      expect(data.listings[2].price).toBe(3000)
    })

    it('should handle file read errors gracefully', async () => {
      mockFs.readFile.mockRejectedValue(new Error('File not found'))

      const request = new NextRequest('http://localhost:3000/api/listings')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.listings).toEqual([])
    })
  })

  describe('POST /api/listings', () => {
    it('should create a new listing', async () => {
      const mockListings = []
      const newListing = {
        title: 'New Test İlan',
        description: 'Test description',
        price: 1000,
        category: 'elektronik',
        location: 'İstanbul',
        userId: 'user1',
      }

      mockFs.readFile.mockResolvedValue(JSON.stringify(mockListings))
      mockFs.writeFile.mockResolvedValue(undefined)

      const request = new NextRequest('http://localhost:3000/api/listings', {
        method: 'POST',
        body: JSON.stringify(newListing),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.listing.title).toBe('New Test İlan')
      expect(data.listing.id).toBeDefined()
      expect(data.listing.status).toBe('pending')
      expect(data.listing.createdAt).toBeDefined()

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        LISTINGS_PATH,
        expect.stringContaining('New Test İlan'),
        'utf-8'
      )
    })

    it('should validate required fields', async () => {
      const invalidListing = {
        description: 'Test description',
        price: 1000,
      }

      const request = new NextRequest('http://localhost:3000/api/listings', {
        method: 'POST',
        body: JSON.stringify(invalidListing),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('title')
    })

    it('should validate price is positive', async () => {
      const invalidListing = {
        title: 'Test İlan',
        description: 'Test description',
        price: -100,
        category: 'elektronik',
        location: 'İstanbul',
        userId: 'user1',
      }

      const request = new NextRequest('http://localhost:3000/api/listings', {
        method: 'POST',
        body: JSON.stringify(invalidListing),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('price')
    })

    it('should handle file write errors gracefully', async () => {
      const mockListings = []
      const newListing = {
        title: 'New Test İlan',
        description: 'Test description',
        price: 1000,
        category: 'elektronik',
        location: 'İstanbul',
        userId: 'user1',
      }

      mockFs.readFile.mockResolvedValue(JSON.stringify(mockListings))
      mockFs.writeFile.mockRejectedValue(new Error('Write failed'))

      const request = new NextRequest('http://localhost:3000/api/listings', {
        method: 'POST',
        body: JSON.stringify(newListing),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toContain('oluşturulamadı')
    })
  })
}) 