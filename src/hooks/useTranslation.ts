import { useState, useEffect, useCallback } from 'react';
import { i18n, Locale } from '@/lib/i18n';

export function useTranslation() {
  const [currentLocale, setCurrentLocale] = useState<Locale>(i18n.getCurrentLocale());

  useEffect(() => {
    // LocalStorage'dan dili yükle
    i18n.loadLocaleFromStorage();
    setCurrentLocale(i18n.getCurrentLocale());

    // Dil değişikliği dinleyicisi
    const unsubscribe = i18n.onLocaleChange((locale) => {
      setCurrentLocale(locale);
    });

    return unsubscribe;
  }, []);

  const t = useCallback((key: string, params?: Record<string, any>): string => {
    return i18n.t(key, params);
  }, []);

  const tMultiple = useCallback((keys: string[], params?: Record<string, any>): Record<string, string> => {
    return i18n.tMultiple(keys, params);
  }, []);

  const formatDate = useCallback((date: Date | string | number, options?: Intl.DateTimeFormatOptions): string => {
    return i18n.formatDate(date, options);
  }, []);

  const formatCurrency = useCallback((amount: number, currency?: string): string => {
    return i18n.formatCurrency(amount, currency);
  }, []);

  const formatNumber = useCallback((number: number, options?: Intl.NumberFormatOptions): string => {
    return i18n.formatNumber(number, options);
  }, []);

  const formatPercent = useCallback((value: number, decimals?: number): string => {
    return i18n.formatPercent(value, decimals);
  }, []);

  const setLocale = useCallback((locale: Locale): void => {
    i18n.setLocale(locale);
  }, []);

  const getCurrentLocale = useCallback((): Locale => {
    return i18n.getCurrentLocale();
  }, []);

  const getSupportedLocales = useCallback((): Locale[] => {
    return i18n.getSupportedLocales();
  }, []);

  const getLocaleInfo = useCallback((locale: Locale) => {
    return i18n.getLocaleInfo(locale);
  }, []);

  const getAllLocaleInfo = useCallback(() => {
    return i18n.getAllLocaleInfo();
  }, []);

  const getDirection = useCallback((): 'ltr' | 'rtl' => {
    return i18n.getDirection();
  }, []);

  return {
    t,
    tMultiple,
    formatDate,
    formatCurrency,
    formatNumber,
    formatPercent,
    currentLocale,
    setLocale,
    getCurrentLocale,
    getSupportedLocales,
    getLocaleInfo,
    getAllLocaleInfo,
    getDirection,
  };
} 