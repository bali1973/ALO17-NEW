import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

// Context providers
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';

// Screens
import HomeScreen from './src/screens/main/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import CreateListingScreen from './src/screens/main/CreateListingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ListingDetailScreen from './src/screens/ListingDetailScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import PaymentSuccessScreen from './src/screens/PaymentSuccessScreen';

// Services
import NotificationService from './services/notificationService';
import SocketService from './services/socketService';
import OfflineService from './services/offlineService';
import PayTRService from './services/paytrService';
import PerformanceService from './services/performanceService';

// Types
import { RootStackParamList } from './src/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = focused ? '🏠' : '🏠';
          } else if (route.name === 'Search') {
            iconName = focused ? '🔍' : '🔍';
          } else if (route.name === 'Categories') {
            iconName = focused ? '📂' : '📂';
          } else if (route.name === 'Create') {
            iconName = focused ? '➕' : '➕';
          } else if (route.name === 'Profile') {
            iconName = focused ? '👤' : '👤';
          } else {
            iconName = '❓';
          }

          return <span style={{ fontSize: size, color }}>{iconName}</span>;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Ana Sayfa' }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ title: 'Arama' }}
      />
      <Tab.Screen 
        name="Categories" 
        component={CategoriesScreen} 
        options={{ title: 'Kategoriler' }}
      />
      <Tab.Screen 
        name="Create" 
        component={CreateListingScreen} 
        options={{ title: 'İlan Ver' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  );
};

// Main Navigation
const Navigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Main" 
        component={TabNavigator} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ListingDetail" 
        component={ListingDetailScreen} 
        options={{ title: 'İlan Detayı' }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ title: 'Giriş Yap' }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ title: 'Kayıt Ol' }}
      />
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen} 
        options={{ title: 'Ödeme' }}
      />
      <Stack.Screen 
        name="PaymentSuccess" 
        component={PaymentSuccessScreen} 
        options={{ title: 'Ödeme Başarılı', headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  useEffect(() => {
    // Tüm servisleri başlat
    initializeServices();
  }, []);

  const initializeServices = async () => {
    try {
      console.log('🚀 Alo17 Mobile uygulaması başlatılıyor...');

      // 1. Bildirim servisini başlat
      console.log('📱 Bildirim servisi başlatılıyor...');
      NotificationService.initialize();
      
      // 2. Offline servisini başlat
      console.log('📶 Offline servisi başlatılıyor...');
      await OfflineService.initialize();
      
      // 3. PayTR servisini başlat
      console.log('💳 PayTR servisi başlatılıyor...');
      await PayTRService.initialize();
      
      // 4. Performans servisini başlat
      console.log('⚡ Performans servisi başlatılıyor...');
      await PerformanceService.initialize();

      // 5. Socket.io servisini başlat (kullanıcı giriş yaptıktan sonra)
      console.log('🔌 Socket.io servisi hazırlanıyor...');
      // SocketService.initialize() kullanıcı giriş yaptıktan sonra çağrılacak

      console.log('✅ Tüm servisler başarıyla başlatıldı!');

      // Test bildirimi gönder (5 saniye sonra)
      setTimeout(() => {
        NotificationService.showTestNotification();
      }, 5000);

    } catch (error) {
      console.error('❌ Servis başlatma hatası:', error);
    }
  };

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PaperProvider>
          <AuthProvider>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <NavigationContainer>
              <Navigation />
            </NavigationContainer>
          </AuthProvider>
        </PaperProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App; 