import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  platformLanguage: string;
  setPlatformLanguage: (language: string) => void;
  voiceLanguage: string;
  setVoiceLanguage: (language: string) => void;
  languageCode: string;
  forceUpdate: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [platformLanguage, setPlatformLanguageState] = useState(() => {
    // Initialize from localStorage or default to 'Auto-detect'
    return localStorage.getItem('platformLanguage') || 'Auto-detect';
  });
  
  const [voiceLanguage, setVoiceLanguageState] = useState(() => {
    // Initialize from localStorage or default to 'Auto-detect'
    return localStorage.getItem('voiceLanguage') || 'Auto-detect';
  });

  const [updateKey, setUpdateKey] = useState(0);

  // Derive language code from platform language
  const languageCode = platformLanguage.toLowerCase().split(' ')[0];

  const setPlatformLanguage = (language: string) => {
    setPlatformLanguageState(language);
    
    // Store in localStorage immediately
    localStorage.setItem('platformLanguage', language);
    
    // Apply to document immediately
    const langCode = language.toLowerCase().split(' ')[0];
    document.documentElement.lang = langCode;
    document.body.setAttribute('data-language', langCode);
    
    // Force update all components
    setUpdateKey(prev => prev + 1);
    
    console.log('Language changed globally to:', language, 'Code:', langCode);
  };
  
  const setVoiceLanguage = (language: string) => {
    setVoiceLanguageState(language);
    
    // Store in localStorage immediately
    localStorage.setItem('voiceLanguage', language);
    
    console.log('Voice language changed to:', language);
  };

  const forceUpdate = () => {
    setUpdateKey(prev => prev + 1);
  };

  // Apply initial language on mount
  useEffect(() => {
    document.documentElement.lang = languageCode;
    document.body.setAttribute('data-language', languageCode);
  }, [languageCode]);

  const contextValue: LanguageContextType = {
    platformLanguage,
    setPlatformLanguage,
    voiceLanguage,
    setVoiceLanguage,
    languageCode,
    forceUpdate
  };

  return (
    <LanguageContext.Provider value={contextValue} key={updateKey}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
