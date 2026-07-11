import React from 'react';
import { ScrollView, StyleSheet, Pressable, View, Text } from 'react-native';
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
import { MenuIcon } from '@/components/menu-icons';

export default function HomeScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { isPro } = usePurchases();

  const handleMenuPress = (route: string, id: string) => {
    if (id === 'flashcards' && !isPro) {
      router.push('/paywall' as any);
    } else {
      router.push(route as any);
    }
  };

  const menuOptions: {
    id: string;
    title: string;
    description: string;
    icon: 'explore' | 'comparator' | 'offflavors' | 'flashcards' | 'settings' | 'glossary';
    route: '/explore' | '/comparator' | '/offflavors' | '/flashcards' | '/settings' | '/glossary';
  }[] = [
    {
      id: 'flashcards',
      title: t('flashcards'),
      description: t('flashcardsDesc'),
      icon: 'flashcards',
      route: '/flashcards',
    },
    {
      id: 'explore',
      title: t('exploreStyles'),
      description: t('exploreStylesDesc'),
      icon: 'explore',
      route: '/explore',
    },
    {
      id: 'comparator',
      title: t('styleComparator'),
      description: t('styleComparatorDesc'),
      icon: 'comparator',
      route: '/comparator',
    },
    {
      id: 'offflavors',
      title: t('offFlavors'),
      description: t('offFlavorsDesc'),
      icon: 'offflavors',
      route: '/offflavors',
    },
    {
      id: 'glossary',
      title: t('glossary'),
      description: t('glossaryDesc'),
      icon: 'glossary',
      route: '/glossary',
    },
    {
      id: 'settings',
      title: t('settings'),
      description: t('settingsDesc'),
      icon: 'settings',
      route: '/settings',
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
          {/* Magnificent Centered Hero Branding Area */}
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

          {/* Interactive Stack of 4 Menu Cards */}
          <View style={styles.menuStack}>
            {menuOptions.map((option) => {
              return (
                <Pressable
                  key={option.id}
                  onPress={() => handleMenuPress(option.route, option.id)}
                  style={({ pressed }) => [
                    styles.menuCard,
                    { 
                      backgroundColor: theme.backgroundElement, 
                      borderColor: theme.border 
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
                      <ThemedText type="smallBold" style={styles.cardTitle}>
                        {option.title}
                      </ThemedText>
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
    marginBottom: Spacing.five,
    marginTop: Spacing.four,
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
    paddingTop: Spacing.two, // Visual alignment
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
    marginTop: -8, // Tighten up the stack
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.75)', // Breathtaking high-contrast light white
    letterSpacing: 2.5, // Sleeker letter spacing tracking
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: Spacing.three, // Push down subtitle for breathing room
  },
  menuStack: {
    gap: Spacing.three,
    width: '88%', // Compressed horizontally for a centered iOS card list look
    alignSelf: 'center',
    maxWidth: 550, // Technical responsive max width
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
  cardIcon: {
    fontSize: 22,
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
    fontSize: 16,
    fontWeight: '700',
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
