import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { RootStackParamList } from '../../types/navigation';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkmak istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 'favorites',
      title: 'Favorilerim',
      icon: '❤️',
      onPress: () => navigation.navigate('Favorites'),
    },
    {
      id: 'my-listings',
      title: 'İlanlarım',
      icon: '📋',
      onPress: () => console.log('My Listings'),
    },
    {
      id: 'settings',
      title: 'Ayarlar',
      icon: '⚙️',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      id: 'help',
      title: 'Yardım',
      icon: '❓',
      onPress: () => console.log('Help'),
    },
    {
      id: 'about',
      title: 'Hakkında',
      icon: 'ℹ️',
      onPress: () => console.log('About'),
    },
  ];

  const renderMenuItem = (item: typeof menuItems[0]) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.menuItem,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        <Text style={styles.menuIcon}>{item.icon}</Text>
        <Text style={[styles.menuTitle, { color: theme.colors.text }]}>
          {item.title}
        </Text>
      </View>
      <Text style={[styles.menuArrow, { color: theme.colors.textSecondary }]}>
        ›
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: user?.avatar || 'https://via.placeholder.com/100x100' }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {user?.name || 'Kullanıcı'}
            </Text>
            <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>
              {user?.email}
            </Text>
            {user?.isPremium && (
              <View style={[styles.premiumBadge, { backgroundColor: theme.colors.warning }]}>
                <Text style={[styles.premiumText, { color: theme.colors.background }]}>
                  PREMIUM ÜYE
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.statsSection}>
        <View style={[styles.statItem, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>12</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            İlanım
          </Text>
        </View>
        <View style={[styles.statItem, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>45</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Favori
          </Text>
        </View>
        <View style={[styles.statItem, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>1.2K</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Görüntüleme
          </Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Hesap
        </Text>
        {menuItems.map(renderMenuItem)}
      </View>

      <View style={styles.menuSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Uygulama
        </Text>
        <TouchableOpacity
          style={[
            styles.menuItem,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={toggleTheme}
        >
          <View style={styles.menuItemLeft}>
            <Text style={styles.menuIcon}>🌙</Text>
            <Text style={[styles.menuTitle, { color: theme.colors.text }]}>
              {isDark ? 'Açık Tema' : 'Koyu Tema'}
            </Text>
          </View>
          <Text style={[styles.menuArrow, { color: theme.colors.textSecondary }]}>
            ›
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}
        onPress={handleLogout}
      >
        <Text style={[styles.logoutButtonText, { color: theme.colors.background }]}>
          Çıkış Yap
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  premiumBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsSection: {
    flexDirection: 'row',
    marginBottom: 32,
    gap: 12,
  },
  statItem: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen; 