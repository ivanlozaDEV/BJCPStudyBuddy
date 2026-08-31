import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { BeerStyle } from '@/data/bjcp2021';
import { Fonts, Spacing, MaxContentWidth } from '@/constants/theme';
import { getSRMColor } from '@/utils/srm';

interface LiveStyleGuideModalProps {
  visible: boolean;
  onClose: () => void;
  style: BeerStyle | null;
  language: 'es' | 'en';
}

export function LiveStyleGuideModal({
  visible,
  onClose,
  style,
  language,
}: LiveStyleGuideModalProps) {
  const [activeTab, setActiveTab] = useState<'sensory' | 'stats' | 'examples'>('sensory');

  if (!style) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: '#1A3340' }]}>
          {/* Handle bar */}
          <View style={styles.handleContainer}>
            <View style={styles.handleBar} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleColumn}>
              <ThemedText style={styles.styleIdBadge}>{style.id}</ThemedText>
              <ThemedText style={styles.styleName}>{style.name}</ThemedText>
              <ThemedText style={styles.styleCategory}>{style.category}</ThemedText>
            </View>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.7 }]}
            >
              <ThemedText style={styles.closeBtnText}>✕</ThemedText>
            </Pressable>
          </View>

          {/* Tab Navigation */}
          <View style={styles.tabRow}>
            <Pressable
              onPress={() => setActiveTab('sensory')}
              style={[
                styles.tabItem,
                activeTab === 'sensory' && styles.tabItemActive,
              ]}
            >
              <ThemedText
                style={[
                  styles.tabText,
                  activeTab === 'sensory' && styles.tabTextActive,
                ]}
              >
                {language === 'es' ? 'Sensorial' : 'Sensory'}
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('stats')}
              style={[
                styles.tabItem,
                activeTab === 'stats' && styles.tabItemActive,
              ]}
            >
              <ThemedText
                style={[
                  styles.tabText,
                  activeTab === 'stats' && styles.tabTextActive,
                ]}
              >
                {language === 'es' ? 'Estadísticas' : 'Vital Stats'}
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('examples')}
              style={[
                styles.tabItem,
                activeTab === 'examples' && styles.tabItemActive,
              ]}
            >
              <ThemedText
                style={[
                  styles.tabText,
                  activeTab === 'examples' && styles.tabTextActive,
                ]}
              >
                {language === 'es' ? 'Ejemplos / Info' : 'Examples / Info'}
              </ThemedText>
            </Pressable>
          </View>

          {/* Content Body */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {activeTab === 'sensory' && (
              <View style={styles.sectionStack}>
                <GuideSection
                  number="1"
                  title={language === 'es' ? 'Impresión General' : 'Overall Impression'}
                  content={style.overallImpression}
                />
                <GuideSection
                  number="2"
                  title={language === 'es' ? 'Aroma' : 'Aroma'}
                  content={style.aroma}
                  highlight
                />
                <GuideSection
                  number="3"
                  title={language === 'es' ? 'Apariencia' : 'Appearance'}
                  content={style.appearance}
                  highlight
                />
                <GuideSection
                  number="4"
                  title={language === 'es' ? 'Sabor' : 'Flavor'}
                  content={style.flavor}
                  highlight
                />
                <GuideSection
                  number="5"
                  title={language === 'es' ? 'Sensación en Boca' : 'Mouthfeel'}
                  content={style.mouthfeel}
                  highlight
                />
              </View>
            )}

            {activeTab === 'stats' && (
              <View style={styles.statsStack}>
                <View style={styles.statsGrid}>
                  <StatCard label="OG" value={style.vitalStatistics.og} />
                  <StatCard label="FG" value={style.vitalStatistics.fg} />
                  <StatCard label="ABV" value={style.vitalStatistics.abv} highlight />
                  <StatCard label="IBU" value={style.vitalStatistics.ibu} highlight />
                  <StatCard label="SRM" value={style.vitalStatistics.srm} />
                </View>

                {/* SRM Color Bar Preview */}
                <View style={styles.srmBarContainer}>
                  <ThemedText style={styles.srmBarLabel}>
                    {language === 'es' ? 'Rango de Color Estimado (SRM)' : 'Estimated Color Range (SRM)'}
                  </ThemedText>
                  <View style={styles.srmBarTrack}>
                    <View
                      style={[
                        styles.srmSwatch,
                        { backgroundColor: getSRMColor(style.srmMin) },
                      ]}
                    />
                    <ThemedText style={styles.srmRangeText}>
                      SRM {style.srmMin} ➔ {style.srmMax}
                    </ThemedText>
                    <View
                      style={[
                        styles.srmSwatch,
                        { backgroundColor: getSRMColor(style.srmMax) },
                      ]}
                    />
                  </View>
                </View>

                {style.tags && style.tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    <ThemedText style={styles.tagsLabel}>
                      {language === 'es' ? 'Etiquetas del Estilo' : 'Style Tags'}
                    </ThemedText>
                    <View style={styles.tagsRow}>
                      {style.tags.map((tag, idx) => (
                        <View key={idx} style={styles.tagChip}>
                          <ThemedText style={styles.tagChipText}>{tag}</ThemedText>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}

            {activeTab === 'examples' && (
              <View style={styles.sectionStack}>
                {style.commercialExamples && style.commercialExamples.length > 0 && (
                  <View style={styles.guideSectionCard}>
                    <ThemedText style={styles.sectionCardTitle}>
                      {language === 'es' ? 'Ejemplos Comerciales' : 'Commercial Examples'}
                    </ThemedText>
                    {style.commercialExamples.map((ex, idx) => (
                      <ThemedText key={idx} style={styles.exampleItem}>
                        • {ex}
                      </ThemedText>
                    ))}
                  </View>
                )}

                {style.ingredients && (
                  <GuideSection
                    number="7"
                    title={language === 'es' ? 'Ingredientes' : 'Ingredients'}
                    content={style.ingredients}
                  />
                )}

                {style.history && (
                  <GuideSection
                    number="6"
                    title={language === 'es' ? 'Historia' : 'History'}
                    content={style.history}
                  />
                )}

                {style.comparison && (
                  <GuideSection
                    number="★"
                    title={language === 'es' ? 'Comparación de Estilos' : 'Style Comparison'}
                    content={style.comparison}
                  />
                )}
              </View>
            )}
          </ScrollView>

          {/* Footer Action */}
          <View style={styles.footer}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.doneBtn, pressed && { opacity: 0.8 }]}
            >
              <ThemedText style={styles.doneBtnText}>
                {language === 'es' ? 'Continuar Evaluando' : 'Continue Scoring'}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function GuideSection({
  number,
  title,
  content,
  highlight = false,
}: {
  number: string;
  title: string;
  content: string;
  highlight?: boolean;
}) {
  if (!content) return null;
  return (
    <View style={[styles.guideSectionCard, highlight && styles.guideSectionHighlight]}>
      <View style={styles.guideSectionHeader}>
        <View style={styles.sectionNumberBadge}>
          <ThemedText style={styles.sectionNumberText}>{number}</ThemedText>
        </View>
        <ThemedText style={styles.sectionCardTitle}>{title}</ThemedText>
      </View>
      <ThemedText style={styles.sectionCardContent}>{content}</ThemedText>
    </View>
  );
}

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View style={[styles.statCard, highlight && styles.statCardHighlight]}>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
      <ThemedText style={styles.statValue}>{value || 'N/A'}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '88%',
    minHeight: '65%',
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingTop: Spacing.two,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  handleBar: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  titleColumn: {
    flex: 1,
    paddingRight: Spacing.two,
  },
  styleIdBadge: {
    color: '#F2B824',
    fontSize: 13,
    fontFamily: Fonts.spaceGroteskBold,
    letterSpacing: 1,
  },
  styleName: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 24,
    fontFamily: Fonts.spaceGroteskBold,
    marginTop: 2,
  },
  styleCategory: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 12,
    fontFamily: Fonts.inter,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.four,
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 12,
    padding: 4,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontFamily: Fonts.manropeBold,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    paddingBottom: Spacing.six,
  },
  sectionStack: {
    gap: Spacing.three,
  },
  guideSectionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  guideSectionHighlight: {
    borderColor: 'rgba(242, 184, 36, 0.25)',
    backgroundColor: 'rgba(242, 184, 36, 0.04)',
  },
  guideSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.two,
    gap: Spacing.two,
  },
  sectionNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionNumberText: {
    color: '#F2B824',
    fontSize: 12,
    fontFamily: Fonts.spaceGroteskBold,
  },
  sectionCardTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: Fonts.spaceGroteskBold,
  },
  sectionCardContent: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    lineHeight: 20,
    fontFamily: Fonts.inter,
  },
  exampleItem: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    lineHeight: 22,
    fontFamily: Fonts.inter,
  },
  statsStack: {
    gap: Spacing.four,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  statCard: {
    flexBasis: '30%',
    flexGrow: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: Spacing.two,
    alignItems: 'center',
  },
  statCardHighlight: {
    backgroundColor: 'rgba(82, 183, 136, 0.15)',
    borderWidth: 1,
    borderColor: '#52B788',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    fontFamily: Fonts.manropeBold,
    textTransform: 'uppercase',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Fonts.spaceGroteskBold,
    marginTop: 2,
  },
  srmBarContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    padding: Spacing.three,
  },
  srmBarLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    fontFamily: Fonts.manropeBold,
    marginBottom: Spacing.two,
    textTransform: 'uppercase',
  },
  srmBarTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  srmSwatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  srmRangeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Fonts.spaceGroteskBold,
  },
  tagsContainer: {
    gap: Spacing.two,
  },
  tagsLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    fontFamily: Fonts.manropeBold,
    textTransform: 'uppercase',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagChipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: Fonts.inter,
  },
  footer: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  doneBtn: {
    backgroundColor: '#2F5D73',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: Fonts.spaceGroteskBold,
  },
});
