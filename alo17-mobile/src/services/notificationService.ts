import PushNotification from 'react-native-push-notification';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  data?: any;
  type: 'message' | 'listing' | 'favorite' | 'system';
}

class NotificationService {
  private isInitialized = false;

  // Bildirim servisini başlat
  initialize() {
    if (this.isInitialized) return;

    // Android için kanal oluştur
    if (Platform.OS === 'android') {
      this.createNotificationChannels();
    }

    // Bildirim izinlerini iste
    this.requestPermissions();

    // Bildirim event listener'ları
    this.setupEventListeners();

    this.isInitialized = true;
  }

  // Android için bildirim kanalları oluştur
  private createNotificationChannels() {
    PushNotification.createChannel(
      {
        channelId: 'alo17-general',
        channelName: 'Genel Bildirimler',
        channelDescription: 'Genel uygulama bildirimleri',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`Genel kanal oluşturuldu: ${created}`)
    );

    PushNotification.createChannel(
      {
        channelId: 'alo17-messages',
        channelName: 'Mesaj Bildirimleri',
        channelDescription: 'Yeni mesaj bildirimleri',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`Mesaj kanalı oluşturuldu: ${created}`)
    );

    PushNotification.createChannel(
      {
        channelId: 'alo17-listings',
        channelName: 'İlan Bildirimleri',
        channelDescription: 'İlan ile ilgili bildirimler',
        playSound: true,
        soundName: 'default',
        importance: 3,
        vibrate: true,
      },
      (created) => console.log(`İlan kanalı oluşturuldu: ${created}`)
    );
  }

  // Bildirim izinlerini iste
  private requestPermissions() {
    PushNotification.requestPermissions(['alert', 'badge', 'sound']).then(
      (permissions) => {
        console.log('Bildirim izinleri:', permissions);
      }
    );
  }

  // Event listener'ları kur
  private setupEventListeners() {
    // Bildirim alındığında (uygulama açıkken)
    PushNotification.onNotification((notification) => {
      console.log('Bildirim alındı:', notification);
      
      // Bildirimi otomatik olarak kapat
      notification.finish();
    });

    // Bildirime tıklandığında
    PushNotification.onNotificationOpenedApp((notification) => {
      console.log('Bildirime tıklandı:', notification);
      this.handleNotificationTap(notification);
    });

    // Uygulama kapalıyken bildirime tıklandığında
    PushNotification.getInitialNotification().then((notification) => {
      if (notification) {
        console.log('İlk bildirim:', notification);
        this.handleNotificationTap(notification);
      }
    });
  }

  // Bildirime tıklama işlemi
  private handleNotificationTap(notification: any) {
    const data = notification.data;
    
    if (data?.type === 'message') {
      // Mesaj ekranına yönlendir
      // navigation.navigate('Chat', { conversationId: data.conversationId });
    } else if (data?.type === 'listing') {
      // İlan detay ekranına yönlendir
      // navigation.navigate('ListingDetail', { listingId: data.listingId });
    } else if (data?.type === 'favorite') {
      // Favoriler ekranına yönlendir
      // navigation.navigate('Favorites');
    }
  }

  // Local bildirim gönder
  scheduleLocalNotification(notification: NotificationData, delay: number = 0) {
    PushNotification.localNotificationSchedule({
      id: notification.id,
      channelId: this.getChannelId(notification.type),
      title: notification.title,
      message: notification.message,
      date: new Date(Date.now() + delay),
      allowWhileIdle: true,
      data: notification.data,
      smallIcon: 'ic_notification',
      largeIcon: '',
      bigText: notification.message,
      subText: 'ALO17',
      vibrate: true,
      vibration: 300,
      priority: 'high',
      importance: 'high',
      autoCancel: true,
      showWhen: true,
      when: Date.now() + delay,
      usesChronometer: false,
      timeoutAfter: null,
      invokeApp: true,
    });
  }

  // Anında local bildirim gönder
  showLocalNotification(notification: NotificationData) {
    PushNotification.localNotification({
      id: notification.id,
      channelId: this.getChannelId(notification.type),
      title: notification.title,
      message: notification.message,
      data: notification.data,
      smallIcon: 'ic_notification',
      largeIcon: '',
      bigText: notification.message,
      subText: 'ALO17',
      vibrate: true,
      vibration: 300,
      priority: 'high',
      importance: 'high',
      autoCancel: true,
      showWhen: true,
      when: Date.now(),
      usesChronometer: false,
      timeoutAfter: null,
      invokeApp: true,
    });
  }

  // Bildirim kanalını belirle
  private getChannelId(type: string): string {
    switch (type) {
      case 'message':
        return 'alo17-messages';
      case 'listing':
        return 'alo17-listings';
      default:
        return 'alo17-general';
    }
  }

  // Tüm bildirimleri temizle
  clearAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }

  // Belirli bildirimi iptal et
  cancelNotification(notificationId: string) {
    PushNotification.cancelLocalNotification(notificationId);
  }

  // Bildirim sayısını al
  getBadgeCount(): Promise<number> {
    return new Promise((resolve) => {
      PushNotification.getApplicationIconBadgeNumber((count) => {
        resolve(count);
      });
    });
  }

  // Bildirim sayısını ayarla
  setBadgeCount(count: number) {
    PushNotification.setApplicationIconBadgeNumber(count);
  }

  // Bildirim sayısını artır
  incrementBadgeCount() {
    this.getBadgeCount().then((count) => {
      this.setBadgeCount(count + 1);
    });
  }

  // Bildirim sayısını sıfırla
  resetBadgeCount() {
    this.setBadgeCount(0);
  }

  // Bildirim ayarlarını kaydet
  async saveNotificationSettings(settings: {
    messages: boolean;
    listings: boolean;
    favorites: boolean;
    system: boolean;
  }) {
    try {
      await AsyncStorage.setItem('notification-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Bildirim ayarları kaydedilemedi:', error);
    }
  }

  // Bildirim ayarlarını al
  async getNotificationSettings(): Promise<{
    messages: boolean;
    listings: boolean;
    favorites: boolean;
    system: boolean;
  }> {
    try {
      const settings = await AsyncStorage.getItem('notification-settings');
      if (settings) {
        return JSON.parse(settings);
      }
    } catch (error) {
      console.error('Bildirim ayarları alınamadı:', error);
    }

    // Varsayılan ayarlar
    return {
      messages: true,
      listings: true,
      favorites: true,
      system: true,
    };
  }

  // Mesaj bildirimi gönder
  async showMessageNotification(senderName: string, message: string, conversationId: string) {
    const settings = await this.getNotificationSettings();
    if (!settings.messages) return;

    this.showLocalNotification({
      id: `message_${conversationId}_${Date.now()}`,
      title: `${senderName} size mesaj gönderdi`,
      message: message,
      type: 'message',
      data: {
        type: 'message',
        conversationId,
        senderName,
      },
    });

    this.incrementBadgeCount();
  }

  // İlan bildirimi gönder
  async showListingNotification(title: string, message: string, listingId: string) {
    const settings = await this.getNotificationSettings();
    if (!settings.listings) return;

    this.showLocalNotification({
      id: `listing_${listingId}_${Date.now()}`,
      title: title,
      message: message,
      type: 'listing',
      data: {
        type: 'listing',
        listingId,
      },
    });
  }

  // Favori bildirimi gönder
  async showFavoriteNotification(title: string, message: string, listingId: string) {
    const settings = await this.getNotificationSettings();
    if (!settings.favorites) return;

    this.showLocalNotification({
      id: `favorite_${listingId}_${Date.now()}`,
      title: title,
      message: message,
      type: 'favorite',
      data: {
        type: 'favorite',
        listingId,
      },
    });
  }

  // Sistem bildirimi gönder
  async showSystemNotification(title: string, message: string) {
    const settings = await this.getNotificationSettings();
    if (!settings.system) return;

    this.showLocalNotification({
      id: `system_${Date.now()}`,
      title: title,
      message: message,
      type: 'system',
    });
  }

  // Test bildirimi gönder
  showTestNotification() {
    this.showLocalNotification({
      id: 'test_notification',
      title: 'Test Bildirimi',
      message: 'Bu bir test bildirimidir. ALO17 uygulaması çalışıyor!',
      type: 'system',
    });
  }
}

export default new NotificationService(); 