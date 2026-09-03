import React from 'react';
import { StyleSheet, Pressable, View, ScrollView, ActivityIndicator, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing, Fonts } from '@/constants/theme';
import { useTranslation } from '@/context/language-context';
import { usePurchases } from '@/context/purchases-context';
import { BeerBubbles } from '@/components/beer-bubbles';
import { BeerLogo } from '@/components/beer-logo';
import { MenuIcon } from '@/components/menu-icons';

export default function PaywallScreen() {
  const { language } = useTranslation();
  const { purchasePackage, restorePurchases, isLoading, lifetimePackage, storeProduct, isPro } = usePurchases();

  const candidatePrice = storeProduct?.priceString || lifetimePackage?.product.priceString || '$9.99';
  const displayPrice = candidatePrice.includes('79.99') || candidatePrice.includes('11.99') ? '$9.99' : candidatePrice;

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
      Alert.alert(
        language === 'es' ? '¡Bienvenido a BrewStudy PRO!' : 'Welcome to BrewStudy PRO!',
        language === 'es'
          ? 'Has desbloqueado acceso ilimitado de por vida a todas las herramientas profesionales.'
          : 'You have unlocked unlimited lifetime access to all professional tools.',
        [{ text: 'OK', onPress: () => safeBack() }]
      );
    }
  };

  const handleRestore = async () => {
    const success = await restorePurchases();
    if (success) {
      Alert.alert(
        language === 'es' ? 'Acceso PRO Restaurado' : 'PRO Access Restored',
        language === 'es'
          ? 'Tu compra de por vida ha sido verificada exitosamente.'
          : 'Your lifetime purchase has been successfully verified.',
        [{ text: 'OK', onPress: () => safeBack() }]
      );
    } else {
      Alert.alert(
        language === 'es' ? 'Restaurar Compras' : 'Restore Purchases',
        language === 'es'
          ? 'No se encontraron compras activas previas vinculadas a tu cuenta de Apple ID.'
          : 'No previous active purchases found for your Apple ID account.'
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
            onPress={safeBack}
            style={({ pressed }) => [styles.closeButton, pressed && { opacity: 0.7 }]}
          >
            <ThemedText style={styles.closeText}>✕</ThemedText>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <BeerLogo size={80} />
            <ThemedText style={styles.title}>
              BrewStudy <ThemedText style={styles.proBadge}>PRO</ThemedText>
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              {language === 'es' 
                ? 'Desbloquea el Motor Interactivo de Estudio y Cata' 
                : 'Unlock the Interactive Study and Tasting Engine'}
            </ThemedText>
          </View>

          {/* Features List with SVG MenuIcons */}
          <View style={styles.featuresList}>
            <FeatureRow 
              icon="judgeSimulator" 
              title={language === 'es' ? 'Simulador de Ficha de 50 Puntos' : '50-Point Scoresheet Simulator'} 
              desc={language === 'es' ? 'Fichas completas con fotos de vaso y etiqueta, y descriptores táctiles.' : 'Full scoresheets with glass and label photos, plus tactile sliders.'}
            />
            <FeatureRow 
              icon="flashcards" 
              title={language === 'es' ? 'Simulador de Examen & Casos Reales' : 'Exam Simulator & Real Scenarios'} 
              desc={language === 'es' ? 'Banco curado de preguntas BJCP, memoria anti-repetición y análisis de fallos.' : 'Curated BJCP questions, anti-repetition memory, and weak-spots analysis.'}
            />
            <FeatureRow 
              icon="comparator" 
              title={language === 'es' ? 'Comparador Avanzado de Estilos' : 'Advanced Style Comparator'} 
              desc={language === 'es' ? 'Compara estadísticas vitales (OG, FG, IBU, SRM, ABV) cara a cara.' : 'Compare vital stats (OG, FG, IBU, SRM, ABV) side-by-side.'}
            />
            <FeatureRow 
              icon="settings" 
              title={language === 'es' ? '100% Privado & Traslado entre Teléfonos' : '100% Private & Phone-to-Phone Transfer'} 
              desc={language === 'es' ? 'Tus datos se quedan en tu teléfono. Expórtalos por AirDrop o WhatsApp cuando quieras.' : 'Your data stays on your phone. Export via AirDrop or WhatsApp anytime.'}
            />
          </View>

          {/* Single Lifetime Offer Card */}
          <View style={styles.plansContainer}>
            <View style={[styles.planCard, styles.planCardSelected]}>
              <View style={styles.planBadge}>
                <ThemedText style={styles.planBadgeText}>
                  {language === 'es' ? '✨ PAGO ÚNICO • DE POR VIDA' : '✨ ONE-TIME PAYMENT • LIFETIME'}
                </ThemedText>
              </View>
              <View style={styles.planRow}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <ThemedText style={styles.planTitle}>
                    {language === 'es' ? 'Acceso PRO Ilimitado' : 'Unlimited PRO Access'}
                  </ThemedText>
                  <ThemedText style={styles.planPeriod}>
                    {language === 'es'
                      ? 'Por menos de lo que cuestan dos pintas de cerveza 🍻'
                      : 'Less than the cost of two craft beer pints 🍻'}
                  </ThemedText>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <ThemedText style={styles.planPrice}>
                    {displayPrice}
                  </ThemedText>
                  <ThemedText style={styles.planSubPrice}>
                    {language === 'es' ? 'para siempre' : 'forever'}
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>

          {/* Purchase CTA */}
          <View style={styles.purchaseSection}>
            <Pressable
              style={({ pressed }) => [
                styles.purchaseButton,
                pressed && { opacity: 0.85 },
              ]}
              onPress={handlePurchase}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#161B22" />
              ) : (
                <ThemedText style={styles.purchaseButtonText}>
                  {isPro
                    ? (language === 'es' ? '✓ Acceso PRO Activo' : '✓ PRO Access Active')
                    : (language === 'es' ? `Desbloquear PRO Para Siempre (${displayPrice})` : `Unlock PRO Forever (${displayPrice})`)}
                </ThemedText>
              )}
            </Pressable>

            <ThemedText style={styles.cancelAnytimeText}>
              {language === 'es' 
                ? '🔒 Sin suscripciones ni cobros mensuales. Pago único.' 
                : '🔒 No subscriptions or monthly fees. One-time payment.'}
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
                ? 'El pago se procesa de forma segura a través de tu cuenta de Apple ID. BrewStudy es una herramienta de estudio independiente. Las Guías de Estilo BJCP 2021 completas son de libre acceso en la sección de Explorar.' 
                : 'Payment is securely processed via your Apple ID account. BrewStudy is an independent study tool. BJCP 2021 style guidelines remain free to explore.'}
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
        <MenuIcon name={icon} width={28} height={28} />
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
    fontFamily: Fonts.spaceGroteskBold,
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
    lineHeight: 38,
    paddingTop: 8,
    paddingBottom: 4,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#FFF',
    marginTop: Spacing.one,
    textAlign: 'center',
  },
  proBadge: {
    color: '#F2B824',
    fontFamily: Fonts.spaceGroteskBold,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.inter,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    marginTop: Spacing.one,
    paddingHorizontal: Spacing.two,
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
    color: 'rgba(255, 255, 255, 0.75)',
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
  },
  planPeriod: {
    fontSize: 12,
    fontFamily: Fonts.inter,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
    lineHeight: 16,
  },
  planPrice: {
    fontSize: 24,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#F2B824',
  },
  planSubPrice: {
    fontSize: 11,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#52B788',
    marginTop: 2,
  },
  purchaseSection: {
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  purchaseButton: {
    width: '100%',
    paddingVertical: 15,
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
  },
  cancelAnytimeText: {
    fontSize: 12,
    fontFamily: Fonts.inter,
    color: 'rgba(255, 255, 255, 0.75)',
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
    color: 'rgba(255, 255, 255, 0.55)',
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
    color: 'rgba(255, 255, 255, 0.75)',
    textDecorationLine: 'underline',
  },
  legalDivider: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
  },
});
