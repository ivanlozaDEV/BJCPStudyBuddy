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
  const { t } = useTranslation();
  const { isPro } = usePurchases();

  const handleMenuPress = (route: string, isProFeature: boolean) => {
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
                <ThemedText style={styles.appNameBottom}>Study</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.subtitle}>
              {t('selectOption')}
            </ThemedText>
          </View>

          {/* Interactive Stack of Menu Cards */}
          <View style={styles.menuStack}>
            {menuOptions.map((option) => {
              return (
                <Pressable
                  key={option.id}
                  onPress={() => handleMenuPress(option.route, option.isPro)}
                  style={({ pressed }) => [
                    styles.menuCard,
                    { 
                      backgroundColor: theme.backgroundElement, 
                      borderColor: option.isPro ? 'rgba(242, 184, 36, 0.4)' : theme.border 
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
                        {option.isPro && (
                          <View style={styles.proBadge}>
                            <ThemedText style={styles.proBadgeText}>PRO</ThemedText>
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
