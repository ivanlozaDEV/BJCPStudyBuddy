import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Purchases, { LOG_LEVEL, CustomerInfo, PurchasesPackage, PurchasesStoreProduct } from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { useAuth } from './auth-context';

const LOCAL_IS_PRO_KEY = '@bjcp_is_pro_status';

// RevenueCat Entitlement and Product Configuration
export const ENTITLEMENT_ID = 'brew_study_pro';
export const PRODUCT_ID_ANNUAL = 'brewstudy_pro_annual_1199';

// RevenueCat Public API Keys
const REVENUECAT_APPLE_KEY = process.env.EXPO_PUBLIC_REVENUECAT_APPLE_KEY || 'test_ToSsdrPqYuaJTPHEcNdVXZlOKXn';
const REVENUECAT_GOOGLE_KEY = process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY || 'test_ToSsdrPqYuaJTPHEcNdVXZlOKXn';

export const isRevenueCatConfigured = () => {
  const key = Platform.OS === 'ios' ? REVENUECAT_APPLE_KEY : REVENUECAT_GOOGLE_KEY;
  return Boolean(key) && key.length > 5 && !key.includes('your-');
};

interface PurchasesContextData {
  isPro: boolean;
  customerInfo: CustomerInfo | null;
  packages: PurchasesPackage[];
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
  const { user } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [annualPackage, setAnnualPackage] = useState<PurchasesPackage | null>(null);
  const [storeProduct, setStoreProduct] = useState<PurchasesStoreProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const configured = isRevenueCatConfigured();

  // Helper to check if entitlement is active
  const checkProEntitlement = (info: CustomerInfo | null): boolean => {
    if (!info || !info.entitlements || !info.entitlements.active) return false;
    return Boolean(
      info.entitlements.active[ENTITLEMENT_ID] ||
      info.entitlements.active['pro'] ||
      info.entitlements.active['BrewStudy PRO']
    );
  };

  // 1. Configure and Initialize RevenueCat SDK
  useEffect(() => {
    async function initPurchases() {
      try {
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
              if (hasPro) setIsPro(true);
            } catch (e) {
              console.warn('RevenueCat: Could not fetch initial customer info', e);
            }

            // Fetch offerings & active packages (Yearly / Annual)
            try {
              const offerings = await Purchases.getOfferings();
              if (offerings.current && offerings.current.availablePackages.length > 0) {
                setPackages(offerings.current.availablePackages);
                const annual = offerings.current.annual || offerings.current.availablePackages[0] || null;
                setAnnualPackage(annual);
              }
            } catch (e) {
              console.warn('RevenueCat: Could not fetch offerings', e);
            }

            // Query store product directly (fallback / StoreKit configuration)
            try {
              const products = await Purchases.getProducts([PRODUCT_ID_ANNUAL]);
              if (products.length > 0) {
                setStoreProduct(products[0]);
              }
            } catch (e) {
              console.warn('RevenueCat: Store product query warning', e);
            }

            // Real-time listener for customer info updates (renewals, cancellations, refunds)
            Purchases.addCustomerInfoUpdateListener((info: CustomerInfo) => {
              setCustomerInfo(info);
              const isEntitled = checkProEntitlement(info);
              setIsPro(isEntitled);
            });
          }
        }

        // Local storage status fallback (offline simulation)
        const localStatus = await AsyncStorage.getItem(LOCAL_IS_PRO_KEY);
        if (localStatus === 'true') {
          setIsPro(true);
        }
      } catch (e) {
        console.warn('RevenueCat initialization error:', e);
        try {
          const localStatus = await AsyncStorage.getItem(LOCAL_IS_PRO_KEY);
          if (localStatus === 'true') setIsPro(true);
        } catch {}
      } finally {
        setIsLoading(false);
      }
    }

    initPurchases();
  }, [configured]);

  // 2. Sync App User ID with Supabase Auth User
  useEffect(() => {
    async function syncUserId() {
      try {
        if (configured && (Platform.OS === 'ios' || Platform.OS === 'android')) {
          if (user?.id) {
            const { customerInfo: updatedInfo } = await Purchases.logIn(user.id);
            setCustomerInfo(updatedInfo);
            setIsPro(checkProEntitlement(updatedInfo));
          }
        }
      } catch (e) {
        console.warn('RevenueCat: Error syncing user ID', e);
      }
    }
    syncUserId();
  }, [user?.id, configured]);

  // 3. Purchase Package / Product
  const purchasePackage = async (pkg?: PurchasesPackage): Promise<boolean> => {
    try {
      setIsLoading(true);

      if (configured) {
        // Attempt Purchase via RevenueCat Package
        const targetPkg = pkg || annualPackage || (packages.length > 0 ? packages[0] : null);
        if (targetPkg) {
          const { customerInfo: purchaseInfo } = await Purchases.purchasePackage(targetPkg);
          setCustomerInfo(purchaseInfo);
          const hasPro = checkProEntitlement(purchaseInfo);
          setIsPro(hasPro);
          if (hasPro) await AsyncStorage.setItem(LOCAL_IS_PRO_KEY, 'true');
          return hasPro;
        }

        // Attempt Purchase via Direct Store Product (StoreKit testing)
        const targetProduct = storeProduct || (await Purchases.getProducts([PRODUCT_ID_ANNUAL]))[0];
        if (targetProduct) {
          const { customerInfo: purchaseInfo } = await Purchases.purchaseStoreProduct(targetProduct);
          setCustomerInfo(purchaseInfo);
          const hasPro = checkProEntitlement(purchaseInfo);
          setIsPro(hasPro);
          if (hasPro) await AsyncStorage.setItem(LOCAL_IS_PRO_KEY, 'true');
          return hasPro;
        }
      }

      // Offline Developer Simulation Fallback
      await AsyncStorage.setItem(LOCAL_IS_PRO_KEY, 'true');
      setIsPro(true);
      return true;
    } catch (e: any) {
      if (e?.userCancelled) {
        // User dismissed Apple Pay sheet
        return false;
      }
      console.warn('Purchase error:', e);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Restore Previous Purchases
  const restorePurchases = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      if (configured) {
        const info = await Purchases.restorePurchases();
        setCustomerInfo(info);
        const hasPro = checkProEntitlement(info);
        setIsPro(hasPro);
        if (hasPro) {
          await AsyncStorage.setItem(LOCAL_IS_PRO_KEY, 'true');
          return true;
        }
      }

      const localStatus = await AsyncStorage.getItem(LOCAL_IS_PRO_KEY);
      if (localStatus === 'true') {
        setIsPro(true);
        return true;
      }
      return false;
    } catch (e) {
      console.warn('Restore purchases error:', e);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Present RevenueCat Native Paywall (RevenueCatUI)
  const presentPaywall = async (): Promise<boolean> => {
    try {
      const paywallResult = await RevenueCatUI.presentPaywall({
        displayCloseButton: true,
      });

      if (
        paywallResult === PAYWALL_RESULT.PURCHASED ||
        paywallResult === PAYWALL_RESULT.RESTORED
      ) {
        const info = await Purchases.getCustomerInfo();
        setCustomerInfo(info);
        const hasPro = checkProEntitlement(info);
        setIsPro(hasPro);
        if (hasPro) await AsyncStorage.setItem(LOCAL_IS_PRO_KEY, 'true');
        return true;
      }
      return false;
    } catch (e) {
      console.warn('RevenueCatUI presentPaywall error:', e);
      return false;
    }
  };

  // 6. Present RevenueCat Customer Center (Self-Service Subscription Management)
  const presentCustomerCenter = async (): Promise<void> => {
    try {
      await RevenueCatUI.presentCustomerCenter();
      // Refresh customer info after customer center dismiss
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
      setIsPro(checkProEntitlement(info));
    } catch (e) {
      console.warn('Customer Center error:', e);
    }
  };

  return (
    <PurchasesContext.Provider
      value={{
        isPro,
        customerInfo,
        packages,
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
