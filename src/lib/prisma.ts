// Netlify'da çalışması için mock Prisma client
// Gerçek Prisma client yerine JSON dosyaları kullanılacak

import { promises as fs } from 'fs';
import path from 'path';

// Mock Prisma client
class MockPrismaClient {
  async $connect() {
    console.log('Mock Prisma connected');
  }

  async $disconnect() {
    console.log('Mock Prisma disconnected');
  }

  async $queryRaw(query: string) {
    console.log('Mock query:', query);
    return [{ current_time: new Date() }];
  }

  // Mock models
  user = {
    findMany: async () => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'users.json'), 'utf-8');
        return JSON.parse(data);
      } catch {
        return [];
      }
    },
    findUnique: async (params: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'users.json'), 'utf-8');
        const users = JSON.parse(data);
        return users.find((user: any) => user.id === params.where.id || user.email === params.where.email);
      } catch {
        return null;
      }
    },
    create: async (params: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'users.json'), 'utf-8');
        const users = JSON.parse(data);
        const newUser = { ...params.data, id: Date.now().toString() };
        users.push(newUser);
        await fs.writeFile(path.join(process.cwd(), 'public', 'users.json'), JSON.stringify(users, null, 2));
        return newUser;
      } catch {
        return null;
      }
    }
  };

  listing = {
    findMany: async () => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'listings.json'), 'utf-8');
        return JSON.parse(data);
      } catch {
        return [];
      }
    },
    findUnique: async (params: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'listings.json'), 'utf-8');
        const listings = JSON.parse(data);
        return listings.find((listing: any) => listing.id === params.where.id);
      } catch {
        return null;
      }
    },
    create: async (params: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'listings.json'), 'utf-8');
        const listings = JSON.parse(data);
        const newListing = { ...params.data, id: Date.now() };
        listings.push(newListing);
        await fs.writeFile(path.join(process.cwd(), 'public', 'listings.json'), JSON.stringify(listings, null, 2));
        return newListing;
      } catch {
        return null;
      }
    },
    update: async (params: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'listings.json'), 'utf-8');
        const listings = JSON.parse(data);
        const index = listings.findIndex((listing: any) => listing.id === params.where.id);
        if (index !== -1) {
          listings[index] = { ...listings[index], ...params.data };
          await fs.writeFile(path.join(process.cwd(), 'public', 'listings.json'), JSON.stringify(listings, null, 2));
          return listings[index];
        }
        return null;
      } catch {
        return null;
      }
    },
    delete: async (params: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'listings.json'), 'utf-8');
        const listings = JSON.parse(data);
        const filteredListings = listings.filter((listing: any) => listing.id !== params.where.id);
        await fs.writeFile(path.join(process.cwd(), 'public', 'listings.json'), JSON.stringify(filteredListings, null, 2));
        return { id: params.where.id };
      } catch {
        return null;
      }
    }
  };

  category = {
    findMany: async () => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'categories.json'), 'utf-8');
        return JSON.parse(data);
      } catch {
        return [];
      }
    }
  };
}

const globalForPrisma = globalThis as unknown as {
  prisma: MockPrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new MockPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 