import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const SettingsScreen: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [locationEnabled, setLocationEnabled] = React.useState(true);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = React.useState(false);

  const handleClearCache = () => {
    Alert.alert(
      'Önbelleği Temizle',
      'Uygulama önbelleği temizlenecek. Bu işlem biraz zaman alabilir.',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Temizle',
          onPress: () => {
            // TODO: Implement cache clearing
            Alert.alert('Başarılı', 'Önbellek temizlendi');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Veri Dışa Aktar',
      'Kişisel verileriniz dışa aktarılacak. Bu işlem biraz zaman alabilir.',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Dışa Aktar',
          onPress: () => {
            // TODO: Implement data export
            Alert.alert('Başarılı', 'Verileriniz dışa aktarıldı');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Hesabı Sil',
      'Hesabınız kalıcı olarak silinecek. Bu işlem geri alınamaz!',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Hesap Silindi', 'Hesabınız başarıyla silindi');
          },
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Görünüm',
      items: [
        {
          id: 'theme',
          title: 'Koyu Tema',
          type: 'switch',
          value: isDark,
          onPress: toggleTheme,
        },
      ],
    },
    {
      title: 'Bildirimler',
      items: [
        {
          id: 'notifications',
          title: 'Push Bildirimleri',
          type: 'switch',
          value: notificationsEnabled,
          onPress: setNotificationsEnabled,
        },
      ],
    },
    {
      title: 'Konum',
      items: [
        {
          id: 'location',
          title: 'Konum Servisleri',
          type: 'switch',
          value: locationEnabled,
          onPress: setLocationEnabled,
        },
      ],
    },
    {
      title: 'Performans',
      items: [
        {
          id: 'autoRefresh',
          title: 'Otomatik Yenileme',
          type: 'switch',
          value: autoRefreshEnabled,
          onPress: setAutoRefreshEnabled,
        },
        {
          id: 'clearCache',
          title: 'Önbelleği Temizle',
          type: 'button',
          onPress: handleClearCache,
        },
      ],
    },
    {
      title: 'Veri',
      items: [
        {
          id: 'exportData',
          title: 'Veri Dışa Aktar',
          type: 'button',
          onPress: handleExportData,
        },
      ],
    },
    {
      title: 'Hesap',
      items: [
        {
          id: 'deleteAccount',
          title: 'Hesabı Sil',
          type: 'button',
          onPress: handleDeleteAccount,
          destructive: true,
        },
      ],
    },
  ];

  const renderSettingItem = (item: any) => (
    <View
      key={item.id}
      style={[
        styles.settingItem,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
        {item.title}
      </Text>
      
      {item.type === 'switch' ? (
        <Switch
          value={item.value}
          onValueChange={item.onPress}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          thumbColor={theme.colors.background}
        />
      ) : (
        <TouchableOpacity
          onPress={item.onPress}
          style={[
            styles.settingButton,
            {
              backgroundColor: item.destructive ? theme.colors.error : theme.colors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.settingButtonText,
              { color: theme.colors.background },
            ]}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Ayarlar
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
          Uygulama tercihlerinizi yönetin
        </Text>
      </View>

      {settingsSections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {section.title}
          </Text>
          {section.items.map(renderSettingItem)}
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>
          Alo17 v1.0.0
        </Text>
        <Text style={[styles.copyrightText, { color: theme.colors.textSecondary }]}>
          © 2024 Alo17. Tüm hakları saklıdır.
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
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  settingButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  versionText: {
    fontSize: 14,
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
  },
});

export default SettingsScreen; 