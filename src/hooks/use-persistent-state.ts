import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * A hook that works like useState but persists the value to AsyncStorage.
 * @param key The unique key for AsyncStorage
 * @param initialValue The default value to use before loading or if nothing is saved
 * @returns [state, setState, isLoaded]
 */
export function usePersistentState<T>(key: string, initialValue: T): [T, (valOrUpdater: T | ((prevState: T) => T)) => void, boolean] {
  const [state, setInternalState] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasManuallyUpdated = React.useRef(false);

  // Load initial state
  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem(key)
      .then(val => {
        if (isMounted) {
          if (val !== null && !hasManuallyUpdated.current) {
            try {
              setInternalState(JSON.parse(val));
            } catch (e) {
              console.error(`Failed to parse persistent state for key: ${key}`, e);
            }
          }
          setIsLoaded(true);
        }
      })
      .catch(err => {
        console.error(`Failed to read from AsyncStorage for key: ${key}`, err);
        if (isMounted) setIsLoaded(true);
      });

    return () => {
      isMounted = false;
    };
  }, [key]);

  // Wrapped setState that persists to AsyncStorage
  const setState = useCallback((valOrUpdater: T | ((prevState: T) => T)) => {
    hasManuallyUpdated.current = true;
    setInternalState((prev) => {
      const nextVal = typeof valOrUpdater === 'function' ? (valOrUpdater as any)(prev) : valOrUpdater;
      AsyncStorage.setItem(key, JSON.stringify(nextVal)).catch(err => 
        console.error(`Failed to save state for key: ${key}`, err)
      );
      return nextVal;
    });
  }, [key]);

  return [state, setState, isLoaded];
}
