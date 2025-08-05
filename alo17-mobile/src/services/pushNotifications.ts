import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Notification handler configuration
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationData {
  type: 'new_message' | 'listing_view' | 'favorite_added' | 'price_drop' | 'system';
  listingId?: string;
  messageId?: string;
  userId?: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

class PushNotificationService {
  private expoPushToken: string | null = null;
  private notificationListener: Notifications.Subscription | null = null;
  private responseListener: Notifications.Subscription | null = null;

  // Initialize push notifications
  async initialize(): Promise<string | null> {
    try {
      // Check if device supports push notifications
      if (!Device.isDevice) {
        console.log('Push notifications are not supported on simulator');
        return null;
      }

      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Push notification permission denied');
        return null;
      }

      // Get Expo push token
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });

      this.expoPushToken = token.data;
      console.log('Expo push token:', this.expoPushToken);

      // Set up notification listeners
      this.setupNotificationListeners();

      return this.expoPushToken;
    } catch (error) {
      console.error('Push notification initialization error:', error);
      return null;
    }
  }

  // Set up notification listeners
  private setupNotificationListeners(): void {
    // Notification received while app is running
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      this.handleNotificationReceived(notification);
    });

    // Notification response (user tapped notification)
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      this.handleNotificationResponse(response);
    });
  }

  // Handle notification received
  private handleNotificationReceived(notification: Notifications.Notification): void {
    const { title, body, data } = notification.request.content;
    
    // Log notification details
    console.log('Notification received:', { title, body, data });
    
    // Handle different notification types
    if (data?.type) {
      switch (data.type) {
        case 'new_message':
          this.handleNewMessageNotification(data);
          break;
        case 'listing_view':
          this.handleListingViewNotification(data);
          break;
        case 'favorite_added':
          this.handleFavoriteNotification(data);
          break;
        case 'price_drop':
          this.handlePriceDropNotification(data);
          break;
        case 'system':
          this.handleSystemNotification(data);
          break;
      }
    }
  }

  // Handle notification response (user interaction)
  private handleNotificationResponse(response: Notifications.NotificationResponse): void {
    const { data } = response.notification.request.content;
    
    // Navigate based on notification type
    if (data?.type) {
      switch (data.type) {
        case 'new_message':
          // Navigate to messages screen
          this.navigateToMessages(data.messageId);
          break;
        case 'listing_view':
        case 'favorite_added':
        case 'price_drop':
          // Navigate to listing detail
          this.navigateToListing(data.listingId);
          break;
        case 'system':
          // Navigate to system notification
          this.navigateToSystemNotification(data);
          break;
      }
    }
  }

  // Send local notification
  async sendLocalNotification(notification: NotificationData): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: {
            type: notification.type,
            listingId: notification.listingId,
            messageId: notification.messageId,
            userId: notification.userId,
            ...notification.data,
          },
          sound: 'default',
          badge: 1,
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Send local notification error:', error);
    }
  }

  // Send scheduled notification
  async sendScheduledNotification(
    notification: NotificationData,
    trigger: Notifications.NotificationTriggerInput
  ): Promise<string> {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: {
            type: notification.type,
            listingId: notification.listingId,
            messageId: notification.messageId,
            userId: notification.userId,
            ...notification.data,
          },
          sound: 'default',
          badge: 1,
        },
        trigger,
      });
      
      console.log('Scheduled notification:', identifier);
      return identifier;
    } catch (error) {
      console.error('Schedule notification error:', error);
      throw error;
    }
  }

  // Send notification at specific date
  async sendNotificationAtDate(
    notification: NotificationData,
    date: Date
  ): Promise<string> {
    return this.sendScheduledNotification(notification, { date });
  }

  // Send notification after delay
  async sendNotificationAfterDelay(
    notification: NotificationData,
    seconds: number
  ): Promise<string> {
    return this.sendScheduledNotification(notification, { seconds });
  }

  // Cancel notification
  async cancelNotification(identifier: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.error('Cancel notification error:', error);
    }
  }

  // Cancel all notifications
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Cancel all notifications error:', error);
    }
  }

  // Get scheduled notifications
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Get scheduled notifications error:', error);
      return [];
    }
  }

  // Get notification permissions
  async getPermissions(): Promise<Notifications.NotificationPermissionsStatus> {
    try {
      return await Notifications.getPermissionsAsync();
    } catch (error) {
      console.error('Get permissions error:', error);
      return { granted: false, canAskAgain: false, status: 'denied' };
    }
  }

  // Request permissions
  async requestPermissions(): Promise<Notifications.NotificationPermissionsStatus> {
    try {
      return await Notifications.requestPermissionsAsync();
    } catch (error) {
      console.error('Request permissions error:', error);
      return { granted: false, canAskAgain: false, status: 'denied' };
    }
  }

  // Set notification channel (Android)
  async setNotificationChannel(): Promise<void> {
    if (Platform.OS === 'android') {
      try {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          sound: 'default',
          enableVibrate: true,
          showBadge: true,
        });
      } catch (error) {
        console.error('Set notification channel error:', error);
      }
    }
  }

  // Send push token to server
  async sendTokenToServer(token: string, userId: string): Promise<void> {
    try {
      const response = await fetch('http://localhost:3000/api/notifications/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          userId,
          platform: Platform.OS,
          deviceId: Device.osInternalBuildId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register push token');
      }

      console.log('Push token registered successfully');
    } catch (error) {
      console.error('Send token to server error:', error);
    }
  }

  // Handle specific notification types
  private handleNewMessageNotification(data: any): void {
    // Update message count, show badge, etc.
    console.log('New message notification:', data);
  }

  private handleListingViewNotification(data: any): void {
    // Update listing view count, analytics, etc.
    console.log('Listing view notification:', data);
  }

  private handleFavoriteNotification(data: any): void {
    // Update favorites list, show confirmation, etc.
    console.log('Favorite notification:', data);
  }

  private handlePriceDropNotification(data: any): void {
    // Show price drop alert, update listing price, etc.
    console.log('Price drop notification:', data);
  }

  private handleSystemNotification(data: any): void {
    // Handle system-wide notifications
    console.log('System notification:', data);
  }

  // Navigation handlers (to be implemented by app navigation)
  private navigateToMessages(messageId?: string): void {
    // Navigate to messages screen
    console.log('Navigate to messages:', messageId);
  }

  private navigateToListing(listingId?: string): void {
    // Navigate to listing detail
    console.log('Navigate to listing:', listingId);
  }

  private navigateToSystemNotification(data: any): void {
    // Navigate to system notification
    console.log('Navigate to system notification:', data);
  }

  // Cleanup
  cleanup(): void {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  // Get current token
  getToken(): string | null {
    return this.expoPushToken;
  }
}

export default new PushNotificationService(); 