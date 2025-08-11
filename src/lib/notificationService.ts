import { prisma } from './prisma';
import { sendEmail } from './email';
import { promises as fs } from 'fs';
import path from 'path';

interface NotificationMatch {
  subscription: any;
  listing: any;
}

interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export class NotificationService {
  // Yeni ilan eklendiğinde çalışacak fonksiyon
  static async notifyNewListing(listing: any) {
    try {
      console.log(`Yeni ilan bildirimi gönderiliyor: ${listing.title}`);

      // Bu ilanla eşleşen abonelikleri bul
      const matchingSubscriptions = await this.findMatchingSubscriptions(listing);

      console.log(`${matchingSubscriptions.length} eşleşen abonelik bulundu`);

      // Her abonelik için bildirim gönder
      for (const match of matchingSubscriptions) {
        await this.sendNotification(match.subscription, match.listing);
      }

      return {
        success: true,
        notificationsSent: matchingSubscriptions.length
      };
    } catch (error) {
      console.error('Notification service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      };
    }
  }

  // İlanla eşleşen abonelikleri bul
  private static async findMatchingSubscriptions(listing: any): Promise<NotificationMatch[]> {
    const matches: NotificationMatch[] = [];

    try {
      // JSON dosyasından abonelikleri oku
      const subscriptionsPath = path.join(process.cwd(), 'public', 'notificationSubscriptions.json');
      const data = await fs.readFile(subscriptionsPath, 'utf-8');
      const subscriptions = JSON.parse(data);

      for (const subscription of subscriptions) {
        if (subscription.isActive && this.matchesSubscription(listing, subscription)) {
          matches.push({ subscription, listing });
        }
      }
    } catch (error) {
      console.error('Abonelikler okunamadı:', error);
    }

    return matches;
  }

  // İlanın abonelik kriterlerine uyup uymadığını kontrol et
  private static matchesSubscription(listing: any, subscription: any): boolean {
    // Kategori kontrolü
    if (subscription.category && listing.category !== subscription.category) {
      return false;
    }

    // Alt kategori kontrolü
    if (subscription.subcategory && listing.subcategory !== subscription.subcategory) {
      return false;
    }

    // Anahtar kelime kontrolü
    if (subscription.keywords) {
      try {
        const keywords = JSON.parse(subscription.keywords);
        if (keywords.length > 0) {
          const listingText = `${listing.title} ${listing.description}`.toLowerCase();
          const hasKeyword = keywords.some((keyword: string) => 
            listingText.includes(keyword.toLowerCase())
          );
          if (!hasKeyword) {
            return false;
          }
        }
      } catch (error) {
        console.error('Keywords parse error:', error);
      }
    }

    // Fiyat aralığı kontrolü
    if (subscription.priceRange) {
      try {
        const priceRange = JSON.parse(subscription.priceRange);
        if (priceRange.min && listing.price < priceRange.min) {
          return false;
        }
        if (priceRange.max && listing.price > priceRange.max) {
          return false;
        }
      } catch (error) {
        console.error('Price range parse error:', error);
      }
    }

    // Konum kontrolü
    if (subscription.location && listing.location) {
      const subscriptionLocation = subscription.location.toLowerCase();
      const listingLocation = listing.location.toLowerCase();
      if (!listingLocation.includes(subscriptionLocation)) {
        return false;
      }
    }

    return true;
  }

  // Bildirim gönder
  private static async sendNotification(subscription: any, listing: any) {
    try {
      // E-posta bildirimi gönder
      if (subscription.frequency === 'instant' && subscription.emailEnabled !== false) {
        await this.sendInstantNotification(subscription, listing);
      }

      // Push notification gönder
      if (subscription.pushEnabled !== false && subscription.pushToken) {
        await this.sendPushNotification(subscription, listing);
      }

      // In-app bildirim kaydet
      await this.saveInAppNotification(subscription, listing);

      // Bildirim geçmişini kaydet
      await this.saveNotificationHistory(subscription, listing);

      console.log(`Bildirim gönderildi: ${subscription.email} - ${listing.title}`);
    } catch (error) {
      console.error('Notification send error:', error);
    }
  }

  // Anında bildirim gönder
  private static async sendInstantNotification(subscription: any, listing: any) {
    const subject = `Yeni İlan: ${listing.title}`;
    
    const content = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Yeni İlan Bildirimi</h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #1e293b;">${listing.title}</h3>
          <p style="margin: 0 0 10px 0; color: #64748b;">${listing.description}</p>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
            <span style="font-size: 18px; font-weight: bold; color: #059669;">${listing.price.toLocaleString('tr-TR')} ₺</span>
            <span style="color: #64748b;">${listing.location}</span>
          </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXTAUTH_URL}/ilan/${listing.id}" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            İlanı Görüntüle
          </a>
        </div>
        
        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #64748b;">
          <p>Bu e-posta, ${subscription.category || 'tüm kategoriler'} kategorisindeki yeni ilanlardan haberdar olmak için abone olduğunuz için gönderilmiştir.</p>
          <p>Aboneliği iptal etmek için <a href="${process.env.NEXTAUTH_URL}/profil/bildirimler">profil sayfanızı</a> ziyaret edin.</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: subscription.email,
      subject: subject,
      html: content
    });
  }

  // Push notification gönder
  private static async sendPushNotification(subscription: any, listing: any) {
    try {
      const notification: PushNotification = {
        title: 'Yeni İlan',
        body: `${listing.title} - ${listing.price.toLocaleString('tr-TR')} ₺`,
        icon: '/icons/favicon-32x32.png',
        badge: '/icons/favicon-16x16.png',
        data: {
          url: `/ilan/${listing.id}`,
          listingId: listing.id,
          type: 'new_listing'
        },
        actions: [
          {
            action: 'view',
            title: 'Görüntüle',
            icon: '/icons/favicon-16x16.png'
          },
          {
            action: 'dismiss',
            title: 'Kapat'
          }
        ]
      };

      // Web Push API kullanarak bildirim gönder
      if (subscription.pushToken) {
        await this.sendWebPushNotification(subscription.pushToken, notification);
      }
    } catch (error) {
      console.error('Push notification error:', error);
    }
  }

  // Web Push notification gönder
  private static async sendWebPushNotification(token: string, notification: PushNotification) {
    try {
      // VAPID keys (gerçek uygulamada environment variables'dan alınmalı)
      const vapidKeys = {
        publicKey: process.env.VAPID_PUBLIC_KEY || 'your-public-key',
        privateKey: process.env.VAPID_PRIVATE_KEY || 'your-private-key'
      };

      // Web Push kütüphanesi kullanarak bildirim gönder
      // Bu kısım gerçek web-push kütüphanesi ile implement edilmeli
      console.log('Push notification gönderiliyor:', {
        token,
        notification
      });

      // Mock implementation - gerçek uygulamada web-push kütüphanesi kullanılmalı
      return true;
    } catch (error) {
      console.error('Web push notification error:', error);
      return false;
    }
  }

  // In-app bildirim kaydet
  private static async saveInAppNotification(subscription: any, listing: any) {
    try {
      const notificationsPath = path.join(process.cwd(), 'public', 'inAppNotifications.json');
      let notifications = [];
      
      try {
        const data = await fs.readFile(notificationsPath, 'utf-8');
        notifications = JSON.parse(data);
      } catch (error) {
        // Dosya yoksa boş array ile başla
        notifications = [];
      }

      const newNotification = {
        id: Date.now().toString(),
        userId: subscription.userId,
        email: subscription.email,
        type: 'new_listing',
        title: 'Yeni İlan',
        message: `${listing.title} - ${listing.price.toLocaleString('tr-TR')} ₺`,
        data: {
          listingId: listing.id,
          listingTitle: listing.title,
          listingPrice: listing.price,
          listingLocation: listing.location
        },
        isRead: false,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 gün sonra
      };

      notifications.unshift(newNotification);
      
      // Sadece son 100 bildirimi tut
      if (notifications.length > 100) {
        notifications = notifications.slice(0, 100);
      }

      await fs.writeFile(notificationsPath, JSON.stringify(notifications, null, 2));
    } catch (error) {
      console.error('In-app notification save error:', error);
    }
  }

  // Bildirim geçmişini kaydet
  private static async saveNotificationHistory(subscription: any, listing: any) {
    try {
      const historyPath = path.join(process.cwd(), 'public', 'notificationHistory.json');
      let history = [];
      
      try {
        const data = await fs.readFile(historyPath, 'utf-8');
        history = JSON.parse(data);
      } catch (error) {
        history = [];
      }

      const historyEntry = {
        id: Date.now().toString(),
        subscriptionId: subscription.id,
        listingId: listing.id,
        email: subscription.email,
        subject: `Yeni İlan: ${listing.title}`,
        content: `Yeni ilan bildirimi gönderildi: ${listing.title}`,
        sentAt: new Date().toISOString(),
        type: 'email',
        status: 'sent'
      };

      history.unshift(historyEntry);
      
      // Sadece son 1000 kaydı tut
      if (history.length > 1000) {
        history = history.slice(0, 1000);
      }

      await fs.writeFile(historyPath, JSON.stringify(history, null, 2));
    } catch (error) {
      console.error('Notification history save error:', error);
    }
  }

  // Günlük özet gönder
  static async sendDailyDigest() {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const subscriptionsPath = path.join(process.cwd(), 'public', 'notificationSubscriptions.json');
      const data = await fs.readFile(subscriptionsPath, 'utf-8');
      const subscriptions = JSON.parse(data);

      const dailySubscriptions = subscriptions.filter((sub: any) => 
        sub.frequency === 'daily' && sub.isActive
      );

      for (const subscription of dailySubscriptions) {
        await this.sendDigestNotification(subscription, 'daily', yesterday);
      }
    } catch (error) {
      console.error('Daily digest error:', error);
    }
  }

  // Haftalık özet gönder
  static async sendWeeklyDigest() {
    try {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);

      const subscriptionsPath = path.join(process.cwd(), 'public', 'notificationSubscriptions.json');
      const data = await fs.readFile(subscriptionsPath, 'utf-8');
      const subscriptions = JSON.parse(data);

      const weeklySubscriptions = subscriptions.filter((sub: any) => 
        sub.frequency === 'weekly' && sub.isActive
      );

      for (const subscription of weeklySubscriptions) {
        await this.sendDigestNotification(subscription, 'weekly', lastWeek);
      }
    } catch (error) {
      console.error('Weekly digest error:', error);
    }
  }

  // Özet bildirimi gönder
  private static async sendDigestNotification(subscription: any, frequency: string, since: Date) {
    try {
      // Bu abonelikle eşleşen son ilanları bul
      const listings = await this.findMatchingListings(subscription, since);

      if (listings.length === 0) {
        return; // Eşleşen ilan yoksa bildirim gönderme
      }

      const frequencyText = frequency === 'daily' ? 'Günlük' : 'Haftalık';
      const subject = `${frequencyText} İlan Özeti`;

      const content = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">${frequencyText} İlan Özeti</h2>
          <p style="color: #64748b;">Son ${frequency === 'daily' ? '24 saat' : 'hafta'} içinde ${listings.length} yeni ilan bulundu.</p>
          
          ${listings.map((listing: any) => `
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #2563eb;">
              <h4 style="margin: 0 0 8px 0; color: #1e293b;">${listing.title}</h4>
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">${listing.description.substring(0, 100)}...</p>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold; color: #059669;">${listing.price.toLocaleString('tr-TR')} ₺</span>
                <span style="color: #64748b; font-size: 12px;">${listing.location}</span>
              </div>
              <a href="${process.env.NEXTAUTH_URL}/ilan/${listing.id}" style="color: #2563eb; text-decoration: none; font-size: 12px;">İlanı Görüntüle →</a>
            </div>
          `).join('')}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/tum-ilanlar" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Tüm İlanları Görüntüle
            </a>
          </div>
          
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #64748b;">
            <p>Bu e-posta, ${subscription.category || 'tüm kategoriler'} kategorisindeki ${frequency} özet aboneliğiniz için gönderilmiştir.</p>
            <p>Aboneliği iptal etmek için <a href="${process.env.NEXTAUTH_URL}/profil/bildirimler">profil sayfanızı</a> ziyaret edin.</p>
          </div>
        </div>
      `;

      await sendEmail({
        to: subscription.email,
        subject: subject,
        html: content
      });

      console.log(`${frequencyText} özet gönderildi: ${subscription.email}`);
    } catch (error) {
      console.error('Digest notification error:', error);
    }
  }

  // Belirli tarihten sonraki eşleşen ilanları bul
  private static async findMatchingListings(subscription: any, since: Date) {
    try {
      const listingsPath = path.join(process.cwd(), 'public', 'listings.json');
      const data = await fs.readFile(listingsPath, 'utf-8');
      const allListings = JSON.parse(data);

      const filteredListings = allListings.filter((listing: any) => {
        const listingDate = new Date(listing.createdAt);
        return listingDate >= since && listing.status === 'onaylandı';
      });

      return filteredListings
        .filter((listing: any) => this.matchesSubscription(listing, subscription))
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);
    } catch (error) {
      console.error('Listings read error:', error);
      return [];
    }
  }

  // Kullanıcının bildirimlerini getir
  static async getUserNotifications(userId: string, limit: number = 20) {
    try {
      const notificationsPath = path.join(process.cwd(), 'public', 'inAppNotifications.json');
      const data = await fs.readFile(notificationsPath, 'utf-8');
      const notifications = JSON.parse(data);

      return notifications
        .filter((notification: any) => notification.userId === userId)
        .slice(0, limit);
    } catch (error) {
      console.error('Get user notifications error:', error);
      return [];
    }
  }

  // Bildirimi okundu olarak işaretle
  static async markNotificationAsRead(notificationId: string, userId: string) {
    try {
      const notificationsPath = path.join(process.cwd(), 'public', 'inAppNotifications.json');
      const data = await fs.readFile(notificationsPath, 'utf-8');
      const notifications = JSON.parse(data);

      const notificationIndex = notifications.findIndex((n: any) => 
        n.id === notificationId && n.userId === userId
      );

      if (notificationIndex !== -1) {
        notifications[notificationIndex].isRead = true;
        await fs.writeFile(notificationsPath, JSON.stringify(notifications, null, 2));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Mark notification as read error:', error);
      return false;
    }
  }

  // Eski bildirimleri temizle
  static async cleanupOldNotifications() {
    try {
      const notificationsPath = path.join(process.cwd(), 'public', 'inAppNotifications.json');
      const data = await fs.readFile(notificationsPath, 'utf-8');
      const notifications = JSON.parse(data);

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const filteredNotifications = notifications.filter((notification: any) => {
        const notificationDate = new Date(notification.createdAt);
        return notificationDate > thirtyDaysAgo;
      });

      await fs.writeFile(notificationsPath, JSON.stringify(filteredNotifications, null, 2));
      console.log('Eski bildirimler temizlendi');
    } catch (error) {
      console.error('Cleanup notifications error:', error);
    }
  }
} 