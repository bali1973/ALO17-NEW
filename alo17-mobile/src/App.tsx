import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

// Screens
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import HomeScreen from './screens/main/HomeScreen';
import SearchScreen from './screens/main/SearchScreen';
import ListingDetailScreen from './screens/main/ListingDetailScreen';
import CreateListingScreen from './screens/main/CreateListingScreen';
import ProfileScreen from './screens/main/ProfileScreen';
import MessagesScreen from './screens/main/MessagesScreen';
import ChatScreen from './screens/main/ChatScreen';
import FavoritesScreen from './screens/main/FavoritesScreen';
import SettingsScreen from './screens/main/SettingsScreen';

// Components
import TabBarIcon from './components/common/TabBarIcon';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Types
import { RootStackParamList, MainTabParamList } from './types/navigation';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => (
          <TabBarIcon route={route.name} focused={focused} color={color} size={size} />
        ),
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
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
        name="CreateListing" 
        component={CreateListingScreen}
        options={{ title: 'İlan Ver' }}
      />
      <Tab.Screen 
        name="Messages" 
        component={MessagesScreen}
        options={{ title: 'Mesajlar' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Auth Stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          // Main App Stack
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen 
              name="ListingDetail" 
              component={ListingDetailScreen}
              options={{ headerShown: true, title: 'İlan Detayı' }}
            />
            <Stack.Screen 
              name="Chat" 
              component={ChatScreen}
              options={{ headerShown: true, title: 'Sohbet' }}
            />
            <Stack.Screen 
              name="Favorites" 
              component={FavoritesScreen}
              options={{ headerShown: true, title: 'Favoriler' }}
            />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen}
              options={{ headerShown: true, title: 'Ayarlar' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PaperProvider>
          <AuthProvider>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <Navigation />
          </AuthProvider>
        </PaperProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App; 