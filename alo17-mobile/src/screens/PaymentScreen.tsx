import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../types/navigation';
import PayTRService from '../services/paytrService';
import AndroidPaymentModule from '../services/androidPaymentModule';
import { PaymentPlan } from '../services/paymentService';

type PaymentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Payment'>;

interface PaymentScreenProps {
  route: {
    params: {
      plan?: PaymentPlan;
      amount?: number;
      description?: string;
    };
  };
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ route }) => {
  const navigation = useNavigation<PaymentScreenNavigationProp>();
  const theme = useTheme();
  const { plan, amount, description } = route.params;

  const [loading, setLoading] = useState(false);
  const [nfcEnabled, setNfcEnabled] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'paytr' | 'nfc'>('paytr');
  
  // Form alanları
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');

  // NFC durumu
  const [nfcAvailable, setNfcAvailable] = useState(false);

  useEffect(() => {
    checkNfcStatus();
  }, []);

  // NFC durumunu kontrol et
  const checkNfcStatus = async () => {
    if (Platform.OS === 'android') {
      const isSupported = await AndroidPaymentModule.isNFCSupported();
      const isEnabled = await AndroidPaymentModule.isNFCEnabled();
      setNfcAvailable(isSupported);
      setNfcEnabled(isEnabled);
    } else {
      const isAvailable = PayTRService.isNfcAvailable();
      setNfcAvailable(isAvailable);
      setNfcEnabled(isAvailable);
    }
  };

  // NFC'yi etkinleştir/devre dışı bırak
  const toggleNfc = async (value: boolean) => {
    if (Platform.OS === 'android') {
      if (value) {
        await AndroidPaymentModule.openNFCSettings();
        Alert.alert('NFC Ayarları', 'NFC ayarlarını açtık. Lütfen NFC\'yi etkinleştirin.');
      }
    } else {
      if (value) {
        const success = await PayTRService.enableNfc();
        setNfcEnabled(success);
        if (success) {
          Alert.alert('NFC Etkin', 'NFC ödeme için hazır');
        }
      } else {
        await PayTRService.disableNfc();
        setNfcEnabled(false);
      }
    }
  };

  // PayTR ödeme yap
  const processPayTRPayment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const paymentAmount = plan?.price || amount || 0;
      
      if (Platform.OS === 'android') {
        // Android Native Module kullan
        const result = await AndroidPaymentModule.startPayTRPayment({
          amount: paymentAmount,
          currency: 'TRY',
          description: plan?.name || description || 'Ödeme',
          userEmail: email,
          userName,
          userAddress,
          userPhone,
        });

        if (result.status === 'success') {
          navigation.navigate('PaymentSuccess', { 
            token: result.token,
            amount: paymentAmount 
          });
        } else if (result.status === 'cancelled') {
          Alert.alert('Ödeme İptal', 'Ödeme işlemi iptal edildi');
        } else {
          Alert.alert('Ödeme Hatası', result.error || 'Ödeme işlemi başarısız oldu');
        }
      } else {
        // iOS için PayTRService kullan
        const paymentResponse = await PayTRService.startPayment({
          amount: paymentAmount,
          currency: 'TRY',
          email,
          userName,
          userAddress,
          userPhone,
          basket: [{
            name: plan?.name || description || 'Ödeme',
            price: paymentAmount,
            quantity: 1,
          }],
        });

        if (paymentResponse.status === 'success') {
          Alert.alert(
            'Ödeme Başarılı',
            'Ödeme işlemi başlatıldı. PayTR sayfasına yönlendiriliyorsunuz.',
            [
              {
                text: 'Tamam',
                onPress: () => {
                  navigation.navigate('PaymentSuccess', { 
                    token: paymentResponse.token,
                    amount: paymentAmount 
                  });
                },
              },
            ]
          );
        } else {
          Alert.alert('Ödeme Hatası', paymentResponse.reason);
        }
      }
    } catch (error) {
      console.error('PayTR ödeme hatası:', error);
      Alert.alert('Ödeme Hatası', 'Ödeme işlemi başarısız oldu');
    } finally {
      setLoading(false);
    }
  };

  // NFC ödeme yap
  const processNfcPayment = async () => {
    if (!nfcEnabled) {
      Alert.alert('NFC Gerekli', 'NFC ödeme için NFC etkinleştirilmelidir');
      return;
    }

    if (!validateNfcForm()) return;

    setLoading(true);
    try {
      const paymentAmount = plan?.price || amount || 0;
      
      if (Platform.OS === 'android') {
        // Android Native NFC Module kullan
        const result = await AndroidPaymentModule.startNFCPayment({
          amount: paymentAmount,
          cardNumber: cardNumber.replace(/\s/g, ''),
          expiryDate,
          cvv,
        });

        if (result.status === 'success') {
          navigation.navigate('PaymentSuccess', { 
            token: result.transactionId || 'NFC_PAYMENT',
            amount: paymentAmount 
          });
        } else if (result.status === 'cancelled') {
          Alert.alert('NFC Ödeme İptal', 'NFC ödeme işlemi iptal edildi');
        } else {
          Alert.alert('NFC Ödeme Hatası', result.error || 'NFC ödeme işlemi başarısız oldu');
        }
      } else {
        // iOS için PayTRService kullan
        const success = await PayTRService.processNfcPayment({
          cardNumber: cardNumber.replace(/\s/g, ''),
          expiryDate,
          cardHolderName,
          amount: paymentAmount,
          currency: 'TRY',
        });

        if (success) {
          navigation.navigate('PaymentSuccess', { 
            token: 'NFC_PAYMENT',
            amount: paymentAmount 
          });
        }
      }
    } catch (error) {
      console.error('NFC ödeme hatası:', error);
      Alert.alert('NFC Ödeme Hatası', 'NFC ödeme işlemi başarısız oldu');
    } finally {
      setLoading(false);
    }
  };

  // Test ödeme yap
  const makeTestPayment = async () => {
    setLoading(true);
    try {
      const success = await PayTRService.makeTestPayment(1.00);
      if (success) {
        navigation.navigate('PaymentSuccess', { 
          token: 'TEST_PAYMENT',
          amount: 1.00 
        });
      }
    } catch (error) {
      console.error('Test ödeme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  // Form doğrulama
  const validateForm = (): boolean => {
    if (!email || !userName || !userAddress || !userPhone) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return false;
    }

    if (!email.includes('@')) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi girin');
      return false;
    }

    return true;
  };

  // NFC form doğrulama
  const validateNfcForm = (): boolean => {
    if (!cardNumber || !expiryDate || !cvv || !cardHolderName) {
      Alert.alert('Hata', 'Lütfen tüm kart bilgilerini doldurun');
      return false;
    }

    if (cardNumber.replace(/\s/g, '').length !== 16) {
      Alert.alert('Hata', 'Geçerli bir kart numarası girin');
      return false;
    }

    if (cvv.length !== 3) {
      Alert.alert('Hata', 'Geçerli bir CVV girin');
      return false;
    }

    return true;
  };

  // Kart numarasını formatla
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  // Son kullanma tarihini formatla
  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const paymentAmount = plan?.price || amount || 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Ödeme
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {plan?.name || description || 'Ödeme İşlemi'}
        </Text>
      </View>

      {/* Tutar Bilgisi */}
      <View style={[styles.amountContainer, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.amountLabel, { color: theme.colors.textSecondary }]}>
          Ödenecek Tutar
        </Text>
        <Text style={[styles.amount, { color: theme.colors.primary }]}>
          ₺{paymentAmount.toFixed(2)}
        </Text>
        {plan && (
          <Text style={[styles.planInfo, { color: theme.colors.textSecondary }]}>
            {plan.duration} günlük plan
          </Text>
        )}
      </View>

      {/* Ödeme Yöntemi Seçimi */}
      <View style={styles.paymentMethodContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Ödeme Yöntemi
        </Text>
        
        <TouchableOpacity
          style={[
            styles.methodOption,
            { backgroundColor: theme.colors.surface },
            paymentMethod === 'paytr' && { borderColor: theme.colors.primary }
          ]}
          onPress={() => setPaymentMethod('paytr')}
        >
          <Text style={[styles.methodText, { color: theme.colors.text }]}>
            💳 PayTR ile Öde
          </Text>
          <Text style={[styles.methodDescription, { color: theme.colors.textSecondary }]}>
            Kredi kartı, banka kartı veya havale
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.methodOption,
            { backgroundColor: theme.colors.surface },
            paymentMethod === 'nfc' && { borderColor: theme.colors.primary }
          ]}
          onPress={() => setPaymentMethod('nfc')}
          disabled={!nfcAvailable}
        >
          <Text style={[styles.methodText, { color: theme.colors.text }]}>
            📱 NFC ile Öde
          </Text>
          <Text style={[styles.methodDescription, { color: theme.colors.textSecondary }]}>
            Kartı telefonun arkasına yaklaştırın
          </Text>
          {!nfcAvailable && (
            <Text style={[styles.nfcUnavailable, { color: theme.colors.error }]}>
              NFC desteklenmiyor
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* PayTR Form */}
      {paymentMethod === 'paytr' && (
        <View style={styles.formContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Kişisel Bilgiler
          </Text>
          
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: theme.colors.border
            }]}
            placeholder="E-posta adresi"
            placeholderTextColor={theme.colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: theme.colors.border
            }]}
            placeholder="Ad Soyad"
            placeholderTextColor={theme.colors.textSecondary}
            value={userName}
            onChangeText={setUserName}
          />
          
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: theme.colors.border
            }]}
            placeholder="Adres"
            placeholderTextColor={theme.colors.textSecondary}
            value={userAddress}
            onChangeText={setUserAddress}
            multiline
          />
          
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: theme.colors.border
            }]}
            placeholder="Telefon"
            placeholderTextColor={theme.colors.textSecondary}
            value={userPhone}
            onChangeText={setUserPhone}
            keyboardType="phone-pad"
          />
        </View>
      )}

      {/* NFC Form */}
      {paymentMethod === 'nfc' && (
        <View style={styles.formContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            NFC Ayarları
          </Text>
          
          <View style={styles.nfcToggleContainer}>
            <Text style={[styles.nfcToggleText, { color: theme.colors.text }]}>
              NFC Etkinleştir
            </Text>
            <Switch
              value={nfcEnabled}
              onValueChange={toggleNfc}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.background}
            />
          </View>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Kart Bilgileri (Doğrulama için)
          </Text>
          
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: theme.colors.border
            }]}
            placeholder="Kart Numarası"
            placeholderTextColor={theme.colors.textSecondary}
            value={cardNumber}
            onChangeText={(text) => setCardNumber(formatCardNumber(text))}
            keyboardType="numeric"
            maxLength={19}
          />
          
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput, { 
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border
              }]}
              placeholder="AA/YY"
              placeholderTextColor={theme.colors.textSecondary}
              value={expiryDate}
              onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
              keyboardType="numeric"
              maxLength={5}
            />
            
            <TextInput
              style={[styles.input, styles.halfInput, { 
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border
              }]}
              placeholder="CVV"
              placeholderTextColor={theme.colors.textSecondary}
              value={cvv}
              onChangeText={setCvv}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
          
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: theme.colors.border
            }]}
            placeholder="Kart Sahibinin Adı"
            placeholderTextColor={theme.colors.textSecondary}
            value={cardHolderName}
            onChangeText={setCardHolderName}
          />
        </View>
      )}

      {/* Ödeme Butonları */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.payButton,
            { backgroundColor: theme.colors.primary },
            loading && { opacity: 0.7 }
          ]}
          onPress={paymentMethod === 'paytr' ? processPayTRPayment : processNfcPayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.background} />
          ) : (
            <Text style={[styles.payButtonText, { color: theme.colors.background }]}>
              {paymentMethod === 'paytr' ? 'PayTR ile Öde' : 'NFC ile Öde'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Test Ödeme Butonu */}
        <TouchableOpacity
          style={[
            styles.testButton,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
          ]}
          onPress={makeTestPayment}
          disabled={loading}
        >
          <Text style={[styles.testButtonText, { color: theme.colors.textSecondary }]}>
            🧪 Test Ödeme (₺1.00)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bilgi */}
      <View style={styles.infoContainer}>
        <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
          💳 PayTR güvenli ödeme altyapısı kullanılmaktadır
        </Text>
        <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
          📱 NFC ödeme için telefonunuzun NFC özelliği açık olmalıdır
        </Text>
        <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
          🔒 Tüm ödeme bilgileriniz şifrelenerek korunmaktadır
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
  },
  amountContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  amountLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  planInfo: {
    fontSize: 12,
    marginTop: 5,
  },
  paymentMethodContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  methodOption: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  methodDescription: {
    fontSize: 14,
  },
  nfcUnavailable: {
    fontSize: 12,
    marginTop: 5,
  },
  formContainer: {
    marginBottom: 30,
  },
  input: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  nfcToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    marginBottom: 20,
  },
  nfcToggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  payButton: {
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  testButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  testButtonText: {
    fontSize: 14,
  },
  infoContainer: {
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 12,
    marginBottom: 5,
  },
});

export default PaymentScreen; 