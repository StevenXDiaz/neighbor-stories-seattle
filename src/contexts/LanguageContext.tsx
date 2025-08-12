"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { translations, TranslationKey } from '@/lib/translations';

type Language = 'en' | 'so' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, replacements?: { [key: string]: string | undefined }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: TranslationKey, replacements?: { [key: string]: string | undefined }): string => {
    let translation = translations[language][key] || translations['en'][key] || key;
    if (replacements) {
      Object.keys(replacements).forEach(rKey => {
        const value = replacements[rKey] || '';
        translation = translation.replace(new RegExp(`{${rKey}}`, 'g'), value);
      });
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}