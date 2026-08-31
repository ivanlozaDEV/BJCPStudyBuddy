import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Purchases, { LOG_LEVEL, CustomerInfo, PurchasesPackage } from 'react-native-purchases';

// No RevenueCat account yet, mocking with AsyncStorage
const IS_PRO_KEY = '@bjcp_is_pro_status';

interface PurchasesContextData {
  isPro: boolean;
  packages: PurchasesPackage[];
  purchasePackage: () => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  isLoading: boolean;
}

const PurchasesContext = createContext<PurchasesContextData | null>(null);

export function PurchasesProvider({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initPurchases() {
      try {
        const proStatus = await AsyncStorage.getItem(IS_PRO_KEY);
        if (proStatus === 'true') {
          setIsPro(true);
        }
      } catch (e) {
        console.error('Error initializing purchases', e);
      } finally {
        setIsLoading(false);
      }
    }
    initPurchases();
  }, []);

  const purchasePackage = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem(IS_PRO_KEY, 'true');
      setIsPro(true);
      return true;
    } catch (e: any) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const restorePurchases = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const proStatus = await AsyncStorage.getItem(IS_PRO_KEY);
      if (proStatus === 'true') {
        setIsPro(true);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PurchasesContext.Provider value={{ isPro, packages, purchasePackage, restorePurchases, isLoading }}>
      {children}
    </PurchasesContext.Provider>
  );
}

export function usePurchases() {
  const context = useContext(PurchasesContext);
  if (!context) {
    throw new Error('usePurchases must be used within a PurchasesProvider');
  }
  return context;
}
