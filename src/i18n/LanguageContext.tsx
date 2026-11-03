import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, LanguageOption } from '../types';
import { translations, Translations, SUPPORTED_LANGUAGES } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations, params?: Record<string, string | number>) => string;
  currentLanguageOption: LanguageOption;
  translateCategory: (category: string) => string;
  supportedLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('shopmate_language') as Language;
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
    } catch (e) {
      console.error(e);
    }
    return 'en'; // English as default
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('shopmate_language', lang);
    } catch (e) {
      console.error(e);
    }
  };

  const t = (key: keyof Translations, params?: Record<string, string | number>): string => {
    const langDict = translations[language] || translations.en;
    let text = (langDict[key] as string) || (translations.en[key] as string) || String(key);

    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
      });
    }

    return text;
  };

  const currentLanguageOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const translateCategory = (cat: string): string => {
    const lower = (cat || '').toLowerCase();
    if (lower.includes('bev')) return t('catBeverages');
    if (lower.includes('dair') || lower.includes('milk')) return t('catDairy');
    if (lower.includes('bak')) return t('catBakery');
    if (lower.includes('pant') || lower.includes('grain') || lower.includes('oil')) return t('catPantry');
    if (lower.includes('snack') || lower.includes('choc')) return t('catSnacks');
    if (lower.includes('house') || lower.includes('clean')) return t('catHousehold');
    return cat;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentLanguageOption,
        translateCategory,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
