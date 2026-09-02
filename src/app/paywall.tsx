import React from 'react';
import { StyleSheet, Pressable, View, ScrollView, ActivityIndicator, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Fonts } from '@/constants/theme';
import { useTranslation } from '@/context/language-context';
import { usePurchases } from '@/context/purchases-context';
import { BeerBubbles } from '@/components/beer-bubbles';
import { BeerLogo } from '@/components/beer-logo';
import { MenuIcon } from '@/components/menu-icons';

export default function PaywallScreen() {
  const { language } = useTranslation();
  const { purchasePackage, restorePurchases, isLoading, lifetimePackage, storeProduct } = usePurchases();
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
          ? 'Has desbloqueado acceso ilimitado de por vida a todas las herramientas de cata y examen.'
          : 'You have unlocked unlimited lifetime access to all tasting and exam tools.',
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
          ? 'Tu compra de por vida ha sido verificada exitosamente en este dispositivo.'
          : 'Your lifetime purchase has been successfully verified on this device.',
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
                ? 'La herramienta definitiva para jueces y estudiantes BJCP' 
                : 'The ultimate tool for BJCP judges and beer enthusiasts'}
            </ThemedText>
          </View>

          {/* Value Proposition Features */}
          <View style={styles.featuresList}>
            <FeatureRow 
              icon="myTastings" 
              title={language === 'es' ? 'Simulador de Juez Oficial (50 Puntos)' : 'Official 50-Point Judge Simulator'} 
              desc={language === 'es' ? 'Fichas de cata completas con fotos duales, descriptores táctiles y cálculo automático.' : 'Full scoresheets with dual photos, tactile continuous sliders, and auto scoring.'}
            />
            <FeatureRow 
              icon="flashcards" 
              title={language === 'es' ? 'Simulador de Examen & Casos Reales' : 'Exam Simulator & Real Scenarios'} 
              desc={language === 'es' ? 'Banco maestro de preguntas curadas, memoria anti-repetición y modo puntos débiles.' : 'Curated master question bank, anti-repetition memory, and weak-spots training.'}
            />
            <FeatureRow 
              icon="comparator" 
              title={language === 'es' ? 'Comparador Avanzado de Estilos' : 'Advanced Style Comparator'} 
              desc={language === 'es' ? 'Compara estadísticas vitales (OG, FG, IBU, SRM, ABV) e ingredientes cara a cara.' : 'Compare vital statistics (OG, FG, IBU, SRM, ABV) and ingredients side-by-side.'}
            />
            <FeatureRow 
              icon="settings" 
              title={language === 'es' ? '100% Privado & Traslado entre Teléfonos' : '100% Private & Phone-to-Phone Transfer'} 
              desc={language === 'es' ? 'Tus catas se quedan en tu teléfono. Expórtalas por AirDrop, WhatsApp o Archivos cuando quieras.' : 'Your data stays on your phone. Export via AirDrop, WhatsApp, or Files anytime.'}
            />
          </View>

          {/* Single Lifetime Card ($9.99 Forever) */}
          <View style={styles.plansContainer}>
            <View style={[styles.planCard, styles.planCardSelected]}>
              <View style={styles.planBadge}>
                <ThemedText style={styles.planBadgeText}>
                  {language === 'es' ? '✨ PAGO ÚNICO • ACCESO DE POR VIDA' : '✨ ONE-TIME PAYMENT • LIFETIME ACCESS'}
                </ThemedText>
              </View>
              <View style={styles.planRow}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <ThemedText style={styles.planTitle}>
                    {language === 'es' ? 'Acceso PRO Ilimitado' : 'Unlimited PRO Access'}
                  </ThemedText>
                  <ThemedText style={styles.planPeriod}>
                    {language === 'es'
                      ? 'Pagas una sola vez. Sin suscripciones ni cobros mensuales.'
                      : 'Pay once forever. No subscriptions or monthly fees.'}
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

          {/* Main Action Button */}
          <View style={styles.ctaContainer}>
            <Pressable
              style={({ pressed }) => [styles.ctaButton, pressed && { transform: [{ scale: 0.98 }] }]}
              onPress={handlePurchase}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#0f172a" size="small" />
              ) : (
                <ThemedText style={styles.ctaButtonText}>
                  {language === 'es' 
                    ? `Desbloquear PRO Para Siempre (${displayPrice})` 
                    : `Unlock PRO Forever (${displayPrice})`}
                </ThemedText>
              )}
            </Pressable>

            {/* Guaranteed Lifetime note */}
            <ThemedText style={styles.guaranteeText}>
              {language === 'es'
                ? '🔒 Compra protegida por Apple. Válida para todos tus dispositivos con tu Apple ID.'
                : '🔒 Protected by Apple. Valid across all your devices with your Apple ID.'}
            </ThemedText>
          </View>

          {/* Legal / Restore Links */}
          <View style={styles.footerLinks}>
            <Pressable onPress={handleRestore}>
              <ThemedText style={styles.linkText}>
                {language === 'es' ? 'Restaurar Compras' : 'Restore Purchases'}
              </ThemedText>
            </Pressable>
            <ThemedText style={styles.linkDivider}>•</ThemedText>
            <Pressable onPress={() => Linking.openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')}>
              <ThemedText style={styles.linkText}>
                {language === 'es' ? 'Términos de Uso' : 'Terms of Use'}
              </ThemedText>
            </Pressable>
            <ThemedText style={styles.linkDivider}>•</ThemedText>
            <Pressable onPress={() => Linking.openURL('https://bjcp.org')}>
              <ThemedText style={styles.linkText}>
                {language === 'es' ? 'Privacidad' : 'Privacy'}
              </ThemedText>
            </Pressable>
          </View>

        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function FeatureRow({ icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureIconBox}>
        <MenuIcon name={icon} width={24} height={24} />
      </View>
      <View style={styles.featureContent}>
        <ThemedText style={styles.featureTitle}>{title}</ThemedText>
        <ThemedText style={styles.featureDesc}>{desc}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1d',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 8,
    zIndex: 10,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 16,
    color: '#94a3b8',
    fontFamily: Fonts.spaceGroteskBold,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 64,
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#f8fafc',
    marginTop: 8,
    textAlign: 'center',
  },
  proBadge: {
    color: '#f59e0b',
    fontFamily: Fonts.spaceGroteskBold,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 290,
    fontFamily: Fonts.inter,
  },
  featuresList: {
    width: '100%',
    marginVertical: 16,
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  featureIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#f8fafc',
  },
  featureDesc: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
    lineHeight: 16,
    fontFamily: Fonts.inter,
  },
  plansContainer: {
    width: '100%',
    marginVertical: 16,
  },
  planCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  planCardSelected: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderColor: '#f59e0b',
  },
  planBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 10,
  },
  planBadgeText: {
    fontSize: 10,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#0f172a',
    letterSpacing: 0.5,
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  planTitle: {
    fontSize: 17,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#f8fafc',
  },
  planPeriod: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 3,
    fontFamily: Fonts.inter,
  },
  planPrice: {
    fontSize: 24,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#f59e0b',
  },
  planSubPrice: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
    fontFamily: Fonts.spaceGroteskBold,
  },
  ctaContainer: {
    width: '100%',
    marginTop: 8,
    alignItems: 'center',
  },
  ctaButton: {
    width: '100%',
    backgroundColor: '#f59e0b',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  ctaButtonText: {
    fontSize: 16,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#0f172a',
    letterSpacing: 0.2,
  },
  guaranteeText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 16,
    fontFamily: Fonts.inter,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    flexWrap: 'wrap',
    gap: 8,
  },
  linkText: {
    fontSize: 11,
    color: '#64748b',
    textDecorationLine: 'underline',
    fontFamily: Fonts.inter,
  },
  linkDivider: {
    color: '#334155',
    fontSize: 11,
  },
});
