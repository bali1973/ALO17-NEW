import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../types/navigation';

const { width } = Dimensions.get('window');

type ListingDetailScreenRouteProp = RouteProp<RootStackParamList, 'ListingDetail'>;
type ListingDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ListingDetail'>;

interface ListingDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  location: string;
  category: string;
  condition: string;
  createdAt: string;
  viewCount: number;
  isPremium: boolean;
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    isVerified: boolean;
  };
}

const ListingDetailScreen: React.FC = () => {
  const route = useRoute<ListingDetailScreenRouteProp>();
  const navigation = useNavigation<ListingDetailScreenNavigationProp>();
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListingDetail();
  }, [route.params.listingId]);

  const loadListingDetail = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockListing: ListingDetail = {
        id: route.params.listingId,
        title: 'iPhone 14 Pro Max - 256GB - Uzay Grisi',
        description: 'Mükemmel durumda, kutulu, garantili iPhone 14 Pro Max. Sadece 3 ay kullanıldı, hiçbir çizik yok. Tüm aksesuarları ile birlikte satılık.',
        price: 25000,
        images: [
          'https://via.placeholder.com/400x300',
          'https://via.placeholder.com/400x300',
          'https://via.placeholder.com/400x300',
        ],
        location: 'İstanbul, Kadıköy',
        category: 'Elektronik',
        condition: 'İkinci El',
        createdAt: '2024-01-15',
        viewCount: 150,
        isPremium: true,
        seller: {
          id: 'seller1',
          name: 'Ahmet Yılmaz',
          avatar: 'https://via.placeholder.com/50x50',
          rating: 4.8,
          isVerified: true,
        },
      };
      
      setListing(mockListing);
    } catch (error) {
      Alert.alert('Hata', 'İlan detayları yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleContactSeller = () => {
    if (!user) {
      Alert.alert('Giriş Gerekli', 'Satıcı ile iletişime geçmek için giriş yapmalısınız');
      return;
    }

    navigation.navigate('Chat', {
      chatId: `chat_${listing?.id}`,
      recipientId: listing?.seller.id || '',
      recipientName: listing?.seller.name || '',
    });
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? 'Favorilerden Çıkarıldı' : 'Favorilere Eklendi',
      isFavorite ? 'İlan favorilerinizden çıkarıldı' : 'İlan favorilerinize eklendi'
    );
  };

  const handleShare = () => {
    Alert.alert('Paylaş', 'İlan paylaşma özelliği yakında eklenecek');
  };

  if (loading || !listing) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Yükleniyor...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: listing.images[currentImageIndex] }}
            style={styles.mainImage}
          />
          {listing.isPremium && (
            <View style={[styles.premiumBadge, { backgroundColor: theme.colors.warning }]}>
              <Text style={[styles.premiumText, { color: theme.colors.background }]}>
                PREMIUM
              </Text>
            </View>
          )}
          
          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            {listing.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  {
                    backgroundColor: index === currentImageIndex 
                      ? theme.colors.primary 
                      : theme.colors.textSecondary,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {listing.title}
            </Text>
            <Text style={[styles.price, { color: theme.colors.primary }]}>
              ₺{listing.price.toLocaleString()}
            </Text>
          </View>

          <View style={styles.metaInfo}>
            <Text style={[styles.location, { color: theme.colors.textSecondary }]}>
              📍 {listing.location}
            </Text>
            <Text style={[styles.views, { color: theme.colors.textSecondary }]}>
              👁️ {listing.viewCount} görüntüleme
            </Text>
          </View>

          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Kategori:
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                {listing.category}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Durum:
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                {listing.condition}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                İlan Tarihi:
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
              </Text>
            </View>
          </View>

          <View style={styles.description}>
            <Text style={[styles.descriptionTitle, { color: theme.colors.text }]}>
              Açıklama
            </Text>
            <Text style={[styles.descriptionText, { color: theme.colors.text }]}>
              {listing.description}
            </Text>
          </View>

          {/* Seller Info */}
          <View style={[styles.sellerSection, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sellerTitle, { color: theme.colors.text }]}>
              Satıcı Bilgileri
            </Text>
            <View style={styles.sellerInfo}>
              <Image source={{ uri: listing.seller.avatar }} style={styles.sellerAvatar} />
              <View style={styles.sellerDetails}>
                <View style={styles.sellerNameRow}>
                  <Text style={[styles.sellerName, { color: theme.colors.text }]}>
                    {listing.seller.name}
                  </Text>
                  {listing.seller.isVerified && (
                    <Text style={styles.verifiedBadge}>✓</Text>
                  )}
                </View>
                <Text style={[styles.sellerRating, { color: theme.colors.textSecondary }]}>
                  ⭐ {listing.seller.rating}/5.0
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.actionBar, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          style={[styles.actionButton, { borderColor: theme.colors.border }]}
          onPress={handleToggleFavorite}
        >
          <Text style={styles.actionIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { borderColor: theme.colors.border }]}
          onPress={handleShare}
        >
          <Text style={styles.actionIcon}>📤</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.contactButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleContactSeller}
        >
          <Text style={[styles.contactButtonText, { color: theme.colors.background }]}>
            Satıcı ile İletişim
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  mainImage: {
    width: width,
    height: 300,
    resizeMode: 'cover',
  },
  premiumBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  location: {
    fontSize: 14,
  },
  views: {
    fontSize: 14,
  },
  details: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  description: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  sellerSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 100, // Space for action bar
  },
  sellerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  sellerDetails: {
    flex: 1,
  },
  sellerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  verifiedBadge: {
    fontSize: 16,
    color: '#34C759',
  },
  sellerRating: {
    fontSize: 14,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    gap: 12,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 20,
  },
  contactButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ListingDetailScreen; 