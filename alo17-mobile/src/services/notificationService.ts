import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function registerForPushNotificationsAsync() {
  let token;
  // Bildirim izni iste
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Bildirim izni verilmedi!');
    return null;
  }
  // Token al
  token = (await Notifications.getExpoPushTokenAsync()).data;
  // Android için kanal ayarı
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  // Token'ı local storage'a kaydet
  await AsyncStorage.setItem('expoPushToken', token);
  return token;
} 