import React from 'react';
import { ScrollView, StyleSheet, Pressable, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/context/language-context';
import { usePurchases } from '@/context/purchases-context';
import { BeerBubbles } from '@/components/beer-bubbles';
import { BeerLogo } from '@/components/beer-logo';
import { MenuIcon, MenuIconProps } from '@/components/menu-icons';

export default function HomeScreen() {
  const theme = useTheme();
  const { t, language } = useTranslation();
  const { isPro, isTrialActive, trialDaysRemaining, isLifetimePurchased } = usePurchases();

  const handleMenuPress = (route: string, isProFeature: boolean, optionId: string) => {
    // If it's myTastings, allow opening the screen to read past tastings in read-only mode
    if (optionId === 'myTastings') {
      router.push(route as any);
      return;
    }
    if (isProFeature && !isPro) {
      router.push('/paywall' as any);
    } else {
      router.push(route as any);
    }
  };

  const menuOptions: {
    id: string;
    title: string;
    description: string;
    icon: MenuIconProps['name'];
    route: string;
    isPro: boolean;
  }[] = [
    // --- HERRAMIENTAS GRATUITAS (Free Tools) ---
    {
      id: 'explore',
      title: t('exploreStyles'),
      description: t('exploreStylesDesc'),
      icon: 'explore',
      route: '/explore',
      isPro: false,
    },
    {
      id: 'offflavors',
      title: t('offFlavors'),
      description: t('offFlavorsDesc'),
      icon: 'offflavors',
      route: '/offflavors',
      isPro: false,
    },
    {
      id: 'glossary',
      title: t('glossary'),
      description: t('glossaryDesc'),
      icon: 'glossary',
      route: '/glossary',
      isPro: false,
    },
    {
      id: 'comparator',
      title: t('styleComparator'),
      description: t('styleComparatorDesc'),
      icon: 'comparator',
      route: '/comparator',
      isPro: true,
    },
    // --- HERRAMIENTAS PRO (PRO Tools) ---
    {
      id: 'myTastings',
      title: t('myTastings'),
      description: t('myTastingsDesc'),
      icon: 'myTastings',
      route: '/tastings',
      isPro: true,
    },
    {
      id: 'flashcards',
      title: t('flashcards'),
      description: t('flashcardsDesc'),
      icon: 'flashcards',
      route: '/flashcards',
      isPro: true,
    },
    // --- CONFIGURACIÓN (Settings) ---
    {
      id: 'settings',
      title: t('settings'),
      description: t('settingsDesc'),
      icon: 'settings',
      route: '/settings',
      isPro: false,
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      {/* Dynamic rising beer carbonation bubbles in background */}
      <BeerBubbles />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Centered Hero Branding Area */}
          <View style={styles.heroContainer}>
            <View style={styles.heroRow}>
              <BeerLogo size={105} />
              <View style={styles.heroTextColumn}>
                <ThemedText style={styles.appNameTop}>BREW</ThemedText>
                <ThemedText style={styles.appNameBottom}>
                  Study {isPro && <ThemedText style={{ color: '#F2B824', fontSize: 20 }}>PRO</ThemedText>}
                </ThemedText>
              </View>
            </View>

            {/* Status Pill in Hero */}
            {!isLifetimePurchased && isTrialActive ? (
              <Pressable
                onPress={() => router.push('/paywall' as any)}
                style={({ pressed }) => [styles.heroPillTrial, pressed && { opacity: 0.8 }]}
              >
                <ThemedText style={styles.heroPillTrialText}>
                  {language === 'es'
                    ? `✨ PRUEBA PRO: ${trialDaysRemaining} ${trialDaysRemaining === 1 ? 'DÍA' : 'DÍAS'}`
                    : `✨ PRO TRIAL: ${trialDaysRemaining} ${trialDaysRemaining === 1 ? 'DAY' : 'DAYS'}`}
                </ThemedText>
              </Pressable>
            ) : !isLifetimePurchased ? (
              <Pressable
                onPress={() => router.push('/paywall' as any)}
                style={({ pressed }) => [styles.heroPillExpired, pressed && { opacity: 0.8 }]}
              >
                <ThemedText style={styles.heroPillExpiredText}>
                  {language === 'es' ? '🔒 PRUEBA FINALIZADA • ACTIVAR PRO' : '🔒 TRIAL ENDED • UNLOCK PRO'}
                </ThemedText>
              </Pressable>
            ) : null}

            <ThemedText style={styles.subtitle}>
              {t('selectOption')}
            </ThemedText>
          </View>

          {/* Interactive Stack of Menu Cards */}
          <View style={styles.menuStack}>
            {menuOptions.map((option) => {
              const isLocked = option.isPro && !isPro;
              return (
                <Pressable
                  key={option.id}
                  onPress={() => handleMenuPress(option.route, option.isPro, option.id)}
                  style={({ pressed }) => [
                    styles.menuCard,
                    { 
                      backgroundColor: theme.backgroundElement, 
                      borderColor: isLocked ? 'rgba(242, 184, 36, 0.4)' : theme.border 
                    },
                    pressed && styles.cardPressed
                  ]}
                >
                  <View style={styles.cardLeft}>
                    <View style={[styles.iconWrapper, { backgroundColor: theme.backgroundSelected }]}>
                      <MenuIcon name={option.icon} />
                    </View>
                  </View>
                  
                  <View style={styles.cardContent}>
                    <View style={styles.cardTitleRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                        <ThemedText type="smallBold" style={styles.cardTitle}>
                          {option.title}
                        </ThemedText>
                        {isLocked && (
                          <View style={styles.proBadge}>
                            <ThemedText style={styles.proBadgeText}>PRO 🔒</ThemedText>
                          </View>
                        )}
                      </View>
                      <ThemedText style={[styles.arrowIcon, { color: theme.tint }]}>➔</ThemedText>
                    </View>
                    <ThemedText type="small" themeColor="textSecondary" style={styles.cardDescription}>
                      {option.description}
                    </ThemedText>
                  </View>
                </Pressable>
              );
            })}
          </View>

        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#2F5D73', // Premium brand petroleum blue background
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: BottomTabInset + Spacing.five,
    gap: Spacing.four,
  },
  heroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.four,
    marginTop: Spacing.three,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  heroTextColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: Spacing.two,
  },
  appNameTop: {
    fontSize: 56,
    lineHeight: 56,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: Fonts.spaceGroteskBold,
    letterSpacing: -1.5,
  },
  appNameBottom: {
    fontSize: 52,
    lineHeight: 52,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: Fonts.spaceGrotesk,
    letterSpacing: -1.0,
    marginTop: -8,
  },
  heroPillTrial: {
    backgroundColor: 'rgba(242, 184, 36, 0.18)',
    borderWidth: 1,
    borderColor: '#F2B824',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginTop: Spacing.two,
    alignSelf: 'center',
  },
  heroPillTrialText: {
    color: '#F2B824',
    fontFamily: Fonts.spaceGroteskBold,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  heroPillLifetime: {
    backgroundColor: 'rgba(82, 183, 136, 0.2)',
    borderWidth: 1,
    borderColor: '#52B788',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginTop: Spacing.two,
    alignSelf: 'center',
  },
  heroPillLifetimeText: {
    color: '#52B788',
    fontFamily: Fonts.spaceGroteskBold,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  heroPillExpired: {
    backgroundColor: 'rgba(224, 86, 36, 0.2)',
    borderWidth: 1,
    borderColor: '#E05624',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginTop: Spacing.two,
    alignSelf: 'center',
  },
  heroPillExpiredText: {
    color: '#FF7A50',
    fontFamily: Fonts.spaceGroteskBold,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: Spacing.two,
  },
  menuStack: {
    gap: Spacing.three,
    width: '92%',
    alignSelf: 'center',
    maxWidth: 550,
  },
  menuCard: {
    flexDirection: 'row',
    borderRadius: Spacing.three,
    borderWidth: 1,
    padding: Spacing.three,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  cardLeft: {
    justifyContent: 'center',
    marginRight: Spacing.three,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: Spacing.two,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  proBadge: {
    backgroundColor: '#F2B824',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  proBadgeText: {
    color: '#161B22',
    fontSize: 9,
    fontFamily: Fonts.manropeBold,
    fontWeight: '800',
  },
  arrowIcon: {
    fontSize: 16,
    fontWeight: '800',
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
});
