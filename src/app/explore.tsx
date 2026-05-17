import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  FlatList, 
  Pressable, 
  View, 
  Modal, 
  ScrollView, 
  useColorScheme,
  Text
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/context/language-context';
import { 
  BeerStyle, 
  getBJCPStyles, 
  searchBeerStyles, 
  getAllCategories 
} from '@/data/bjcp2021';

// SRM Color Mapping Helper for Visual WOW factor
function getSRMColor(srm: number): string {
  if (srm <= 2.5) return '#F8F753'; // Light straw
  if (srm <= 4.5) return '#F2C75C'; // Pale gold
  if (srm <= 7.5) return '#E9A13B'; // Deep gold / orange amber
  if (srm <= 12.5) return '#C47632'; // Amber / copper
  if (srm <= 18.5) return '#944C25'; // Medium brown
  if (srm <= 24.5) return '#60310F'; // Dark brown
  if (srm <= 35.0) return '#241208'; // Very dark
  return '#080402'; // Stout Black
}

export default function ExploreScreen() {
  const params = useLocalSearchParams<{ search?: string }>();
  const theme = useTheme();
  const scheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { t, language } = useTranslation();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [abvFilter, setAbvFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [ibuFilter, setIbuFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all');

  // Detail Modal State
  const [selectedStyle, setSelectedStyle] = useState<BeerStyle | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // Sync Search parameter from HomeScreen (Style of the Day)
  useEffect(() => {
    if (params.search) {
      setSearchQuery(params.search);
      setSelectedCategory(null);
      setAbvFilter('all');
      setIbuFilter('all');
    }
  }, [params.search]);

  // Categories list
  const categories = getAllCategories(language);

  // Handlers
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setAbvFilter('all');
    setIbuFilter('all');
  };

  // Filter Logic
  const filteredStyles = getBJCPStyles(language).filter(style => {
    // 1. Text Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = 
        style.id.toLowerCase().includes(q) ||
        style.name.toLowerCase().includes(q) ||
        style.category.toLowerCase().includes(q) ||
        style.tags.some(t => t.toLowerCase().includes(q)) ||
        style.overallImpression.toLowerCase().includes(q);
      if (!matchText) return false;
    }

    // 2. Category Filter
    if (selectedCategory && style.category !== selectedCategory) {
      return false;
    }

    // 3. ABV Filter
    // low (<4.5%), mid (4.5% - 6.5%), high (>6.5%)
    if (abvFilter === 'low' && style.abvMax > 4.5) return false;
    if (abvFilter === 'mid' && (style.abvMin > 6.5 || style.abvMax < 4.5)) return false;
    if (abvFilter === 'high' && style.abvMin < 6.5) return false;

    // 4. IBU Filter
    // low (<20), mid (20-45), high (>45)
    if (ibuFilter === 'low' && style.ibuMax > 20) return false;
    if (ibuFilter === 'mid' && (style.ibuMin > 45 || style.ibuMax < 20)) return false;
    if (ibuFilter === 'high' && style.ibuMin < 45) return false;

    return true;
  });

  const renderStyleItem = ({ item }: { item: BeerStyle }) => {
    const cardSrmColor = getSRMColor((item.srmMin + item.srmMax) / 2);

    return (
      <Pressable 
        onPress={() => {
          setSelectedStyle(item);
          setDetailModalVisible(true);
        }}
        style={({ pressed }) => [
          styles.styleCard, 
          { backgroundColor: theme.backgroundElement },
          pressed && styles.cardPressed
        ]}
      >
        <View style={styles.cardHeader}>
          {/* Visual Color Bar representing Beer SRM */}
          <View style={[styles.srmIndicator, { backgroundColor: cardSrmColor }]} />
          
          <View style={styles.cardInfo}>
            <View style={styles.cardTitleRow}>
              <ThemedText type="smallBold" style={[styles.styleId, { color: theme.tint }]}>
                {item.id}
              </ThemedText>
              <ThemedText type="default" style={styles.styleName} numberOfLines={1}>
                {item.name}
              </ThemedText>
            </View>
            <ThemedText type="small" themeColor="textSecondary" style={styles.styleCategory}>
              {item.category}
            </ThemedText>
          </View>
        </View>

        <ThemedText type="small" style={styles.cardSummary} numberOfLines={2}>
          {item.overallImpression}
        </ThemedText>

        {/* Vital stats small badges */}
        <View style={styles.vitalStatsRow}>
          <ThemedText type="code" style={styles.vitalStatLabel}>
            ABV: <Text style={{ color: theme.text }}>{item.vitalStatistics.abv}</Text>
          </ThemedText>
          <ThemedText type="code" style={styles.vitalStatLabel}>
            IBU: <Text style={{ color: theme.text }}>{item.vitalStatistics.ibu}</Text>
          </ThemedText>
          <ThemedText type="code" style={styles.vitalStatLabel}>
            SRM: <Text style={{ color: theme.text }}>{item.vitalStatistics.srm}</Text>
          </ThemedText>
        </View>
      </Pressable>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Sticky Header with Search */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Pressable 
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            >
              <ThemedText style={[styles.backText, { color: theme.tint }]}>
                {t('back')}
              </ThemedText>
            </Pressable>
            <ThemedText type="subtitle" style={styles.headerTitle}>
              {t('exploreStyles')}
            </ThemedText>
          </View>
          
          {/* Search Input */}
          <View style={[styles.searchBox, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText style={styles.searchIcon}>🔍</ThemedText>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t('searchPlaceholder')}
              placeholderTextColor={theme.textSecondary}
              style={[styles.searchInput, { color: theme.text }]}
              clearButtonMode="while-editing"
            />
            {searchQuery ? (
              <Pressable onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
                <ThemedText style={{ color: theme.tint }}>✕</ThemedText>
              </Pressable>
            ) : null}
          </View>
        </View>

        {/* Scrollable Filters Block */}
        <View style={styles.filterSection}>
          {/* Categories Pill Selector */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            <Pressable 
              onPress={() => setSelectedCategory(null)}
              style={[
                styles.categoryPill, 
                { backgroundColor: selectedCategory === null ? theme.tint : theme.backgroundElement }
              ]}
            >
              <ThemedText type="smallBold" style={[
                styles.categoryPillText, 
                { color: selectedCategory === null ? '#100E0D' : theme.text }
              ]}>
                Todos
              </ThemedText>
            </Pressable>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              // Shorten category names for pills (e.g. "21. IPA" -> "IPA")
              const cleanName = cat.replace(/^\d+\.\s+/, '');

              return (
                <Pressable 
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.categoryPill, 
                    { backgroundColor: isSelected ? theme.tint : theme.backgroundElement }
                  ]}
                >
                  <ThemedText type="smallBold" style={[
                    styles.categoryPillText, 
                    { color: isSelected ? '#100E0D' : theme.text }
                  ]}>
                    {cleanName}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Quick Technical Stats Selectors */}
          <View style={styles.quickFiltersContainer}>
            {/* ABV Filter */}
            <View style={styles.filterColumn}>
              <ThemedText type="code" style={styles.filterGroupLabel}>GRADUACIÓN (ABV)</ThemedText>
              <View style={[styles.filterSelector, { backgroundColor: theme.backgroundElement }]}>
                {([
                  { label: 'Todos', value: 'all' },
                  { label: '<4.5%', value: 'low' },
                  { label: '4.5-6.5%', value: 'mid' },
                  { label: '>6.5%', value: 'high' }
                ] as const).map(opt => (
                  <Pressable 
                    key={opt.value}
                    onPress={() => setAbvFilter(opt.value)}
                    style={[
                      styles.filterOption,
                      abvFilter === opt.value && { backgroundColor: theme.backgroundSelected }
                    ]}
                  >
                    <ThemedText style={[
                      styles.filterOptionText,
                      abvFilter === opt.value && { fontWeight: '700', color: theme.tint }
                    ]}>
                      {opt.label}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* IBU Filter */}
            <View style={styles.filterColumn}>
              <ThemedText type="code" style={styles.filterGroupLabel}>AMARGOR (IBU)</ThemedText>
              <View style={[styles.filterSelector, { backgroundColor: theme.backgroundElement }]}>
                {([
                  { label: 'Todos', value: 'all' },
                  { label: 'Bajo', value: 'low' },
                  { label: 'Medio', value: 'mid' },
                  { label: 'Alto', value: 'high' }
                ] as const).map(opt => (
                  <Pressable 
                    key={opt.value}
                    onPress={() => setIbuFilter(opt.value)}
                    style={[
                      styles.filterOption,
                      ibuFilter === opt.value && { backgroundColor: theme.backgroundSelected }
                    ]}
                  >
                    <ThemedText style={[
                      styles.filterOptionText,
                      ibuFilter === opt.value && { fontWeight: '700', color: theme.tint }
                    ]}>
                      {opt.label}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Results Counter and Clean Button */}
        <View style={styles.resultsHeader}>
          <ThemedText type="small" themeColor="textSecondary">
            {filteredStyles.length} estilos encontrados
          </ThemedText>
          {(searchQuery || selectedCategory || abvFilter !== 'all' || ibuFilter !== 'all') ? (
            <Pressable onPress={handleClearFilters}>
              <ThemedText type="smallBold" style={{ color: theme.tint }}>
                Limpiar filtros
              </ThemedText>
            </Pressable>
          ) : null}
        </View>

        {/* Styles list */}
        <FlatList
          data={filteredStyles}
          keyExtractor={(item) => item.id}
          renderItem={renderStyleItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyIcon}>🍺🚫</ThemedText>
              <ThemedText type="default" style={styles.emptyTitle}>Ningún estilo coincide</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.emptyBody}>
                Prueba buscando otros términos o elimina los filtros técnicos seleccionados.
              </ThemedText>
            </View>
          }
        />
      </SafeAreaView>

      {/* DETAIL MODAL (Visual Masterpiece Overlay) */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={detailModalVisible}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        {selectedStyle && (
          <ThemedView style={styles.modalContainer}>
            <SafeAreaView style={styles.modalSafeArea} edges={['top', 'bottom']}>
              
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Pressable 
                  onPress={() => setDetailModalVisible(false)}
                  style={styles.modalCloseBtn}
                >
                  <ThemedText type="default" style={{ color: theme.tint, fontSize: 16 }}>
                    ← Volver
                  </ThemedText>
                </Pressable>
                <ThemedText type="smallBold" style={styles.modalSubHeader}>
                  DETALLES DE ESTILO
                </ThemedText>
                <View style={{ width: 60 }} />
              </View>

              {/* Scrollable Details */}
              <ScrollView 
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={false}
              >
                
                {/* Visual Title Header */}
                <View style={styles.styleTitleBlock}>
                  <View style={styles.styleMainRow}>
                    <View style={[styles.styleBadgeBig, { backgroundColor: theme.tint }]}>
                      <ThemedText style={styles.styleBadgeBigText}>{selectedStyle.id}</ThemedText>
                    </View>
                    <View style={{ flex: 1 }}>
                      <ThemedText type="subtitle" style={styles.styleMainName}>
                        {selectedStyle.name}
                      </ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">
                        Categoría: {selectedStyle.category}
                      </ThemedText>
                    </View>
                  </View>

                  {/* Beer Visual Color Bar */}
                  <View style={styles.srmVisualBarWrapper}>
                    <ThemedText type="code" style={styles.srmBarLabel}>COLOR VISUAL ESTIMADO (SRM)</ThemedText>
                    <View style={styles.srmVisualBarTrack}>
                      {Array.from({ length: 40 }, (_, idx) => {
                        const srmVal = idx + 1;
                        const col = getSRMColor(srmVal);
                        const isInRange = srmVal >= selectedStyle.srmMin && srmVal <= selectedStyle.srmMax;
                        return (
                          <View 
                            key={idx} 
                            style={[
                              styles.srmColorPill, 
                              { backgroundColor: col, opacity: isInRange ? 1 : 0.15 },
                              isInRange && { borderColor: '#FFFFFF', borderWidth: 1 }
                            ]} 
                          />
                        );
                      })}
                    </View>
                    <View style={styles.srmLegendRow}>
                      <ThemedText type="code" style={styles.srmLegendText}>SRM Mín: {selectedStyle.srmMin}</ThemedText>
                      <ThemedText type="code" style={styles.srmLegendText}>SRM Máx: {selectedStyle.srmMax}</ThemedText>
                    </View>
                  </View>
                </View>

                {/* Vital Statistics Table */}
                <ThemedView type="backgroundElement" style={styles.vitalTable}>
                  <ThemedText type="smallBold" style={styles.vitalTableHeader}>Estadísticas Vitales</ThemedText>
                  
                  <View style={styles.vitalRow}>
                    <ThemedText type="small" themeColor="textSecondary">Densidad Inicial (OG)</ThemedText>
                    <ThemedText type="code" style={styles.vitalValue}>{selectedStyle.vitalStatistics.og}</ThemedText>
                  </View>
                  <View style={styles.vitalDivider} />
                  
                  <View style={styles.vitalRow}>
                    <ThemedText type="small" themeColor="textSecondary">Densidad Final (FG)</ThemedText>
                    <ThemedText type="code" style={styles.vitalValue}>{selectedStyle.vitalStatistics.fg}</ThemedText>
                  </View>
                  <View style={styles.vitalDivider} />

                  <View style={styles.vitalRow}>
                    <ThemedText type="small" themeColor="textSecondary">Alcohol en Volumen (ABV)</ThemedText>
                    <ThemedText type="code" style={[styles.vitalValue, { color: theme.tint, fontWeight: '700' }]}>
                      {selectedStyle.vitalStatistics.abv}
                    </ThemedText>
                  </View>
                  <View style={styles.vitalDivider} />

                  <View style={styles.vitalRow}>
                    <ThemedText type="small" themeColor="textSecondary">Amargor (IBU)</ThemedText>
                    <ThemedText type="code" style={[styles.vitalValue, { color: theme.accent, fontWeight: '700' }]}>
                      {selectedStyle.vitalStatistics.ibu}
                    </ThemedText>
                  </View>
                  <View style={styles.vitalDivider} />

                  <View style={styles.vitalRow}>
                    <ThemedText type="small" themeColor="textSecondary">Color de Cerveza (SRM)</ThemedText>
                    <ThemedText type="code" style={styles.vitalValue}>{selectedStyle.vitalStatistics.srm}</ThemedText>
                  </View>
                </ThemedView>

                {/* Descriptive Sections */}
                <View style={styles.detailsGroup}>
                  
                  {/* Overall Impression */}
                  <View style={styles.detailSection}>
                    <ThemedText type="smallBold" style={styles.detailHeading}>1. Impresión General</ThemedText>
                    <ThemedText type="default" style={styles.detailText}>{selectedStyle.overallImpression}</ThemedText>
                  </View>

                  {/* Aroma */}
                  <View style={styles.detailSection}>
                    <ThemedText type="smallBold" style={styles.detailHeading}>2. Aroma</ThemedText>
                    <ThemedText type="default" style={styles.detailText}>{selectedStyle.aroma}</ThemedText>
                  </View>

                  {/* Appearance */}
                  <View style={styles.detailSection}>
                    <ThemedText type="smallBold" style={styles.detailHeading}>3. Apariencia</ThemedText>
                    <ThemedText type="default" style={styles.detailText}>{selectedStyle.appearance}</ThemedText>
                  </View>

                  {/* Flavor */}
                  <View style={styles.detailSection}>
                    <ThemedText type="smallBold" style={styles.detailHeading}>4. Sabor</ThemedText>
                    <ThemedText type="default" style={styles.detailText}>{selectedStyle.flavor}</ThemedText>
                  </View>

                  {/* Mouthfeel */}
                  <View style={styles.detailSection}>
                    <ThemedText type="smallBold" style={styles.detailHeading}>5. Sensación en Boca</ThemedText>
                    <ThemedText type="default" style={styles.detailText}>{selectedStyle.mouthfeel}</ThemedText>
                  </View>

                  {/* History */}
                  <View style={styles.detailSection}>
                    <ThemedText type="smallBold" style={styles.detailHeading}>6. Historia</ThemedText>
                    <ThemedText type="default" style={styles.detailText}>{selectedStyle.history}</ThemedText>
                  </View>

                  {/* Ingredients */}
                  <View style={styles.detailSection}>
                    <ThemedText type="smallBold" style={styles.detailHeading}>7. Ingredientes Característicos</ThemedText>
                    <ThemedText type="default" style={styles.detailText}>{selectedStyle.ingredients}</ThemedText>
                  </View>

                  {/* Commercial Examples */}
                  <View style={styles.detailSection}>
                    <ThemedText type="smallBold" style={styles.detailHeading}>8. Ejemplos Comerciales</ThemedText>
                    <View style={styles.examplesList}>
                      {selectedStyle.commercialExamples.map((ex, i) => (
                        <ThemedView key={i} type="backgroundElement" style={styles.exampleItem}>
                          <ThemedText type="default" style={styles.exampleText}>🍺 {ex}</ThemedText>
                        </ThemedView>
                      ))}
                    </View>
                  </View>

                  {/* Tags */}
                  <View style={styles.detailSection}>
                    <ThemedText type="smallBold" style={styles.detailHeading}>Etiquetas</ThemedText>
                    <View style={styles.tagsContainer}>
                      {selectedStyle.tags.map((tag, i) => (
                        <View key={i} style={[styles.tagBadge, { backgroundColor: theme.backgroundSelected }]}>
                          <ThemedText type="code" style={{ fontSize: 11 }}>#{tag}</ThemedText>
                        </View>
                      ))}
                    </View>
                  </View>

                </View>

              </ScrollView>
            </SafeAreaView>
          </ThemedView>
        )}
      </Modal>

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
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
    gap: Spacing.two,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  backButton: {
    paddingVertical: Spacing.one,
    paddingRight: Spacing.three,
  },
  backText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Fonts.manropeBold,
  },
  pressed: {
    opacity: 0.7,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: Spacing.two,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
    fontWeight: '500',
  },
  clearSearchBtn: {
    padding: Spacing.one,
  },
  filterSection: {
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  categoriesScroll: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  categoryPill: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.five,
  },
  categoryPillText: {
    fontSize: 13,
  },
  quickFiltersContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  filterColumn: {
    flex: 1,
    gap: Spacing.half,
  },
  filterGroupLabel: {
    fontSize: 9,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  filterSelector: {
    flexDirection: 'row',
    borderRadius: Spacing.two,
    padding: Spacing.half,
  },
  filterOption: {
    flex: 1,
    paddingVertical: Spacing.half,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.one,
  },
  filterOptionText: {
    fontSize: 10,
    fontWeight: '500',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.one,
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.six,
    gap: Spacing.three,
  },
  styleCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  srmIndicator: {
    width: 6,
    height: 36,
    borderRadius: Spacing.half,
    marginRight: Spacing.three,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  styleId: {
    fontSize: 15,
    fontWeight: '800',
  },
  styleName: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  styleCategory: {
    fontSize: 11,
    marginTop: 2,
  },
  cardSummary: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.two,
  },
  vitalStatsRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128,128,128,0.08)',
    paddingTop: Spacing.two,
  },
  vitalStatLabel: {
    fontSize: 10,
    color: 'rgba(128,128,128,0.7)',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.six,
    gap: Spacing.two,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontWeight: '700',
  },
  emptyBody: {
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: Spacing.five,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalSafeArea: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128,128,128,0.1)',
  },
  modalCloseBtn: {
    paddingVertical: Spacing.one,
  },
  modalSubHeader: {
    fontSize: 11,
    letterSpacing: 1.5,
  },
  modalScrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
  },
  styleTitleBlock: {
    gap: Spacing.three,
  },
  styleMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  styleBadgeBig: {
    width: 52,
    height: 52,
    borderRadius: Spacing.two,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleBadgeBigText: {
    color: '#100E0D',
    fontSize: 18,
    fontWeight: '900',
  },
  styleMainName: {
    fontSize: 22,
    fontWeight: '800',
  },
  srmVisualBarWrapper: {
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
  srmBarLabel: {
    fontSize: 9,
    letterSpacing: 0.5,
    color: 'rgba(128,128,128,0.7)',
  },
  srmVisualBarTrack: {
    flexDirection: 'row',
    height: 18,
    borderRadius: Spacing.one,
    overflow: 'hidden',
  },
  srmColorPill: {
    flex: 1,
    height: '100%',
  },
  srmLegendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  srmLegendText: {
    fontSize: 10,
  },
  vitalTable: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  vitalTableHeader: {
    fontWeight: '700',
    marginBottom: Spacing.one,
  },
  vitalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vitalValue: {
    fontSize: 13,
  },
  vitalDivider: {
    height: 1,
    backgroundColor: 'rgba(128,128,128,0.08)',
  },
  detailsGroup: {
    gap: Spacing.four,
  },
  detailSection: {
    gap: Spacing.one,
  },
  detailHeading: {
    fontSize: 13,
    letterSpacing: 0.5,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  detailText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
  examplesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.half,
  },
  exampleItem: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
  },
  exampleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
    marginTop: Spacing.half,
  },
  tagBadge: {
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.one,
  },
});
