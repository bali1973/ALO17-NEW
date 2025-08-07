import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface Listing {
  id: string;
  title: string;
  price: string;
  location: string;
  imageUrl?: string;
  isPremium: boolean;
  createdAt: string;
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      // TODO: API'den veri çek
      const mockData: Listing[] = [
        {
          id: '1',
          title: 'iPhone 13 Pro Max',
          price: '25.000 ₺',
          location: 'İstanbul',
          imageUrl: 'https://via.placeholder.com/300x200',
          isPremium: true,
          createdAt: '2024-01-15',
        },
        {
          id: '2',
          title: 'MacBook Air M2',
          price: '35.000 ₺',
          location: 'Ankara',
          imageUrl: 'https://via.placeholder.com/300x200',
          isPremium: false,
          createdAt: '2024-01-14',
        },
        {
          id: '3',
          title: 'Samsung Galaxy S23',
          price: '18.000 ₺',
          location: 'İzmir',
          imageUrl: 'https://via.placeholder.com/300x200',
          isPremium: true,
          createdAt: '2024-01-13',
        },
      ];
      setListings(mockData);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchListings();
    setRefreshing(false);
  };

  const renderListingCard = (listing: Listing) => (
    <TouchableOpacity
      key={listing.id}
      style={styles.listingCard}
      onPress={() => navigation.navigate('ListingDetail', { listingId: listing.id })}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: listing.imageUrl || 'https://via.placeholder.com/300x200' }}
          style={styles.listingImage}
          resizeMode="cover"
        />
        {listing.isPremium && (
          <View style={styles.premiumBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        )}
      </View>
      <View style={styles.listingInfo}>
        <Text style={styles.listingTitle} numberOfLines={2}>
          {listing.title}
        </Text>
        <Text style={styles.listingPrice}>{listing.price}</Text>
        <View style={styles.listingMeta}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.listingLocation}>{listing.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>İlanlar yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>ALO17'ye Hoş Geldiniz!</Text>
        <Text style={styles.subtitleText}>En iyi fırsatları keşfedin</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('CreateListing')}
        >
          <Ionicons name="add-circle" size={24} color="#3B82F6" />
          <Text style={styles.actionText}>İlan Ver</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Ionicons name="search" size={24} color="#3B82F6" />
          <Text style={styles.actionText}>Ara</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Categories')}
        >
          <Ionicons name="grid" size={24} color="#3B82F6" />
          <Text style={styles.actionText}>Kategoriler</Text>
        </TouchableOpacity>
      </View>

      {/* Premium Listings */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="star" size={20} color="#FFD700" />
          <Text style={styles.sectionTitle}>Premium İlanlar</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {listings.filter(l => l.isPremium).map(renderListingCard)}
        </ScrollView>
      </View>

      {/* Recent Listings */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="time" size={20} color="#3B82F6" />
          <Text style={styles.sectionTitle}>Son Eklenen İlanlar</Text>
        </View>
        <View style={styles.listingsGrid}>
          {listings.map(renderListingCard)}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  actionButton: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    minWidth: 80,
  },
  actionText: {
    marginTop: 5,
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  listingsGrid: {
    paddingHorizontal: 10,
  },
  listingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 5,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    width: 200,
  },
  imageContainer: {
    position: 'relative',
  },
  listingImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  listingInfo: {
    padding: 12,
  },
  listingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  listingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listingLocation: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
}); 