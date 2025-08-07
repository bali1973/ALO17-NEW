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
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';
import { RootStackParamList } from '../../types/navigation';
import ImageService, { ImageUploadResult } from '../../services/imageService';
import { listingsAPI } from '../../services/api';

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
  const [images, setImages] = useState<ImageUploadResult[]>([]);
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

  // Fotoğraf seçme modalı
  const showImagePicker = () => {
    Alert.alert(
      'Fotoğraf Ekle',
      'Fotoğraf eklemek için bir seçenek seçin',
      [
        {
          text: 'Galeriden Seç',
          onPress: pickFromGallery,
        },
        {
          text: 'Kamera ile Çek',
          onPress: takePhoto,
        },
        {
          text: 'İptal',
          style: 'cancel',
        },
      ]
    );
  };

  // Galeriden fotoğraf seç
  const pickFromGallery = async () => {
    const image = await ImageService.pickFromGallery();
    if (image) {
      addImage(image);
    }
  };

  // Kameradan fotoğraf çek
  const takePhoto = async () => {
    const image = await ImageService.takePhoto();
    if (image) {
      addImage(image);
    }
  };

  // Fotoğraf ekle
  const addImage = (image: ImageUploadResult) => {
    // Boyut kontrolü
    if (!ImageService.validateImageSize(image, 5)) {
      Alert.alert('Hata', 'Fotoğraf boyutu 5MB\'dan küçük olmalıdır.');
      return;
    }

    // Format kontrolü
    if (!ImageService.validateImageFormat(image)) {
      Alert.alert('Hata', 'Sadece JPEG, PNG ve WebP formatları desteklenir.');
      return;
    }

    // Maksimum 5 fotoğraf
    if (images.length >= 5) {
      Alert.alert('Hata', 'Maksimum 5 fotoğraf ekleyebilirsiniz.');
      return;
    }

    setImages([...images, image]);
  };

  // Fotoğraf kaldır
  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  // Fotoğraf kırp
  const cropImage = async (index: number) => {
    const image = images[index];
    const croppedImage = await ImageService.cropImage(image.uri);
    if (croppedImage) {
      const newImages = [...images];
      newImages[index] = croppedImage;
      setImages(newImages);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !price || !category || !location || !condition) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      Alert.alert('Hata', 'Geçerli bir fiyat girin');
      return;
    }

    if (images.length === 0) {
      Alert.alert('Hata', 'En az bir fotoğraf eklemelisiniz');
      return;
    }

    try {
      setIsLoading(true);
      
      // API'ye gönderilecek veri
      const listingData = {
        title,
        description,
        price: Number(price),
        category,
        subcategory: '',
        location,
        condition,
        images: images.map(img => img.uri),
      };

      // API çağrısı
      const response = await listingsAPI.create(listingData);
      
      if (response.data) {
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
      }
    } catch (error) {
      console.error('İlan oluşturma hatası:', error);
      Alert.alert('Hata', 'İlan oluşturulurken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const renderImageItem = ({ item, index }: { item: ImageUploadResult; index: number }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.uri }} style={styles.imagePreview} />
      <View style={styles.imageActions}>
        <TouchableOpacity
          style={[styles.imageActionButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => cropImage(index)}
        >
          <Text style={[styles.imageActionText, { color: theme.colors.background }]}>
            Kırp
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.imageActionButton, { backgroundColor: theme.colors.error }]}
          onPress={() => removeImage(index)}
        >
          <Text style={[styles.imageActionText, { color: theme.colors.background }]}>
            Sil
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
        {/* Fotoğraf Bölümü */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Fotoğraflar * ({images.length}/5)
          </Text>
          
          {images.length > 0 && (
            <FlatList
              data={images}
              renderItem={renderImageItem}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imageList}
            />
          )}
          
          <TouchableOpacity
            style={[
              styles.addImageButton,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={showImagePicker}
          >
            <Text style={[styles.addImageText, { color: theme.colors.primary }]}>
              📷 Fotoğraf Ekle
            </Text>
          </TouchableOpacity>
        </View>

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
  imageList: {
    marginBottom: 12,
  },
  imageContainer: {
    marginRight: 12,
    alignItems: 'center',
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  imageActions: {
    flexDirection: 'row',
    gap: 8,
  },
  imageActionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  imageActionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  addImageButton: {
    height: 80,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    fontSize: 16,
    fontWeight: '500',
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