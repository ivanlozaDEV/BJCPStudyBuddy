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

export default function PaywallScreen() {
  const theme = useTheme();
  const { language } = useTranslation();
  const { packages, purchasePackage, restorePurchases, isLoading } = usePurchases();

  const handlePurchase = async (pack: any) => {
    const success = await purchasePackage(pack);
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
              icon="🧠" 
              title={language === 'es' ? 'Flashcards Inteligentes' : 'Smart Flashcards'} 
              desc={language === 'es' ? 'Practica estilos, estadísticas y glosario con tarjetas interactivas.' : 'Practice styles, stats, and glossary with interactive cards.'}
            />
            <FeatureRow 
              icon="🎯" 
              title={language === 'es' ? 'Quizzes Generados por IA' : 'AI-Generated Quizzes'} 
              desc={language === 'es' ? 'Exámenes de opción múltiple algorítmicos basados en los parámetros del BJCP.' : 'Algorithmic multiple-choice exams based on BJCP parameters.'}
            />
            <FeatureRow 
              icon="📈" 
              title={language === 'es' ? 'Seguimiento de Progreso' : 'Progress Tracking'} 
              desc={language === 'es' ? 'Identifica tus puntos débiles y mejora tu puntuación.' : 'Identify your weak spots and improve your score.'}
            />
          </View>

          <View style={styles.purchaseSection}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#FFFFFF" style={{ marginVertical: 20 }} />
            ) : packages.length > 0 ? (
              packages.map((pack) => (
                <Pressable
                  key={pack.identifier}
                  style={({ pressed }) => [
                    styles.purchaseButton,
                    { backgroundColor: theme.accent },
                    pressed && { opacity: 0.8 }
                  ]}
                  onPress={() => handlePurchase(pack)}
                >
                  <ThemedText style={styles.purchaseButtonText}>
                    {language === 'es' ? 'Desbloquear por ' : 'Unlock for '} 
                    {pack.product.priceString}
                  </ThemedText>
                </Pressable>
              ))
            ) : (
              <ThemedText style={styles.errorText}>
                {language === 'es' 
                  ? 'Las opciones de compra no están disponibles en este momento.' 
                  : 'Purchase options are not available at this time.'}
              </ThemedText>
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

function FeatureRow({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <View style={styles.featureRow}>
      <ThemedText style={styles.featureIcon}>{icon}</ThemedText>
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
  featureIcon: {
    fontSize: 32,
    marginRight: Spacing.four,
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
