import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../types/navigation';

type PaymentSuccessScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PaymentSuccess'>;

interface PaymentSuccessScreenProps {
  route: {
    params: {
      token: string;
      amount: number;
    };
  };
}

const PaymentSuccessScreen: React.FC<PaymentSuccessScreenProps> = ({ route }) => {
  const navigation = useNavigation<PaymentSuccessScreenNavigationProp>();
  const theme = useTheme();
  const { token, amount } = route.params;

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  const handleViewReceipt = () => {
    // Makbuz görüntüleme işlemi
    console.log('Makbuz görüntüleniyor:', token);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Başarı İkonu */}
      <View style={styles.iconContainer}>
        <Text style={styles.successIcon}>✅</Text>
      </View>

      {/* Başlık */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Ödeme Başarılı!
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Ödeme işleminiz başarıyla tamamlandı
        </Text>
      </View>

      {/* Ödeme Detayları */}
      <View style={[styles.detailsContainer, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.detailsTitle, { color: theme.colors.text }]}>
          Ödeme Detayları
        </Text>
        
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
            İşlem Tutarı:
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.text }]}>
            ₺{amount.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
            İşlem Kodu:
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.text }]}>
            {token}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
            Tarih:
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.text }]}>
            {new Date().toLocaleDateString('tr-TR')}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
            Saat:
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.text }]}>
            {new Date().toLocaleTimeString('tr-TR')}
          </Text>
        </View>
      </View>

      {/* Bilgi Mesajları */}
      <View style={[styles.infoContainer, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
          Önemli Bilgiler
        </Text>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>📧</Text>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            Ödeme onayı e-posta adresinize gönderildi
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>📱</Text>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            SMS ile bilgilendirme yapılacak
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>🔒</Text>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            İşlem güvenli şekilde kaydedildi
          </Text>
        </View>
      </View>

      {/* Butonlar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleGoHome}
        >
          <Text style={[styles.primaryButtonText, { color: theme.colors.background }]}>
            Ana Sayfaya Dön
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border
          }]}
          onPress={handleViewReceipt}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.colors.text }]}>
            📄 Makbuzu Görüntüle
          </Text>
        </TouchableOpacity>
      </View>

      {/* Alt Bilgi */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
          Herhangi bir sorunuz varsa müşteri hizmetlerimizle iletişime geçebilirsiniz
        </Text>
        <Text style={[styles.contactInfo, { color: theme.colors.primary }]}>
          📞 0850 123 45 67
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  detailsContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 30,
  },
  primaryButton: {
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  contactInfo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentSuccessScreen; 