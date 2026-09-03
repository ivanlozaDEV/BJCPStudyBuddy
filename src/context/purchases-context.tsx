import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Purchases, { LOG_LEVEL, CustomerInfo, PurchasesPackage, PurchasesStoreProduct } from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { useAuth } from './auth-context';

const LOCAL_IS_PRO_KEY = '@bjcp_is_pro_status';
const TRIAL_START_KEY = '@brewstudy_trial_start_date_v1';
const TRIAL_DURATION_DAYS = 7;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

// RevenueCat Entitlement and Product Configuration
export const ENTITLEMENT_ID = 'brew_study_pro';
export const PRODUCT_ID_LIFETIME = 'brewstudy_pro_lifetime_999';
export const PRODUCT_ID_ANNUAL = 'brewstudy_pro_annual_1199';

// RevenueCat Public API Keys
const REVENUECAT_APPLE_KEY = process.env.EXPO_PUBLIC_REVENUECAT_APPLE_KEY || 'appl_SKgYRRyopYxguWygfHmMuJyNBLE';
const REVENUECAT_GOOGLE_KEY = process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY || 'appl_SKgYRRyopYxguWygfHmMuJyNBLE';

export const isRevenueCatConfigured = () => {
  const key = Platform.OS === 'ios' ? REVENUECAT_APPLE_KEY : REVENUECAT_GOOGLE_KEY;
  return Boolean(key) && key.length > 5 && !key.includes('your-');
};

interface PurchasesContextData {
  isPro: boolean;
  isTrialActive: boolean;
  trialDaysRemaining: number;
  isLifetimePurchased: boolean;
  customerInfo: CustomerInfo | null;
  packages: PurchasesPackage[];
  lifetimePackage: PurchasesPackage | null;
  annualPackage: PurchasesPackage | null;
  storeProduct: PurchasesStoreProduct | null;
  purchasePackage: (pkg?: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  presentPaywall: () => Promise<boolean>;
  presentCustomerCenter: () => Promise<void>;
  isLoading: boolean;
  isConfigured: boolean;
}

const PurchasesContext = createContext<PurchasesContextData | null>(null);

export function PurchasesProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();
  const [isLifetimePurchased, setIsLifetimePurchased] = useState(false);
  const [isTrialActive, setIsTrialActive] = useState(true);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(TRIAL_DURATION_DAYS);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [lifetimePackage, setLifetimePackage] = useState<PurchasesPackage | null>(null);
  const [annualPackage, setAnnualPackage] = useState<PurchasesPackage | null>(null);
  const [storeProduct, setStoreProduct] = useState<PurchasesStoreProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const configured = isRevenueCatConfigured();

  // Effective isPro status: true if user purchased lifetime OR if within 7-day trial period
  const isPro = isLifetimePurchased || isTrialActive;

  // Helper to check if entitlement is active
  const checkProEntitlement = (info: CustomerInfo | null): boolean => {
    if (!info || !info.entitlements || !info.entitlements.active) return false;
    return Boolean(
      info.entitlements.active[ENTITLEMENT_ID] ||
      info.entitlements.active['pro'] ||
      info.entitlements.active['BrewStudy PRO'] ||
      info.entitlements.active['lifetime']
    );
  };

  // 1. Configure and Initialize RevenueCat SDK & 7-Day Free Trial
  useEffect(() => {
    async function initPurchases() {
      try {
        // Step A: Initialize 7-Day Local Trial calculation
        try {
          let storedDate = await AsyncStorage.getItem(TRIAL_START_KEY);
          let startTimestamp = storedDate ? parseInt(storedDate, 10) : null;
          if (!startTimestamp || isNaN(startTimestamp)) {
            startTimestamp = Date.now();
            await AsyncStorage.setItem(TRIAL_START_KEY, startTimestamp.toString());
          }
          const elapsedDays = (Date.now() - startTimestamp) / MS_PER_DAY;
          const remaining = Math.max(0, Math.ceil(TRIAL_DURATION_DAYS - elapsedDays));
          setTrialDaysRemaining(remaining);
          setIsTrialActive(elapsedDays < TRIAL_DURATION_DAYS);
        } catch (e) {
          console.warn('Error calculating trial status:', e);
        }

        // Step B: Initialize StoreKit / RevenueCat SDK
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
          Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.INFO);

          const apiKey = Platform.OS === 'ios' ? REVENUECAT_APPLE_KEY : REVENUECAT_GOOGLE_KEY;
          
          if (apiKey) {
            await Purchases.configure({ apiKey });

            // Fetch initial customer info
            try {
              const info = await Purchases.getCustomerInfo();
              setCustomerInfo(info);
              const hasPro = checkProEntitlement(info);
              if (hasPro) setIsLifetimePurchased(true);
            } catch (e) {
              console.warn('RevenueCat: Could not fetch initial customer info', e);
            }

            // Fetch offerings & active packages (Lifetime / Annual)
            try {
              const offerings = await Purchases.getOfferings();
              if (offerings.current && offerings.current.availablePackages.length > 0) {
                setPackages(offerings.current.availablePackages);
                const lifetime = offerings.current.lifetime || offerings.current.availablePackages.find(p => p.identifier.includes('lifetime')) || offerings.current.availablePackages[0] || null;
                const annual = offerings.current.annual || offerings.current.availablePackages[0] || null;
                setLifetimePackage(lifetime);
                setAnnualPackage(annual);
              }
            } catch (e) {
              console.warn('RevenueCat: Could not fetch offerings', e);
            }

            // Query store product directly (fallback / StoreKit configuration)
            try {
              const products = await Purchases.getProducts([PRODUCT_ID_LIFETIME, PRODUCT_ID_ANNUAL]);
              if (products.length > 0) {
                setStoreProduct(products[0]);
              }
            } catch (e) {
              console.warn('RevenueCat: Could not fetch store products', e);
            }

            // Listener for customer info changes (renewals, cancellations, cross-device updates)
            Purchases.addCustomerInfoUpdateListener((info) => {
              setCustomerInfo(info);
              const hasPro = checkProEntitlement(info);
              setIsLifetimePurchased(hasPro);
              AsyncStorage.setItem(LOCAL_IS_PRO_KEY, JSON.stringify(hasPro));
            });
          }
        }
      } catch (error) {
        console.error('Error initializing RevenueCat:', error);
      } finally {
        // Fallback: check local storage if offline or during local development
        try {
          const localPro = await AsyncStorage.getItem(LOCAL_IS_PRO_KEY);
          if (localPro) {
            setIsLifetimePurchased(JSON.parse(localPro));
          }
        } catch {}
        setIsLoading(false);
      }
    }

    initPurchases();
  }, []);

  // Purchase Package Handler
  const purchasePackage = async (pkg?: PurchasesPackage): Promise<boolean> => {
    try {
      setIsLoading(true);
      const targetPackage = pkg || lifetimePackage || annualPackage || (packages.length > 0 ? packages[0] : null);

      if (targetPackage) {
        const { customerInfo } = await Purchases.purchasePackage(targetPackage);
        const hasPro = checkProEntitlement(customerInfo);
        setIsLifetimePurchased(hasPro);
        await AsyncStorage.setItem(LOCAL_IS_PRO_KEY, JSON.stringify(hasPro));
        return hasPro;
      } else if (storeProduct) {
        const { customerInfo } = await Purchases.purchaseStoreProduct(storeProduct);
        const hasPro = checkProEntitlement(customerInfo);
        setIsLifetimePurchased(hasPro);
        await AsyncStorage.setItem(LOCAL_IS_PRO_KEY, JSON.stringify(hasPro));
        return hasPro;
      } else {
        // Mock fallback in development
        if (__DEV__) {
          setIsLifetimePurchased(true);
          await AsyncStorage.setItem(LOCAL_IS_PRO_KEY, JSON.stringify(true));
          return true;
        }
        return false;
      }
    } catch (error: any) {
      if (!error.userCancelled) {
        console.error('RevenueCat: Error purchasing package', error);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Restore Purchases Handler
  const restorePurchases = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const restoredInfo = await Purchases.restorePurchases();
      setCustomerInfo(restoredInfo);
      const hasPro = checkProEntitlement(restoredInfo);
      setIsLifetimePurchased(hasPro);
      await AsyncStorage.setItem(LOCAL_IS_PRO_KEY, JSON.stringify(hasPro));
      return hasPro;
    } catch (error) {
      console.error('RevenueCat: Error restoring purchases', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Present RevenueCat Native Paywall
  const presentPaywall = async (): Promise<boolean> => {
    try {
      const paywallResult = await RevenueCatUI.presentPaywall({
        displayCloseButton: true,
      });

      switch (paywallResult) {
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
          setIsLifetimePurchased(true);
          await AsyncStorage.setItem(LOCAL_IS_PRO_KEY, JSON.stringify(true));
          return true;
        case PAYWALL_RESULT.CANCELLED:
        case PAYWALL_RESULT.NOT_PRESENTED:
        case PAYWALL_RESULT.ERROR:
        default:
          return false;
      }
    } catch (error) {
      console.warn('RevenueCatUI paywall failed to present:', error);
      return false;
    }
  };

  // Present RevenueCat Customer Center
  const presentCustomerCenter = async () => {
    try {
      await RevenueCatUI.presentCustomerCenter();
    } catch (error) {
      console.warn('RevenueCat Customer Center not available:', error);
    }
  };

  return (
    <PurchasesContext.Provider
      value={{
        isPro,
        isTrialActive,
        trialDaysRemaining,
        isLifetimePurchased,
        customerInfo,
        packages,
        lifetimePackage,
        annualPackage,
        storeProduct,
        purchasePackage,
        restorePurchases,
        presentPaywall,
        presentCustomerCenter,
        isLoading,
        isConfigured: configured,
      }}
    >
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
