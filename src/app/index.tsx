import React from 'react';
import { ScrollView, StyleSheet, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/context/language-context';

export default function HomeScreen() {
  const theme = useTheme();
  const { t } = useTranslation();

  const menuOptions = [
    {
      id: 'explore',
      title: t('exploreStyles'),
      description: t('exploreStylesDesc'),
      icon: '🔍',
      route: '/explore' as const,
    },
    {
      id: 'comparator',
      title: t('styleComparator'),
      description: t('styleComparatorDesc'),
      icon: '⚖️',
      route: '/explore' as const, // Placeholder until comparator is built
    },
    {
      id: 'offflavors',
      title: t('offFlavors'),
      description: t('offFlavorsDesc'),
      icon: '🔬',
      route: '/settings' as const, // Placeholder until off-flavors screen is built
    },
    {
      id: 'flashcards',
      title: t('flashcards'),
      description: t('flashcardsDesc'),
      icon: '🃏',
      route: '/flashcards' as const,
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
          >
          {/* Header Area with Logo and Settings Button */}
          <View style={styles.header}>
            <View style={styles.logoAndTitle}>
              <ThemedText style={styles.logoSymbol}>🧬</ThemedText>
              <View>
                <ThemedText type="title" style={styles.appName}>
                  {t('appName')}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
                  {t('selectOption')}
                </ThemedText>
              </View>
            </View>

            {/* Premium Settings Button */}
            <Pressable 
              onPress={() => router.push('/settings')}
              style={({ pressed }) => [
                styles.settingsBtn,
                { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                pressed && styles.pressed
              ]}
            >
              <ThemedText style={{ fontSize: 18 }}>⚙️</ThemedText>
            </Pressable>
          </View>

          {/* Interactive Stack of 4 Menu Cards */}
          <View style={styles.menuStack}>
            {menuOptions.map((option) => {
              return (
                <Pressable
                  key={option.id}
                  onPress={() => router.push(option.route)}
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
                      <ThemedText style={styles.cardIcon}>{option.icon}</ThemedText>
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
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.five,
    gap: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  logoAndTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  logoSymbol: {
    fontSize: 32,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: Spacing.two,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  menuStack: {
    gap: Spacing.three,
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
