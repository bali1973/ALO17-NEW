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
    findMany: async (params?: any) => {
      try {
        console.log('Mock Prisma findMany called with params:', params);
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'users.json'), 'utf-8');
        let users = JSON.parse(data);
        console.log('Total users loaded in findMany:', users.length);
        
        // Filtreleme işlemleri
        if (params?.where) {
          const where = params.where;
          console.log('Applying filters in findMany:', where);
          
          if (where.OR) {
            users = users.filter((user: any) => 
              where.OR.some((condition: any) => {
                if (condition.name?.contains) {
                  return user.name?.toLowerCase().includes(condition.name.contains.toLowerCase());
                }
                if (condition.email?.contains) {
                  return user.email?.toLowerCase().includes(condition.email.contains.toLowerCase());
                }
                return false;
              })
            );
          }
          if (where.role) {
            users = users.filter((user: any) => user.role === where.role);
          }
          if (where.status) {
            users = users.filter((user: any) => user.status === where.status);
          }
        }
        
        // Sıralama
        if (params?.orderBy?.createdAt === 'desc') {
          users.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (params?.orderBy?.createdAt === 'asc') {
          users.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        }
        
        // Sayfalama - skip ve take parametrelerini kontrol et
        if (params?.skip !== undefined && params?.take !== undefined) {
          const skip = parseInt(params.skip) || 0;
          const take = parseInt(params.take) || 10;
          console.log('Applying pagination - skip:', skip, 'take:', take);
          users = users.slice(skip, skip + take);
        }
        
        console.log('Users returned from findMany:', users.length);
        return users;
      } catch (error) {
        console.error('Mock Prisma findMany error:', error);
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
    count: async (params?: any) => {
      try {
        console.log('Mock Prisma count called with params:', params);
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'users.json'), 'utf-8');
        let users = JSON.parse(data);
        console.log('Total users loaded:', users.length);
        
        // Filtreleme işlemleri
        if (params?.where) {
          const where = params.where;
          console.log('Applying filters:', where);
          
          if (where.OR) {
            users = users.filter((user: any) => 
              where.OR.some((condition: any) => {
                if (condition.name?.contains) {
                  return user.name?.toLowerCase().includes(condition.name.contains.toLowerCase());
                }
                if (condition.email?.contains) {
                  return user.email?.toLowerCase().includes(condition.email.contains.toLowerCase());
                }
                return false;
              })
            );
          }
          if (where.role) {
            users = users.filter((user: any) => user.role === where.role);
          }
          if (where.status) {
            users = users.filter((user: any) => user.status === where.status);
          }
        }
        
        console.log('Users after filtering:', users.length);
        return users.length;
      } catch (error) {
        console.error('Mock Prisma count error:', error);
        return 0;
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

  notificationSubscription = {
    findFirst: async (params?: any) => {
      try {
        console.log('Mock Prisma notificationSubscription.findFirst called with params:', params);
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'notificationSubscriptions.json'), 'utf-8');
        const subscriptions = JSON.parse(data);
        
        if (params?.where) {
          const where = params.where;
          return subscriptions.find((sub: any) => {
            if (where.email && sub.email !== where.email) return false;
            if (where.category && sub.category !== where.category) return false;
            if (where.subcategory && sub.subcategory !== where.subcategory) return false;
            return true;
          });
        }
        
        return subscriptions[0] || null;
      } catch (error) {
        console.error('Mock Prisma notificationSubscription.findFirst error:', error);
        return null;
      }
    },
    findMany: async (params?: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'notificationSubscriptions.json'), 'utf-8');
        return JSON.parse(data);
      } catch {
        return [];
      }
    },
    create: async (params: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'notificationSubscriptions.json'), 'utf-8');
        const subscriptions = JSON.parse(data);
        const newSubscription = { ...params.data, id: Date.now().toString() };
        subscriptions.push(newSubscription);
        await fs.writeFile(path.join(process.cwd(), 'public', 'notificationSubscriptions.json'), JSON.stringify(subscriptions, null, 2));
        return newSubscription;
      } catch {
        return null;
      }
    },
    delete: async (params: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'notificationSubscriptions.json'), 'utf-8');
        let subscriptions = JSON.parse(data);
        subscriptions = subscriptions.filter((sub: any) => {
          if (params?.where?.email && sub.email !== params.where.email) return true;
          if (params?.where?.category && sub.category !== params.where.category) return true;
          if (params?.where?.subcategory && sub.subcategory !== params.where.subcategory) return true;
          return false;
        });
        await fs.writeFile(path.join(process.cwd(), 'public', 'notificationSubscriptions.json'), JSON.stringify(subscriptions, null, 2));
        return { count: 1 };
      } catch {
        return { count: 0 };
      }
    }
  };

  listing = {
    findMany: async (params?: { where?: { category?: string; subcategory?: string }; orderBy?: { createdAt: 'desc' | 'asc' } }) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'listings.json'), 'utf-8');
        let listings = JSON.parse(data);

        const where = params?.where;
        if (where) {
          if (where.category) {
            listings = listings.filter((listing: any) => listing.category === where.category);
          }
          if (where.subcategory) {
            listings = listings.filter((listing: any) => listing.subcategory === where.subcategory);
          }
        }

        if (params?.orderBy?.createdAt === 'desc') {
          listings.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (params?.orderBy?.createdAt === 'asc') {
          listings.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        }

        return listings;
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
        console.log('Reading categories.json...');
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'categories.json'), 'utf-8');
        console.log('Categories data loaded successfully');
        return JSON.parse(data);
      } catch (error) {
        console.error('Error reading categories.json:', error);
        return [];
      }
    },
    findUnique: async (params: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'categories.json'), 'utf-8');
        const categories = JSON.parse(data);
        return categories.find((category: any) => category.slug === params.where.slug);
      } catch {
        return null;
      }
    },
    create: async (params: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'categories.json'), 'utf-8');
        const categories = JSON.parse(data);
        const newCategory = { ...params.data, id: Date.now().toString(), subCategories: [] };
        categories.push(newCategory);
        await fs.writeFile(path.join(process.cwd(), 'public', 'categories.json'), JSON.stringify(categories, null, 2));
        return newCategory;
      } catch {
        return null;
      }
    },
    update: async (params: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'categories.json'), 'utf-8');
        const categories = JSON.parse(data);
        const index = categories.findIndex((category: any) => category.id === params.where.id);
        if (index !== -1) {
          categories[index] = { ...categories[index], ...params.data };
          await fs.writeFile(path.join(process.cwd(), 'public', 'categories.json'), JSON.stringify(categories, null, 2));
          return categories[index];
        }
        return null;
      } catch {
        return null;
      }
    },
    delete: async (params: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'categories.json'), 'utf-8');
        const categories = JSON.parse(data);
        const filteredCategories = categories.filter((category: any) => category.id !== params.where.id);
        await fs.writeFile(path.join(process.cwd(), 'public', 'categories.json'), JSON.stringify(filteredCategories, null, 2));
        return { id: params.where.id };
      } catch {
        return null;
      }
    }
  };

  report = {
    findMany: async (params?: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'raporlar.json'), 'utf-8');
        const reports = JSON.parse(data);
        
        // Sıralama
        if (params?.orderBy?.createdAt === 'desc') {
          reports.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        
        return reports;
      } catch (error) {
        console.error('Mock Prisma report findMany error:', error);
        return [];
      }
    },
    findUnique: async (params: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'raporlar.json'), 'utf-8');
        const reports = JSON.parse(data);
        return reports.find((report: any) => report.id === params.where.id);
      } catch {
        return null;
      }
    },
         create: async (params: any) => {
       try {
         console.log('Mock Prisma report.create called with:', params);
         console.log('Params data:', params.data);
         
         const data = await fs.readFile(path.join(process.cwd(), 'public', 'raporlar.json'), 'utf-8');
         console.log('Existing reports loaded:', data.length);
         
         const reports = JSON.parse(data);
         console.log('Parsed reports count:', reports.length);
         
         const newReport = { 
           ...params.data, 
           id: Date.now().toString(),
           createdAt: new Date().toISOString(),
           updatedAt: new Date().toISOString()
         };
         console.log('New report data:', newReport);
         
         reports.push(newReport);
         console.log('Report added to array, new count:', reports.length);
         
         await fs.writeFile(path.join(process.cwd(), 'public', 'raporlar.json'), JSON.stringify(reports, null, 2));
         console.log('Report saved successfully to file');
         
         return newReport;
       } catch (error) {
         console.error('Mock Prisma report.create error:', error);
         console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
         return null;
       }
     },
    update: async (params: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'raporlar.json'), 'utf-8');
        const reports = JSON.parse(data);
        const reportIndex = reports.findIndex((report: any) => report.id === params.where.id);
        if (reportIndex !== -1) {
          reports[reportIndex] = { 
            ...reports[reportIndex], 
            ...params.data,
            updatedAt: new Date().toISOString()
          };
          await fs.writeFile(path.join(process.cwd(), 'public', 'raporlar.json'), JSON.stringify(reports, null, 2));
          return reports[reportIndex];
        }
        return null;
      } catch {
        return null;
      }
    },
    updateMany: async (params: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'raporlar.json'), 'utf-8');
        let reports = JSON.parse(data);
        
        if (params.data.status) {
          reports = reports.map((report: any) => ({
            ...report,
            status: params.data.status,
            updatedAt: new Date().toISOString()
          }));
          await fs.writeFile(path.join(process.cwd(), 'public', 'raporlar.json'), JSON.stringify(reports, null, 2));
        }
        
        return { count: reports.length };
      } catch {
        return { count: 0 };
      }
    },
    delete: async (params: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'raporlar.json'), 'utf-8');
        const reports = JSON.parse(data);
        const filteredReports = reports.filter((report: any) => report.id !== params.where.id);
        await fs.writeFile(path.join(process.cwd(), 'public', 'raporlar.json'), JSON.stringify(filteredReports, null, 2));
        return { id: params.where.id };
      } catch {
        return null;
      }
    }
  };

    subCategory = {
    findMany: async () => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'raporlar.json'), 'utf-8');
        const categories = JSON.parse(data);
        const allSubCategories: any[] = [];
        for (const category of categories) {
          if (category.subCategories) {
            allSubCategories.push(...category.subCategories);
          }
        }
        return allSubCategories;
      } catch {
        return [];
      }
    },
    findFirst: async (params: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'categories.json'), 'utf-8');
        const categories = JSON.parse(data);
        for (const category of categories) {
          const subCategory = category.subCategories.find((sub: any) => sub.slug === params.where.slug && sub.categoryId === params.where.categoryId);
          if (subCategory) return subCategory;
        }
        return null;
      } catch {
        return null;
      }
    },
    create: async (params: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'categories.json'), 'utf-8');
        const categories = JSON.parse(data);
        const categoryIndex = categories.findIndex((cat: any) => cat.id === params.data.categoryId);
        if (categoryIndex !== -1) {
          const newSubCategory = { ...params.data, id: Date.now().toString() };
          categories[categoryIndex].subCategories.push(newSubCategory);
          await fs.writeFile(path.join(process.cwd(), 'public', 'categories.json'), JSON.stringify(categories, null, 2));
          return newSubCategory;
        }
        return null;
      } catch {
        return null;
      }
    },
    update: async (params: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'categories.json'), 'utf-8');
        const categories = JSON.parse(data);
        for (const category of categories) {
          const subCategoryIndex = category.subCategories.findIndex((sub: any) => sub.id === params.where.id);
          if (subCategoryIndex !== -1) {
            category.subCategories[subCategoryIndex] = { ...category.subCategories[subCategoryIndex], ...params.data };
            await fs.writeFile(path.join(process.cwd(), 'public', 'categories.json'), JSON.stringify(categories, null, 2));
            return category.subCategories[subCategoryIndex];
          }
        }
        return null;
      } catch {
        return null;
      }
    },
    delete: async (params: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'categories.json'), 'utf-8');
        const categories = JSON.parse(data);
        for (const category of categories) {
          const subCategoryIndex = category.subCategories.findIndex((sub: any) => sub.id === params.where.id);
          if (subCategoryIndex !== -1) {
            category.subCategories.splice(subCategoryIndex, 1);
            await fs.writeFile(path.join(process.cwd(), 'public', 'categories.json'), JSON.stringify(categories, null, 2));
            return { id: params.where.id };
          }
        }
        return null;
      } catch {
        return null;
      }
    }
  };

  message = {
    findMany: async (params?: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'messages.json'), 'utf-8');
        let messages = JSON.parse(data);

        const where = params?.where;
        if (where) {
          if (where.type) {
            messages = messages.filter((message: any) => message.type === where.type);
          }
          if (where.listingId) {
            messages = messages.filter((message: any) => message.listingId === where.listingId);
          }
          if (where.receiver) {
            messages = messages.filter((message: any) => message.receiver === where.receiver);
          }
        }

        if (params?.orderBy?.date === 'desc') {
          messages.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }

        return messages;
      } catch {
        return [];
      }
    },
    findUnique: async (params: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'messages.json'), 'utf-8');
        const messages = JSON.parse(data);
        return messages.find((message: any) => message.id === params.where.id);
      } catch {
        return null;
      }
    },
    create: async (params: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'messages.json'), 'utf-8');
        const messages = JSON.parse(data);
        const newMessage = { 
          ...params.data, 
          id: Date.now().toString(),
          date: params.data.date || new Date().toISOString(),
          isRead: params.data.isRead || false
        };
        messages.push(newMessage);
        await fs.writeFile(path.join(process.cwd(), 'public', 'messages.json'), JSON.stringify(messages, null, 2));
        return newMessage;
      } catch {
        return null;
      }
    },
    update: async (params: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'messages.json'), 'utf-8');
        const messages = JSON.parse(data);
        const index = messages.findIndex((message: any) => message.id === params.where.id);
        if (index !== -1) {
          messages[index] = { ...messages[index], ...params.data };
          await fs.writeFile(path.join(process.cwd(), 'public', 'messages.json'), JSON.stringify(messages, null, 2));
          return messages[index];
        }
        return null;
      } catch {
        return null;
      }
    },
    delete: async (params: any) => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'public', 'public', 'messages.json'), 'utf-8');
        const messages = JSON.parse(data);
        const filteredMessages = messages.filter((message: any) => message.id !== params.where.id);
        await fs.writeFile(path.join(process.cwd(), 'public', 'messages.json'), JSON.stringify(filteredMessages, null, 2));
        return { id: params.where.id };
      } catch {
        return null;
      }
    }
  };
}

const globalForPrisma = globalThis as unknown as {
  prisma: MockPrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new MockPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 