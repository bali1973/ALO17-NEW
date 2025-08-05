import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface NotificationData {
  id: string;
  title: string;
  message: string;
  data?: any;
  type: 'message' | 'listing' | 'system' | 'premium';
  timestamp: number;
}

class PushNotificationService {
  private static instance: PushNotificationService;
  private isInitialized = false;

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  async initialize() {
    if (this.isInitialized) return;

    // Push notification kanallarını oluştur
    this.createNotificationChannels();

    // Bildirim izinlerini iste
    await this.requestPermissions();

    // Bildirim dinleyicilerini ayarla
    this.setupNotificationListeners();

    this.isInitialized = true;
  }

  private createNotificationChannels() {
    if (Platform.OS === 'android') {
      // Ana bildirim kanalı
      PushNotification.createChannel(
        {
          channelId: 'default',
          channelName: 'Genel Bildirimler',
          channelDescription: 'Genel uygulama bildirimleri',
          playSound: true,
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        (created) => console.log(`Default channel created: ${created}`)
      );

      // Mesaj bildirim kanalı
      PushNotification.createChannel(
        {
          channelId: 'messages',
          channelName: 'Mesaj Bildirimleri',
          channelDescription: 'Yeni mesaj bildirimleri',
          playSound: true,
          soundName: 'default',
          importance: 5,
          vibrate: true,
        },
        (created) => console.log(`Messages channel created: ${created}`)
      );

      // Premium bildirim kanalı
      PushNotification.createChannel(
        {
          channelId: 'premium',
          channelName: 'Premium Bildirimleri',
          channelDescription: 'Premium özellik bildirimleri',
          playSound: true,
          soundName: 'default',
          importance: 3,
          vibrate: false,
        },
        (created) => console.log(`Premium channel created: ${created}`)
      );
    }
  }

  private async requestPermissions() {
    try {
      const authStatus = await PushNotification.requestPermissions();
      console.log('Push notification permissions:', authStatus);
      return authStatus;
    } catch (error) {
      console.error('Error requesting push notification permissions:', error);
    }
  }

  private setupNotificationListeners() {
    // Uygulama açıkken gelen bildirimler
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
        // Token'ı sunucuya gönder
        this.sendTokenToServer(token);
      },

      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        
        // Bildirimi yerel olarak kaydet
        this.saveNotificationLocally(notification);
        
        // Bildirimi işaretle
        notification.finish();
      },

      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
        
        // Bildirim aksiyonunu işle
        this.handleNotificationAction(notification);
      },

      onRegistrationError: function (err) {
        console.error('Registration error:', err.message, err);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  private async sendTokenToServer(token: string) {
    try {
      const response = await fetch('http://localhost:3000/api/push/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          platform: Platform.OS,
          userId: await this.getUserId(),
        }),
      });

      if (response.ok) {
        console.log('Push token successfully sent to server');
      }
    } catch (error) {
      console.error('Error sending push token to server:', error);
    }
  }

  private async saveNotificationLocally(notification: any) {
    try {
      const notifications = await this.getLocalNotifications();
      const newNotification: NotificationData = {
        id: notification.id || Date.now().toString(),
        title: notification.title,
        message: notification.message,
        data: notification.data,
        type: notification.data?.type || 'system',
        timestamp: Date.now(),
      };

      notifications.unshift(newNotification);
      
      // Son 100 bildirimi sakla
      if (notifications.length > 100) {
        notifications.splice(100);
      }

      await AsyncStorage.setItem('localNotifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notification locally:', error);
    }
  }

  private async handleNotificationAction(notification: any) {
    // Bildirim aksiyonuna göre navigasyon yap
    const { type, data } = notification.data || {};
    
    switch (type) {
      case 'message':
        // Mesaj sayfasına yönlendir
        this.navigateToMessage(data?.messageId);
        break;
      case 'listing':
        // İlan detay sayfasına yönlendir
        this.navigateToListing(data?.listingId);
        break;
      case 'premium':
        // Premium sayfasına yönlendir
        this.navigateToPremium();
        break;
      default:
        // Ana sayfaya yönlendir
        this.navigateToHome();
    }
  }

  // Yerel bildirim gönder
  async scheduleLocalNotification(
    title: string,
    message: string,
    data?: any,
    delay: number = 0
  ) {
    const notificationId = Date.now().toString();
    
    PushNotification.localNotificationSchedule({
      id: notificationId,
      title,
      message,
      data,
      date: new Date(Date.now() + delay),
      channelId: data?.type === 'messages' ? 'messages' : 'default',
      allowWhileIdle: true,
      repeatType: 'day',
      number: 1,
    });

    return notificationId;
  }

  // Anında yerel bildirim gönder
  async showLocalNotification(
    title: string,
    message: string,
    data?: any,
    channelId: string = 'default'
  ) {
    const notificationId = Date.now().toString();
    
    PushNotification.localNotification({
      id: notificationId,
      title,
      message,
      data,
      channelId,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
      vibrate: true,
      vibration: 300,
      autoCancel: true,
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_notification',
      bigText: message,
      subText: 'Alo17',
      color: '#007AFF',
      number: 1,
    });

    return notificationId;
  }

  // Bildirimleri iptal et
  cancelNotification(notificationId: string) {
    PushNotification.cancelLocalNotification(notificationId);
  }

  // Tüm bildirimleri iptal et
  cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }

  // Bildirim rozetini temizle
  clearBadge() {
    PushNotification.setApplicationIconBadgeNumber(0);
  }

  // Yerel bildirimleri al
  async getLocalNotifications(): Promise<NotificationData[]> {
    try {
      const notifications = await AsyncStorage.getItem('localNotifications');
      return notifications ? JSON.parse(notifications) : [];
    } catch (error) {
      console.error('Error getting local notifications:', error);
      return [];
    }
  }

  // Bildirimi okundu olarak işaretle
  async markNotificationAsRead(notificationId: string) {
    try {
      const notifications = await this.getLocalNotifications();
      const updatedNotifications = notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      );
      
      await AsyncStorage.setItem('localNotifications', JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Okunmamış bildirim sayısını al
  async getUnreadNotificationCount(): Promise<number> {
    try {
      const notifications = await this.getLocalNotifications();
      return notifications.filter(notification => !notification.read).length;
    } catch (error) {
      console.error('Error getting unread notification count:', error);
      return 0;
    }
  }

  // Bildirim ayarlarını kaydet
  async saveNotificationSettings(settings: {
    messages: boolean;
    listings: boolean;
    system: boolean;
    premium: boolean;
    sound: boolean;
    vibration: boolean;
  }) {
    try {
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }

  // Bildirim ayarlarını al
  async getNotificationSettings() {
    try {
      const settings = await AsyncStorage.getItem('notificationSettings');
      return settings ? JSON.parse(settings) : {
        messages: true,
        listings: true,
        system: true,
        premium: true,
        sound: true,
        vibration: true,
      };
    } catch (error) {
      console.error('Error getting notification settings:', error);
      return {
        messages: true,
        listings: true,
        system: true,
        premium: true,
        sound: true,
        vibration: true,
      };
    }
  }

  private async getUserId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('userId');
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  }

  // Navigasyon metodları (React Navigation ile entegre edilecek)
  private navigateToMessage(messageId: string) {
    // React Navigation ile mesaj sayfasına yönlendir
    console.log('Navigate to message:', messageId);
  }

  private navigateToListing(listingId: string) {
    // React Navigation ile ilan detay sayfasına yönlendir
    console.log('Navigate to listing:', listingId);
  }

  private navigateToPremium() {
    // React Navigation ile premium sayfasına yönlendir
    console.log('Navigate to premium');
  }

  private navigateToHome() {
    // React Navigation ile ana sayfaya yönlendir
    console.log('Navigate to home');
  }
}

export default PushNotificationService.getInstance(); 