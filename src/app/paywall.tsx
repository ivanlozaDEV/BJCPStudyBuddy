import React, { useState } from 'react';
import { StyleSheet, Pressable, View, ScrollView, ActivityIndicator, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing, Fonts } from '@/constants/theme';
import { useTranslation } from '@/context/language-context';
import { usePurchases } from '@/context/purchases-context';
import { useAuth } from '@/context/auth-context';
import { BeerBubbles } from '@/components/beer-bubbles';
import { BeerLogo } from '@/components/beer-logo';
import { MenuIcon } from '@/components/menu-icons';

type PlanId = 'annual' | 'monthly' | 'lifetime';

export default function PaywallScreen() {
  const { language } = useTranslation();
  const { purchasePackage, restorePurchases, isLoading, isPro, annualPackage, storeProduct } = usePurchases();
  const { user } = useAuth();
  const candidatePrice = storeProduct?.priceString || annualPackage?.product.priceString || '$11.99';
  const displayPrice = candidatePrice.includes('79.99') ? '$11.99' : candidatePrice;

  const safeBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handlePurchase = async () => {
    const success = await purchasePackage();
    if (success) {
      if (!user) {
        Alert.alert(
          language === 'es' ? '¡Bienvenido a BrewStudy PRO!' : 'Welcome to BrewStudy PRO!',
          language === 'es'
            ? '¿Deseas crear tu cuenta ahora para activar el respaldo automático de fotos y catas en la nube?'
            : 'Would you like to create your account now to activate automatic cloud backup and sync for your photos and tastings?',
          [
            {
              text: language === 'es' ? 'Más Tarde' : 'Later',
              style: 'cancel',
              onPress: () => safeBack(),
            },
            {
              text: language === 'es' ? 'Crear Cuenta' : 'Create Account',
              onPress: () => {
                router.replace('/auth' as any);
              },
            },
          ]
        );
      } else {
        Alert.alert(
          language === 'es' ? '¡Felicidades!' : 'Congratulations!',
          language === 'es' ? 'Has activado BrewStudy PRO con sincronización en la nube.' : 'You have activated BrewStudy PRO with cloud sync.',
          [{ text: 'OK', onPress: () => safeBack() }]
        );
      }
    }
  };

  const handleRestore = async () => {
    const success = await restorePurchases();
    if (success) {
      if (!user) {
        Alert.alert(
          language === 'es' ? 'Compras Restauradas' : 'Purchases Restored',
          language === 'es'
            ? 'Acceso PRO restaurado. ¿Deseas iniciar sesión o crear cuenta para sincronizar con la nube?'
            : 'PRO access restored. Would you like to sign in or create an account to sync with the cloud?',
          [
            {
              text: language === 'es' ? 'Más Tarde' : 'Later',
              style: 'cancel',
              onPress: () => safeBack(),
            },
            {
              text: language === 'es' ? 'Iniciar Sesión / Registro' : 'Sign In / Sign Up',
              onPress: () => {
                router.replace('/auth' as any);
              },
            },
          ]
        );
      } else {
        Alert.alert(
          language === 'es' ? 'Restaurado' : 'Restored',
          language === 'es' ? 'Tus compras han sido restauradas exitosamente.' : 'Your purchases have been successfully restored.',
          [{ text: 'OK', onPress: () => safeBack() }]
        );
      }
    } else {
      Alert.alert(
        language === 'es' ? 'Restaurar Compras' : 'Restore Purchases',
        language === 'es' ? 'No se encontraron compras activas previas vinculadas a tu cuenta.' : 'No previous active purchases found for your account.'
      );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <BeerBubbles />
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header with Close */}
        <View style={styles.header}>
          <Pressable 
            onPress={safeBack}
            style={({ pressed }) => [styles.closeButton, pressed && { opacity: 0.7 }]}
          >
            <ThemedText style={styles.closeText}>✕</ThemedText>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Hero Branding */}
          <View style={styles.heroSection}>
            <BeerLogo size={74} />
            <ThemedText style={styles.title}>
              BrewStudy <ThemedText style={styles.proBadge}>PRO</ThemedText>
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              {language === 'es' 
                ? 'Conviértete en un Juez Cervecero de Nivel Master' 
                : 'Become a Master-Level BJCP Beer Judge'}
            </ThemedText>
          </View>

          {/* Value Proposition Features */}
          <View style={styles.featuresList}>
            <FeatureRow 
              icon="myTastings" 
              title={language === 'es' ? 'Simulador de Juez Oficial (50 Puntos)' : 'Official 50-Point Judge Simulator'} 
              desc={language === 'es' ? 'Fichas de cata completas, escalas táctiles, fotos duales de vaso y etiqueta, y nube.' : 'Full scoresheets, continuous tactile faders, dual glass/label photos and cloud sync.'}
            />
            <FeatureRow 
              icon="flashcards" 
              title={language === 'es' ? 'Flashcards & Simulador de Examen' : 'Flashcards & Exam Simulator'} 
              desc={language === 'es' ? 'Algoritmo de repetición espaciada para estilos, defectos y glosario técnico.' : 'Spaced repetition algorithm for styles, off-flavors, and technical glossary.'}
            />
            <FeatureRow 
              icon="comparator" 
              title={language === 'es' ? 'Comparador Avanzado de Estilos' : 'Advanced Style Comparator'} 
              desc={language === 'es' ? 'Compara estadísticas vitales (OG, FG, IBU, SRM, ABV) y aromas cara a cara.' : 'Compare vital statistics (OG, FG, IBU, SRM, ABV) and aroma profiles side-by-side.'}
            />
          </View>

          {/* Single Simple Annual Subscription Card with 7-Day Free Trial */}
          <View style={styles.plansContainer}>
            <View style={[styles.planCard, styles.planCardSelected]}>
              <View style={styles.planBadge}>
                <ThemedText style={styles.planBadgeText}>
                  {language === 'es' ? '🎁 7 DÍAS GRATIS • LUEGO $1.00 / MES' : '🎁 7-DAY FREE TRIAL • THEN $1.00 / MO'}
                </ThemedText>
              </View>
              <View style={styles.planRow}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <ThemedText style={styles.planTitle}>
                    {language === 'es' ? 'Suscripción Anual PRO' : 'Annual PRO Subscription'}
                  </ThemedText>
                  <ThemedText style={styles.planPeriod}>
                    {language === 'es'
                      ? `7 días gratis, luego ${displayPrice} / año. Acceso completo y nube.`
                      : `7 days free, then ${displayPrice} / year. Full access & cloud sync.`}
                  </ThemedText>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <ThemedText style={styles.planPrice}>
                    {displayPrice} <ThemedText style={styles.planPricePeriod}>{language === 'es' ? '/año' : '/yr'}</ThemedText>
                  </ThemedText>
                  <ThemedText style={styles.planSubPrice}>
                    {language === 'es' ? '($1.00 / mes)' : '($1.00 / mo)'}
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>

          {/* Action CTA Button */}
          <View style={styles.purchaseSection}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#F2B824" style={{ marginVertical: 16 }} />
            ) : (
              <Pressable
                style={({ pressed }) => [
                  styles.purchaseButton,
                  pressed && { opacity: 0.85 },
                ]}
                onPress={handlePurchase}
              >
                <ThemedText style={styles.purchaseButtonText}>
                  {isPro
                    ? (language === 'es' ? '✓ Suscripción PRO Activa' : '✓ PRO Subscription Active')
                    : (language === 'es' ? 'Iniciar Prueba Gratis de 7 Días' : 'Start 7-Day Free Trial')} 
                </ThemedText>
              </Pressable>
            )}

            <ThemedText style={styles.cancelAnytimeText}>
              {language === 'es' ? 'Sin compromiso • Cancela en cualquier momento' : 'No commitment • Cancel anytime'}
            </ThemedText>

            <Pressable onPress={handleRestore} style={({ pressed }) => [styles.restoreButton, pressed && { opacity: 0.7 }]}>
              <ThemedText style={styles.restoreText}>
                {language === 'es' ? 'Restaurar Compras Anteriores' : 'Restore Previous Purchases'}
              </ThemedText>
            </Pressable>
          </View>

          {/* Legal Footer */}
          <View style={styles.legalSection}>
            <ThemedText style={styles.legalText}>
              {language === 'es' 
                ? 'El pago se cargará a tu cuenta de Apple ID / Google Play al confirmar la compra. La suscripción se renueva automáticamente a menos que se cancele al menos 24 horas antes del final del período actual. Las Guías de Estilo BJCP 2021 completas son de libre acceso en la sección de Explorar.' 
                : 'Payment will be charged to your Apple ID / Google Play account at confirmation of purchase. Subscription automatically renews unless canceled at least 24 hours before the end of the current period. The official BJCP 2021 guidelines remain free to explore.'}
            </ThemedText>

            <View style={styles.legalLinksRow}>
              <Pressable onPress={() => Linking.openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')}>
                <ThemedText style={styles.legalLink}>
                  {language === 'es' ? 'Términos de Uso (EULA)' : 'Terms of Service (EULA)'}
                </ThemedText>
              </Pressable>
              <ThemedText style={styles.legalDivider}>•</ThemedText>
              <Pressable onPress={() => Linking.openURL('https://www.banana-computer.com/brew-study/privacy-policy')}>
                <ThemedText style={styles.legalLink}>
                  {language === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
                </ThemedText>
              </Pressable>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function FeatureRow({ icon, title, desc }: { icon: any; title: string; desc: string }) {
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: Spacing.two,
    marginBottom: Spacing.four,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    paddingTop: 6,
    paddingBottom: 2,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#FFF',
    marginTop: Spacing.one,
    textAlign: 'center',
  },
  proBadge: {
    color: '#F2B824', // Gold
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.inter,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: Spacing.one,
  },
  featuresList: {
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    padding: Spacing.three,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  featureIconContainer: {
    marginRight: Spacing.three,
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#FFF',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    fontFamily: Fonts.inter,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 17,
  },
  plansContainer: {
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  planCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 16,
    padding: Spacing.four,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#F2B824',
    backgroundColor: 'rgba(242, 184, 36, 0.12)',
  },
  planBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#F2B824',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  planBadgeText: {
    color: '#161B22',
    fontSize: 10,
    fontFamily: Fonts.spaceGroteskBold,
    fontWeight: '800',
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planTitle: {
    fontSize: 16,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  planPeriod: {
    fontSize: 12,
    fontFamily: Fonts.inter,
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 2,
  },
  planPrice: {
    fontSize: 20,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#F2B824',
    fontWeight: '800',
  },
  planPricePeriod: {
    fontSize: 12,
    fontFamily: Fonts.inter,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  planSubPrice: {
    fontSize: 11,
    fontFamily: Fonts.inter,
    color: '#52B788',
    fontWeight: '700',
    marginTop: 2,
  },
  purchaseSection: {
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  purchaseButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#F2B824',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  purchaseButtonText: {
    fontSize: 16,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#161B22',
    fontWeight: '800',
  },
  cancelAnytimeText: {
    fontSize: 12,
    fontFamily: Fonts.inter,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: Spacing.two,
    textAlign: 'center',
  },
  restoreButton: {
    padding: Spacing.two,
  },
  restoreText: {
    fontSize: 13,
    fontFamily: Fonts.inter,
    color: 'rgba(255, 255, 255, 0.75)',
    textDecorationLine: 'underline',
  },
  legalSection: {
    paddingHorizontal: Spacing.two,
    gap: 8,
  },
  legalText: {
    fontSize: 10.5,
    fontFamily: Fonts.inter,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    lineHeight: 15,
  },
  legalLinksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  legalLink: {
    fontSize: 11,
    fontFamily: Fonts.inter,
    color: 'rgba(255, 255, 255, 0.7)',
    textDecorationLine: 'underline',
  },
  legalDivider: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
  },
});
