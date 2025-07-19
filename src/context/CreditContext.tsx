import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface CreditContextType {
  credits: number;
  useCredit: () => boolean;
  resetCredits: () => void;
}

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export const CreditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [credits, setCredits] = useState<number>(user ? 5 : 2);

  useEffect(() => {
    setCredits(user ? 5 : 2);
  }, [user]);

  const useCredit = () => {
    if (credits > 0) {
      setCredits(c => c - 1);
      return true;
    }
    return false;
  };

  const resetCredits = () => {
    setCredits(user ? 5 : 2);
  };

  return (
    <CreditContext.Provider value={{ credits, useCredit, resetCredits }}>
      {children}
    </CreditContext.Provider>
  );
};

export const useCreditContext = () => {
  const ctx = useContext(CreditContext);
  if (!ctx) throw new Error('useCreditContext must be used within CreditProvider');
  return ctx;
};
