import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname, useGlobalSearchParams, router } from 'expo-router';

const LAST_ROUTE_KEY = '@bjcp_last_route';

/**
 * A hook that handles full app navigation persistence.
 * 1. On mount, reads the last saved route from AsyncStorage and redirects to it.
 * 2. After restoration, tracks route changes and saves them to AsyncStorage.
 * Should be called EXACTLY ONCE at the root of the app (e.g., _layout.tsx).
 */
export function useLastRoute() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const [isRestored, setIsRestored] = useState(false);

  // 1. Restoration Phase
  useEffect(() => {
    let isMounted = true;
    
    AsyncStorage.getItem(LAST_ROUTE_KEY)
      .then(val => {
        if (!isMounted) return;
        
        if (val) {
          try {
            const state = JSON.parse(val);
            // Only restore if it's a deep link or inner screen, prevent infinite loops on '/'
            if (state && state.pathname && state.pathname !== '/') {
              // Slight delay ensures the root layout has finished mounting
              setTimeout(() => {
                router.replace({ pathname: state.pathname, params: state.params });
              }, 100);
            }
          } catch (e) {
            console.error('Failed to parse last route', e);
          }
        }
        
        // Wait slightly longer before tracking to allow the replace animation/process to complete
        setTimeout(() => {
          if (isMounted) setIsRestored(true);
        }, 500);
      })
      .catch(() => {
        if (isMounted) setIsRestored(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Tracking Phase
  useEffect(() => {
    if (!isRestored || !pathname) return;

    // Do not save error screens or hidden routes
    if (pathname === '/_sitemap' || pathname.includes('+not-found')) return;
    
    const stateToSave = {
      pathname,
      params,
    };
    
    AsyncStorage.setItem(LAST_ROUTE_KEY, JSON.stringify(stateToSave)).catch(err => 
      console.error('Failed to track route', err)
    );
  }, [pathname, params, isRestored]);
}
