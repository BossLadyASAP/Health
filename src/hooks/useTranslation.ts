import { useLanguage } from '@/contexts/LanguageContext';
import { translations, TranslationKey, LanguageCode } from '@/i18n/translations';

export const useTranslation = () => {
  const { platformLanguage } = useLanguage();
  
  const t = (key: TranslationKey): string => {
    // Get the language code from the platform language
    const languageCode = platformLanguage as LanguageCode;
    
    // Check if the language exists in translations
    if (translations[languageCode] && translations[languageCode][key]) {
      return translations[languageCode][key];
    }
    
    // Fallback to English if translation doesn't exist
    if (translations.English[key]) {
      return translations.English[key];
    }
    
    // Return the key itself if no translation found
    return key;
  };

  return { t, currentLanguage: platformLanguage };
};
