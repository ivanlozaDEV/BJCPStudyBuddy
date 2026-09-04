import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts, Spacing, MaxContentWidth } from '@/constants/theme';
import { useTranslation } from '@/context/language-context';

export default function NotFoundScreen() {
  const { language } = useTranslation();

  useEffect(() => {
    // Si se llegó a una ruta no encontrada (ej. por archivo entrante o deep link desconocido), redirigir al inicio
    const timer = setTimeout(() => {
      router.replace('/');
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!', headerShown: false }} />
      <ThemedView style={styles.container}>
        <StatusBar style="light" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <ThemedText style={styles.title}>
              {language === 'es' ? 'Cargando contenido...' : 'Loading content...'}
            </ThemedText>
            <Pressable
              onPress={() => router.replace('/')}
              style={({ pressed }) => [styles.link, pressed && { opacity: 0.7 }]}
            >
              <ThemedText style={styles.linkText}>
                {language === 'es' ? 'Volver al Inicio' : 'Return to Home'}
              </ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0C10',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#FFFFFF',
  },
  link: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  linkText: {
    fontSize: 14,
    fontFamily: Fonts.manropeBold,
    color: '#F2B824',
  },
});
