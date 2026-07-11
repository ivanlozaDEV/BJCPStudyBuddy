import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL, CustomerInfo, PurchasesPackage } from 'react-native-purchases';

// IMPORTANT: Replace these with your actual RevenueCat Public API Keys
const API_KEYS = {
  apple: 'appl_YOUR_APPLE_API_KEY_HERE',
  google: 'goog_YOUR_GOOGLE_API_KEY_HERE',
};

// Replace with your RevenueCat Entitlement ID
const ENTITLEMENT_ID = 'pro'; 

interface PurchasesContextData {
  isPro: boolean;
  packages: PurchasesPackage[];
  purchasePackage: (pack: PurchasesPackage) => Promise<boolean>;
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
        if (Platform.OS === 'ios') {
          Purchases.configure({ apiKey: API_KEYS.apple });
        } else if (Platform.OS === 'android') {
          Purchases.configure({ apiKey: API_KEYS.google });
        }
        
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);

        const customerInfo = await Purchases.getCustomerInfo();
        updateCustomerState(customerInfo);

        const offerings = await Purchases.getOfferings();
        if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
          setPackages(offerings.current.availablePackages);
        }
      } catch (e) {
        console.error('Error initializing purchases', e);
      } finally {
        setIsLoading(false);
      }
    }

    initPurchases();

    // Listen for changes in purchaser info
    Purchases.addCustomerInfoUpdateListener((info) => {
      updateCustomerState(info);
    });

  }, []);

  const updateCustomerState = (customerInfo: CustomerInfo) => {
    if (typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined') {
      setIsPro(true);
    } else {
      setIsPro(false);
    }
  };

  const purchasePackage = async (pack: PurchasesPackage): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { customerInfo } = await Purchases.purchasePackage(pack);
      updateCustomerState(customerInfo);
      return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
    } catch (e: any) {
      if (!e.userCancelled) {
        console.error('Error purchasing package', e);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const restorePurchases = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const customerInfo = await Purchases.restorePurchases();
      updateCustomerState(customerInfo);
      return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
    } catch (e) {
      console.error('Error restoring purchases', e);
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
