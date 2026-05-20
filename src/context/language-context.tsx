import React, { createContext, useContext } from 'react';
import { Language, translations } from '@/data/translations';
import { usePersistentState } from '@/hooks/use-persistent-state';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.es) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Detects the device's system language using the built-in Intl API (pure JS, no native module).
 * Any Spanish variant (es-MX, es-AR, es-ES, etc.) maps to 'es'.
 * Everything else defaults to 'en'.
 */
function detectSystemLanguage(): Language {
  try {
    const locale =
      Intl.DateTimeFormat().resolvedOptions().locale ||
      (typeof navigator !== 'undefined' ? navigator.language : '');
    return locale.toLowerCase().startsWith('es') ? 'es' : 'en';
  } catch {
    return 'es';
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Use persistent state so the user's manual preference is remembered across sessions.
  // Initial value is null — meaning "not yet chosen by the user".
  const [language, setLanguageState, isLoaded] = usePersistentState<Language | null>(
    '@bjcp_language_preference',
    null
  );

  // Once AsyncStorage loads, if no preference was saved, auto-detect from device
  const resolvedLanguage: Language = language ?? detectSystemLanguage();

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // Autocomplete-friendly translation helper
  const t = (key: keyof typeof translations.es): string => {
    const dictionary = translations[resolvedLanguage] || translations.es;
    return dictionary[key] || translations.es[key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language: resolvedLanguage, setLanguage, t }}>
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
