import React, { createContext, useState, useContext } from 'react';
import { Language, translations } from '@/data/translations';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.es) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default language is Spanish ('es')
  const [language, setLanguageState] = useState<Language>('es');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // Autocomplete-friendly translation helper
  const t = (key: keyof typeof translations.es): string => {
    const dictionary = translations[language] || translations.es;
    return dictionary[key] || translations.es[key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
