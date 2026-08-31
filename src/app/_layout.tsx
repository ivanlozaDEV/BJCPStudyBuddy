import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import React from 'react';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SpaceGrotesk_400Regular, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { Sora_400Regular, Sora_700Bold } from '@expo-google-fonts/sora';
import { IBMPlexSans_400Regular, IBMPlexSans_600SemiBold } from '@expo-google-fonts/ibm-plex-sans';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { LanguageProvider } from '@/context/language-context';
import { PurchasesProvider } from '@/context/purchases-context';
import { AuthProvider } from '@/context/auth-context';
import { TastingsProvider } from '@/context/tastings-context';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useLastRoute } from '@/hooks/use-last-route';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  const [loaded, error] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Sora_400Regular,
    Sora_700Bold,
    IBMPlexSans_400Regular,
    IBMPlexSans_600SemiBold,
  });

  // Handle automatic route restoration
  useLastRoute();

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AuthProvider>
          <PurchasesProvider>
            <TastingsProvider>
              <ThemeProvider value={DefaultTheme}>
                <StatusBar style="dark" />
                <AnimatedSplashOverlay />
                <Stack screenOptions={{ 
                  headerShown: false, 
                  animation: 'slide_from_right',
                  gestureEnabled: true,
                  fullScreenGestureEnabled: true 
                }} />
              </ThemeProvider>
            </TastingsProvider>
          </PurchasesProvider>
        </AuthProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
