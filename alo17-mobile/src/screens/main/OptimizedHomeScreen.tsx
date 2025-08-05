import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import OptimizedFlatList from '../../components/OptimizedFlatList';
import OptimizedImage from '../../components/OptimizedImage';
import {
  performanceMonitor,
  memoryManager,
  networkOptimizer,
  cacheManager,
  PerformanceUtils,
} from '../../services/performanceService';

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  description: string;
  category: string;
  imageUrl?: string;
  isPremium: boolean;
  views: number;
  createdAt: string;
  condition: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  listingsCount: number;
}

const OptimizedHomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { session } = useAuth();
  const { theme, colors } = useTheme();
  
  // State management
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Performance monitoring
  useEffect(() => {
    performanceMonitor.startTimer('home_screen_load');
    
    return () => {
      const loadTime = performanceMonitor.endTimer('home_screen_load');
      console.log(`Home screen load time: ${loadTime}ms`);
    };
  }, []);

  // Debounced search
  const debouncedSearch = useMemo(
    () => PerformanceUtils.debounce((query: string) => {
      setSearchQuery(query);
      setCurrentPage(1);
    }, 300),
    []
  );

  // Fetch listings with caching
  const fetchListings = useCallback(async (page: number = 1, refresh: boolean = false) => {
    performanceMonitor.startTimer('fetch_listings');
    
    try {
      // Check cache first
      const cacheKey = `listings_page_${page}`;
      const cachedData = cacheManager.get(cacheKey);
      
      if (cachedData && !refresh) {
        setListings(cachedData);
        setLoading(false);
        return;
      }

      // Simulate API call (replace with actual API)
      const response = await fetch(`/api/listings?page=${page}&limit=20`);
      const data = await response.json();
      
      if (refresh || page === 1) {
        setListings(data.listings);
      } else {
        setListings(prev => [...prev, ...data.listings]);
      }
      
      setHasMore(data.hasMore);
      setCurrentPage(page);
      
      // Cache the data
      cacheManager.set(cacheKey, data.listings, 5 * 60 * 1000); // 5 minutes
      
    } catch (error) {
      console.error('Error fetching listings:', error);
      Alert.alert('Hata', 'İlanlar yüklenirken bir hata oluştu');
    } finally {
      performanceMonitor.endTimer('fetch_listings');
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const cachedCategories = cacheManager.get('categories');
      if (cachedCategories) {
        setCategories(cachedCategories);
        return;
      }

      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
      cacheManager.set('categories', data, 10 * 60 * 1000); // 10 minutes
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  // Initialize data
  useEffect(() => {
    fetchListings(1);
    fetchCategories();
  }, [fetchListings, fetchCategories]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchListings(1, true);
  }, [fetchListings]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchListings(currentPage + 1);
    }
  }, [loading, hasMore, currentPage, fetchListings]);

  // Filtered listings
  const filteredListings = useMemo(() => {
    let filtered = listings;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    return filtered;
  }, [listings, searchQuery, selectedCategory]);

  // Toggle favorite
  const handleToggleFavorite = useCallback((listingId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(listingId)) {
        newFavorites.delete(listingId);
      } else {
        newFavorites.add(listingId);
      }
      return newFavorites;
    });
  }, []);

  // Render listing item
  const renderListingItem = useCallback(({ item }: { item: Listing }) => (
    <TouchableOpacity
      style={[styles.listingCard, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate('ListingDetail' as never, { id: item.id } as never)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <OptimizedImage
          uri={item.imageUrl || 'https://via.placeholder.com/300x200'}
          width={300}
          height={200}
          priority="normal"
          quality={networkOptimizer.getImageQuality()}
        />
        {item.isPremium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>PREMIUM</Text>
          </View>
        )}
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            { backgroundColor: favorites.has(item.id) ? '#ef4444' : 'rgba(255,255,255,0.8)' }
          ]}
          onPress={() => handleToggleFavorite(item.id)}
        >
          <Text style={[
            styles.favoriteIcon,
            { color: favorites.has(item.id) ? '#ffffff' : '#666666' }
          ]}>
            {favorites.has(item.id) ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.listingContent}>
        <Text style={[styles.listingTitle, { color: colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.listingPrice, { color: colors.primary }]}>
          ₺{item.price.toLocaleString()}
        </Text>
        <Text style={[styles.listingLocation, { color: colors.textSecondary }]}>
          {item.location}
        </Text>
        <View style={styles.listingMeta}>
          <Text style={[styles.listingCondition, { color: colors.textSecondary }]}>
            {item.condition}
          </Text>
          <Text style={[styles.listingViews, { color: colors.textSecondary }]}>
            👁️ {item.views}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  ), [favorites, handleToggleFavorite, colors, navigation]);

  // Render category item
  const renderCategoryItem = useCallback(({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: colors.card }]}
      onPress={() => setSelectedCategory(selectedCategory === item.slug ? '' : item.slug)}
      activeOpacity={0.7}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={[styles.categoryName, { color: colors.text }]} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={[styles.categoryCount, { color: colors.textSecondary }]}>
        {item.listingsCount} ilan
      </Text>
    </TouchableOpacity>
  ), [selectedCategory, colors]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.welcomeText, { color: colors.text }]}>
            Hoş geldiniz{session?.user?.name ? `, ${session.user.name}` : ''}!
          </Text>
          <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>
            En iyi fırsatları keşfedin
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Search' as never)}
        >
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Kategoriler</Text>
        <OptimizedFlatList
          data={categories.slice(0, 6)}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={6}
        />
      </View>

      {/* Listings */}
      <View style={styles.listingsSection}>
        <View style={styles.listingsHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            İlanlar ({filteredListings.length})
          </Text>
          {selectedCategory && (
            <TouchableOpacity
              onPress={() => setSelectedCategory('')}
              style={styles.clearFilterButton}
            >
              <Text style={[styles.clearFilterText, { color: colors.primary }]}>
                Filtreyi Temizle
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        <OptimizedFlatList
          data={filteredListings}
          renderItem={renderListingItem}
          keyExtractor={(item) => item.id}
          onRefresh={handleRefresh}
          onLoadMore={handleLoadMore}
          loading={loading}
          refreshing={refreshing}
          hasMore={hasMore}
          numColumns={2}
          columnWrapperStyle={styles.listingRow}
          contentContainerStyle={styles.listingsList}
          initialNumToRender={6}
          maxToRenderPerBatch={4}
          windowSize={10}
          removeClippedSubviews={true}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitleText: {
    fontSize: 16,
    marginTop: 2,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 20,
  },
  categoriesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryCard: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 10,
    marginTop: 2,
  },
  listingsSection: {
    flex: 1,
  },
  listingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  clearFilterButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearFilterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listingsList: {
    paddingHorizontal: 16,
  },
  listingRow: {
    justifyContent: 'space-between',
  },
  listingCard: {
    width: '48%',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  premiumText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 16,
  },
  listingContent: {
    padding: 12,
  },
  listingTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 18,
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  listingLocation: {
    fontSize: 12,
    marginBottom: 4,
  },
  listingMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listingCondition: {
    fontSize: 10,
  },
  listingViews: {
    fontSize: 10,
  },
});

export default OptimizedHomeScreen; 