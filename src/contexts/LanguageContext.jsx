import { createContext, useContext, useState, useEffect } from 'react';

export const INDIAN_LANGUAGES = [
  { code: 'hi', name: 'हिंदी', english: 'Hindi' },
  { code: 'en', name: 'English', english: 'English' },
  { code: 'bn', name: 'বাংলা', english: 'Bengali' },
  { code: 'te', name: 'తెలుగు', english: 'Telugu' },
  { code: 'mr', name: 'मराठी', english: 'Marathi' },
  { code: 'ta', name: 'தமிழ்', english: 'Tamil' },
  { code: 'ur', name: 'اردو', english: 'Urdu' },
  { code: 'gu', name: 'ગુજરાતી', english: 'Gujarati' },
  { code: 'kn', name: 'ಕನ್ನಡ', english: 'Kannada' },
  { code: 'ml', name: 'മലയാളം', english: 'Malayalam' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', english: 'Punjabi' },
  { code: 'or', name: 'ଓଡ଼ିଆ', english: 'Odia' },
  { code: 'as', name: 'অসমীয়া', english: 'Assamese' },
  { code: 'mai', name: 'मैथिली', english: 'Maithili' },
  { code: 'sat', name: 'ᱥᱟᱱᱛᱟᱲᱤ', english: 'Santali' },
  { code: 'ks', name: 'کٲشُر', english: 'Kashmiri' },
  { code: 'ne', name: 'नेपाली', english: 'Nepali' },
  { code: 'sd', name: 'سنڌي', english: 'Sindhi' },
  { code: 'kok', name: 'कोंकणी', english: 'Konkani' },
  { code: 'doi', name: 'डोगरी', english: 'Dogri' },
  { code: 'mni', name: 'মৈতৈলোন্', english: 'Manipuri' },
  { code: 'sa', name: 'संस्कृतम्', english: 'Sanskrit' },
];

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('nyay-lang');
    if (saved) {
      const found = INDIAN_LANGUAGES.find(l => l.code === saved);
      if (found) return found;
    }
    const browserLang = navigator.language?.split('-')[0];
    const match = INDIAN_LANGUAGES.find(l => l.code === browserLang);
    return match || INDIAN_LANGUAGES[0];
  });

  useEffect(() => {
    localStorage.setItem('nyay-lang', language.code);
    document.documentElement.lang = language.code;
  }, [language]);

  const switchLanguage = (code) => {
    const found = INDIAN_LANGUAGES.find(l => l.code === code);
    if (found) setLanguage(found);
  };

  return (
    <LanguageContext.Provider value={{ language, switchLanguage, languages: INDIAN_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
