import React from 'react';
import { StyleSheet, Pressable, View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/context/language-context';
import { usePurchases } from '@/context/purchases-context';
import { BeerBubbles } from '@/components/beer-bubbles';
import { BeerLogo } from '@/components/beer-logo';
import { MenuIcon } from '@/components/menu-icons';

export default function PaywallScreen() {
  const theme = useTheme();
  const { language } = useTranslation();
  const { purchasePackage, restorePurchases, isLoading } = usePurchases();

  const handlePurchase = async () => {
    const success = await purchasePackage();
    if (success) {
      Alert.alert(
        language === 'es' ? '¡Felicidades!' : 'Congratulations!',
        language === 'es' ? 'Has desbloqueado BrewStudy PRO.' : 'You have unlocked BrewStudy PRO.',
        [{ text: 'OK', onPress: () => router.replace('/flashcards' as any) }]
      );
    }
  };

  const handleRestore = async () => {
    const success = await restorePurchases();
    if (success) {
      Alert.alert(
        language === 'es' ? 'Restaurado' : 'Restored',
        language === 'es' ? 'Tus compras han sido restauradas exitosamente.' : 'Your purchases have been successfully restored.',
        [{ text: 'OK', onPress: () => router.replace('/flashcards' as any) }]
      );
    } else {
      Alert.alert(
        language === 'es' ? 'Error' : 'Error',
        language === 'es' ? 'No se encontraron compras anteriores.' : 'No previous purchases found.'
      );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <BeerBubbles />
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <Pressable 
            onPress={() => router.back()}
            style={({ pressed }) => [styles.closeButton, pressed && { opacity: 0.7 }]}
          >
            <ThemedText style={styles.closeText}>✕</ThemedText>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.heroSection}>
            <BeerLogo size={80} />
            <ThemedText style={styles.title}>
              BrewStudy <ThemedText style={styles.proBadge}>PRO</ThemedText>
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              {language === 'es' 
                ? 'Desbloquea el Motor Interactivo de Estudio' 
                : 'Unlock the Interactive Study Engine'}
            </ThemedText>
          </View>

          <View style={styles.featuresList}>
            <FeatureRow 
              icon="myTastings" 
              title={language === 'es' ? 'Mis Catas & Simulador de Juez' : 'My Tastings & Judge Simulator'} 
              desc={language === 'es' ? 'Ficha estructurada oficial de 50 puntos, escalas continuas, fotos y sincronización en la nube.' : 'Official 50-point structured scoresheet, continuous sliders, photo capture and cloud sync.'}
            />
            <FeatureRow 
              icon="flashcards" 
              title={language === 'es' ? 'Flashcards & Simulador de Examen' : 'Flashcards & Exam Simulator'} 
              desc={language === 'es' ? 'Algoritmo de repetición espaciada y exámenes interactivos para preparar tu certificación.' : 'Spaced repetition and interactive exams to prepare for your certification.'}
            />
            <FeatureRow 
              icon="comparator" 
              title={language === 'es' ? 'Comparador Avanzado de Estilos' : 'Advanced Style Comparator'} 
              desc={language === 'es' ? 'Compara parámetros vitales, SRM, perfiles aromáticos y diferencias técnicas frente a frente.' : 'Compare vital statistics, SRM color, aroma profiles, and style differences side-by-side.'}
            />
          </View>

          <View style={styles.purchaseSection}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#FFFFFF" style={{ marginVertical: 20 }} />
            ) : (
              <Pressable
                style={({ pressed }) => [
                  styles.purchaseButton,
                  { backgroundColor: theme.accent },
                  pressed && { opacity: 0.8 }
                ]}
                onPress={handlePurchase}
              >
                <ThemedText style={styles.purchaseButtonText}>
                  {language === 'es' ? 'Desbloquear PRO Ahora' : 'Unlock PRO Now'} 
                </ThemedText>
              </Pressable>
            )}

            <Pressable onPress={handleRestore} style={({pressed}) => [styles.restoreButton, pressed && {opacity: 0.7}]}>
              <ThemedText style={styles.restoreText}>
                {language === 'es' ? 'Restaurar Compras' : 'Restore Purchases'}
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.legalSection}>
            <ThemedText style={styles.legalText}>
              {language === 'es' 
                ? 'El pago se cargará a tu cuenta al confirmar la compra. BrewStudy es una herramienta independiente. Las guías de estilo BJCP completas siguen siendo 100% gratuitas en la sección de Explorar Estilos.' 
                : 'Payment will be charged to your account at confirmation of purchase. BrewStudy is an independent tool. The full BJCP style guidelines remain 100% free in the Explore Styles section.'}
            </ThemedText>
          </View>

        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function FeatureRow({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureIconContainer}>
        <MenuIcon name={icon} />
      </View>
      <View style={styles.featureTextContainer}>
        <ThemedText style={styles.featureTitle}>{title}</ThemedText>
        <ThemedText style={styles.featureDesc}>{desc}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F5D73',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    alignItems: 'flex-end',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.six,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: Spacing.two,
    marginBottom: Spacing.six,
  },
  title: {
    fontSize: 36,
    lineHeight: 44,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#FFF',
    marginTop: Spacing.four,
  },
  proBadge: {
    color: '#F9A826', // Gold/Accent
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.inter,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: Spacing.two,
  },
  featuresList: {
    gap: Spacing.four,
    marginBottom: Spacing.six,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    padding: Spacing.four,
    borderRadius: Spacing.three,
  },
  featureIconContainer: {
    marginRight: Spacing.four,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#FFF',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    fontFamily: Fonts.inter,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  purchaseSection: {
    alignItems: 'center',
    marginBottom: Spacing.six,
  },
  purchaseButton: {
    width: '100%',
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  purchaseButtonText: {
    fontSize: 18,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#FFF',
  },
  restoreButton: {
    padding: Spacing.three,
  },
  restoreText: {
    fontSize: 14,
    fontFamily: Fonts.inter,
    color: 'rgba(255, 255, 255, 0.6)',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: Spacing.three,
  },
  legalSection: {
    paddingHorizontal: Spacing.two,
  },
  legalText: {
    fontSize: 11,
    fontFamily: Fonts.inter,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    lineHeight: 16,
  },
});
