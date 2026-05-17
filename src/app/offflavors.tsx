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

export default function OffFlavorsScreen() {
  const theme = useTheme();
  const { t, language } = useTranslation();
  const offFlavorsList = getOffFlavors(language);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filtered list
  const filteredOffFlavors = offFlavorsList.filter(o => 
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.chemical.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.sensation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.origin.toLowerCase().includes(searchQuery.toLowerCase())
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
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>{t('back')}</Text>
          </Pressable>
          <ThemedText style={styles.headerTitle}>{t('offFlavors')}</ThemedText>
          <View style={{ width: 60 }} />
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
                      <Text style={styles.defectName}>{item.name}</Text>
                      <Text style={[styles.defectChemical, { color: theme.textSecondary }]}>
                        {item.chemical}
                      </Text>
                    </View>
                    <Text style={[styles.expandArrow, { color: theme.tint }]}>
                      {isExpanded ? '▲' : '▼'}
                    </Text>
                  </Pressable>

                  {/* Expanded Sensory Panels */}
                  {isExpanded && (
                    <View style={styles.cardBody}>
                      {/* Sensation Description Badge */}
                      <View style={styles.sensationBadge}>
                        <Text style={styles.sensationBadgeHeader}>
                          {language === 'es' ? 'PERFIL AROMÁTICO / SENSORIAL' : 'SENSORY PERCEPTION'}
                        </Text>
                        <Text style={styles.sensationBadgeText}>
                          {item.sensation}
                        </Text>
                      </View>

                      {/* Threshold & Chemical tag row */}
                      <View style={styles.metaRow}>
                        <View style={[styles.metaTag, { backgroundColor: theme.backgroundSelected }]}>
                          <Text style={[styles.metaTagLabel, { color: theme.textSecondary }]}>
                            {t('threshold')}
                          </Text>
                          <Text style={styles.metaTagValue}>{item.threshold}</Text>
                        </View>
                      </View>

                      {/* Detail Compartment 1: Description */}
                      <View style={styles.detailCompartment}>
                        <Text style={styles.compartmentTitle}>🔬 {t('sensoryDescription')}</Text>
                        <Text style={[styles.compartmentText, { color: theme.text }]}>
                          {item.description}
                        </Text>
                      </View>

                      {/* Detail Compartment 2: Origin */}
                      <View style={styles.detailCompartment}>
                        <Text style={styles.compartmentTitle}>🌾 {t('originCauses')}</Text>
                        <Text style={[styles.compartmentText, { color: theme.text }]}>
                          {item.origin}
                        </Text>
                      </View>

                      {/* Detail Compartment 3: Prevention */}
                      <View style={styles.detailCompartment}>
                        <Text style={styles.compartmentTitle}>🛡️ {t('prevention')}</Text>
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
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.one,
  },
  backText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: Fonts.spaceGrotesk,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    fontFamily: Fonts.spaceGroteskBold,
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
    gap: 2,
  },
  defectName: {
    fontSize: 16,
    fontWeight: '700',
  },
  defectChemical: {
    fontSize: 12,
    fontFamily: Fonts.spaceGrotesk,
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
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  metaTag: {
    flex: 1,
    borderRadius: Spacing.two,
    padding: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaTagLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  metaTagValue: {
    fontSize: 13,
    fontWeight: '700',
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
