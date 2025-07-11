import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';
import { RootStackParamList } from '../../types/navigation';

type CreateListingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

const CreateListingScreen: React.FC = () => {
  const navigation = useNavigation<CreateListingScreenNavigationProp>();
  const { theme } = useTheme();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [condition, setCondition] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'Elektronik',
    'Ev & Yaşam',
    'Moda',
    'Spor',
    'Kitap',
    'Otomobil',
    'Emlak',
    'Diğer',
  ];

  const conditions = ['Yeni', 'İkinci El'];

  const handleSubmit = async () => {
    if (!title || !description || !price || !category || !location || !condition) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      Alert.alert('Hata', 'Geçerli bir fiyat girin');
      return;
    }

    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Başarılı',
        'İlanınız başarıyla oluşturuldu ve onay için gönderildi',
        [
          {
            text: 'Tamam',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Hata', 'İlan oluşturulurken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCategoryButton = (cat: string) => (
    <TouchableOpacity
      key={cat}
      style={[
        styles.categoryButton,
        {
          backgroundColor: category === cat ? theme.colors.primary : theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={() => setCategory(cat)}
    >
      <Text
        style={[
          styles.categoryButtonText,
          {
            color: category === cat ? theme.colors.background : theme.colors.text,
          },
        ]}
      >
        {cat}
      </Text>
    </TouchableOpacity>
  );

  const renderConditionButton = (cond: string) => (
    <TouchableOpacity
      key={cond}
      style={[
        styles.conditionButton,
        {
          backgroundColor: condition === cond ? theme.colors.primary : theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={() => setCondition(cond)}
    >
      <Text
        style={[
          styles.conditionButtonText,
          {
            color: condition === cond ? theme.colors.background : theme.colors.text,
          },
        ]}
      >
        {cond}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Yeni İlan Oluştur
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Ürününüzü satışa çıkarın
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            İlan Başlığı *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                color: theme.colors.text,
              },
            ]}
            placeholder="Ürününüzün başlığını girin"
            placeholderTextColor={theme.colors.textSecondary}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Açıklama *
          </Text>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                color: theme.colors.text,
              },
            ]}
            placeholder="Ürününüzün detaylı açıklamasını girin"
            placeholderTextColor={theme.colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Fiyat (₺) *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                color: theme.colors.text,
              },
            ]}
            placeholder="0"
            placeholderTextColor={theme.colors.textSecondary}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Kategori *
          </Text>
          <View style={styles.categoryContainer}>
            {categories.map(renderCategoryButton)}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Durum *
          </Text>
          <View style={styles.conditionContainer}>
            {conditions.map(renderConditionButton)}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Konum *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                color: theme.colors.text,
              },
            ]}
            placeholder="Şehir, ilçe"
            placeholderTextColor={theme.colors.textSecondary}
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            {
              backgroundColor: theme.colors.primary,
              opacity: isLoading ? 0.7 : 1,
            },
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={[styles.submitButtonText, { color: theme.colors.background }]}>
            {isLoading ? 'Oluşturuluyor...' : 'İlanı Yayınla'}
          </Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  conditionContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  conditionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  conditionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateListingScreen; 