export interface Listing {
  id: number
  title: string
  price: string
  location: string
  description: string
  category: string
  subcategory: string
  isPremium: boolean
  premiumUntil: Date | null
  features: string[]
  imageUrl: string
  seller: {
    id: string
    name: string
    email: string
    phone: string
  }
  createdAt: Date
  views: number
  condition: string
  brand: string
  model: string
  year: number
}

export const listings: Listing[] = [] 