import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface NotificationData {
  id: string;
  title: string;
  body: string;
  data?: any;
  sound?: string;
  badge?: number;
  userInteraction?: boolean;
  foreground?: boolean;
  background?: boolean;
}

interface NotificationChannel {
  id: string;
  name: string;
  description: string;
  sound?: string;
  importance?: number;
  vibrate?: boolean;
}

class NotificationService {
  private static instance: NotificationService;
  private isInitialized = false;
  private notificationListeners: Map<string, Function> = new Map();

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Push notification konfigürasyonu
      PushNotification.configure({
        // (required) Called when a remote or local notification is opened or received
        onNotification: this.handleNotification.bind(this),
        
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: this.handleToken.bind(this),
        
        // (required) Called when a remote is received or opened, or local notification is opened
        onNotificationOpenedApp: this.handleNotificationOpened.bind(this),
        
        // (optional) Called when Action is pressed (Android)
        onAction: this.handleAction.bind(this),
        
        // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
        onRegistrationError: this.handleRegistrationError.bind(this),
        
        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },
        
        // Should the initial notification be popped automatically
        popInitialNotification: true,
        
        /**
         * (optional) default: true
         * - false: it will not be called (only if `popInitialNotification: true`)
         * - true: it will be called every time a notification is opened/recieved
         */
        requestPermissions: Platform.OS === 'ios',
      });

      // Android için kanal oluştur
      if (Platform.OS === 'android') {
        this.createNotificationChannels();
      }

      this.isInitialized = true;
      console.log('Notification service initialized successfully');
    } catch (error) {
      console.error('Notification service initialization failed:', error);
    }
  }

  private createNotificationChannels(): void {
    const channels: NotificationChannel[] = [
      {
        id: 'default',
        name: 'Genel Bildirimler',
        description: 'Genel uygulama bildirimleri',
        sound: 'default',
        importance: 4,
        vibrate: true,
      },
      {
        id: 'messages',
        name: 'Mesaj Bildirimleri',
        description: 'Yeni mesaj bildirimleri',
        sound: 'message',
        importance: 5,
        vibrate: true,
      },
      {
        id: 'listings',
        name: 'İlan Bildirimleri',
        description: 'Yeni ilan ve güncelleme bildirimleri',
        sound: 'default',
        importance: 4,
        vibrate: true,
      },
      {
        id: 'promotions',
        name: 'Promosyon Bildirimleri',
        description: 'Kampanya ve promosyon bildirimleri',
        sound: 'default',
        importance: 3,
        vibrate: false,
      },
    ];

    channels.forEach(channel => {
      PushNotification.createChannel(
        {
          channelId: channel.id,
          channelName: channel.name,
          channelDescription: channel.description,
          soundName: channel.sound,
          importance: channel.importance,
          vibrate: channel.vibrate,
        },
        (created) => {
          console.log(`Notification channel ${channel.id} created:`, created);
        }
      );
    });
  }

  private async handleNotification(notification: any): Promise<void> {
    console.log('Notification received:', notification);
    
    // Bildirimi kaydet
    await this.saveNotification(notification);
    
    // Listener'ları çağır
    this.notificationListeners.forEach(listener => {
      try {
        listener(notification);
      } catch (error) {
        console.error('Notification listener error:', error);
      }
    });
  }

  private async handleToken(token: any): Promise<void> {
    console.log('Push notification token:', token);
    
    try {
      // Token'ı kaydet
      await AsyncStorage.setItem('pushToken', token.token);
      
      // Sunucuya token'ı gönder
      await this.sendTokenToServer(token.token);
    } catch (error) {
      console.error('Token handling error:', error);
    }
  }

  private async handleNotificationOpened(notification: any): Promise<void> {
    console.log('Notification opened:', notification);
    
    // Bildirimi okundu olarak işaretle
    await this.markNotificationAsRead(notification.id);
    
    // Navigasyon işlemi (React Navigation ile entegre edilebilir)
    this.handleNotificationNavigation(notification);
  }

  private async handleAction(notification: any): Promise<void> {
    console.log('Notification action:', notification);
    
    // Action'a göre işlem yap
    if (notification.action === 'reply') {
      // Mesaj yanıtlama işlemi
      this.handleReplyAction(notification);
    } else if (notification.action === 'view') {
      // Görüntüleme işlemi
      this.handleViewAction(notification);
    }
  }

  private async handleRegistrationError(error: any): Promise<void> {
    console.error('Push notification registration error:', error);
  }

  // Yerel bildirim gönder
  async sendLocalNotification(notification: NotificationData): Promise<void> {
    try {
      PushNotification.localNotification({
        id: notification.id,
        title: notification.title,
        message: notification.body,
        data: notification.data,
        soundName: notification.sound || 'default',
        number: notification.badge,
        channelId: 'default',
        userInteraction: notification.userInteraction || false,
        playSound: true,
        vibrate: true,
        vibration: 300,
        priority: 'high',
        importance: 'high',
        autoCancel: true,
        largeIcon: 'ic_launcher',
        smallIcon: 'ic_notification',
        bigText: notification.body,
        subText: 'Alo17',
        color: '#007AFF',
        actions: ['Yanıtla', 'Görüntüle'],
      });
    } catch (error) {
      console.error('Send local notification error:', error);
    }
  }

  // Zamanlanmış bildirim gönder
  async scheduleNotification(notification: NotificationData, date: Date): Promise<void> {
    try {
      PushNotification.localNotificationSchedule({
        id: notification.id,
        title: notification.title,
        message: notification.body,
        data: notification.data,
        date: date,
        soundName: notification.sound || 'default',
        channelId: 'default',
        playSound: true,
        vibrate: true,
        vibration: 300,
        priority: 'high',
        importance: 'high',
        autoCancel: true,
        largeIcon: 'ic_launcher',
        smallIcon: 'ic_notification',
        bigText: notification.body,
        subText: 'Alo17',
        color: '#007AFF',
      });
    } catch (error) {
      console.error('Schedule notification error:', error);
    }
  }

  // Bildirimi iptal et
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      PushNotification.cancelLocalNotification(notificationId);
    } catch (error) {
      console.error('Cancel notification error:', error);
    }
  }

  // Tüm bildirimleri iptal et
  async cancelAllNotifications(): Promise<void> {
    try {
      PushNotification.cancelAllLocalNotifications();
    } catch (error) {
      console.error('Cancel all notifications error:', error);
    }
  }

  // Bildirim izinlerini kontrol et
  async checkPermissions(): Promise<boolean> {
    try {
      const permissions = await PushNotification.checkPermissions();
      return permissions.alert && permissions.badge && permissions.sound;
    } catch (error) {
      console.error('Check permissions error:', error);
      return false;
    }
  }

  // Bildirim izinlerini iste
  async requestPermissions(): Promise<boolean> {
    try {
      const permissions = await PushNotification.requestPermissions();
      return permissions.alert && permissions.badge && permissions.sound;
    } catch (error) {
      console.error('Request permissions error:', error);
      return false;
    }
  }

  // Bildirim listener'ı ekle
  addNotificationListener(id: string, listener: Function): void {
    this.notificationListeners.set(id, listener);
  }

  // Bildirim listener'ı kaldır
  removeNotificationListener(id: string): void {
    this.notificationListeners.delete(id);
  }

  // Bildirimi kaydet
  private async saveNotification(notification: any): Promise<void> {
    try {
      const notifications = await this.getStoredNotifications();
      const newNotification = {
        id: notification.id || Date.now().toString(),
        title: notification.title,
        body: notification.body,
        data: notification.data,
        timestamp: new Date().toISOString(),
        isRead: false,
      };
      
      notifications.unshift(newNotification);
      
      // Sadece son 100 bildirimi tut
      if (notifications.length > 100) {
        notifications.splice(100);
      }
      
      await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Save notification error:', error);
    }
  }

  // Kaydedilmiş bildirimleri getir
  async getStoredNotifications(): Promise<any[]> {
    try {
      const notifications = await AsyncStorage.getItem('notifications');
      return notifications ? JSON.parse(notifications) : [];
    } catch (error) {
      console.error('Get stored notifications error:', error);
      return [];
    }
  }

  // Bildirimi okundu olarak işaretle
  private async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const notifications = await this.getStoredNotifications();
      const notificationIndex = notifications.findIndex(n => n.id === notificationId);
      
      if (notificationIndex !== -1) {
        notifications[notificationIndex].isRead = true;
        await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
      }
    } catch (error) {
      console.error('Mark notification as read error:', error);
    }
  }

  // Token'ı sunucuya gönder
  private async sendTokenToServer(token: string): Promise<void> {
    try {
      const response = await fetch('https://alo17.netlify.app/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pushToken: token,
          platform: Platform.OS,
          appVersion: '1.0.0',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send token to server');
      }
    } catch (error) {
      console.error('Send token to server error:', error);
    }
  }

  // Bildirim navigasyonu
  private handleNotificationNavigation(notification: any): void {
    // React Navigation ile entegre edilebilir
    if (notification.data?.type === 'message') {
      // Mesaj sayfasına git
      console.log('Navigate to message:', notification.data.messageId);
    } else if (notification.data?.type === 'listing') {
      // İlan detay sayfasına git
      console.log('Navigate to listing:', notification.data.listingId);
    }
  }

  // Yanıtlama action'ı
  private handleReplyAction(notification: any): void {
    console.log('Handle reply action:', notification);
    // Mesaj yanıtlama işlemi
  }

  // Görüntüleme action'ı
  private handleViewAction(notification: any): void {
    console.log('Handle view action:', notification);
    // Görüntüleme işlemi
  }

  // Badge sayısını güncelle
  async setBadgeCount(count: number): Promise<void> {
    try {
      PushNotification.setApplicationIconBadgeNumber(count);
    } catch (error) {
      console.error('Set badge count error:', error);
    }
  }

  // Badge sayısını sıfırla
  async clearBadge(): Promise<void> {
    try {
      PushNotification.setApplicationIconBadgeNumber(0);
    } catch (error) {
      console.error('Clear badge error:', error);
    }
  }
}

export default NotificationService.getInstance(); 