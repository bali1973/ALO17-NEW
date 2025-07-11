import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../types/navigation';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

interface Listing {
  id: string;
  title: string;
  price: number;
  image: string;
  location: string;
  createdAt: string;
  isPremium: boolean;
  viewCount: number;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockListings: Listing[] = [
        {
          id: '1',
          title: 'iPhone 14 Pro Max',
          price: 25000,
          image: 'https://via.placeholder.com/300x200',
          location: 'İstanbul',
          createdAt: '2024-01-15',
          isPremium: true,
          viewCount: 150,
        },
        {
          id: '2',
          title: 'MacBook Pro M2',
          price: 45000,
          image: 'https://via.placeholder.com/300x200',
          location: 'Ankara',
          createdAt: '2024-01-14',
          isPremium: false,
          viewCount: 89,
        },
        {
          id: '3',
          title: 'Samsung Galaxy S23',
          price: 18000,
          image: 'https://via.placeholder.com/300x200',
          location: 'İzmir',
          createdAt: '2024-01-13',
          isPremium: true,
          viewCount: 234,
        },
      ];
      
      setListings(mockListings);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadListings();
    setRefreshing(false);
  };

  const handleListingPress = (listingId: string) => {
    navigation.navigate('ListingDetail', { listingId });
  };

  const renderListingItem = ({ item }: { item: Listing }) => (
    <TouchableOpacity
      style={[
        styles.listingCard,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={() => handleListingPress(item.id)}
    >
      <Image source={{ uri: item.image }} style={styles.listingImage} />
      
      {item.isPremium && (
        <View style={[styles.premiumBadge, { backgroundColor: theme.colors.warning }]}>
          <Text style={[styles.premiumText, { color: theme.colors.background }]}>
            PREMIUM
          </Text>
        </View>
      )}
      
      <View style={styles.listingContent}>
        <Text style={[styles.listingTitle, { color: theme.colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        
        <Text style={[styles.listingPrice, { color: theme.colors.primary }]}>
          ₺{item.price.toLocaleString()}
        </Text>
        
        <View style={styles.listingMeta}>
          <Text style={[styles.listingLocation, { color: theme.colors.textSecondary }]}>
            📍 {item.location}
          </Text>
          <Text style={[styles.listingViews, { color: theme.colors.textSecondary }]}>
            👁️ {item.viewCount} görüntüleme
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.welcomeSection}>
        <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
          Hoş geldiniz,
        </Text>
        <Text style={[styles.userName, { color: theme.colors.text }]}>
          {user?.name || 'Kullanıcı'}
        </Text>
      </View>
      
      <TouchableOpacity
        style={[styles.searchButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('Search')}
      >
        <Text style={[styles.searchButtonText, { color: theme.colors.background }]}>
          🔍 Arama yapın
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={listings}
        renderItem={renderListingItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  welcomeSection: {
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  listingCard: {
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listingImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  premiumBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  listingContent: {
    padding: 16,
  },
  listingTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  listingPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  listingMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listingLocation: {
    fontSize: 14,
  },
  listingViews: {
    fontSize: 14,
  },
});

export default HomeScreen; 