import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  SectionList, 
  Pressable, 
  View, 
  Modal, 
  ScrollView, 
  useColorScheme,
  Text,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { getSRMColor, getSRMContrastColor } from '@/utils/srm';

import Svg, { Path } from 'react-native-svg';
import { DetailIcon } from '@/components/detail-icons';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/context/language-context';
import { 
  BeerStyle, 
  getBJCPStyles 
} from '@/data/bjcp2021';
import { fuzzyMatch } from '@/utils/fuzzy';
import { GLOSSARY_DATA, GlossaryTerm, TAG_DEFINITIONS_DATA, TagDefinition } from '@/data/glossary';
import { OFF_FLAVORS_DATA, OffFlavor } from '@/data/offflavors';



// Volume Options Definitions
function getAbvLevels(language: 'es' | 'en') {
  return [
    { value: 'all', label: language === 'es' ? 'Todos' : 'All', desc: language === 'es' ? 'Cualquier alcohol' : 'Any ABV' },
    { value: 'low', label: language === 'es' ? 'Suave' : 'Low', desc: '<4.5% ABV' },
    { value: 'mid', label: language === 'es' ? 'Medio' : 'Medium', desc: '4.5% - 6.5%' },
    { value: 'high', label: language === 'es' ? 'Fuerte' : 'High', desc: '>6.5% ABV' },
  ] as const;
}

function getIbuLevels(language: 'es' | 'en') {
  return [
    { value: 'all', label: language === 'es' ? 'Todos' : 'All', desc: language === 'es' ? 'Cualquier amargor' : 'Any IBU' },
    { value: 'low', label: language === 'es' ? 'Bajo' : 'Low', desc: '<20 IBU' },
    { value: 'mid', label: language === 'es' ? 'Medio' : 'Medium', desc: '20 - 45 IBU' },
    { value: 'high', label: language === 'es' ? 'Alto' : 'High', desc: '>45 IBU' },
  ] as const;
}

export default function ExploreScreen() {
  const params = useLocalSearchParams<{ search?: string }>();
  const theme = useTheme();
  const { t, language } = useTranslation();
  const abvLevels = getAbvLevels(language);
  const ibuLevels = getIbuLevels(language);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Volume Filters: 'all' | 'low' | 'mid' | 'high'
  const [abvFilter, setAbvFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [ibuFilter, setIbuFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all');

  // Detail Modal State




  // Sync Search parameter from HomeScreen (Style of the Day)
  useEffect(() => {
    if (params.search) {
      setSearchQuery(params.search);
      setIsSearching(true);
      setAbvFilter('all');
      setIbuFilter('all');
    }
  }, [params.search]);

  // Handlers
  const handleClearFilters = () => {
    setSearchQuery('');
    setIsSearching(false);
    setAbvFilter('all');
    setIbuFilter('all');
  };



  // Extract sorting value for Category group ordering (e.g. "1A" -> 1.01, "21B" -> 21.02, "X1" -> 99.01)
  const getCategorySortValue = (styleId: string) => {
    const match = styleId.match(/^(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      const letter = styleId.match(/^(\d+)([A-Z]?)/)?.[2] || '';
      const letterVal = letter ? letter.charCodeAt(0) - 64 : 0;
      return num + letterVal / 100;
    }
    if (styleId.startsWith('X')) {
      const subNum = parseInt(styleId.substring(1), 10) || 0;
      return 100 + subNum / 100;
    }
    return 999;
  };

  // Filter & Sort Logic
  const processedStyles = getBJCPStyles(language)
    .filter(style => {
      // 1. Text Search using hybrid multi-field fuzzy search
      if (searchQuery) {
        const matchText = fuzzyMatch(searchQuery, [
          style.id,
          style.name,
          style.category,
          style.overallImpression,
          ...style.tags
        ]);
        if (!matchText) return false;
      }

      // 2. ABV Volume Filter
      if (abvFilter === 'low' && style.abvMax > 4.5) return false;
      if (abvFilter === 'mid' && (style.abvMin > 6.5 || style.abvMax < 4.5)) return false;
      if (abvFilter === 'high' && style.abvMin < 6.5) return false;

      // 3. IBU Volume Filter
      if (ibuFilter === 'low' && style.ibuMax > 20) return false;
      if (ibuFilter === 'mid' && (style.ibuMin > 45 || style.ibuMax < 20)) return false;
      if (ibuFilter === 'high' && style.ibuMin < 45) return false;

      return true;
    })
    .sort((a, b) => {
      return getCategorySortValue(a.id) - getCategorySortValue(b.id);
    });

  // Group styles into Section structure dynamically
  const sections: { title: string; data: BeerStyle[] }[] = [];
  processedStyles.forEach(style => {
    const lastSection = sections[sections.length - 1];
    if (lastSection && lastSection.title === style.category) {
      lastSection.data.push(style);
    } else {
      sections.push({
        title: style.category,
        data: [style]
      });
    }
  });

  // Render Equalizer Volume Filters in Hi-Fi Audio Visualizer Style
  const renderAbvVolumeControl = () => {
    const activeIndex = abvLevels.findIndex(opt => opt.value === abvFilter);
    return (
      <View style={styles.volumeColumn}>
        <Text style={styles.filterGroupLabel}>{t('abvFilter')}</Text>
        <View style={styles.volumeEqualizerTrack}>
          {abvLevels.map((opt, idx) => {
            const isLit = idx <= activeIndex;
            const barHeight = 10 + idx * 7;
            return (
              <Pressable 
                key={opt.value}
                onPress={() => setAbvFilter(opt.value)}
                style={styles.volumeBarTouch}
              >
                <View 
                  style={[
                    styles.volumeEqualizerBar, 
                    { 
                      height: barHeight, 
                      backgroundColor: isLit ? '#D99B26' : 'rgba(255, 255, 255, 0.2)' 
                    }
                  ]} 
                />
                <Text style={[
                  styles.volumeLevelShortLabel,
                  { color: abvFilter === opt.value ? '#D99B26' : 'rgba(255,255,255,0.4)' }
                ]}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.volumeDescText}>{abvLevels[activeIndex].desc}</Text>
      </View>
    );
  };

  const renderIbuVolumeControl = () => {
    const activeIndex = ibuLevels.findIndex(opt => opt.value === ibuFilter);
    return (
      <View style={styles.volumeColumn}>
        <Text style={styles.filterGroupLabel}>{t('ibuFilter')}</Text>
        <View style={styles.volumeEqualizerTrack}>
          {ibuLevels.map((opt, idx) => {
            const isLit = idx <= activeIndex;
            const barHeight = 10 + idx * 7;
            return (
              <Pressable 
                key={opt.value}
                onPress={() => setIbuFilter(opt.value)}
                style={styles.volumeBarTouch}
              >
                <View 
                  style={[
                    styles.volumeEqualizerBar, 
                    { 
                      height: barHeight, 
                      backgroundColor: isLit ? '#D99B26' : 'rgba(255, 255, 255, 0.2)' 
                    }
                  ]} 
                />
                <Text style={[
                  styles.volumeLevelShortLabel,
                  { color: ibuFilter === opt.value ? '#D99B26' : 'rgba(255,255,255,0.4)' }
                ]}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.volumeDescText}>{ibuLevels[activeIndex].desc}</Text>
      </View>
    );
  };

  const renderStyleItem = ({ item }: { item: BeerStyle }) => {
    const avgSrm = (item.srmMin + item.srmMax) / 2;
    const cardSrmColor = getSRMColor(avgSrm);
    const contrastColor = getSRMContrastColor(avgSrm);

    return (
      <Pressable 
        onPress={() => {
          router.push(('/style/' + item.id) as any);
        }}
        style={({ pressed }) => [
          styles.styleCard, 
          pressed && styles.cardPressed
        ]}
      >
        <View style={styles.cardHeader}>
          {/* German Beer Stein/Mug Icon containing Style ID and SRM Color */}
          <View style={styles.beerGlassContainer}>
            {/* Curved Glass Handle on the left side of the Mug */}
            <View style={styles.beerGlassHandle} />

            {/* Puffy Foam Head Base */}
            <View style={styles.beerGlassFoam}>
              {/* Extra foam bubble on top of the collar for fluffiness */}
              <View style={styles.beerGlassFoamBubble} />
            </View>
            
            {/* Beer Mug Body filled with SRM Color, highlight and carbonation bubbles */}
            <View style={[styles.beerGlassLiquid, { backgroundColor: cardSrmColor }]}>
              {/* Cold glass reflection highlight line */}
              <View style={styles.beerGlassHighlight} />

              {/* Rising Carbonation micro-bubbles */}
              <View style={styles.beerGlassBubble1} />
              <View style={styles.beerGlassBubble2} />

              {/* Centered Style ID */}
              <Text style={[styles.beerGlassText, { color: contrastColor }]}>
                {item.id}
              </Text>
            </View>
          </View>
          
          <View style={styles.cardInfo}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.styleName} numberOfLines={1}>
                {item.name}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.cardSummary} numberOfLines={2}>
          {item.overallImpression}
        </Text>

        {/* Vital stats minimal row */}
        <View style={styles.vitalStatsRow}>
          <Text style={styles.vitalStatLabel}>
            ABV: <Text style={styles.vitalStatValue}>{item.vitalStatistics.abv}</Text>
          </Text>
          <Text style={styles.vitalStatLabel}>
            IBU: <Text style={styles.vitalStatValue}>{item.vitalStatistics.ibu}</Text>
          </Text>
          <Text style={styles.vitalStatLabel}>
            SRM: <Text style={styles.vitalStatValue}>{item.vitalStatistics.srm}</Text>
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        
        {/* Minimalist Header with Toggleable Search */}
        <View style={styles.header}>
          {!isSearching ? (
            <View style={styles.headerTop}>
              <Pressable 
                onPress={() => router.back()}
                style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
              >
                <Text style={styles.backText}>←</Text>
              </Pressable>
              
              <Text style={styles.headerTitle}>
                {t('exploreStyles')}
              </Text>
              
              <Pressable 
                onPress={() => setIsSearching(true)}
                style={({ pressed }) => [styles.searchToggleButton, pressed && styles.pressed]}
              >
                <Text style={styles.searchToggleIcon}>🔍</Text>
              </Pressable>
            </View>
          ) : (
            <View style={[styles.headerSearchActive, { 
              backgroundColor: theme.backgroundElement,
              borderColor: theme.border
            }]}>
              <Pressable 
                onPress={() => {
                  setIsSearching(false);
                  setSearchQuery('');
                }}
                style={({ pressed }) => [styles.searchCloseBtn, pressed && styles.pressed]}
              >
                <Text style={[styles.searchBackArrow, { color: theme.text }]}>←</Text>
              </Pressable>
              
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={t('searchPlaceholder')}
                placeholderTextColor={theme.textSecondary}
                style={[styles.searchInputActive, { color: theme.text }]}
                clearButtonMode="while-editing"
                autoFocus
              />
              
              {searchQuery ? (
                <Pressable 
                  onPress={() => setSearchQuery('')} 
                  style={({ pressed }) => [styles.searchInlineClearBtn, pressed && styles.pressed]}
                >
                  <Text style={[styles.searchInlineClearText, { color: theme.tint }]}>✕</Text>
                </Pressable>
              ) : null}
            </View>
          )}
        </View>

        {/* Minimalist Volume Equalizer Controls Side-by-Side */}
        <View style={styles.volumeFiltersPanel}>
          <View style={styles.volumeEqualizersRow}>
            {renderAbvVolumeControl()}
            <View style={styles.volumeDividerColumn} />
            {renderIbuVolumeControl()}
          </View>
        </View>

        {/* Results Counter and Clean Filters */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCounterText}>
            {processedStyles.length} {t('foundStyles')}
          </Text>
          {(searchQuery || abvFilter !== 'all' || ibuFilter !== 'all') ? (
            <Pressable onPress={handleClearFilters}>
              <Text style={styles.clearFiltersText}>
                {t('clearFilters')}
              </Text>
            </Pressable>
          ) : null}
        </View>

        {/* Categories Grouped Beer Styles SectionList */}
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderStyleItem}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionHeaderTitle}>{title}</Text>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={true}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🍺🚫</Text>
              <Text style={styles.emptyTitle}>{t('noResults')}</Text>
              <Text style={styles.emptyBody}>
                {t('noResultsDesc')}
              </Text>
            </View>
          }
        />
      </SafeAreaView>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#2F5D73', // Premium brand Petroleum Blue background
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
  },
  backButton: {
    paddingVertical: Spacing.one,
    paddingRight: Spacing.four,
  },
  backText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
    fontFamily: Fonts.spaceGroteskBold,
  },
  pressed: {
    opacity: 0.7,
  },
  headerTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '900',
    fontFamily: Fonts.spaceGroteskBold,
    flex: 1,
    textAlign: 'center',
  },
  searchToggleButton: {
    paddingVertical: Spacing.one,
    paddingLeft: Spacing.four,
  },
  searchToggleIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  headerSearchActive: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    height: 48,
    borderWidth: 1.5,
  },
  searchCloseBtn: {
    paddingRight: Spacing.three,
  },
  searchBackArrow: {
    fontSize: 22,
    fontWeight: '800',
    fontFamily: Fonts.spaceGroteskBold,
  },
  searchInputActive: {
    flex: 1,
    fontSize: 15,
    padding: 0,
    fontWeight: '600',
    fontFamily: Fonts.spaceGrotesk,
    ...({ outlineStyle: 'none' } as any),
  },
  searchInlineClearBtn: {
    paddingLeft: Spacing.three,
  },
  searchInlineClearText: {
    fontWeight: '800',
    fontSize: 16,
  },
  volumeFiltersPanel: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    marginBottom: Spacing.one,
  },
  volumeEqualizersRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: Spacing.three,
    padding: Spacing.three,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  volumeColumn: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.one,
  },
  volumeDividerColumn: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: Spacing.two,
  },
  filterGroupLabel: {
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.75)', // Elegant high tracking subtitles
    textTransform: 'uppercase',
    fontFamily: Fonts.spaceGroteskBold,
    textAlign: 'center',
  },
  volumeEqualizerTrack: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: Spacing.two,
    height: 36,
    marginVertical: 4,
  },
  volumeBarTouch: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 24,
    height: 48,
  },
  volumeEqualizerBar: {
    width: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  volumeLevelShortLabel: {
    fontSize: 8,
    fontWeight: '700',
    textAlign: 'center',
  },
  volumeDescText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '700',
    fontFamily: Fonts.manropeBold,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.one,
    marginBottom: 2,
  },
  resultsCounterText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '600',
  },
  clearFiltersText: {
    color: '#D99B26',
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.six,
  },
  sectionHeaderContainer: {
    backgroundColor: '#2F5D73', // Sticky category header matches screen petroleum blue
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
  },
  sectionHeaderTitle: {
    fontSize: 13,
    color: '#D99B26', // Vibrant brand amber category headings
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontFamily: Fonts.spaceGroteskBold,
  },
  styleCard: {
    backgroundColor: '#FFFFFF', // Solid premium white cards
    borderRadius: Spacing.three,
    padding: Spacing.three,
    marginVertical: Spacing.one, // Beautiful spacing between list items
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  beerGlassContainer: {
    width: 46,
    height: 48,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: Spacing.three,
    position: 'relative',
  },
  beerGlassHandle: {
    position: 'absolute',
    left: 2,
    top: 18,
    width: 9,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#CFCFCF', // Dynamic glass handle instantly makes it a beer mug!
    zIndex: 1,
  },
  beerGlassFoam: {
    width: 30, // Fits perfectly on top of the 26px mug base
    height: 12,
    backgroundColor: '#FFFDF4', // Creamy foam head base
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
    borderWidth: 1.5,
    borderColor: '#DFDFDF',
    zIndex: 3,
    position: 'relative',
    bottom: -1.5, // Overlaps glass rim
  },
  beerGlassFoamBubble: {
    position: 'absolute',
    top: -5,
    left: 14,
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: '#FFFDF4', // Fluffy bubble top for triple-rounded cloud effect
    borderWidth: 1.5,
    borderColor: '#DFDFDF',
    borderBottomWidth: 0,
    zIndex: 4,
  },
  beerGlassLiquid: {
    width: 26, // Sleek, taller aspect ratio (26x34) to avoid "jar" look
    height: 34,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    borderTopLeftRadius: 1.5,
    borderTopRightRadius: 1.5,
    borderWidth: 1.5,
    borderColor: '#CFCFCF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  beerGlassHighlight: {
    position: 'absolute',
    left: 2.5,
    top: 2.5,
    width: 2.5,
    height: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.45)', // Glistening glass reflection glare
    borderRadius: 1,
    zIndex: 4,
  },
  beerGlassBubble1: {
    position: 'absolute',
    bottom: 3,
    right: 4,
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.45)', // Rising carbonation micro-bubble
    zIndex: 4,
  },
  beerGlassBubble2: {
    position: 'absolute',
    bottom: 9,
    right: 8,
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: 'rgba(255, 255, 255, 0.55)', // Rising carbonation micro-bubble
    zIndex: 4,
  },
  beerGlassText: {
    fontSize: 8.5, // Compact, ultra-clean typography inside the mug
    fontWeight: '900',
    fontFamily: Fonts.spaceGroteskBold,
    textAlign: 'center',
    zIndex: 5,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  styleName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0A0C10',
    flex: 1,
  },
  cardSummary: {
    fontSize: 13,
    lineHeight: 18,
    color: '#0A0C10',
    marginVertical: Spacing.two,
  },
  vitalStatsRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: Spacing.two,
    marginTop: 2,
  },
  vitalStatLabel: {
    fontSize: 11,
    color: 'rgba(10, 12, 16, 0.5)',
    fontWeight: '600',
  },
  vitalStatValue: {
    color: '#0A0C10',
    fontWeight: '700',
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
    color: '#FFFFFF',
  },
  emptyBody: {
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: Spacing.five,
    color: 'rgba(255, 255, 255, 0.7)',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#2F5D73', // Cohesive Petroleum Blue modal background
  },
  modalSafeArea: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  modalCloseBtn: {
    paddingVertical: Spacing.one,
  },
  modalBackText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Fonts.spaceGrotesk,
  },
  modalSubHeader: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 2.5,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  modalScrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
  },
  styleTitleBlock: {
    gap: Spacing.three,
    marginBottom: Spacing.two,
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
    backgroundColor: '#D99B26', // Solid brand amber badge
  },
  styleBadgeBigText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  styleMainName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  styleMainCategory: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  srmVisualBarWrapper: {
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
  srmBarLabel: {
    fontSize: 10,
    letterSpacing: 2,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  srmVisualBarTrack: {
    flexDirection: 'row',
    height: 28, // Sized up for spectacular visual clarity!
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
    marginTop: 4,
  },
  srmLegendText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  vitalCard: {
    backgroundColor: '#FFFFFF', // Premium white card
    borderRadius: Spacing.three,
    padding: Spacing.four,
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  vitalTableHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2F5D73',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.one,
  },
  vitalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  vitalFieldLabel: {
    fontSize: 13,
    color: 'rgba(10, 12, 16, 0.6)',
    fontWeight: '600',
  },
  vitalFieldValue: {
    fontSize: 14,
    color: '#0A0C10',
    fontWeight: '700',
  },
  vitalDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  detailsGroup: {
    gap: Spacing.three,
  },
  detailCard: {
    backgroundColor: '#FFFFFF', // Premium white card
    borderRadius: Spacing.three,
    padding: Spacing.four,
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  detailHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: Spacing.two,
  },
  detailHeaderIcon: {
    marginRight: 2,
  },
  detailHeading: {
    fontSize: 13,
    letterSpacing: 1.2,
    fontWeight: '900',
    color: '#2F5D73', // Vibrant brand petroleum blue
    textTransform: 'uppercase',
    fontFamily: Fonts.spaceGroteskBold,
  },
  detailText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
    color: '#0A0C10',
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
    backgroundColor: '#F5F6F8', // Soft neutral grey pill
  },
  exampleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0A0C10',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
    marginTop: Spacing.half,
  },
  tagBadge: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.one,
    backgroundColor: 'rgba(47, 93, 115, 0.1)', // Subtle petroleum blue badge tint
  },
  tagBadgeText: {
    fontSize: 12,
    color: '#2F5D73',
    fontWeight: '700',
  },
  choiceModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  choiceModalContainer: {
    width: '90%',
    maxWidth: 340,
    borderRadius: 16,
    padding: Spacing.five,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  choiceModalTitle: {
    fontFamily: Fonts.spaceGroteskBold,
    fontWeight: '900',
    fontSize: 18,
    marginBottom: Spacing.two,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  choiceModalSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: Spacing.four,
    fontWeight: '600',
  },
  choiceButtonGroup: {
    width: '100%',
  },
  choiceButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  choiceCancelButton: {
    width: '100%',
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceCancelButtonText: {
    fontWeight: '700',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  glossaryModalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: Spacing.three,
    borderWidth: 2,
    padding: Spacing.five,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  glossaryModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  glossaryBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glossaryModalTitle: {
    fontSize: 20,
    fontWeight: '900',
    fontFamily: Fonts.spaceGroteskBold,
    flex: 1,
  },
  glossaryModalBody: {
    maxHeight: 200,
    marginBottom: Spacing.five,
  },
  glossaryModalText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  },
  glossaryModalButton: {
    borderRadius: Spacing.two,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glossaryModalButtonText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '800',
    fontFamily: Fonts.spaceGroteskBold,
  },
  offFlavorCard: {
    width: '92%',
    maxWidth: 420,
    borderRadius: Spacing.three,
    borderWidth: 2,
    padding: Spacing.four,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  offFlavorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  offFlavorBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offFlavorTitleContainer: {
    flex: 1,
  },
  offFlavorTitle: {
    fontSize: 20,
    fontWeight: '900',
    fontFamily: Fonts.spaceGroteskBold,
  },
  offFlavorSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  offFlavorBody: {
    maxHeight: 350,
    marginBottom: Spacing.four,
  },
  offFlavorSection: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    marginBottom: Spacing.three,
    borderWidth: 1,
  },
  offFlavorSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  offFlavorSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: Fonts.spaceGroteskBold,
  },
  offFlavorSectionText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
