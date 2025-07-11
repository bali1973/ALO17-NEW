import { Expo } from 'expo-server-sdk';

const expo = new Expo();

export async function sendPushNotification(pushToken: string, title: string, body: string, data?: any) {
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error('Geçersiz Expo push token:', pushToken);
    return;
  }
  const messages = [{
    to: pushToken,
    sound: 'default',
    title,
    body,
    data,
  }];
  try {
    const ticketChunk = await expo.sendPushNotificationsAsync(messages);
    return ticketChunk;
  } catch (error) {
    console.error('Push notification gönderilemedi:', error);
  }
} 
 
 