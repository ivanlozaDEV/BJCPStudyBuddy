import React, { useState } from 'react';
import { 
  StyleSheet, 
  Pressable, 
  View, 
  ScrollView, 
  Text
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';

import { DetailIcon } from '@/components/detail-icons';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing, Fonts, BottomTabInset } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/context/language-context';
import { 
  BeerStyle, 
  getBJCPStyles 
} from '@/data/bjcp2021';
import { GLOSSARY_DATA, GlossaryTerm, TAG_DEFINITIONS_DATA, TagDefinition } from '@/data/glossary';
import { OFF_FLAVORS_DATA, OffFlavor } from '@/data/offflavors';
import { getSRMColor, getSRMContrastColor } from '@/utils/srm';

export default function StyleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { t, language } = useTranslation();

  const selectedStyle = getBJCPStyles(language).find(s => s.id === id);

  // Modal States
  const [linkChoiceModalVisible, setLinkChoiceModalVisible] = useState(false);
  const [linkTargetStyle, setLinkTargetStyle] = useState<BeerStyle | null>(null);
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState<GlossaryTerm | null>(null);
  const [glossaryModalVisible, setGlossaryModalVisible] = useState(false);
  const [selectedOffFlavor, setSelectedOffFlavor] = useState<OffFlavor | null>(null);
  const [offFlavorModalVisible, setOffFlavorModalVisible] = useState(false);



  const handleStyleLinkPress = (targetStyle: BeerStyle, currentStyle: BeerStyle) => {
    setLinkTargetStyle(targetStyle);
    setLinkChoiceModalVisible(true);
  };

  const renderTextWithStyleLinks = (text: string, currentStyle: BeerStyle) => {
    if (!text) return null;

    const allStyles = getBJCPStyles(language);

    // 1. Filter other styles and register terms (both names and code IDs)
    const otherStyles = allStyles.filter(s => s.id !== currentStyle.id);
    const terms: { text: string; style: BeerStyle }[] = [];
    otherStyles.forEach(s => {
      terms.push({ text: s.name, style: s });
      terms.push({ text: s.id, style: s });
    });

    // Sort terms by length descending to prevent partial matching (e.g. "Fruit Beer" instead of "Specialty Fruit Beer")
    terms.sort((a, b) => b.text.length - a.text.length);

    // 2. Escape special regex characters
    const escapeRegExp = (str: string) => {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const escapedTerms = terms.map(t => escapeRegExp(t.text));

    // 3. Build alternation regex with word boundaries
    const regexString = `\\b(${escapedTerms.join('|')})\\b`;
    const styleNameRegex = new RegExp(regexString, 'gi');

    const parts = text.split(styleNameRegex);

    if (parts.length <= 1) {
      return <Text style={styles.detailText}>{text}</Text>;
    }

    return (
      <Text style={styles.detailText}>
        {parts.map((part, index) => {
          // Odd indices are matched terms (names or codes)
          if (index % 2 !== 0) {
            const termObj = terms.find(t => t.text.toLowerCase() === part.toLowerCase());

            if (termObj) {
              const targetStyle = termObj.style;
              return (
                <Text
                  key={index}
                  onPress={() => handleStyleLinkPress(targetStyle, currentStyle)}
                  style={{
                    color: '#D99B26', // Premium warm brand amber
                    fontWeight: '700',
                    textDecorationLine: 'underline',
                    ...({ outlineStyle: 'none' } as any), // Remove web focus outline ring
                  }}
                >
                  {part}
                </Text>
              );
            }
          }

          // Even indices are regular text parts
          return part;
        })}
      </Text>
    );
  };

  const handleGlossaryLinkPress = (term: GlossaryTerm) => {
    setSelectedGlossaryTerm(term);
    setGlossaryModalVisible(true);
  };

  const handleTagLinkPress = (tagDef: TagDefinition) => {
    setSelectedGlossaryTerm({
      id: tagDef.tag,
      name_es: tagDef.name_es,
      name_en: tagDef.name_en,
      definition_es: tagDef.description_es,
      definition_en: tagDef.description_en,
      patterns_es: [],
      patterns_en: []
    });
    setGlossaryModalVisible(true);
  };

  const handleOffFlavorLinkPress = (offFlavor: OffFlavor) => {
    setSelectedOffFlavor(offFlavor);
    setOffFlavorModalVisible(true);
  };

  const getAssociatedOffFlavor = (termId: string): OffFlavor | undefined => {
    if (termId === 'esters') {
      return OFF_FLAVORS_DATA.find(off => off.id === 'estery');
    }
    return OFF_FLAVORS_DATA.find(off => off.id === termId);
  };

  const renderTextWithGlossaryLinks = (text: string) => {
    if (!text) return null;

    // 1. Build term matching map from GLOSSARY_DATA
    const langPatterns = GLOSSARY_DATA.map(term => {
      const patterns = language === 'es' ? (term.patterns_es || []) : (term.patterns_en || []);
      return { term, patterns };
    });

    // 2. Also map TAG_DEFINITIONS_DATA into this patterns list to highlight style tags!
    TAG_DEFINITIONS_DATA.forEach(tagDef => {
      const patterns: string[] = [];
      
      if (language === 'es') {
        const tagEs = tagDef.tag_es;
        if (tagEs) {
          patterns.push(tagEs);
          patterns.push(tagEs.replace(/-/g, ' '));
          if (tagEs.includes('á')) {
            patterns.push(tagEs.replace(/á/g, 'a'));
            patterns.push(tagEs.replace(/á/g, 'a').replace(/-/g, ' '));
          }
          if (tagEs.includes('í')) {
            patterns.push(tagEs.replace(/í/g, 'i'));
            patterns.push(tagEs.replace(/í/g, 'i').replace(/-/g, ' '));
          }
          if (tagEs.includes('ó')) {
            patterns.push(tagEs.replace(/ó/g, 'o'));
            patterns.push(tagEs.replace(/ó/g, 'o').replace(/-/g, ' '));
          }
          if (tagEs.includes('ú')) {
            patterns.push(tagEs.replace(/ú/g, 'u'));
            patterns.push(tagEs.replace(/ú/g, 'u').replace(/-/g, ' '));
          }
        }
        const cleanName = tagDef.name_es.split('(')[0].trim().toLowerCase();
        patterns.push(cleanName);
        if (cleanName.includes('á')) patterns.push(cleanName.replace(/á/g, 'a'));
        if (cleanName.includes('í')) patterns.push(cleanName.replace(/í/g, 'i'));
        if (cleanName.includes('ó')) patterns.push(cleanName.replace(/ó/g, 'o'));
        if (cleanName.includes('ú')) patterns.push(cleanName.replace(/ú/g, 'u'));
      } else {
        patterns.push(tagDef.tag);
        patterns.push(tagDef.tag.replace(/-/g, ' '));
        const cleanName = tagDef.name_en.split('(')[0].trim().toLowerCase();
        patterns.push(cleanName);
      }

      const uniquePatterns = Array.from(new Set(patterns)).filter(p => p.length > 2);

      const projectedTerm: GlossaryTerm = {
        id: tagDef.tag,
        name_es: tagDef.name_es,
        name_en: tagDef.name_en,
        definition_es: tagDef.description_es,
        definition_en: tagDef.description_en,
        patterns_es: [],
        patterns_en: []
      };

      langPatterns.push({ term: projectedTerm, patterns: uniquePatterns });
    });

    // Flatten patterns into a single sorted list
    interface FlatPattern {
      patternStr: string;
      term: GlossaryTerm;
      type: 'glossary' | 'offflavor';
      offFlavor?: OffFlavor;
    }

    const flatPatterns: FlatPattern[] = [];
    langPatterns.forEach(({ term, patterns }) => {
      patterns.forEach(p => {
        flatPatterns.push({ patternStr: p, term, type: 'glossary' });
      });
    });

    // 3. Add pure off-flavors (not matched by glossary/tag definitions to avoid duplicates)
    OFF_FLAVORS_DATA.forEach(off => {
      const hasGlossaryMatch = GLOSSARY_DATA.some(g => g.id === off.id) || TAG_DEFINITIONS_DATA.some(t => t.tag === off.id);
      if (hasGlossaryMatch) {
        return; // Skip adding patterns, since it will be matched by the glossary/tag patterns
      }

      const patterns = language === 'es' ? (off.patterns_es || []) : (off.patterns_en || []);
      patterns.forEach(p => {
        flatPatterns.push({
          patternStr: p,
          term: {
            id: off.id,
            name_es: off.name_es,
            name_en: off.name_en,
            definition_es: off.sensation_es,
            definition_en: off.sensation_en,
            patterns_es: [],
            patterns_en: []
          },
          type: 'offflavor',
          offFlavor: off
        });
      });
    });

    // Sort by pattern string length descending to prevent partial matching
    flatPatterns.sort((a, b) => b.patternStr.length - a.patternStr.length);

    if (flatPatterns.length === 0) {
      return <Text style={styles.detailText}>{text}</Text>;
    }

    const getEscapedPattern = (pattern: string): string => {
      const placeholder = '___WORDBOUNDARY___';
      const withPlaceholder = pattern.replace(/\\b/g, placeholder);
      const escaped = withPlaceholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return escaped.replace(new RegExp(placeholder, 'g'), '\\b');
    };

    // Build the dynamic regex alternation with word boundaries using non-capturing groups
    const regexParts = flatPatterns.map(p => {
      const finalPattern = getEscapedPattern(p.patternStr);
      if (finalPattern.includes('\\b')) {
        return `(?:${finalPattern})`;
      }
      return `\\b(?:${finalPattern})\\b`;
    });

    const combinedRegex = new RegExp(`(${regexParts.join('|')})`, 'gi');

    const parts = text.split(combinedRegex);

    if (parts.length <= 1) {
      return <Text style={styles.detailText}>{text}</Text>;
    }

    return (
      <Text style={styles.detailText}>
        {parts.map((part, index) => {
          // Odd indices are matched patterns
          if (index % 2 !== 0 && part) {
            // Find which term matched this part
            const matchedPattern = flatPatterns.find(p => {
              const finalPattern = getEscapedPattern(p.patternStr);
              const pRegex = new RegExp(finalPattern.includes('\\b') ? finalPattern : `^${finalPattern}$`, 'i');
              return pRegex.test(part);
            });

            if (matchedPattern) {
              if (matchedPattern.type === 'offflavor' && matchedPattern.offFlavor) {
                const off = matchedPattern.offFlavor;
                return (
                  <Text
                    key={index}
                    onPress={() => handleOffFlavorLinkPress(off)}
                    style={{
                      color: '#0A0C10', // Leave the letter black
                      textDecorationLine: 'underline',
                      textDecorationColor: '#0A0C10', // Normal black underline
                      ...({ outlineStyle: 'none' } as any), // Remove web focus outline ring
                    }}
                  >
                    {part}
                  </Text>
                );
              } else {
                const term = matchedPattern.term;
                return (
                  <Text
                    key={index}
                    onPress={() => handleGlossaryLinkPress(term)}
                    style={{
                      color: '#0A0C10', // Leave the letter black
                      textDecorationLine: 'underline',
                      textDecorationColor: '#0A0C10', // Normal black underline
                      ...({ outlineStyle: 'none' } as any), // Remove web focus outline ring
                    }}
                  >
                    {part}
                  </Text>
                );
              }
            } else {
              return part;
            }
          }

          // Even indices are regular text parts
          return part;
        })}
      </Text>
    );
  };

  if (!selectedStyle) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.text }}>Style not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={[styles.modalContainer, { backgroundColor: '#2F5D73' }]}>
        <SafeAreaView style={styles.modalSafeArea} edges={['top', 'bottom']}>
              
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Pressable 
                  onPress={() => router.back()}
                  style={styles.modalCloseBtn}
                >
                  <Text style={styles.modalBackText}>
                    {language === 'es' ? '← Volver' : '← Back'}
                  </Text>
                </Pressable>
                <Text style={styles.modalSubHeader}>
                  {t('styleDetailsTitle')}
                </Text>
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
                    {/* Reusable CSS Beer Mug filled with SRM Color */}
                    {(() => {
                      const avgSrm = (selectedStyle.srmMin + selectedStyle.srmMax) / 2;
                      const beerColor = getSRMColor(avgSrm);
                      const contrastColor = getSRMContrastColor(avgSrm);
                      return (
                        <View style={[styles.beerGlassContainer, { 
                          marginRight: Spacing.four, 
                          transform: [{ scale: 1.2 }], 
                          marginLeft: 6 
                        }]}>
                          {/* Curved Glass Handle on the left side of the Mug */}
                          <View style={styles.beerGlassHandle} />

                          {/* Puffy Foam Head Base */}
                          <View style={styles.beerGlassFoam}>
                            {/* Extra foam bubble on top of the collar for fluffiness */}
                            <View style={styles.beerGlassFoamBubble} />
                          </View>
                          
                          {/* Beer Mug Body filled with SRM Color, highlight and carbonation bubbles */}
                          <View style={[styles.beerGlassLiquid, { backgroundColor: beerColor }]}>
                            {/* Cold glass reflection highlight line */}
                            <View style={styles.beerGlassHighlight} />

                            {/* Rising Carbonation micro-bubbles */}
                            <View style={styles.beerGlassBubble1} />
                            <View style={styles.beerGlassBubble2} />

                            {/* Centered Style ID */}
                            <Text style={[styles.beerGlassText, { color: contrastColor }]}>
                              {selectedStyle.id}
                            </Text>
                          </View>
                        </View>
                      );
                    })()}
                    <View style={{ flex: 1 }}>
                      <Text style={styles.styleMainName}>
                        {selectedStyle.name}
                      </Text>
                      <Text style={styles.styleMainCategory}>
                        {language === 'es' ? 'Categoría:' : 'Category:'} {selectedStyle.category}
                      </Text>
                    </View>
                  </View>

                  {/* Beer Visual Color Bar */}
                  <View style={styles.srmVisualBarWrapper}>
                    <Text style={styles.srmBarLabel}>{t('srmColorVisual')}</Text>
                    <View style={styles.srmVisualBarTrack}>
                      {(() => {
                        const min = selectedStyle.srmMin;
                        const max = selectedStyle.srmMax;
                        return Array.from({ length: 24 }, (_, idx) => {
                          const srmVal = min === max ? min : min + (idx / 23) * (max - min);
                          const col = getSRMColor(Math.round(srmVal));
                          return (
                            <View 
                              key={idx} 
                              style={[
                                styles.srmColorPill, 
                                { backgroundColor: col }
                              ]} 
                            />
                          );
                        });
                      })()}
                    </View>
                    <View style={styles.srmLegendRow}>
                      <Text style={styles.srmLegendText}>{language === 'es' ? 'SRM Mín:' : 'Min SRM:'} {selectedStyle.srmMin}</Text>
                      <Text style={styles.srmLegendText}>{language === 'es' ? 'SRM Máx:' : 'Max SRM:'} {selectedStyle.srmMax}</Text>
                    </View>
                  </View>
                </View>

                {/* Vital Statistics Table Card */}
                <View style={styles.vitalCard}>
                  <Text style={styles.vitalTableHeader}>{t('vitalStats')}</Text>
                  
                  <View style={styles.vitalRow}>
                    <Text style={styles.vitalFieldLabel}>{t('og')}</Text>
                    <Text style={styles.vitalFieldValue}>{selectedStyle.vitalStatistics.og}</Text>
                  </View>
                  <View style={styles.vitalDivider} />
                  
                  <View style={styles.vitalRow}>
                    <Text style={styles.vitalFieldLabel}>{t('fg')}</Text>
                    <Text style={styles.vitalFieldValue}>{selectedStyle.vitalStatistics.fg}</Text>
                  </View>
                  <View style={styles.vitalDivider} />

                  <View style={styles.vitalRow}>
                    <Text style={styles.vitalFieldLabel}>{t('abv')}</Text>
                    <Text style={[styles.vitalFieldValue, { color: '#D99B26', fontWeight: '800' }]}>
                      {selectedStyle.vitalStatistics.abv}
                    </Text>
                  </View>
                  <View style={styles.vitalDivider} />

                  <View style={styles.vitalRow}>
                    <Text style={styles.vitalFieldLabel}>{t('ibu')}</Text>
                    <Text style={[styles.vitalFieldValue, { color: '#2F5D73', fontWeight: '800' }]}>
                      {selectedStyle.vitalStatistics.ibu}
                    </Text>
                  </View>
                  <View style={styles.vitalDivider} />

                  <View style={styles.vitalRow}>
                    <Text style={styles.vitalFieldLabel}>{t('srm')}</Text>
                    <Text style={styles.vitalFieldValue}>{selectedStyle.vitalStatistics.srm}</Text>
                  </View>
                </View>

                {/* Descriptive Cards Stack */}
                <View style={styles.detailsGroup}>
                  
                  {/* Overall Impression */}
                  <View style={styles.detailCard}>
                    <View style={styles.detailHeaderRow}>
                      <DetailIcon name="impression" style={styles.detailHeaderIcon} />
                      <Text style={styles.detailHeading}>
                        {t('impression').split('.')[1]?.trim() || t('impression')}
                      </Text>
                    </View>
                    {renderTextWithGlossaryLinks(selectedStyle.overallImpression)}
                  </View>

                  {/* Aroma */}
                  <View style={styles.detailCard}>
                    <View style={styles.detailHeaderRow}>
                      <DetailIcon name="aroma" style={styles.detailHeaderIcon} />
                      <Text style={styles.detailHeading}>
                        {t('aroma').split('.')[1]?.trim() || t('aroma')}
                      </Text>
                    </View>
                    {renderTextWithGlossaryLinks(selectedStyle.aroma)}
                  </View>

                  {/* Appearance */}
                  <View style={styles.detailCard}>
                    <View style={styles.detailHeaderRow}>
                      <DetailIcon name="appearance" style={styles.detailHeaderIcon} />
                      <Text style={styles.detailHeading}>
                        {t('appearance').split('.')[1]?.trim() || t('appearance')}
                      </Text>
                    </View>
                    {renderTextWithGlossaryLinks(selectedStyle.appearance)}
                  </View>

                  {/* Flavor */}
                  <View style={styles.detailCard}>
                    <View style={styles.detailHeaderRow}>
                      <DetailIcon name="flavor" style={styles.detailHeaderIcon} />
                      <Text style={styles.detailHeading}>
                        {t('flavor').split('.')[1]?.trim() || t('flavor')}
                      </Text>
                    </View>
                    {renderTextWithGlossaryLinks(selectedStyle.flavor)}
                  </View>

                  {/* Mouthfeel */}
                  <View style={styles.detailCard}>
                    <View style={styles.detailHeaderRow}>
                      <DetailIcon name="mouthfeel" style={styles.detailHeaderIcon} />
                      <Text style={styles.detailHeading}>
                        {t('mouthfeel').split('.')[1]?.trim() || t('mouthfeel')}
                      </Text>
                    </View>
                    {renderTextWithGlossaryLinks(selectedStyle.mouthfeel)}
                  </View>

                  {/* Comments */}
                  {selectedStyle.comments ? (
                    <View style={styles.detailCard}>
                      <View style={styles.detailHeaderRow}>
                        <DetailIcon name="comments" style={styles.detailHeaderIcon} />
                        <Text style={styles.detailHeading}>
                          {t('comments').split('.')[1]?.trim() || t('comments')}
                        </Text>
                      </View>
                      {renderTextWithGlossaryLinks(selectedStyle.comments)}
                    </View>
                  ) : null}

                  {/* Comparison */}
                  {selectedStyle.comparison ? (
                    <View style={styles.detailCard}>
                      <View style={styles.detailHeaderRow}>
                        <DetailIcon name="comparison" style={styles.detailHeaderIcon} />
                        <Text style={styles.detailHeading}>
                          {t('comparison').split('.')[1]?.trim() || t('comparison')}
                        </Text>
                      </View>
                      {renderTextWithStyleLinks(selectedStyle.comparison, selectedStyle)}
                    </View>
                  ) : null}

                  {/* History */}
                  <View style={styles.detailCard}>
                    <View style={styles.detailHeaderRow}>
                      <DetailIcon name="history" style={styles.detailHeaderIcon} />
                      <Text style={styles.detailHeading}>
                        {t('history').split('.')[1]?.trim() || t('history')}
                      </Text>
                    </View>
                    {renderTextWithGlossaryLinks(selectedStyle.history)}
                  </View>

                  {/* Ingredients */}
                  <View style={styles.detailCard}>
                    <View style={styles.detailHeaderRow}>
                      <DetailIcon name="ingredients" style={styles.detailHeaderIcon} />
                      <Text style={styles.detailHeading}>
                        {t('ingredients').split('.')[1]?.trim() || t('ingredients')}
                      </Text>
                    </View>
                    {renderTextWithGlossaryLinks(selectedStyle.ingredients)}
                  </View>

                  {/* Commercial Examples */}
                  <View style={styles.detailCard}>
                    <View style={styles.detailHeaderRow}>
                      <DetailIcon name="examples" style={styles.detailHeaderIcon} />
                      <Text style={styles.detailHeading}>
                        {t('examples').split('.')[1]?.trim() || t('examples')}
                      </Text>
                    </View>
                    <View style={styles.examplesList}>
                      {selectedStyle.commercialExamples.map((ex, i) => (
                        <View key={i} style={styles.exampleItem}>
                          <Text style={styles.exampleText}>🍺 {ex}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Tags */}
                  <View style={styles.detailCard}>
                    <View style={styles.detailHeaderRow}>
                      <DetailIcon name="tags" style={styles.detailHeaderIcon} />
                      <Text style={styles.detailHeading}>
                        {t('tags').split('.')[1]?.trim() || t('tags')}
                      </Text>
                    </View>
                    <View style={{ marginTop: Spacing.two }}>
                      <Text style={styles.detailText}>
                        {selectedStyle.tags.map((tag, i) => {
                          const tagDef = TAG_DEFINITIONS_DATA.find(
                            tData => 
                              tData.tag.toLowerCase() === tag.toLowerCase() || 
                              (tData.tag_es && tData.tag_es.toLowerCase() === tag.toLowerCase())
                          );

                          return (
                            <React.Fragment key={i}>
                              {i > 0 && <Text style={{ color: '#0A0C10', fontWeight: '500' }}>, </Text>}
                              <Text
                                onPress={() => {
                                  if (tagDef) {
                                    handleTagLinkPress(tagDef);
                                  }
                                }}
                                style={{
                                  color: '#0A0C10',
                                  fontWeight: '500',
                                  textDecorationLine: 'underline',
                                  textDecorationColor: '#0A0C10',
                                  ...({ outlineStyle: 'none' } as any),
                                }}
                              >
                                {tag}
                              </Text>
                            </React.Fragment>
                          );
                        })}
                      </Text>
                    </View>
                  </View>

                </View>

              </ScrollView>
            </SafeAreaView>

            {/* Dynamic Link Choice Modal Overlay (Inside Main Modal) */}
            {linkChoiceModalVisible && (
              <View style={[StyleSheet.absoluteFill, { zIndex: 1000, elevation: 1000 }]}>
                <View style={styles.choiceModalOverlay}>
                  <View style={[styles.choiceModalContainer, { backgroundColor: theme.backgroundElement }]}>
                    <Text style={[styles.choiceModalTitle, { color: theme.text }]}>
                      {language === 'es' ? 'Referencia Cruzada' : 'Cross Reference'}
                    </Text>
                    
                    <Text style={[styles.choiceModalSubtitle, { color: theme.textSecondary }]}>
                      {language === 'es' 
                        ? `¿Qué te gustaría hacer con el estilo ${linkTargetStyle?.name} (${linkTargetStyle?.id})?`
                        : `What would you like to do with style ${linkTargetStyle?.name} (${linkTargetStyle?.id})?`}
                    </Text>

                    <View style={styles.choiceButtonGroup}>
                      {/* Option 1: View Details */}
                      <Pressable 
                        style={({ pressed }) => [
                          styles.choiceButton, 
                          { backgroundColor: '#D99B26', opacity: pressed ? 0.8 : 1 }
                        ]} 
                        onPress={() => {
                          if (linkTargetStyle) {
                            setLinkChoiceModalVisible(false);
                            setTimeout(() => {
                              router.push(('/style/' + linkTargetStyle.id) as any);
                            }, 300);
                          }
                        }}
                      >
                        <Text style={styles.choiceButtonText}>
                          {language === 'es' ? 'Ver Detalles' : 'View Details'}
                        </Text>
                      </Pressable>

                      {/* Option 2: Compare */}
                      <Pressable 
                        style={({ pressed }) => [
                          styles.choiceButton, 
                          { backgroundColor: '#2F5D73', marginTop: 10, opacity: pressed ? 0.8 : 1 }
                        ]} 
                        onPress={() => {
                          if (linkTargetStyle && selectedStyle) {
                            setLinkChoiceModalVisible(false);
                            setTimeout(() => {
                              router.push({
                                pathname: '/comparator',
                                params: {
                                  styleAId: selectedStyle.id,
                                  styleBId: linkTargetStyle.id
                                }
                              });
                            }, 300);
                          }
                        }}
                      >
                        <Text style={styles.choiceButtonText}>
                          {language === 'es' ? 'Comparar con actual' : 'Compare with current'}
                        </Text>
                      </Pressable>

                      {/* Option 3: Cancel */}
                      <Pressable 
                        style={({ pressed }) => [
                          styles.choiceCancelButton, 
                          { marginTop: 15, opacity: pressed ? 0.7 : 1 }
                        ]} 
                        onPress={() => setLinkChoiceModalVisible(false)}
                      >
                        <Text style={[styles.choiceCancelButtonText, { color: theme.textSecondary }]}>
                          {language === 'es' ? 'Cancelar' : 'Cancel'}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Dynamic Glossary Term Details Modal Overlay (Inside Main Modal) */}
            {glossaryModalVisible && (
              <View style={[StyleSheet.absoluteFill, { zIndex: 1001, elevation: 1001 }]}>
                <Pressable 
                  style={styles.modalOverlay} 
                  onPress={() => setGlossaryModalVisible(false)}
                >
                  <View 
                    style={[
                      styles.glossaryModalContent,
                      { backgroundColor: theme.backgroundElement, borderColor: theme.border }
                    ]}
                    onStartShouldSetResponder={() => true}
                  >
                    <View style={styles.glossaryModalHeader}>
                      <Text style={{ fontSize: 24 }}>📖</Text>
                      <Text style={[styles.glossaryModalTitle, { color: theme.text }]} numberOfLines={2}>
                        {selectedGlossaryTerm ? (language === 'es' ? selectedGlossaryTerm.name_es : selectedGlossaryTerm.name_en) : ''}
                      </Text>
                    </View>
                    
                    <ScrollView style={{ maxHeight: 300 }} indicatorStyle={(theme.text as string) === '#FFFFFF' ? 'white' : 'black'}>
                      <Text style={[styles.glossaryModalBody, { color: theme.textSecondary }]}>
                        {selectedGlossaryTerm ? (language === 'es' ? selectedGlossaryTerm.definition_es : selectedGlossaryTerm.definition_en) : ''}
                      </Text>
                    </ScrollView>

                    <Pressable 
                      style={[styles.glossaryModalButton, { backgroundColor: theme.tint }]}
                      onPress={() => setGlossaryModalVisible(false)}
                    >
                      <Text style={styles.glossaryModalButtonText}>
                        {language === 'es' ? 'Entendido' : 'Got it'}
                      </Text>
                    </Pressable>
                  </View>
                </Pressable>
              </View>
            )}

            {/* Dynamic Off-Flavor Modal Overlay (Inside Main Modal) */}
            {offFlavorModalVisible && (
              <View style={[StyleSheet.absoluteFill, { zIndex: 1002, elevation: 1002 }]}>
                <Pressable 
                  style={styles.modalOverlay} 
                  onPress={() => setOffFlavorModalVisible(false)}
                >
                  <View 
                    style={[
                      styles.offFlavorCard,
                      { backgroundColor: theme.backgroundElement, borderColor: theme.border }
                    ]}
                    onStartShouldSetResponder={() => true}
                  >
                    <View style={styles.offFlavorHeader}>
                      <Text style={{ fontSize: 28 }}>{(selectedOffFlavor as any)?.icon || '⚠️'}</Text>
                      <Text style={[styles.offFlavorTitle, { color: theme.text }]} numberOfLines={2}>
                        {selectedOffFlavor ? (language === 'es' ? selectedOffFlavor.name_es : selectedOffFlavor.name_en) : ''}
                      </Text>
                    </View>

                    <ScrollView style={{ maxHeight: 400 }} indicatorStyle={(theme.text as string) === '#FFFFFF' ? 'white' : 'black'}>
                      
                      {/* Section 1: Sensation */}
                      <View style={[styles.offFlavorSection, { backgroundColor: theme.background, borderColor: theme.border }]}>
                        <View style={styles.offFlavorSectionHeader}>
                          <Text style={{ fontSize: 16 }}>👅</Text>
                          <Text style={[styles.offFlavorSectionTitle, { color: theme.text }]}>
                            {language === 'es' ? 'Sensación / Percepción' : 'Sensation / Perception'}
                          </Text>
                        </View>
                        <Text style={[styles.offFlavorSectionText, { color: theme.textSecondary }]}>
                          {selectedOffFlavor ? (language === 'es' ? selectedOffFlavor.sensation_es : selectedOffFlavor.sensation_en) : ''}
                        </Text>
                      </View>

                      {/* Section 2: Causes */}
                      <View style={[styles.offFlavorSection, { backgroundColor: theme.background, borderColor: theme.border }]}>
                        <View style={styles.offFlavorSectionHeader}>
                          <Text style={{ fontSize: 16 }}>🧪</Text>
                          <Text style={[styles.offFlavorSectionTitle, { color: theme.text }]}>
                            {language === 'es' ? 'Causas Comunes' : 'Common Causes'}
                          </Text>
                        </View>
                        <Text style={[styles.offFlavorSectionText, { color: theme.textSecondary }]}>
                          {selectedOffFlavor ? (language === 'es' ? selectedOffFlavor.causes_es : selectedOffFlavor.causes_en) : ''}
                        </Text>
                      </View>

                      {/* Section 3: Prevention */}
                      <View style={[styles.offFlavorSection, { backgroundColor: theme.background, borderColor: theme.border }]}>
                        <View style={styles.offFlavorSectionHeader}>
                          <Text style={{ fontSize: 16 }}>🛡️</Text>
                          <Text style={[styles.offFlavorSectionTitle, { color: theme.text }]}>
                            {language === 'es' ? 'Cómo Evitarlo / Prevención' : 'How to Prevent / Prevention'}
                          </Text>
                        </View>
                        <Text style={[styles.offFlavorSectionText, { color: theme.textSecondary }]}>
                          {selectedOffFlavor ? (language === 'es' ? selectedOffFlavor.prevention_es : selectedOffFlavor.prevention_en) : ''}
                        </Text>
                      </View>
                    </ScrollView>

                    <Pressable 
                      style={[styles.glossaryModalButton, { backgroundColor: theme.tint }]}
                      onPress={() => setOffFlavorModalVisible(false)}
                    >
                      <Text style={styles.glossaryModalButtonText}>
                        {language === 'es' ? 'Cerrar' : 'Close'}
                      </Text>
                    </Pressable>
                  </View>
                </Pressable>
              </View>
            )}


      </View>
    </SafeAreaProvider>
  );
}

// Extract styles from explore.tsx
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
