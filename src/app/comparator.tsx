import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Pressable, 
  ScrollView, 
  Modal, 
  TextInput, 
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/context/language-context';
import { getBJCPStyles, BeerStyle } from '@/data/bjcp2021';
import { fuzzyMatch } from '@/utils/fuzzy';
import { BottomTabInset, Fonts, Spacing } from '@/constants/theme';

// Helper to convert SRM values to actual hex beer colors for premium UI barometers
const getSRMColor = (srm: number): string => {
  if (srm <= 2) return '#F3F9CB'; // Straw
  if (srm <= 4) return '#F5E791'; // Pale Gold
  if (srm <= 6) return '#EBB042'; // Deep Gold
  if (srm <= 9) return '#C17B27'; // Amber
  if (srm <= 12) return '#A65615'; // Deep Amber
  if (srm <= 15) return '#8D400A'; // Copper
  if (srm <= 20) return '#5E2B08'; // Dark Copper
  if (srm <= 30) return '#3B1F0B'; // Brown / Dark Brown
  if (srm <= 40) return '#1A0B05'; // Black
  return '#080302'; // Impenetrable Black
};

export default function ComparatorScreen() {
  const theme = useTheme();
  const { t, language } = useTranslation();
  const stylesList = getBJCPStyles(language);

  // Selected Beer Styles
  const [styleA, setStyleA] = useState<BeerStyle | null>(null);
  const [styleB, setStyleB] = useState<BeerStyle | null>(null);

  // Selection Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [activePicker, setActivePicker] = useState<'A' | 'B' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Descriptive comparison active tab
  const [activeTab, setActiveTab] = useState<'impression' | 'aroma' | 'appearance' | 'flavor' | 'mouthfeel' | 'history' | 'commercialExamples'>('impression');

  // Filtered styles for the picker modal using multi-field fuzzy search
  const filteredStyles = stylesList.filter(s => 
    fuzzyMatch(searchQuery, [s.id, s.name, s.category])
  );

  const openPicker = (picker: 'A' | 'B') => {
    setActivePicker(picker);
    setSearchQuery('');
    setModalVisible(true);
  };

  const selectStyle = (style: BeerStyle) => {
    if (activePicker === 'A') {
      setStyleA(style);
    } else {
      setStyleB(style);
    }
    setModalVisible(false);
    setActivePicker(null);
  };

  // Helper to calculate relative visual progress percent for vital stats barometers
  const getProgressWidth = (val: number, maxVal: number): any => {
    const percent = Math.min(100, Math.max(5, (val / maxVal) * 100));
    return `${percent}%`;
  };

  // Comparative Tabs config
  const tabOptions = [
    { id: 'impression' as const, label: t('impression').split('.')[1]?.trim() || t('impression') },
    { id: 'aroma' as const, label: t('aroma').split('.')[1]?.trim() || t('aroma') },
    { id: 'appearance' as const, label: t('appearance').split('.')[1]?.trim() || t('appearance') },
    { id: 'flavor' as const, label: t('flavor').split('.')[1]?.trim() || t('flavor') },
    { id: 'mouthfeel' as const, label: t('mouthfeel').split('.')[1]?.trim() || t('mouthfeel') },
    { id: 'history' as const, label: t('history').split('.')[1]?.trim() || t('history') },
    { id: 'commercialExamples' as const, label: language === 'es' ? 'Ejemplos Comerciales' : 'Commercial Examples' },
  ];

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Sticky Premium Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>{t('back')}</Text>
          </Pressable>
          <ThemedText style={styles.headerTitle}>{t('styleComparator')}</ThemedText>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Double Selector Cards Stack */}
          <View style={styles.selectorStack}>
            <Pressable 
              onPress={() => openPicker('A')}
              style={[
                styles.selectorCard,
                { backgroundColor: theme.backgroundElement, borderColor: styleA ? '#D99B26' : theme.border }
              ]}
            >
              <Text style={styles.cardLabel}>{t('selectStyleA')} 🍺</Text>
              {styleA ? (
                <View>
                  <Text style={styles.styleName}>{styleA.name}</Text>
                  <Text style={[styles.styleCategory, { color: theme.textSecondary }]}>
                    {styleA.id} • {styleA.category}
                  </Text>
                </View>
              ) : (
                <Text style={[styles.placeholderText, { color: theme.textSecondary }]}>
                  {language === 'es' ? 'Toca para elegir...' : 'Tap to select...'}
                </Text>
              )}
            </Pressable>

            <View style={styles.vsBadge}>
              <Text style={styles.vsText}>{t('vs')}</Text>
            </View>

            <Pressable 
              onPress={() => openPicker('B')}
              style={[
                styles.selectorCard,
                { backgroundColor: theme.backgroundElement, borderColor: styleB ? '#D99B26' : theme.border }
              ]}
            >
              <Text style={styles.cardLabel}>{t('selectStyleB')} 🍺</Text>
              {styleB ? (
                <View>
                  <Text style={styles.styleName}>{styleB.name}</Text>
                  <Text style={[styles.styleCategory, { color: theme.textSecondary }]}>
                    {styleB.id} • {styleB.category}
                  </Text>
                </View>
              ) : (
                <Text style={[styles.placeholderText, { color: theme.textSecondary }]}>
                  {language === 'es' ? 'Toca para elegir...' : 'Tap to select...'}
                </Text>
              )}
            </Pressable>
          </View>

          {/* Prompt when styles are not selected */}
          {(!styleA || !styleB) ? (
            <View style={[styles.emptyContainer, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              <Text style={styles.emptyIcon}>⚖️</Text>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                {t('noStylesSelected')}
              </Text>
            </View>
          ) : (
            // Full Comparative Dashboard
            <View style={styles.comparisonDashboard}>
              {/* Technical Vital Stats Barometers Header */}
              <View style={[styles.sectionHeader, { backgroundColor: theme.backgroundSelected }]}>
                <ThemedText style={styles.sectionHeaderTitle}>{t('differentStats')}</ThemedText>
              </View>

              {/* Head-to-Head Stats Comparison Grid */}
              <View style={[styles.comparisonGrid, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                {/* 1. ABV Compare */}
                <View style={styles.barometerRow}>
                  <View style={styles.barometerLabels}>
                    <Text style={styles.barLabel}>{styleA.abvMin}% - {styleA.abvMax}%</Text>
                    <Text style={styles.barTitle}>{t('abv')}</Text>
                    <Text style={styles.barLabel}>{styleB.abvMin}% - {styleB.abvMax}%</Text>
                  </View>
                  <View style={styles.progressBarWrapper}>
                    {/* Left Style Barometer (Style A) */}
                    <View style={styles.barSide}>
                      <View style={[styles.barFill, { 
                        width: getProgressWidth(styleA.abvMax, 15), 
                        backgroundColor: '#D99B26',
                        alignSelf: 'flex-end',
                        borderTopLeftRadius: 6,
                        borderBottomLeftRadius: 6
                      }]} />
                    </View>
                    {/* Right Style Barometer (Style B) */}
                    <View style={styles.barSide}>
                      <View style={[styles.barFill, { 
                        width: getProgressWidth(styleB.abvMax, 15), 
                        backgroundColor: '#2F5D73',
                        alignSelf: 'flex-start',
                        borderTopRightRadius: 6,
                        borderBottomRightRadius: 6
                      }]} />
                    </View>
                  </View>
                </View>

                {/* 2. IBU Compare */}
                <View style={styles.barometerRow}>
                  <View style={styles.barometerLabels}>
                    <Text style={styles.barLabel}>{styleA.ibuMin} - {styleA.ibuMax}</Text>
                    <Text style={styles.barTitle}>{t('ibu')}</Text>
                    <Text style={styles.barLabel}>{styleB.ibuMin} - {styleB.ibuMax}</Text>
                  </View>
                  <View style={styles.progressBarWrapper}>
                    <View style={styles.barSide}>
                      <View style={[styles.barFill, { 
                        width: getProgressWidth(styleA.ibuMax, 120), 
                        backgroundColor: '#D99B26',
                        alignSelf: 'flex-end',
                        borderTopLeftRadius: 6,
                        borderBottomLeftRadius: 6
                      }]} />
                    </View>
                    <View style={styles.barSide}>
                      <View style={[styles.barFill, { 
                        width: getProgressWidth(styleB.ibuMax, 120), 
                        backgroundColor: '#2F5D73',
                        alignSelf: 'flex-start',
                        borderTopRightRadius: 6,
                        borderBottomRightRadius: 6
                      }]} />
                    </View>
                  </View>
                </View>

                {/* 3. SRM Compare (Color swatches overlay) */}
                <View style={styles.barometerRow}>
                  <View style={styles.barometerLabels}>
                    <Text style={styles.barLabel}>SRM {styleA.srmMin} - {styleA.srmMax}</Text>
                    <Text style={styles.barTitle}>{t('srm')}</Text>
                    <Text style={styles.barLabel}>SRM {styleB.srmMin} - {styleB.srmMax}</Text>
                  </View>
                  <View style={styles.colorCompareRow}>
                    <View style={[styles.colorSwatch, { backgroundColor: getSRMColor(styleA.srmMax) }]}>
                      <Text style={[styles.swatchText, { color: styleA.srmMax > 12 ? '#FFF' : '#000' }]}>
                        {styleA.id}
                      </Text>
                    </View>
                    <View style={[styles.colorSwatch, { backgroundColor: getSRMColor(styleB.srmMax) }]}>
                      <Text style={[styles.swatchText, { color: styleB.srmMax > 12 ? '#FFF' : '#000' }]}>
                        {styleB.id}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* 4. Densities ranges compare */}
                <View style={styles.densityRow}>
                  <View style={styles.densityCol}>
                    <Text style={[styles.densityHeader, { color: theme.textSecondary }]}>OG</Text>
                    <Text style={styles.densityValue}>{styleA.vitalStatistics.og}</Text>
                    <Text style={[styles.densityHeader, { color: theme.textSecondary }]}>FG</Text>
                    <Text style={styles.densityValue}>{styleA.vitalStatistics.fg}</Text>
                  </View>
                  <View style={styles.densityDivider} />
                  <View style={styles.densityCol}>
                    <Text style={[styles.densityHeader, { color: theme.textSecondary }]}>OG</Text>
                    <Text style={styles.densityValue}>{styleB.vitalStatistics.og}</Text>
                    <Text style={[styles.densityHeader, { color: theme.textSecondary }]}>FG</Text>
                    <Text style={styles.densityValue}>{styleB.vitalStatistics.fg}</Text>
                  </View>
                </View>
              </View>

              {/* Side-by-Side Sensory Descriptor Compartments */}
              <View style={[styles.sectionHeader, { backgroundColor: theme.backgroundSelected, marginTop: Spacing.four }]}>
                <ThemedText style={styles.sectionHeaderTitle}>
                  {language === 'es' ? 'Comparador Sensorial' : 'Sensory Comparison'}
                </ThemedText>
              </View>

              {/* Descriptive tabs select scroller */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabsScroller}
              >
                {tabOptions.map((opt) => {
                  const active = activeTab === opt.id;
                  return (
                    <Pressable
                      key={opt.id}
                      onPress={() => setActiveTab(opt.id)}
                      style={[
                        styles.tabButton,
                        { backgroundColor: active ? '#2F5D73' : theme.backgroundElement, borderColor: theme.border }
                      ]}
                    >
                      <Text style={[styles.tabLabel, { color: active ? '#FFF' : theme.text }]}>
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Double descriptive textual panels side-by-side */}
              <View style={styles.descriptivePanels}>
                {/* Style A Panel */}
                <View style={[styles.descPanel, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                  <View style={styles.panelHeaderA}>
                    <Text style={styles.panelTitleText}>{styleA.id}</Text>
                  </View>
                  <ScrollView nestedScrollEnabled style={styles.panelScroll}>
                    <Text style={[styles.panelBodyText, { color: theme.text }]}>
                      {activeTab === 'impression' && styleA.overallImpression}
                      {activeTab === 'aroma' && styleA.aroma}
                      {activeTab === 'appearance' && styleA.appearance}
                      {activeTab === 'flavor' && styleA.flavor}
                      {activeTab === 'mouthfeel' && styleA.mouthfeel}
                      {activeTab === 'history' && styleA.history}
                      {activeTab === 'commercialExamples' && (
                        styleA.commercialExamples.length > 0
                          ? '• ' + styleA.commercialExamples.join('\n• ')
                          : (language === 'es' ? 'No hay ejemplos registrados.' : 'No examples registered.')
                      )}
                    </Text>
                  </ScrollView>
                </View>

                {/* Style B Panel */}
                <View style={[styles.descPanel, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                  <View style={styles.panelHeaderB}>
                    <Text style={styles.panelTitleText}>{styleB.id}</Text>
                  </View>
                  <ScrollView nestedScrollEnabled style={styles.panelScroll}>
                    <Text style={[styles.panelBodyText, { color: theme.text }]}>
                      {activeTab === 'impression' && styleB.overallImpression}
                      {activeTab === 'aroma' && styleB.aroma}
                      {activeTab === 'appearance' && styleB.appearance}
                      {activeTab === 'flavor' && styleB.flavor}
                      {activeTab === 'mouthfeel' && styleB.mouthfeel}
                      {activeTab === 'history' && styleB.history}
                      {activeTab === 'commercialExamples' && (
                        styleB.commercialExamples.length > 0
                          ? '• ' + styleB.commercialExamples.join('\n• ')
                          : (language === 'es' ? 'No hay ejemplos registrados.' : 'No examples registered.')
                      )}
                    </Text>
                  </ScrollView>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Modern Searchable Selection Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
            {/* Modal Header */}
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <Text style={styles.modalTitle}>
                {activePicker === 'A' ? t('selectStyleA') : t('selectStyleB')}
              </Text>
              <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={[styles.closeButtonText, { color: theme.tint }]}>
                  {language === 'es' ? 'Cerrar' : 'Close'}
                </Text>
              </Pressable>
            </View>

            {/* Live Search Input */}
            <View style={styles.searchWrapper}>
              <TextInput
                style={[styles.searchInput, { 
                  backgroundColor: theme.backgroundElement, 
                  color: theme.text,
                  borderColor: theme.border
                }]}
                placeholder={t('searchPlaceholder')}
                placeholderTextColor={theme.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                clearButtonMode="while-editing"
                autoFocus
              />
            </View>

            {/* List of matching Styles */}
            <FlatList
              data={filteredStyles}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => {
                return (
                  <Pressable
                    onPress={() => selectStyle(item)}
                    style={({ pressed }) => [
                      styles.listItem,
                      { 
                        backgroundColor: theme.backgroundElement, 
                        borderBottomColor: theme.border 
                      },
                      pressed && styles.itemPressed
                    ]}
                  >
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemIdBadge}>{item.id}</Text>
                      <Text style={styles.itemCategory}>{item.category}</Text>
                    </View>
                    <Text style={styles.itemName}>{item.name}</Text>
                  </Pressable>
                );
              }}
              ListEmptyComponent={() => (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsIcon}>🔍</Text>
                  <Text style={[styles.noResultsText, { color: theme.textSecondary }]}>
                    {t('noResults')}
                  </Text>
                </View>
              )}
            />
          </SafeAreaView>
        </View>
      </Modal>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: BottomTabInset + Spacing.six,
  },
  selectorStack: {
    flexDirection: 'row',
    alignItems: 'stretch', // Stretch child selectorCards to have the exact same height!
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    marginTop: Spacing.two,
    gap: Spacing.two,
  },
  selectorCard: {
    flex: 1,
    borderRadius: Spacing.two,
    borderWidth: 1.5,
    padding: Spacing.three,
    minHeight: 105,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D99B26', // Warm amber brand accent
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  styleName: {
    fontSize: 15,
    fontWeight: '700',
  },
  styleCategory: {
    fontSize: 11,
    marginTop: 2,
  },
  placeholderText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  vsBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D99B26',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  vsText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
    fontFamily: Fonts.spaceGroteskBold,
  },
  emptyContainer: {
    margin: Spacing.four,
    padding: Spacing.six,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderStyle: 'dashed',
    minHeight: 250,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.three,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
    maxWidth: 280,
  },
  comparisonDashboard: {
    marginTop: Spacing.four,
    paddingHorizontal: Spacing.four,
  },
  sectionHeader: {
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three, // Slightly more padding for breathing space
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.two,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2, // Elegant wide tracking
    textTransform: 'uppercase',
    textAlign: 'center',
    fontFamily: Fonts.spaceGroteskBold,
  },
  comparisonGrid: {
    borderRadius: Spacing.three,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.four,
  },
  barometerRow: {
    gap: Spacing.two,
  },
  barometerLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  barTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D99B26',
    textTransform: 'uppercase',
  },
  progressBarWrapper: {
    flexDirection: 'row',
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barSide: {
    flex: 1,
    height: '100%',
  },
  barFill: {
    height: '100%',
  },
  colorCompareRow: {
    flexDirection: 'row',
    height: 38,
    borderRadius: Spacing.two,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  colorSwatch: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchText: {
    fontSize: 12,
    fontWeight: '900',
  },
  densityRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: Spacing.three,
    marginTop: 4,
  },
  densityCol: {
    flex: 1,
    alignItems: 'center',
  },
  densityDivider: {
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    height: '100%',
  },
  densityHeader: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  densityValue: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: Spacing.one,
  },
  tabsScroller: {
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    marginBottom: Spacing.two,
  },
  tabButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  descriptivePanels: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  descPanel: {
    flex: 1,
    borderRadius: Spacing.three,
    borderWidth: 1,
    height: 320,
    overflow: 'hidden',
  },
  panelHeaderA: {
    backgroundColor: '#D99B26',
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  panelHeaderB: {
    backgroundColor: '#2F5D73',
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  panelTitleText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 13,
  },
  panelScroll: {
    padding: Spacing.three,
  },
  panelBodyText: {
    fontSize: 13,
    lineHeight: 18,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '80%',
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.four,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  closeButton: {
    padding: Spacing.one,
  },
  closeButtonText: {
    fontWeight: '700',
    fontSize: 14,
  },
  searchWrapper: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  searchInput: {
    height: 48,
    borderRadius: Spacing.two,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    fontSize: 14,
  },
  listContent: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
  listItem: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    borderBottomWidth: 1,
  },
  itemPressed: {
    opacity: 0.8,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: 4,
  },
  itemIdBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D99B26',
    backgroundColor: 'rgba(217, 155, 38, 0.1)',
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: 4,
  },
  itemCategory: {
    fontSize: 11,
    color: '#888',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
  },
  noResultsIcon: {
    fontSize: 38,
    marginBottom: Spacing.two,
  },
  noResultsText: {
    fontSize: 14,
  },
});
