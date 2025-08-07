import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function CreateListingScreen() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.location) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    Alert.alert(
      'Başarılı',
      'İlanınız başarıyla oluşturuldu!',
      [
        { text: 'Tamam', onPress: () => navigation.goBack() }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Yeni İlan Oluştur</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>İlan Başlığı *</Text>
          <TextInput
            style={styles.input}
            placeholder="İlan başlığını girin"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Açıklama *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="İlan açıklamasını girin"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Fiyat (₺) *</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Kategori *</Text>
          <TouchableOpacity style={styles.pickerButton}>
            <Text style={formData.category ? styles.pickerText : styles.pickerPlaceholder}>
              {formData.category || 'Kategori seçin'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Konum *</Text>
          <TextInput
            style={styles.input}
            placeholder="Şehir/İlçe"
            value={formData.location}
            onChangeText={(text) => setFormData({ ...formData, location: text })}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Fotoğraflar</Text>
          <TouchableOpacity style={styles.photoButton}>
            <Ionicons name="camera" size={24} color="#3B82F6" />
            <Text style={styles.photoButtonText}>Fotoğraf Ekle</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>İlanı Yayınla</Text>
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  pickerPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  photoButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  photoButtonText: {
    fontSize: 16,
    color: '#3B82F6',
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
}); 