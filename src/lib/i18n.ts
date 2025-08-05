import tr from '@/locales/tr.json';
import en from '@/locales/en.json';

export type Locale = 'tr' | 'en';

export interface I18nConfig {
  defaultLocale: Locale;
  supportedLocales: Locale[];
  fallbackLocale: Locale;
}

export interface TranslationData {
  [key: string]: any;
}

class I18nService {
  private static instance: I18nService;
  private currentLocale: Locale = 'tr';
  private translations: Record<Locale, TranslationData> = {
    tr,
    en,
  };
  private config: I18nConfig = {
    defaultLocale: 'tr',
    supportedLocales: ['tr', 'en'],
    fallbackLocale: 'tr',
  };

  static getInstance(): I18nService {
    if (!I18nService.instance) {
      I18nService.instance = new I18nService();
    }
    return I18nService.instance;
  }

  // Mevcut dili al
  getCurrentLocale(): Locale {
    return this.currentLocale;
  }

  // Dili ayarla
  setLocale(locale: Locale): void {
    if (this.config.supportedLocales.includes(locale)) {
      this.currentLocale = locale;
      
      // LocalStorage'a kaydet
      if (typeof window !== 'undefined') {
        localStorage.setItem('alo17-locale', locale);
      }
    }
  }

  // Desteklenen dilleri al
  getSupportedLocales(): Locale[] {
    return this.config.supportedLocales;
  }

  // Konfigürasyonu güncelle
  updateConfig(newConfig: Partial<I18nConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Çeviri al
  t(key: string, params?: Record<string, any>): string {
    const keys = key.split('.');
    let translation: any = this.translations[this.currentLocale];

    // Anahtar yolunu takip et
    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k];
      } else {
        // Fallback locale'den dene
        translation = this.translations[this.config.fallbackLocale];
        for (const fallbackKey of keys) {
          if (translation && typeof translation === 'object' && fallbackKey in translation) {
            translation = translation[fallbackKey];
          } else {
            return key; // Anahtarı döndür
          }
        }
        break;
      }
    }

    // String değilse anahtarı döndür
    if (typeof translation !== 'string') {
      return key;
    }

    // Parametreleri değiştir
    if (params) {
      return this.interpolate(translation, params);
    }

    return translation;
  }

  // Parametre interpolasyonu
  private interpolate(text: string, params: Record<string, any>): string {
    return text.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? String(params[key]) : match;
    });
  }

  // Çoklu çeviri al
  tMultiple(keys: string[], params?: Record<string, any>): Record<string, string> {
    const result: Record<string, string> = {};
    
    for (const key of keys) {
      result[key] = this.t(key, params);
    }
    
    return result;
  }

  // Tarih formatla
  formatDate(date: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    return dateObj.toLocaleDateString(this.getLocaleCode(), {
      ...defaultOptions,
      ...options,
    });
  }

  // Para formatla
  formatCurrency(amount: number, currency: string = 'TRY'): string {
    return new Intl.NumberFormat(this.getLocaleCode(), {
      style: 'currency',
      currency,
    }).format(amount);
  }

  // Sayı formatla
  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(this.getLocaleCode(), options).format(number);
  }

  // Yüzde formatla
  formatPercent(value: number, decimals: number = 2): string {
    return new Intl.NumberFormat(this.getLocaleCode(), {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value / 100);
  }

  // Locale kodunu al
  private getLocaleCode(): string {
    const localeMap: Record<Locale, string> = {
      tr: 'tr-TR',
      en: 'en-US',
    };
    return localeMap[this.currentLocale];
  }

  // Dil yönünü al (LTR/RTL)
  getDirection(): 'ltr' | 'rtl' {
    const rtlLocales = ['ar', 'he', 'fa', 'ur'];
    const localeCode = this.getLocaleCode();
    return rtlLocales.some(locale => localeCode.startsWith(locale)) ? 'rtl' : 'ltr';
  }

  // Dil bilgilerini al
  getLocaleInfo(locale: Locale): {
    name: string;
    nativeName: string;
    flag: string;
    code: string;
  } {
    const localeInfo: Record<Locale, any> = {
      tr: {
        name: 'Turkish',
        nativeName: 'Türkçe',
        flag: '🇹🇷',
        code: 'tr-TR',
      },
      en: {
        name: 'English',
        nativeName: 'English',
        flag: '🇺🇸',
        code: 'en-US',
      },
    };

    return localeInfo[locale] || localeInfo[this.config.fallbackLocale];
  }

  // Tüm dil bilgilerini al
  getAllLocaleInfo(): Array<{
    code: Locale;
    name: string;
    nativeName: string;
    flag: string;
  }> {
    return this.config.supportedLocales.map(locale => ({
      code: locale,
      ...this.getLocaleInfo(locale),
    }));
  }

  // Çeviri anahtarlarını al
  getTranslationKeys(prefix?: string): string[] {
    const keys: string[] = [];
    const translations = this.translations[this.currentLocale];

    const extractKeys = (obj: any, currentPrefix: string = '') => {
      for (const key in obj) {
        const fullKey = currentPrefix ? `${currentPrefix}.${key}` : key;
        
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          extractKeys(obj[key], fullKey);
        } else {
          if (!prefix || fullKey.startsWith(prefix)) {
            keys.push(fullKey);
          }
        }
      }
    };

    extractKeys(translations);
    return keys;
  }

  // Eksik çevirileri bul
  findMissingTranslations(locale: Locale): string[] {
    const referenceKeys = this.getTranslationKeys();
    const targetKeys = this.getTranslationKeys();
    
    return referenceKeys.filter(key => !targetKeys.includes(key));
  }

  // Çeviri istatistiklerini al
  getTranslationStats(): Record<Locale, { total: number; translated: number; missing: number }> {
    const stats: Record<Locale, any> = {};
    
    for (const locale of this.config.supportedLocales) {
      const keys = this.getTranslationKeys();
      const total = keys.length;
      const translated = keys.filter(key => {
        const keys = key.split('.');
        let translation: any = this.translations[locale];
        
        for (const k of keys) {
          if (translation && typeof translation === 'object' && k in translation) {
            translation = translation[k];
          } else {
            return false;
          }
        }
        
        return typeof translation === 'string';
      }).length;
      
      stats[locale] = {
        total,
        translated,
        missing: total - translated,
      };
    }
    
    return stats;
  }

  // LocalStorage'dan dili yükle
  loadLocaleFromStorage(): void {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('alo17-locale') as Locale;
      if (savedLocale && this.config.supportedLocales.includes(savedLocale)) {
        this.currentLocale = savedLocale;
      }
    }
  }

  // Dil değişikliği dinleyicisi
  onLocaleChange(callback: (locale: Locale) => void): () => void {
    const originalSetLocale = this.setLocale.bind(this);
    
    this.setLocale = (locale: Locale) => {
      originalSetLocale(locale);
      callback(locale);
    };
    
    return () => {
      this.setLocale = originalSetLocale;
    };
  }
}

// Global i18n instance
export const i18n = I18nService.getInstance();

// React hook için yardımcı fonksiyon
export function useTranslation() {
  return {
    t: i18n.t.bind(i18n),
    tMultiple: i18n.tMultiple.bind(i18n),
    formatDate: i18n.formatDate.bind(i18n),
    formatCurrency: i18n.formatCurrency.bind(i18n),
    formatNumber: i18n.formatNumber.bind(i18n),
    formatPercent: i18n.formatPercent.bind(i18n),
    getCurrentLocale: i18n.getCurrentLocale.bind(i18n),
    setLocale: i18n.setLocale.bind(i18n),
    getSupportedLocales: i18n.getSupportedLocales.bind(i18n),
    getLocaleInfo: i18n.getLocaleInfo.bind(i18n),
    getAllLocaleInfo: i18n.getAllLocaleInfo.bind(i18n),
    getDirection: i18n.getDirection.bind(i18n),
  };
}

export default i18n; 