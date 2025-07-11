import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';
import { RootStackParamList } from '../../types/navigation';

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

interface SearchResult {
  id: string;
  title: string;
  price: number;
  image: string;
  location: string;
  category: string;
}

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const { theme } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    // TODO: Replace with actual API call
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: 'iPhone 14 Pro Max',
          price: 25000,
          image: 'https://via.placeholder.com/300x200',
          location: 'İstanbul',
          category: 'Elektronik',
        },
        {
          id: '2',
          title: 'MacBook Pro M2',
          price: 45000,
          image: 'https://via.placeholder.com/300x200',
          location: 'Ankara',
          category: 'Elektronik',
        },
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleResultPress = (resultId: string) => {
    navigation.navigate('ListingDetail', { listingId: resultId });
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={[
        styles.resultCard,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={() => handleResultPress(item.id)}
    >
      <Image source={{ uri: item.image }} style={styles.resultImage} />
      <View style={styles.resultContent}>
        <Text style={[styles.resultTitle, { color: theme.colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.resultPrice, { color: theme.colors.primary }]}>
          ₺{item.price.toLocaleString()}
        </Text>
        <View style={styles.resultMeta}>
          <Text style={[styles.resultLocation, { color: theme.colors.textSecondary }]}>
            📍 {item.location}
          </Text>
          <Text style={[styles.resultCategory, { color: theme.colors.textSecondary }]}>
            {item.category}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.text,
            },
          ]}
          placeholder="Ne arıyorsunuz?"
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            handleSearch(text);
          }}
          autoFocus
        />
      </View>

      {isSearching && (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Aranıyor...
          </Text>
        </View>
      )}

      {!isSearching && searchQuery && searchResults.length === 0 && (
        <View style={styles.noResultsContainer}>
          <Text style={[styles.noResultsText, { color: theme.colors.textSecondary }]}>
            "{searchQuery}" için sonuç bulunamadı
          </Text>
        </View>
      )}

      <FlatList
        data={searchResults}
        renderItem={renderSearchResult}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.resultsContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
  },
  resultsContainer: {
    padding: 16,
  },
  resultCard: {
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
  resultImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  resultContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultLocation: {
    fontSize: 12,
  },
  resultCategory: {
    fontSize: 12,
  },
});

export default SearchScreen; 