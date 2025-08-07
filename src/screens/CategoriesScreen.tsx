import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface Category {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  count: number;
}

const categories: Category[] = [
  { id: '1', name: 'Elektronik', icon: 'phone-portrait', color: '#3B82F6', count: 1250 },
  { id: '2', name: 'Ev & Bahçe', icon: 'home', color: '#10B981', count: 890 },
  { id: '3', name: 'Giyim', icon: 'shirt', color: '#F59E0B', count: 2100 },
  { id: '4', name: 'Anne & Bebek', icon: 'baby', color: '#EC4899', count: 450 },
  { id: '5', name: 'Spor & Hobi', icon: 'fitness', color: '#8B5CF6', count: 780 },
  { id: '6', name: 'Eğitim', icon: 'school', color: '#06B6D4', count: 320 },
  { id: '7', name: 'Yemek & İçecek', icon: 'restaurant', color: '#EF4444', count: 650 },
  { id: '8', name: 'Turizm', icon: 'airplane', color: '#84CC16', count: 420 },
  { id: '9', name: 'Sağlık & Güzellik', icon: 'heart', color: '#F97316', count: 380 },
  { id: '10', name: 'İş & Kariyer', icon: 'briefcase', color: '#6366F1', count: 290 },
  { id: '11', name: 'Hizmetler', icon: 'construct', color: '#14B8A6', count: 540 },
  { id: '12', name: 'Ücretsiz Gel Al', icon: 'gift', color: '#F43F5E', count: 180 },
];

export default function CategoriesScreen() {
  const navigation = useNavigation();

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => navigation.navigate('CategoryDetail', { categoryId: item.id, categoryName: item.name })}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={24} color="#fff" />
      </View>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categoryCount}>{item.count} ilan</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 14,
    color: '#666',
  },
}); 