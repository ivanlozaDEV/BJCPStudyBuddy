import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTranslation } from '@/context/language-context';
import { useTastings } from '@/context/tastings-context';
import { getBJCPStyles } from '@/data/bjcp2021';
import { getQualityTier, OFFICIAL_BJCP_DESCRIPTORS } from '@/types/tasting';
import { ScoreDial } from '@/components/score-dial';
import { LiveStyleGuideModal } from '@/components/live-style-guide-modal';
import { AttributeScale, RadioGroup } from '@/components/attribute-scale';
import { BottomTabInset, Fonts, Spacing, MaxContentWidth } from '@/constants/theme';
import Svg, { Path, Circle, Line } from 'react-native-svg';

function GlassIconSvg({ size = 14 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 3h10c0 4-1.5 7.5-4 8.5v5.5h3v2H8v-2h3V11.5C8.5 10.5 7 7 7 3z"
        fill="#F2B824"
        stroke="#E5A81E"
        strokeWidth={1.2}
      />
      <Path
        d="M7 3c0-1 1-1.5 2.5-1.5S11 2 12 1.5s1.5 0 2.5.5S17 2 17 3H7z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

function LabelIconSvg({ size = 14 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 11V4a1 1 0 0 1 1-1h7l10 10-8 8L3 11z"
        fill="#52B788"
        stroke="#3E9B6E"
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      <Circle cx={7.5} cy={7.5} r={1.8} fill="#161B22" />
      <Line x1={11} y1={12} x2={16} y2={17} stroke="rgba(255, 255, 255, 0.6)" strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  );
}

export default function TastingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, language } = useTranslation();
  const { getTastingById, deleteTasting } = useTastings();

  const tasting = getTastingById(id || '');
  const allStyles = getBJCPStyles(language);
  const correspondingStyle = tasting
    ? allStyles.find((s) => s.id.toLowerCase() === tasting.styleId.toLowerCase()) || null
    : null;

  const [guideModalVisible, setGuideModalVisible] = useState(false);

  if (!tasting) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.notFoundBox}>
            <ThemedText style={styles.notFoundText}>
              {language === 'es' ? 'Cata no encontrada' : 'Tasting not found'}
            </ThemedText>
            <Pressable
              onPress={() => router.replace('/tastings' as any)}
              style={styles.backBtnPill}
            >
              <ThemedText style={styles.backBtnPillText}>← {t('myTastings')}</ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  const quality = getQualityTier(tasting.totalScore);
  const formattedDate = new Date(tasting.createdAt).toLocaleDateString(
    language === 'es' ? 'es-ES' : 'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  );

  const handleDelete = () => {
    Alert.alert(
      language === 'es' ? 'Eliminar Cata' : 'Delete Tasting',
      t('deleteTastingConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            await deleteTasting(tasting.id);
            router.replace('/tastings' as any);
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              if (router.canGoBack()) router.back();
              else router.replace('/tastings' as any);
            }}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
          >
            <ThemedText style={styles.backBtnText}>←</ThemedText>
          </Pressable>

          <ThemedText style={styles.headerTitle}>{t('tastingDetailTitle')}</ThemedText>

          <View style={styles.headerActions}>
            <Pressable
              onPress={() => router.push({ pathname: '/judge-simulator' as any, params: { editId: tasting.id } })}
              style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }]}
            >
              <ThemedText style={styles.actionBtnText}>✏️</ThemedText>
            </Pressable>
            <Pressable
              onPress={handleDelete}
              style={({ pressed }) => [styles.actionBtn, styles.deleteBtn, pressed && { opacity: 0.7 }]}
            >
              <ThemedText style={styles.actionBtnText}>🗑️</ThemedText>
            </Pressable>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Banner with Photo and Score */}
          <View style={styles.heroCard}>
            {tasting.photoUrl && tasting.labelPhotoUrl ? (
              <View style={styles.dualPhotoHeroRow}>
                <View style={styles.dualPhotoWrapper}>
                  <Image source={{ uri: tasting.photoUrl }} style={styles.dualPhotoImage} />
                  <View style={styles.photoTypePill}>
                    <GlassIconSvg size={13} />
                    <ThemedText style={styles.photoTypePillText}>
                      {language === 'es' ? 'Vaso' : 'Glass'}
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.dualPhotoWrapper}>
                  <Image source={{ uri: tasting.labelPhotoUrl }} style={styles.dualPhotoImage} />
                  <View style={styles.photoTypePill}>
                    <LabelIconSvg size={13} />
                    <ThemedText style={styles.photoTypePillText}>
                      {language === 'es' ? 'Etiqueta' : 'Label'}
                    </ThemedText>
                  </View>
                </View>
              </View>
            ) : tasting.photoUrl ? (
              <View style={{ position: 'relative' }}>
                <Image source={{ uri: tasting.photoUrl }} style={styles.beerPhoto} />
                <View style={styles.photoTypePillSingle}>
                  <GlassIconSvg size={14} />
                  <ThemedText style={styles.photoTypePillText}>
                    {language === 'es' ? 'Cerveza Servida' : 'Beer in Glass'}
                  </ThemedText>
                </View>
              </View>
            ) : tasting.labelPhotoUrl ? (
              <View style={{ position: 'relative' }}>
                <Image source={{ uri: tasting.labelPhotoUrl }} style={styles.beerPhoto} />
                <View style={styles.photoTypePillSingle}>
                  <LabelIconSvg size={14} />
                  <ThemedText style={styles.photoTypePillText}>
                    {language === 'es' ? 'Etiqueta / Lata' : 'Label / Bottle'}
                  </ThemedText>
                </View>
              </View>
            ) : (
              <View style={styles.photoPlaceholderBanner}>
                <GlassIconSvg size={40} />
              </View>
            )}

            <View style={styles.heroInfoRow}>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.beerNameText}>{tasting.beerName}</ThemedText>
                {tasting.brewery ? (
                  <ThemedText style={styles.breweryText}>{tasting.brewery}</ThemedText>
                ) : null}
                <ThemedText style={styles.dateText}>
                  {formattedDate} {tasting.vintageOrBatch ? `• Lote: ${tasting.vintageOrBatch}` : ''}
                </ThemedText>

                {/* Style Badge Link */}
                <Pressable
                  onPress={() => {
                    if (correspondingStyle) {
                      router.push(`/style/${correspondingStyle.id}` as any);
                    }
                  }}
                  style={({ pressed }) => [
                    styles.styleBadgeLink,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <ThemedText style={styles.styleBadgeId}>{tasting.styleId}</ThemedText>
                  <ThemedText style={styles.styleBadgeName} numberOfLines={1}>
                    {tasting.styleName} ➔
                  </ThemedText>
                </Pressable>
              </View>

              <ScoreDial score={tasting.totalScore} maxScore={50} size={95} language={language} />
            </View>
          </View>

          {/* Quick BJCP Style Guide Pill Action */}
          <Pressable
            onPress={() => setGuideModalVisible(true)}
            style={({ pressed }) => [styles.guideBannerBtn, pressed && { opacity: 0.85 }]}
          >
            <ThemedText style={styles.guideBannerIcon}>📖</ThemedText>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.guideBannerTitle}>
                {language === 'es' ? 'Consultar Guía BJCP de este Estilo' : 'Review Official BJCP Guide for Style'}
              </ThemedText>
              <ThemedText style={styles.guideBannerSubtitle}>
                {tasting.styleId} {tasting.styleName}
              </ThemedText>
            </View>
            <ThemedText style={styles.guideBannerArrow}>➔</ThemedText>
          </Pressable>

          {/* Scoresheet Breakdown Cards */}
          <View style={styles.breakdownContainer}>
            <ThemedText style={styles.sectionHeaderTitle}>
              {language === 'es' ? 'FICHA SENSORIAL Y PUNTUACIÓN (50 PTS)' : 'SENSORY SCORESHEET (50 PTS)'}
            </ThemedText>

            {/* 1. Apariencia */}
            <View style={styles.categoryCard}>
              <ScoreBreakdownRow
                label={language === 'es' ? '1. Apariencia' : '1. Appearance'}
                score={tasting.scoresheet.appearanceScore}
                max={3}
                notes={tasting.scoresheet.appearanceNotes}
              />
              {tasting.structuredAttributes?.appearanceColor !== undefined && (
                <AttributeScale
                  label={language === 'es' ? 'Color' : 'Color'}
                  options={
                    language === 'es'
                      ? ['Muy Clara', 'Apropiada', 'Muy Oscura']
                      : ['Too Light', 'Appropriate', 'Too Dark']
                  }
                  value={tasting.structuredAttributes.appearanceColor}
                  readOnly={true}
                  language={language}
                />
              )}
              {tasting.structuredAttributes?.appearanceClarity !== undefined && (
                <AttributeScale
                  label={language === 'es' ? 'Claridad' : 'Clarity'}
                  options={
                    language === 'es'
                      ? ['Muy Cristalina', 'Apropiada', 'Muy Turbia']
                      : ['Too Clear', 'Appropriate', 'Too Hazy / Turbid']
                  }
                  value={tasting.structuredAttributes.appearanceClarity}
                  readOnly={true}
                  language={language}
                />
              )}
              {tasting.structuredAttributes?.appearanceHead !== undefined && (
                <AttributeScale
                  label={language === 'es' ? 'Espuma' : 'Head / Foam'}
                  options={
                    language === 'es'
                      ? ['Espuma baja', 'Apropiada', 'Espuma alta']
                      : ['Too Low', 'Appropriate', 'Too High']
                  }
                  value={tasting.structuredAttributes.appearanceHead}
                  readOnly={true}
                  language={language}
                />
              )}
            </View>

            {/* 2. Aroma */}
            <View style={styles.categoryCard}>
              <ScoreBreakdownRow
                label={language === 'es' ? '2. Aroma' : '2. Aroma'}
                score={tasting.scoresheet.aromaScore}
                max={12}
                notes={tasting.scoresheet.aromaNotes}
              />
              {tasting.structuredAttributes?.aromaAppropriate !== undefined && (
                <AttributeScale
                  label={language === 'es' ? 'Adecuación aromática' : 'Aroma Appropriateness'}
                  options={
                    language === 'es'
                      ? ['Apropiada', 'No apropiada']
                      : ['Appropriate', 'Inappropriate']
                  }
                  scoringMode="start-ideal"
                  value={tasting.structuredAttributes.aromaAppropriate}
                  readOnly={true}
                  language={language}
                />
              )}
            </View>

            {/* 3. Sabor & Retrogusto */}
            <View style={styles.categoryCard}>
              <ScoreBreakdownRow
                label={language === 'es' ? '3. Sabor & Retrogusto' : '3. Flavor & Aftertaste'}
                score={tasting.scoresheet.flavorScore}
                max={20}
                notes={
                  tasting.scoresheet.flavorNotes && tasting.scoresheet.aftertasteNotes
                    ? `${tasting.scoresheet.flavorNotes}\n\n[Retrogusto]: ${tasting.scoresheet.aftertasteNotes}`
                    : (tasting.scoresheet.flavorNotes || tasting.scoresheet.aftertasteNotes || '')
                }
              />
              {tasting.structuredAttributes?.flavorSweetness !== undefined && (
                <AttributeScale
                  label={language === 'es' ? 'Dulzor' : 'Sweetness'}
                  options={
                    language === 'es'
                      ? ['Muy baja', 'Apropiada', 'Muy alta']
                      : ['Too Low', 'Appropriate', 'Too Sweet']
                  }
                  value={tasting.structuredAttributes.flavorSweetness}
                  readOnly={true}
                  language={language}
                />
              )}
              {tasting.structuredAttributes?.flavorBitterness !== undefined && (
                <AttributeScale
                  label={language === 'es' ? 'Amargor' : 'Bitterness'}
                  options={
                    language === 'es'
                      ? ['Muy baja', 'Apropiada', 'Muy alta']
                      : ['Too Low', 'Appropriate', 'Too Bitter']
                  }
                  value={tasting.structuredAttributes.flavorBitterness}
                  readOnly={true}
                  language={language}
                />
              )}
              {tasting.structuredAttributes?.flavorAcidity !== undefined && (
                <AttributeScale
                  label={language === 'es' ? 'Acidez' : 'Acidity'}
                  options={
                    language === 'es'
                      ? ['Muy baja', 'Apropiada', 'Muy alta']
                      : ['Too Low', 'Appropriate', 'Too Acidic']
                  }
                  value={tasting.structuredAttributes.flavorAcidity}
                  readOnly={true}
                  language={language}
                />
              )}
              {tasting.structuredAttributes?.aftertasteDuration !== undefined && (
                <AttributeScale
                  label={language === 'es' ? 'Duración del Retrogusto' : 'Aftertaste Duration'}
                  options={
                    language === 'es'
                      ? ['Muy corto', 'Apropiado / Equilibrado', 'Muy persistente / Largo']
                      : ['Too Short', 'Appropriate / Balanced', 'Too Long / Lingering']
                  }
                  value={tasting.structuredAttributes.aftertasteDuration}
                  readOnly={true}
                  language={language}
                />
              )}
              {tasting.structuredAttributes?.aftertasteCharacter !== undefined && (
                <AttributeScale
                  label={language === 'es' ? 'Carácter del Final' : 'Finish Character'}
                  options={
                    language === 'es'
                      ? ['Muy seco / Cortante', 'Limpio / Agradable', 'Astringente / Áspero']
                      : ['Too Dry / Abrupt', 'Clean / Pleasant', 'Harsh / Astringent']
                  }
                  value={tasting.structuredAttributes.aftertasteCharacter}
                  readOnly={true}
                  language={language}
                />
              )}
            </View>

            {/* 4. Sensación en Boca */}
            <View style={styles.categoryCard}>
              <ScoreBreakdownRow
                label={language === 'es' ? '4. Sensación en Boca' : '4. Mouthfeel'}
                score={tasting.scoresheet.mouthfeelScore}
                max={5}
                notes={tasting.scoresheet.mouthfeelNotes}
              />
              {tasting.structuredAttributes?.mouthfeelBody !== undefined && (
                <AttributeScale
                  label={language === 'es' ? 'Cuerpo' : 'Body'}
                  options={
                    language === 'es'
                      ? ['Muy baja', 'Apropiada', 'Muy alta']
                      : ['Too Low / Light', 'Appropriate', 'Too High / Heavy']
                  }
                  value={tasting.structuredAttributes.mouthfeelBody}
                  readOnly={true}
                  language={language}
                />
              )}
              {tasting.structuredAttributes?.mouthfeelCarbonation !== undefined && (
                <AttributeScale
                  label={language === 'es' ? 'Carbonatación' : 'Carbonation'}
                  options={
                    language === 'es'
                      ? ['Muy baja', 'Apropiada', 'Muy alta']
                      : ['Too Low', 'Appropriate', 'Too High']
                  }
                  value={tasting.structuredAttributes.mouthfeelCarbonation}
                  readOnly={true}
                  language={language}
                />
              )}
              {tasting.structuredAttributes?.mouthfeelAlcohol !== undefined && (
                <AttributeScale
                  label={language === 'es' ? 'Alcohol / Calidez' : 'Alcohol Warmth'}
                  options={
                    language === 'es'
                      ? ['Muy baja', 'Apropiada', 'Muy alta']
                      : ['Too Low', 'Appropriate', 'Too High']
                  }
                  value={tasting.structuredAttributes.mouthfeelAlcohol}
                  readOnly={true}
                  language={language}
                />
              )}
            </View>

            {/* 5. Impresión General */}
            <View style={styles.categoryCard}>
              <ScoreBreakdownRow
                label={language === 'es' ? '5. General / Impresión' : '5. Overall Impression'}
                score={tasting.scoresheet.overallScore}
                max={10}
                notes={tasting.scoresheet.overallNotes}
              />
              {tasting.structuredAttributes?.generalTechnicalQuality !== undefined && (
                <AttributeScale
                  label={language === 'es' ? 'Calidad técnica' : 'Technical Quality'}
                  options={
                    language === 'es'
                      ? ['Excelente', 'Muy Bueno', 'Bueno', 'Aceptable', 'Necesita mejoras']
                      : ['Outstanding', 'Very Good', 'Good', 'Fair', 'Needs Improvement']
                  }
                  scoringMode="start-ideal"
                  value={tasting.structuredAttributes.generalTechnicalQuality}
                  readOnly={true}
                  language={language}
                />
              )}
              {tasting.structuredAttributes?.generalStyleRepresentation !== undefined && (
                <AttributeScale
                  label={language === 'es' ? 'Estilo' : 'Style Representation'}
                  options={
                    language === 'es'
                      ? ['Muy representativa', 'Algo Representativa', 'No representativa']
                      : ['Classic to Style', 'Somewhat Representative', 'Not Representative']
                  }
                  scoringMode="start-ideal"
                  value={tasting.structuredAttributes.generalStyleRepresentation}
                  readOnly={true}
                  language={language}
                />
              )}
              {tasting.structuredAttributes?.generalRelativeStrength && (
                <RadioGroup
                  title={language === 'es' ? 'Fuerza relativa en la cata' : 'Relative Flight Strength'}
                  options={
                    language === 'es'
                      ? [
                          { id: 'top3', label: 'Top 3 - Avanzado/Medallista' },
                          { id: 'cut', label: 'Casi alcanza el corte' },
                          { id: 'middle', label: 'Mitad del grupo' },
                          { id: 'tail', label: 'Final del grupo' },
                        ]
                      : [
                          { id: 'top3', label: 'Top 3 - Medal Contender' },
                          { id: 'cut', label: 'Near Cut / Mini-BOS' },
                          { id: 'middle', label: 'Middle of Flight' },
                          { id: 'tail', label: 'Bottom of Flight' },
                        ]
                  }
                  selectedId={tasting.structuredAttributes.generalRelativeStrength}
                  readOnly={true}
                />
              )}
            </View>
          </View>

          {/* Detected Descriptors / Off-Flavors */}
          {tasting.descriptors && tasting.descriptors.length > 0 && (
            <View style={styles.sectionCard}>
              <ThemedText style={styles.sectionHeaderTitle}>
                {t('flawsChecklist')} ({tasting.descriptors.length})
              </ThemedText>
              <View style={styles.descriptorsRow}>
                {tasting.descriptors.map((descId) => {
                  const item = OFFICIAL_BJCP_DESCRIPTORS.find((d) => d.id === descId);
                  const label = item
                    ? language === 'es'
                      ? item.name_es
                      : item.name_en
                    : descId;
                  return (
                    <View key={descId} style={styles.descriptorBadge}>
                      <ThemedText style={styles.descriptorBadgeText}>
                        ⚠️ {label}
                      </ThemedText>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Feedback for Brewer */}
          {tasting.feedbackNotes ? (
            <View style={styles.sectionCard}>
              <ThemedText style={styles.sectionHeaderTitle}>
                {t('feedbackToBrewer')}
              </ThemedText>
              <ThemedText style={styles.feedbackText}>
                {tasting.feedbackNotes}
              </ThemedText>
            </View>
          ) : null}
        </ScrollView>

        {/* Live Style Guide Modal */}
        <LiveStyleGuideModal
          visible={guideModalVisible}
          onClose={() => setGuideModalVisible(false)}
          style={correspondingStyle}
          language={language}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

function ScoreBreakdownRow({
  label,
  score,
  max,
  notes,
}: {
  label: string;
  score: number;
  max: number;
  notes?: string;
}) {
  const percentage = Math.round((score / max) * 100);

  return (
    <View style={styles.breakdownRowCard}>
      <View style={styles.breakdownHeaderRow}>
        <ThemedText style={styles.breakdownLabel}>{label}</ThemedText>
        <ThemedText style={styles.breakdownScore}>
          {score} <ThemedText style={styles.breakdownMax}>/{max}</ThemedText>
        </ThemedText>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarTrack}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${percentage}%`,
              backgroundColor: percentage > 75 ? '#52B788' : percentage > 50 ? '#F2B824' : '#C45B0E',
            },
          ]}
        />
      </View>

      {notes ? (
        <ThemedText style={styles.breakdownNotesText}>{notes}</ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F5D73',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: Fonts.spaceGroteskBold,
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    backgroundColor: 'rgba(217, 4, 41, 0.2)',
  },
  actionBtnText: {
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.six,
    gap: Spacing.three,
  },
  heroCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  beerPhoto: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  dualPhotoHeroRow: {
    flexDirection: 'row',
    height: 180,
    width: '100%',
  },
  dualPhotoWrapper: {
    flex: 1,
    height: '100%',
    position: 'relative',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.15)',
  },
  dualPhotoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoTypePill: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(22, 27, 34, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(242, 184, 36, 0.4)',
  },
  photoTypePillSingle: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(22, 27, 34, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(242, 184, 36, 0.4)',
  },
  photoTypePillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: Fonts.spaceGroteskBold,
  },
  photoPlaceholderBanner: {
    width: '100%',
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  beerIconBanner: {
    fontSize: 48,
  },
  heroInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    gap: Spacing.two,
  },
  beerNameText: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 26,
    fontFamily: Fonts.spaceGroteskBold,
    fontWeight: '900',
  },
  breweryText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontFamily: Fonts.inter,
    marginTop: 2,
  },
  dateText: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 11,
    fontFamily: Fonts.inter,
    marginTop: 2,
  },
  styleBadgeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 8,
    gap: 6,
  },
  styleBadgeId: {
    color: '#F2B824',
    fontSize: 12,
    fontFamily: Fonts.spaceGroteskBold,
  },
  styleBadgeName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: Fonts.manropeBold,
    maxWidth: 160,
  },
  guideBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(242, 184, 36, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(242, 184, 36, 0.4)',
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  guideBannerIcon: {
    fontSize: 22,
  },
  guideBannerTitle: {
    color: '#F2B824',
    fontSize: 13,
    fontFamily: Fonts.spaceGroteskBold,
  },
  guideBannerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontFamily: Fonts.inter,
  },
  guideBannerArrow: {
    color: '#F2B824',
    fontSize: 16,
    fontWeight: 'bold',
  },
  breakdownContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    borderRadius: 20,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: Spacing.three,
  },
  categoryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: Spacing.two,
  },
  sectionHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: Fonts.manropeBold,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  breakdownRowCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    padding: Spacing.three,
    gap: 6,
  },
  breakdownHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Fonts.spaceGroteskBold,
  },
  breakdownScore: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: Fonts.spaceGroteskBold,
  },
  breakdownMax: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  breakdownNotesText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: Fonts.inter,
    marginTop: 4,
    fontStyle: 'italic',
  },
  sectionCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    borderRadius: 20,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: Spacing.two,
  },
  descriptorsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  descriptorBadge: {
    backgroundColor: 'rgba(217, 4, 41, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(217, 4, 41, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  descriptorBadgeText: {
    color: '#FFA8A8',
    fontSize: 11,
    fontFamily: Fonts.inter,
  },
  feedbackText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    lineHeight: 20,
    fontFamily: Fonts.inter,
  },
  notFoundBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  notFoundText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: Fonts.spaceGroteskBold,
  },
  backBtnPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  backBtnPillText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Fonts.manropeBold,
  },
});
