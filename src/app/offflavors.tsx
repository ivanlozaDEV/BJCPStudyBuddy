import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Pressable, 
  ScrollView, 
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/context/language-context';
import { getOffFlavors } from '@/data/offflavors';
import { BottomTabInset, Fonts, Spacing } from '@/constants/theme';
import { OffFlavorIcon } from '@/components/offflavor-icons';
import { fuzzyMatch } from '@/utils/fuzzy';

export default function OffFlavorsScreen() {
  const theme = useTheme();
  const { t, language } = useTranslation();
  const offFlavorsList = getOffFlavors(language);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filtered list using hybrid multi-field fuzzy search
  const filteredOffFlavors = offFlavorsList.filter(o => 
    fuzzyMatch(searchQuery, [o.name, o.sensation, o.causes, o.prevention])
  );

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Sticky Premium Header */}
        <View style={styles.header}>
          <Pressable 
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/');
              }
            }} 
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <ThemedText style={styles.headerTitle}>{t('offFlavors')}</ThemedText>
          <View style={{ width: 40 }} />
        </View>

        {/* Live Search Filter Box */}
        <View style={styles.searchWrapper}>
          <TextInput
            style={[styles.searchInput, { 
              backgroundColor: theme.backgroundElement, 
              color: theme.text,
              borderColor: theme.border
            }]}
            placeholder={t('searchOffFlavors')}
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>

        {/* Dynamic List */}
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredOffFlavors.length === 0 ? (
            <View style={[styles.noResultsContainer, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              <Text style={styles.noResultsIcon}>🔬</Text>
              <Text style={[styles.noResultsText, { color: theme.textSecondary }]}>
                {language === 'es' ? 'Ningún defecto coincide con tu búsqueda.' : 'No off-flavors match your search.'}
              </Text>
            </View>
          ) : (
            filteredOffFlavors.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <View 
                  key={item.id}
                  style={[
                    styles.defectCard,
                    { 
                      backgroundColor: theme.backgroundElement, 
                      borderColor: isExpanded ? '#D99B26' : theme.border 
                    }
                  ]}
                >
                  <Pressable 
                    onPress={() => toggleExpand(item.id)}
                    style={styles.cardHeader}
                  >
                    <View style={styles.cardHeaderLeft}>
                      <OffFlavorIcon id={item.id} size={34} />
                      <Text style={styles.defectName}>{item.name}</Text>
                    </View>
                    <Text style={[styles.expandArrow, { color: theme.tint }]}>
                      {isExpanded ? '▲' : '▼'}
                    </Text>
                  </Pressable>

                  {/* Expanded Sensory Panels (Tastes Like, Possible Causes, How to Avoid) */}
                  {isExpanded && (
                    <View style={styles.cardBody}>
                      
                      {/* 1. TASTES / SMELLS LIKE */}
                      <View style={styles.sensationBadge}>
                        <Text style={styles.sensationBadgeHeader}>
                          👅 {language === 'es' ? 'SABOR Y OLOR (TASTES/SMELLS LIKE)' : 'TASTES / SMELLS LIKE'}
                        </Text>
                        <Text style={styles.sensationBadgeText}>
                          {item.sensation}
                        </Text>
                      </View>

                      {/* 2. POSSIBLE CAUSES */}
                      <View style={styles.detailCompartment}>
                        <Text style={styles.compartmentTitle}>
                          🔬 {language === 'es' ? 'CAUSAS POSIBLES (POSSIBLE CAUSES)' : 'POSSIBLE CAUSES'}
                        </Text>
                        <Text style={[styles.compartmentText, { color: theme.text }]}>
                          {item.causes}
                        </Text>
                      </View>

                      {/* 3. HOW TO AVOID */}
                      <View style={styles.detailCompartment}>
                        <Text style={styles.compartmentTitle}>
                          🛡️ {language === 'es' ? 'CÓMO EVITAR (HOW TO AVOID)' : 'HOW TO AVOID'}
                        </Text>
                        <Text style={[styles.compartmentText, { color: theme.text }]}>
                          {item.prevention}
                        </Text>
                      </View>

                    </View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F5D73', // Premium Brand Petroleum Blue background
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  pressed: {
    opacity: 0.7,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    fontFamily: Fonts.spaceGroteskBold,
    flex: 1,
    textAlign: 'center',
  },
  searchWrapper: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  searchInput: {
    height: 48,
    borderRadius: Spacing.two,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    fontSize: 14,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.six,
    gap: Spacing.three,
  },
  noResultsContainer: {
    padding: Spacing.six,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: Spacing.four,
  },
  noResultsIcon: {
    fontSize: 38,
    marginBottom: Spacing.three,
  },
  noResultsText: {
    fontSize: 14,
    textAlign: 'center',
  },
  defectCard: {
    borderRadius: Spacing.three,
    borderWidth: 1.5,
    padding: Spacing.three,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  defectName: {
    fontSize: 16,
    fontWeight: '700',
  },
  expandArrow: {
    fontSize: 12,
    fontWeight: '800',
    marginLeft: Spacing.two,
  },
  cardBody: {
    marginTop: Spacing.three,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  sensationBadge: {
    backgroundColor: 'rgba(219, 155, 38, 0.08)',
    borderRadius: Spacing.two,
    borderLeftWidth: 4,
    borderLeftColor: '#D99B26', // Warm brand amber vertical accent line
    padding: Spacing.three,
  },
  sensationBadgeHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D99B26',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  sensationBadgeText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  detailCompartment: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: 4,
  },
  compartmentTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2F5D73', // Brand petroleum blue
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  compartmentText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
});
