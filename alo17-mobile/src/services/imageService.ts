import { Platform, Alert, PermissionsAndroid } from 'react-native';
import { launchImageLibrary, launchCamera, ImagePickerResponse, Image } from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';

export interface ImageUploadResult {
  uri: string;
  type: string;
  name: string;
  size?: number;
}

class ImageService {
  // Kamera izni iste
  async requestCameraPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Kamera İzni',
            message: 'Fotoğraf çekmek için kamera izni gerekiyor',
            buttonNeutral: 'Daha Sonra Sor',
            buttonNegative: 'İptal',
            buttonPositive: 'Tamam',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  }

  // Galeri izni iste
  async requestGalleryPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Galeri İzni',
            message: 'Fotoğraf seçmek için galeri izni gerekiyor',
            buttonNeutral: 'Daha Sonra Sor',
            buttonNegative: 'İptal',
            buttonPositive: 'Tamam',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  }

  // Galeriden fotoğraf seç
  async pickFromGallery(): Promise<ImageUploadResult | null> {
    try {
      const hasPermission = await this.requestGalleryPermission();
      if (!hasPermission) {
        Alert.alert('İzin Gerekli', 'Galeri izni olmadan fotoğraf seçemezsiniz.');
        return null;
      }

      const result: ImagePickerResponse = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
        includeBase64: false,
      });

      if (result.didCancel) {
        return null;
      }

      if (result.errorCode) {
        Alert.alert('Hata', 'Fotoğraf seçilirken bir hata oluştu.');
        return null;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        return {
          uri: asset.uri || '',
          type: asset.type || 'image/jpeg',
          name: asset.fileName || `photo_${Date.now()}.jpg`,
          size: asset.fileSize,
        };
      }

      return null;
    } catch (error) {
      console.error('Galeri seçim hatası:', error);
      Alert.alert('Hata', 'Fotoğraf seçilirken bir hata oluştu.');
      return null;
    }
  }

  // Kameradan fotoğraf çek
  async takePhoto(): Promise<ImageUploadResult | null> {
    try {
      const hasPermission = await this.requestCameraPermission();
      if (!hasPermission) {
        Alert.alert('İzin Gerekli', 'Kamera izni olmadan fotoğraf çekemezsiniz.');
        return null;
      }

      const result: ImagePickerResponse = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
        includeBase64: false,
        saveToPhotos: true,
      });

      if (result.didCancel) {
        return null;
      }

      if (result.errorCode) {
        Alert.alert('Hata', 'Fotoğraf çekilirken bir hata oluştu.');
        return null;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        return {
          uri: asset.uri || '',
          type: asset.type || 'image/jpeg',
          name: asset.fileName || `photo_${Date.now()}.jpg`,
          size: asset.fileSize,
        };
      }

      return null;
    } catch (error) {
      console.error('Kamera hatası:', error);
      Alert.alert('Hata', 'Fotoğraf çekilirken bir hata oluştu.');
      return null;
    }
  }

  // Fotoğraf kırp
  async cropImage(imageUri: string): Promise<ImageUploadResult | null> {
    try {
      const result = await ImageCropPicker.openCropper({
        path: imageUri,
        width: 800,
        height: 600,
        cropperCircleOverlay: false,
        freeStyleCropEnabled: true,
        cropperActiveWidgetColor: '#3B82F6',
        cropperStatusBarColor: '#3B82F6',
        cropperToolbarColor: '#3B82F6',
        cropperToolbarTitle: 'Fotoğrafı Kırp',
      });

      return {
        uri: result.path,
        type: result.mime || 'image/jpeg',
        name: result.path.split('/').pop() || `cropped_${Date.now()}.jpg`,
        size: result.size,
      };
    } catch (error) {
      console.error('Kırpma hatası:', error);
      return null;
    }
  }

  // Çoklu fotoğraf seç
  async pickMultiplePhotos(maxCount: number = 5): Promise<ImageUploadResult[]> {
    try {
      const hasPermission = await this.requestGalleryPermission();
      if (!hasPermission) {
        Alert.alert('İzin Gerekli', 'Galeri izni olmadan fotoğraf seçemezsiniz.');
        return [];
      }

      const result: ImagePickerResponse = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
        includeBase64: false,
        selectionLimit: maxCount,
      });

      if (result.didCancel || !result.assets) {
        return [];
      }

      return result.assets.map((asset) => ({
        uri: asset.uri || '',
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `photo_${Date.now()}.jpg`,
        size: asset.fileSize,
      }));
    } catch (error) {
      console.error('Çoklu fotoğraf seçim hatası:', error);
      Alert.alert('Hata', 'Fotoğraflar seçilirken bir hata oluştu.');
      return [];
    }
  }

  // Fotoğraf boyutunu kontrol et
  validateImageSize(image: ImageUploadResult, maxSizeMB: number = 5): boolean {
    if (!image.size) return true; // Boyut bilgisi yoksa geç
    const sizeInMB = image.size / (1024 * 1024);
    return sizeInMB <= maxSizeMB;
  }

  // Fotoğraf formatını kontrol et
  validateImageFormat(image: ImageUploadResult): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    return allowedTypes.includes(image.type.toLowerCase());
  }

  // Fotoğrafı sıkıştır
  async compressImage(image: ImageUploadResult, quality: number = 0.8): Promise<ImageUploadResult> {
    try {
      const result = await ImageCropPicker.openCropper({
        path: image.uri,
        width: 800,
        height: 600,
        quality: quality,
        cropperCircleOverlay: false,
        freeStyleCropEnabled: false,
      });

      return {
        uri: result.path,
        type: result.mime || image.type,
        name: result.path.split('/').pop() || image.name,
        size: result.size,
      };
    } catch (error) {
      console.error('Sıkıştırma hatası:', error);
      return image; // Hata durumunda orijinal fotoğrafı döndür
    }
  }
}

export default new ImageService(); 