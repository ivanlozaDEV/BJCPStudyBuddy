import { useEffect } from 'react';
import { router } from 'expo-router';

export default function AuthScreen() {
  useEffect(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/settings' as any);
    }
  }, []);

  return null;
}
