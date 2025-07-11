import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';
import { RootStackParamList } from '../../types/navigation';

type FavoritesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Favorites'>;

interface FavoriteListing {
  id: string;
  title: string;
  price: number;
  image: string;
  location: string;
  isPremium: boolean;
  addedAt: string;
}

const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { theme } = useTheme();
  
  const [favorites, setFavorites] = useState<FavoriteListing[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    // TODO: Replace with actual API call
    const mockFavorites: FavoriteListing[] = [
      {
        id: '1',
        title: 'iPhone 14 Pro Max - 256GB',
        price: 25000,
        image: 'https://via.placeholder.com/300x200',
        location: 'İstanbul',
        isPremium: true,
        addedAt: '2024-01-15',
      },
      {
        id: '2',
        title: 'MacBook Pro M2 - 512GB',
        price: 45000,
        image: 'https://via.placeholder.com/300x200',
        location: 'Ankara',
        isPremium: false,
        addedAt: '2024-01-14',
      },
      {
        id: '3',
        title: 'Samsung Galaxy S23 Ultra',
        price: 18000,
        image: 'https://via.placeholder.com/300x200',
        location: 'İzmir',
        isPremium: true,
        addedAt: '2024-01-13',
      },
    ];
    
    setFavorites(mockFavorites);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const handleListingPress = (listingId: string) => {
    navigation.navigate('ListingDetail', { listingId });
  };

  const handleRemoveFavorite = (listingId: string) => {
    Alert.alert(
      'Favorilerden Çıkar',
      'Bu ilanı favorilerinizden çıkarmak istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Çıkar',
          style: 'destructive',
          onPress: () => {
            setFavorites(prev => prev.filter(item => item.id !== listingId));
          },
        },
      ]
    );
  };

  const renderFavoriteItem = ({ item }: { item: FavoriteListing }) => (
    <TouchableOpacity
      style={[
        styles.favoriteCard,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={() => handleListingPress(item.id)}
    >
      <Image source={{ uri: item.image }} style={styles.favoriteImage} />
      
      {item.isPremium && (
        <View style={[styles.premiumBadge, { backgroundColor: theme.colors.warning }]}>
          <Text style={[styles.premiumText, { color: theme.colors.background }]}>
            PREMIUM
          </Text>
        </View>
      )}
      
      <View style={styles.favoriteContent}>
        <Text style={[styles.favoriteTitle, { color: theme.colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        
        <Text style={[styles.favoritePrice, { color: theme.colors.primary }]}>
          ₺{item.price.toLocaleString()}
        </Text>
        
        <View style={styles.favoriteMeta}>
          <Text style={[styles.favoriteLocation, { color: theme.colors.textSecondary }]}>
            📍 {item.location}
          </Text>
          <Text style={[styles.favoriteDate, { color: theme.colors.textSecondary }]}>
            {new Date(item.addedAt).toLocaleDateString('tr-TR')}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item.id)}
      >
        <Text style={[styles.removeButtonText, { color: theme.colors.error }]}>
          ❌
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        Henüz favori ilanınız yok
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
        Beğendiğiniz ilanları favorilere ekleyerek daha sonra kolayca bulabilirsiniz
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Favorilerim ({favorites.length})
        </Text>
      </View>

      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  favoriteCard: {
    flexDirection: 'row',
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
  favoriteImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  premiumText: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  favoriteContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  favoritePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  favoriteMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  favoriteLocation: {
    fontSize: 12,
  },
  favoriteDate: {
    fontSize: 12,
  },
  removeButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default FavoritesScreen; 