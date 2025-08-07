import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ListingDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { listingId } = route.params as { listingId: string };

  const handleContact = () => {
    Alert.alert('İletişim', 'Satıcı ile iletişime geçmek için giriş yapın.');
  };

  const handleFavorite = () => {
    Alert.alert('Favori', 'Bu ilanı favorilere eklemek için giriş yapın.');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/400x300' }}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteButton} onPress={handleFavorite}>
          <Ionicons name="heart-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>iPhone 13 Pro Max</Text>
        <Text style={styles.price}>25.000 ₺</Text>
        
        <View style={styles.metaInfo}>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.metaText}>İstanbul</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.metaText}>2 gün önce</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="eye-outline" size={16} color="#666" />
            <Text style={styles.metaText}>1.2k görüntüleme</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Açıklama</Text>
          <Text style={styles.description}>
            iPhone 13 Pro Max, 256GB, Sierra Blue renk. 1 yıl kullanıldı, 
            çok iyi durumda. Orijinal kutusu ve aksesuarları ile birlikte. 
            Garanti süresi devam ediyor. Fiyatta pazarlık payı var.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Özellikler</Text>
          <View style={styles.features}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.featureText}>Orijinal ürün</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.featureText}>Garanti mevcut</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.featureText}>Kutusu ile birlikte</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Satıcı Bilgileri</Text>
          <View style={styles.sellerInfo}>
            <View style={styles.sellerAvatar}>
              <Ionicons name="person" size={24} color="#fff" />
            </View>
            <View style={styles.sellerDetails}>
              <Text style={styles.sellerName}>Ahmet Yılmaz</Text>
              <Text style={styles.sellerLocation}>İstanbul, Türkiye</Text>
              <Text style={styles.sellerRating}>⭐ 4.8 (156 değerlendirme)</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
          <Ionicons name="chatbubble" size={20} color="#fff" />
          <Text style={styles.contactButtonText}>İletişime Geç</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.callButton} onPress={handleContact}>
          <Ionicons name="call" size={20} color="#3B82F6" />
          <Text style={styles.callButtonText}>Ara</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 16,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  features: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sellerLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  sellerRating: {
    fontSize: 14,
    color: '#666',
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    marginRight: 12,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  callButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 