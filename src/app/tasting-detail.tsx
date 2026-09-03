import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  Image,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTranslation } from '@/context/language-context';
import { useAuth } from '@/context/auth-context';
import { useTastings } from '@/context/tastings-context';
import { getBJCPStyles } from '@/data/bjcp2021';
import { getQualityTier, OFFICIAL_BJCP_DESCRIPTORS } from '@/types/tasting';
import { ScoreDial } from '@/components/score-dial';
import { BottomTabInset, Fonts, Spacing, MaxContentWidth } from '@/constants/theme';
import { shareTastingFile, shareTastingText } from '@/services/tasting-share-service';
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

function ShareIconSvg({ size = 16, color = '#F2B824' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 15V3m0 0L7.5 7.5M12 3l4.5 4.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function EditIconSvg({ size = 16, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function TrashIconSvg({ size = 16, color = '#FF5C5C' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line x1="10" y1="11" x2="10" y2="17" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Line x1="14" y1="11" x2="14" y2="17" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function WhatsAppIconSvg({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
        stroke="#FFFFFF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.5 8.5c-.3-.7-.6-.7-.9-.7s-.6 0-.9.3-.9.9-.9 2.2 1 2.6 1.1 2.8 1.9 3.1 4.7 4.2c2.4 1 2.8.7 3.3.6s1.6-.7 1.8-1.3.2-1.2.1-1.3-.3-.2-.7-.4-2.3-1.1-2.6-1.3-.6-.2-.9.2-1 1.3-1.2 1.5-.4.2-.8 0a10.1 10.1 0 0 1-3-1.8 11.1 11.1 0 0 1-2.1-2.6c-.2-.4 0-.6.2-.8s.4-.4.6-.6.3-.4.4-.6 0-.4-.1-.6l-.9-2.1z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

function ScoresheetFileIconSvg({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        stroke="#0A0C10"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M14 2v6h6" stroke="#0A0C10" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1={16} y1={13} x2={8} y2={13} stroke="#0A0C10" strokeWidth={2} strokeLinecap="round" />
      <Line x1={16} y1={17} x2={8} y2={17} stroke="#0A0C10" strokeWidth={2} strokeLinecap="round" />
      <Line x1={10} y1={9} x2={8} y2={9} stroke="#0A0C10" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function MagnifierSvg({ size = 14 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={7} stroke="#FFFFFF" strokeWidth={2} strokeOpacity={0.85} />
      <Line x1={16.5} y1={16.5} x2={21} y2={21} stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeOpacity={0.85} />
    </Svg>
  );
}

export default function TastingDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id, justSaved } = useLocalSearchParams<{ id: string; justSaved?: string }>();
  const { t, language } = useTranslation();
  const { profile } = useAuth();
  const { getTastingById, deleteTasting } = useTastings();

  const tasting = getTastingById(id || '');
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<{ uri: string; title: string } | null>(null);
  const [showSavedToast, setShowSavedToast] = useState(justSaved === 'true');

  useEffect(() => {
    if (justSaved === 'true') {
      setShowSavedToast(true);
      const timer = setTimeout(() => {
        setShowSavedToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [justSaved]);

  // Estado de secciones desplegables (todas abiertas por defecto para lectura inmediata)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    aroma: true,
    appearance: true,
    flavor: true,
    mouthfeel: true,
    overall: true,
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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

  // Verificar si la cata fue evaluada por otro juez externo
  const isExternalJudge =
    tasting.judgeName &&
    tasting.judgeName !== profile?.fullName &&
    tasting.judgeName !== 'Juez en Formación' &&
    tasting.judgeName !== 'Judge in Training';

  const safeBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/tastings' as any);
    }
  };

  const handleShare = () => {
    Alert.alert(
      language === 'es' ? '📤 Compartir Ficha de Cata' : '📤 Share BJCP Scoresheet',
      language === 'es'
        ? 'Elige cómo deseas compartir esta evaluación:'
        : 'Choose how you want to share this evaluation:',
      [
        {
          text: language === 'es' ? '💬 Resumen para WhatsApp / Redes' : '💬 WhatsApp / Text Summary',
          onPress: () => shareTastingText(tasting, profile, language),
        },
        {
          text: language === 'es' ? '📱 Enviar Ficha Completa (.bjcptasting)' : '📱 Send Full Scoresheet (.bjcptasting)',
          onPress: () => shareTastingFile(tasting, profile, language),
        },
        { text: language === 'es' ? 'Cancelar' : 'Cancel', style: 'cancel' },
      ]
    );
  };

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
            safeBack();
          },
        },
      ]
    );
  };

  const attrs = tasting.structuredAttributes || {};

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        
        {/* 1. Header Line: Clean Title 'Scoresheet' matching Settings style */}
        <View style={styles.header}>
          <Pressable 
            onPress={safeBack} 
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <ThemedText style={styles.backText}>‹</ThemedText>
          </Pressable>
          <ThemedText style={styles.title}>
            {language === 'es' ? 'Ficha de Cata' : 'Scoresheet'}
          </ThemedText>
          <View style={{ width: 40 }} />
        </View>

        {/* 2. Second Line Action Bar: Icon-only buttons aligned to the right */}
        <View style={styles.actionBar}>
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [styles.iconActionButton, styles.shareIconBtn, pressed && styles.pressed]}
            hitSlop={6}
          >
            <ShareIconSvg size={14} color="#F2B824" />
          </Pressable>

          {!isExternalJudge && (
            <Pressable
              onPress={() => router.push({ pathname: '/judge-simulator' as any, params: { editId: tasting.id } })}
              style={({ pressed }) => [styles.iconActionButton, pressed && styles.pressed]}
              hitSlop={6}
            >
              <EditIconSvg size={14} color="#FFFFFF" />
            </Pressable>
          )}

          <Pressable
            onPress={handleDelete}
            style={({ pressed }) => [styles.iconActionButton, styles.deleteIconBtn, pressed && styles.pressed]}
            hitSlop={6}
          >
            <TrashIconSvg size={14} color="#FF6B6B" />
          </Pressable>
        </View>

        {/* Floating Toast Notification on Save */}
        {showSavedToast && (
          <View style={styles.savedToastContainer}>
            <ThemedText style={styles.savedToastIcon}>✨</ThemedText>
            <View style={styles.savedToastContent}>
              <ThemedText style={styles.savedToastTitle}>
                {language === 'es' ? '¡Cata Guardada con Éxito!' : 'Tasting Saved Successfully!'}
              </ThemedText>
              <ThemedText style={styles.savedToastSub}>
                {tasting.beerName} • {tasting.totalScore}/50 pts
              </ThemedText>
            </View>
            <Pressable
              onPress={() => setShowSavedToast(false)}
              hitSlop={10}
              style={styles.savedToastCloseBtn}
            >
              <ThemedText style={styles.savedToastCloseText}>✕</ThemedText>
            </Pressable>
          </View>
        )}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* External Evaluator Judge Card (Only shown if created by another judge) */}
          {isExternalJudge && (
            <View style={styles.externalJudgeCard}>
              <View style={styles.externalJudgeAvatar}>
                {tasting.judgeAvatarUrl ? (
                  <Image source={{ uri: tasting.judgeAvatarUrl }} style={styles.externalJudgeAvatarImg} />
                ) : (
                  <ThemedText style={styles.externalJudgeAvatarText}>
                    {tasting.judgeName?.charAt(0).toUpperCase()}
                  </ThemedText>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.externalJudgeLabel}>
                  {language === 'es' ? 'FICHA RECIBIDA • JUEZ EVALUADOR' : 'RECEIVED SCORESHEET • EVALUATOR'}
                </ThemedText>
                <ThemedText style={styles.externalJudgeName}>
                  {tasting.judgeName}
                </ThemedText>
                <ThemedText style={styles.externalJudgeRank}>
                  {tasting.judgeRank || 'Apprentice'} {tasting.judgeId ? `• ID: ${tasting.judgeId}` : ''}
                </ThemedText>
              </View>
            </View>
          )}

          {/* Hero Banner with Photo and Score */}
          <View style={styles.heroCard}>
            {tasting.photoUrl && tasting.labelPhotoUrl ? (
              <View style={styles.dualPhotoHeroRow}>
                <Pressable
                  onPress={() =>
                    setSelectedPhotoModal({
                      uri: tasting.photoUrl!,
                      title: `${tasting.beerName} (${language === 'es' ? 'Vaso' : 'Glass'})`,
                    })
                  }
                  style={({ pressed }) => [styles.dualPhotoWrapper, pressed && { opacity: 0.9 }]}
                >
                  <Image source={{ uri: tasting.photoUrl }} style={styles.dualPhotoImage} />
                  <View style={styles.zoomHintBadge}>
                    <MagnifierSvg size={13} />
                  </View>
                </Pressable>
                <Pressable
                  onPress={() =>
                    setSelectedPhotoModal({
                      uri: tasting.labelPhotoUrl!,
                      title: `${tasting.beerName} (${language === 'es' ? 'Etiqueta' : 'Label'})`,
                    })
                  }
                  style={({ pressed }) => [styles.dualPhotoWrapper, pressed && { opacity: 0.9 }]}
                >
                  <Image source={{ uri: tasting.labelPhotoUrl }} style={styles.dualPhotoImage} />
                  <View style={styles.zoomHintBadge}>
                    <MagnifierSvg size={13} />
                  </View>
                </Pressable>
              </View>
            ) : tasting.photoUrl ? (
              <Pressable
                onPress={() =>
                  setSelectedPhotoModal({
                    uri: tasting.photoUrl!,
                    title: `${tasting.beerName} (${language === 'es' ? 'Vaso' : 'Glass'})`,
                  })
                }
                style={({ pressed }) => [styles.singlePhotoHeroWrapper, pressed && { opacity: 0.9 }]}
              >
                <Image source={{ uri: tasting.photoUrl }} style={styles.singlePhotoImage} />
                <View style={styles.zoomHintBadge}>
                  <MagnifierSvg size={13} />
                </View>
              </Pressable>
            ) : tasting.labelPhotoUrl ? (
              <Pressable
                onPress={() =>
                  setSelectedPhotoModal({
                    uri: tasting.labelPhotoUrl!,
                    title: `${tasting.beerName} (${language === 'es' ? 'Etiqueta' : 'Label'})`,
                  })
                }
                style={({ pressed }) => [styles.singlePhotoHeroWrapper, pressed && { opacity: 0.9 }]}
              >
                <Image source={{ uri: tasting.labelPhotoUrl }} style={styles.singlePhotoImage} />
                <View style={styles.zoomHintBadge}>
                  <MagnifierSvg size={13} />
                </View>
              </Pressable>
            ) : null}

            {/* Beer Information Header */}
            <View style={styles.beerInfoContainer}>
              <View style={styles.beerTitleRow}>
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.beerName}>{tasting.beerName}</ThemedText>
                  {tasting.brewery ? (
                    <ThemedText style={styles.brewery}>
                      {tasting.brewery} {tasting.vintageOrBatch ? `• ${tasting.vintageOrBatch}` : ''}
                    </ThemedText>
                  ) : null}
                </View>
              </View>

              <View style={styles.styleBadgeRow}>
                <Pressable
                  onPress={() => router.push(`/style/${tasting.styleId}` as any)}
                  style={({ pressed }) => [styles.stylePill, pressed && { opacity: 0.8 }]}
                >
                  <ThemedText style={styles.stylePillId}>{tasting.styleId}</ThemedText>
                  <ThemedText style={styles.stylePillName} numberOfLines={1}>
                    {tasting.styleName}
                  </ThemedText>
                  <ThemedText style={styles.styleGuideHint}>
                    {language === 'es' ? '📖 Guía' : '📖 Guide'}
                  </ThemedText>
                </Pressable>
                <ThemedText style={styles.dateText}>{formattedDate}</ThemedText>
              </View>
            </View>

            {/* Score Dial & Quality Tier Banner */}
            <View style={styles.scoreDialContainer}>
              <ScoreDial score={tasting.totalScore} maxScore={50} size={130} language={language} />
              <View style={styles.scoreDetails}>
                <View style={[styles.qualityPill, { backgroundColor: quality.color + '25', borderColor: quality.color }]}>
                  <ThemedText style={[styles.qualityPillText, { color: quality.color }]}>
                    {language === 'es' ? quality.label_es : quality.label_en}
                  </ThemedText>
                </View>
                <ThemedText style={styles.qualityRangeText}>{quality.range} pts</ThemedText>
              </View>
            </View>
          </View>

          {/* 3. Sensory 50-Points Breakdown in exact evaluation order (Appearance -> Aroma -> Flavor -> Mouthfeel -> Overall) */}
          <View style={styles.sectionCard}>
            <ThemedText style={styles.sectionHeaderTitle}>
              {language === 'es' ? 'DESGLOSE SENSORIAL DE 50 PUNTOS & DESCRIPTORES' : '50-POINT SENSORY BREAKDOWN & DESCRIPTORS'}
            </ThemedText>

            {/* 1. APARIENCIA / ASPECTO (0 - 3) */}
            <CollapsibleBreakdownRow
              label={language === 'es' ? 'Apariencia / Aspecto' : 'Appearance'}
              score={tasting.scoresheet.appearanceScore}
              max={3}
              notes={tasting.scoresheet.appearanceNotes}
              color="#52B788"
              isExpanded={!!expandedSections.appearance}
              onToggle={() => toggleSection('appearance')}
              language={language}
            >
              <MiniScaleBar
                label={language === 'es' ? 'Color' : 'Color'}
                options={language === 'es' ? ['Muy Clara', 'Apropiado', 'Muy Oscuro'] : ['Very Pale', 'Appropriate', 'Very Dark']}
                value={attrs.appearanceColor ?? 0.5}
                color="#52B788"
              />
              <MiniScaleBar
                label={language === 'es' ? 'Claridad' : 'Clarity'}
                options={language === 'es' ? ['Cristalina', 'Apropiada', 'Turbia'] : ['Brilliant', 'Appropriate', 'Hazy']}
                value={attrs.appearanceClarity ?? 0.5}
                color="#52B788"
              />
              <MiniScaleBar
                label={language === 'es' ? 'Espuma' : 'Head'}
                options={language === 'es' ? ['Baja', 'Apropiada', 'Persistente'] : ['Low', 'Appropriate', 'Persistent']}
                value={attrs.appearanceHead ?? 0.5}
                color="#52B788"
              />
            </CollapsibleBreakdownRow>

            {/* 2. AROMA (0 - 12) */}
            <CollapsibleBreakdownRow
              label={language === 'es' ? 'Aroma' : 'Aroma'}
              score={tasting.scoresheet.aromaScore}
              max={12}
              notes={tasting.scoresheet.aromaNotes}
              color="#F2B824"
              isExpanded={!!expandedSections.aroma}
              onToggle={() => toggleSection('aroma')}
              language={language}
            >
              <MiniScaleBar
                label={language === 'es' ? 'Adecuación aromática' : 'Aroma Appropriateness'}
                options={language === 'es' ? ['Apropiada (100%)', 'Desviación Media', 'No Apropiada'] : ['Appropriate (100%)', 'Moderate Flaw', 'Not Appropriate']}
                value={attrs.aromaAppropriate ?? 0.0}
                color="#F2B824"
              />
            </CollapsibleBreakdownRow>

            {/* SABOR (0 - 20) */}
            <CollapsibleBreakdownRow
              label={language === 'es' ? 'Sabor' : 'Flavor'}
              score={tasting.scoresheet.flavorScore}
              max={20}
              notes={tasting.scoresheet.flavorNotes}
              color="#E76F51"
              isExpanded={!!expandedSections.flavor}
              onToggle={() => toggleSection('flavor')}
              language={language}
            >
              <MiniScaleBar
                label={language === 'es' ? 'Dulzor' : 'Sweetness'}
                options={language === 'es' ? ['Muy Bajo', 'Equilibrado', 'Muy Alto'] : ['Very Low', 'Balanced', 'Very High']}
                value={attrs.flavorSweetness ?? 0.5}
                color="#E76F51"
              />
              <MiniScaleBar
                label={language === 'es' ? 'Amargor' : 'Bitterness'}
                options={language === 'es' ? ['Bajo', 'Equilibrado', 'Muy Alto'] : ['Low', 'Balanced', 'Very High']}
                value={attrs.flavorBitterness ?? 0.5}
                color="#E76F51"
              />
              <MiniScaleBar
                label={language === 'es' ? 'Acidez' : 'Acidity'}
                options={language === 'es' ? ['Muy Baja', 'Equilibrada', 'Muy Alta'] : ['Very Low', 'Balanced', 'Very High']}
                value={attrs.flavorAcidity ?? 0.5}
                color="#E76F51"
              />
              <MiniScaleBar
                label={language === 'es' ? 'Duración Retrogusto' : 'Aftertaste Duration'}
                options={language === 'es' ? ['Muy Corto', 'Equilibrado', 'Muy Largo'] : ['Very Short', 'Balanced', 'Very Long']}
                value={attrs.aftertasteDuration ?? 0.5}
                color="#E76F51"
              />
              <MiniScaleBar
                label={language === 'es' ? 'Carácter Retrogusto' : 'Aftertaste Character'}
                options={language === 'es' ? ['Muy Seco', 'Limpio / Agradable', 'Áspero / Astringente'] : ['Very Dry', 'Clean / Pleasant', 'Harsh / Astringent']}
                value={attrs.aftertasteCharacter ?? 0.5}
                color="#E76F51"
              />
              {tasting.scoresheet.aftertasteNotes ? (
                <View style={styles.subNoteBox}>
                  <ThemedText style={styles.subNoteLabel}>
                    {language === 'es' ? 'Retrogusto y Final:' : 'Aftertaste & Finish:'}
                  </ThemedText>
                  <ThemedText style={styles.subNoteText}>
                    "{tasting.scoresheet.aftertasteNotes}"
                  </ThemedText>
                </View>
              ) : null}
            </CollapsibleBreakdownRow>

            {/* SENSACIÓN EN BOCA (0 - 5) */}
            <CollapsibleBreakdownRow
              label={language === 'es' ? 'Sensación en Boca' : 'Mouthfeel'}
              score={tasting.scoresheet.mouthfeelScore}
              max={5}
              notes={tasting.scoresheet.mouthfeelNotes}
              color="#457B9D"
              isExpanded={!!expandedSections.mouthfeel}
              onToggle={() => toggleSection('mouthfeel')}
              language={language}
            >
              <MiniScaleBar
                label={language === 'es' ? 'Cuerpo' : 'Body'}
                options={language === 'es' ? ['Ligero', 'Medio', 'Pleno'] : ['Light', 'Medium', 'Full']}
                value={attrs.mouthfeelBody ?? 0.5}
                color="#457B9D"
              />
              <MiniScaleBar
                label={language === 'es' ? 'Carbonatación' : 'Carbonation'}
                options={language === 'es' ? ['Baja', 'Media', 'Alta'] : ['Low', 'Medium', 'High']}
                value={attrs.mouthfeelCarbonation ?? 0.5}
                color="#457B9D"
              />
              <MiniScaleBar
                label={language === 'es' ? 'Calidez de Alcohol' : 'Alcohol Warmth'}
                options={language === 'es' ? ['Imperceptible', 'Apropiada', 'Muy Caliente'] : ['Imperceptible', 'Appropriate', 'Hot / Harsh']}
                value={attrs.mouthfeelAlcohol ?? 0.5}
                color="#457B9D"
              />
            </CollapsibleBreakdownRow>

            {/* IMPRESIÓN GENERAL (0 - 10) */}
            <CollapsibleBreakdownRow
              label={language === 'es' ? 'Impresión General' : 'Overall Impression'}
              score={tasting.scoresheet.overallScore}
              max={10}
              notes={tasting.scoresheet.overallNotes}
              color="#A855F7"
              isExpanded={!!expandedSections.overall}
              onToggle={() => toggleSection('overall')}
              language={language}
            >
              <MiniScaleBar
                label={language === 'es' ? 'Calidad Técnica' : 'Technical Quality'}
                options={language === 'es' ? ['Excelente', 'Bueno', 'Necesita Mejoras'] : ['Excellent', 'Good', 'Needs Work']}
                value={attrs.generalTechnicalQuality ?? 0.25}
                color="#A855F7"
              />
              <MiniScaleBar
                label={language === 'es' ? 'Representación del Estilo' : 'Style Representation'}
                options={language === 'es' ? ['Muy Representativa', 'Algo Representativa', 'No Representativa'] : ['True to Style', 'Somewhat True', 'Not True to Style']}
                value={attrs.generalStyleRepresentation ?? 0.0}
                color="#A855F7"
              />
              {attrs.generalRelativeStrength ? (
                <View style={styles.flightStrengthRow}>
                  <ThemedText style={styles.flightStrengthLabel}>
                    {language === 'es' ? 'Fuerza en la Mesa:' : 'Flight Standing:'}
                  </ThemedText>
                  <View style={styles.flightStrengthPill}>
                    <ThemedText style={styles.flightStrengthPillText}>
                      {attrs.generalRelativeStrength === 'top3'
                        ? language === 'es' ? '🏆 Top 3 - Medallista' : '🏆 Top 3 - Medal Contender'
                        : attrs.generalRelativeStrength === 'cut'
                        ? language === 'es' ? '🥈 Casi alcanza el corte' : '🥈 Near Cut / Mini-BOS'
                        : attrs.generalRelativeStrength === 'middle'
                        ? language === 'es' ? '📊 Mitad del grupo' : '📊 Middle of Flight'
                        : language === 'es' ? '📉 Final del grupo' : '📉 Bottom of Flight'}
                    </ThemedText>
                  </View>
                </View>
              ) : null}
            </CollapsibleBreakdownRow>
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

        {/* Fullscreen Pinch-to-Zoom Lightbox Modal */}
        <Modal
          visible={!!selectedPhotoModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedPhotoModal(null)}
        >
          <ThemedView style={styles.lightboxContainer}>
            <StatusBar style="light" />
            
            {/* Top Bar with Explicit Safe Insets avoiding Dynamic Island / Notch */}
            <View style={[styles.lightboxHeader, { paddingTop: Math.max(insets.top, 48) + 8 }]}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <ThemedText style={styles.lightboxTitle} numberOfLines={1}>
                  {selectedPhotoModal?.title}
                </ThemedText>
                <ThemedText style={styles.lightboxHint}>
                  {language === 'es' ? 'Pellizca con dos dedos para hacer zoom' : 'Pinch with two fingers to zoom'}
                </ThemedText>
              </View>
              <Pressable
                onPress={() => setSelectedPhotoModal(null)}
                style={({ pressed }) => [styles.lightboxCloseBtn, pressed && { opacity: 0.7 }]}
                hitSlop={16}
              >
                <ThemedText style={styles.lightboxCloseText}>✕</ThemedText>
              </Pressable>
            </View>

            <ScrollView
              style={styles.zoomScrollView}
              contentContainerStyle={styles.zoomScrollContent}
              maximumZoomScale={5.0}
              minimumZoomScale={1.0}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              centerContent={true}
              bouncesZoom={true}
            >
              {selectedPhotoModal?.uri ? (
                <Image
                  source={{ uri: selectedPhotoModal.uri }}
                  style={styles.fullScreenImage}
                  resizeMode="contain"
                />
              ) : null}
            </ScrollView>

            {/* Bottom Safe Bar with Floating Close Pill */}
            <View style={[styles.lightboxBottomBar, { paddingBottom: Math.max(insets.bottom, 20) + 10 }]}>
              <Pressable
                onPress={() => setSelectedPhotoModal(null)}
                style={({ pressed }) => [styles.lightboxBottomDismissBtn, pressed && { opacity: 0.8 }]}
              >
                <ThemedText style={styles.lightboxBottomDismissText}>
                  ✕ {language === 'es' ? 'Cerrar Foto' : 'Close Photo'}
                </ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </Modal>
      </SafeAreaView>
    </ThemedView>
  );
}

function CollapsibleBreakdownRow({
  label,
  score,
  max,
  notes,
  color,
  isExpanded,
  onToggle,
  language,
  children,
}: {
  label: string;
  score: number;
  max: number;
  notes?: string;
  color: string;
  isExpanded: boolean;
  onToggle: () => void;
  language: 'es' | 'en';
  children?: React.ReactNode;
}) {
  const percentage = Math.min(100, Math.max(0, (score / max) * 100));

  return (
    <View style={styles.breakdownRowCard}>
      <Pressable onPress={onToggle} style={styles.breakdownHeaderPressable}>
        <View style={styles.breakdownHeaderRow}>
          <View style={styles.breakdownTitleGroup}>
            <ThemedText style={styles.breakdownLabel}>{label}</ThemedText>
            <ThemedText style={styles.expandChevron}>{isExpanded ? '▴' : '▾'}</ThemedText>
          </View>
          <ThemedText style={styles.breakdownScore}>
            {score} <ThemedText style={styles.breakdownMax}>/ {max}</ThemedText>
          </ThemedText>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
        </View>
      </Pressable>

      {isExpanded && (
        <View style={styles.breakdownDrawer}>
          {notes ? (
            <View style={styles.notesBox}>
              <ThemedText style={styles.notesQuoteBar} />
              <ThemedText style={styles.breakdownNotesText}>"{notes}"</ThemedText>
            </View>
          ) : (
            <ThemedText style={styles.noNotesText}>
              {language === 'es' ? 'Sin comentarios registrados.' : 'No notes recorded.'}
            </ThemedText>
          )}

          {children ? <View style={styles.miniScalesWrapper}>{children}</View> : null}
        </View>
      )}
    </View>
  );
}

function MiniScaleBar({
  label,
  options,
  value = 0.5,
  color = '#F2B824',
}: {
  label: string;
  options: string[];
  value?: number;
  color?: string;
}) {
  const safeVal = Math.max(0, Math.min(1, typeof value === 'number' ? value : 0.5));
  const percent = Math.min(94, Math.max(6, safeVal * 100));

  return (
    <View style={styles.miniScaleContainer}>
      <ThemedText style={styles.miniScaleLabel}>{label}</ThemedText>
      <View style={styles.miniScaleTrackWrapper}>
        <View style={styles.miniScaleTrack}>
          <View style={[styles.miniScaleFill, { width: `${percent}%`, backgroundColor: color + '40' }]} />
          <View style={[styles.miniScalePin, { left: `${percent}%`, backgroundColor: color }]} />
        </View>
      </View>
      <View style={styles.miniScaleLabelsRow}>
        <ThemedText style={[styles.miniScaleOption, safeVal < 0.35 && styles.miniScaleOptionActive]}>
          {options[0]}
        </ThemedText>
        <ThemedText style={[styles.miniScaleOption, safeVal >= 0.35 && safeVal <= 0.65 && styles.miniScaleOptionActive]}>
          {options[1]}
        </ThemedText>
        <ThemedText style={[styles.miniScaleOption, safeVal > 0.65 && styles.miniScaleOptionActive]}>
          {options[2]}
        </ThemedText>
      </View>
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
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    marginBottom: Spacing.one,
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  pressed: {
    opacity: 0.7,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    fontFamily: Fonts.spaceGroteskBold,
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    gap: 8,
    marginTop: 2,
    marginBottom: Spacing.three,
  },
  iconActionButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  shareIconBtn: {
    backgroundColor: 'rgba(242, 184, 36, 0.15)',
    borderColor: 'rgba(242, 184, 36, 0.35)',
  },
  deleteIconBtn: {
    backgroundColor: 'rgba(255, 92, 92, 0.12)',
    borderColor: 'rgba(255, 92, 92, 0.25)',
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.six,
    gap: Spacing.three,
  },
  externalJudgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: 'rgba(242, 184, 36, 0.35)',
    gap: Spacing.three,
  },
  externalJudgeAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2B824',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  externalJudgeAvatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  externalJudgeAvatarText: {
    fontSize: 18,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#0A0C10',
  },
  externalJudgeLabel: {
    fontSize: 9,
    fontFamily: Fonts.manropeBold,
    color: '#F2B824',
    letterSpacing: 0.5,
  },
  externalJudgeName: {
    fontSize: 15,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#FFFFFF',
    marginTop: 1,
  },
  externalJudgeRank: {
    fontSize: 11,
    fontFamily: Fonts.inter,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  heroCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    borderRadius: 20,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: Spacing.three,
  },
  dualPhotoHeroRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  dualPhotoWrapper: {
    flex: 1,
    aspectRatio: 3 / 4,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  dualPhotoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  singlePhotoHeroWrapper: {
    width: '100%',
    aspectRatio: 3 / 4,
    maxHeight: 280,
    alignSelf: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  singlePhotoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  beerInfoContainer: {
    gap: Spacing.one,
  },
  beerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  beerName: {
    fontSize: 22,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#FFFFFF',
  },
  brewery: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: Fonts.inter,
    marginTop: 2,
  },
  styleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  stylePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 6,
    flex: 1,
    marginRight: 10,
  },
  stylePillId: {
    color: '#F2B824',
    fontSize: 12,
    fontFamily: Fonts.spaceGroteskBold,
    fontWeight: '800',
  },
  stylePillName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: Fonts.inter,
    fontWeight: '600',
    flex: 1,
  },
  styleGuideHint: {
    fontSize: 10,
    color: '#F2B824',
    fontFamily: Fonts.manropeBold,
  },
  dateText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: Fonts.inter,
  },
  scoreDialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: Spacing.two,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    borderRadius: 16,
  },
  scoreDetails: {
    alignItems: 'center',
    gap: 6,
  },
  qualityPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  qualityPillText: {
    fontSize: 13,
    fontFamily: Fonts.spaceGroteskBold,
    textTransform: 'uppercase',
  },
  qualityRangeText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: Fonts.inter,
  },
  sectionCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    borderRadius: 20,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: Spacing.two,
  },
  sectionHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: Fonts.manropeBold,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  breakdownRowCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  breakdownHeaderPressable: {
    padding: Spacing.three,
    gap: 6,
  },
  breakdownHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  breakdownLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Fonts.spaceGroteskBold,
  },
  expandChevron: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
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
  breakdownDrawer: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 8,
    gap: 10,
  },
  notesBox: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 10,
    borderRadius: 10,
  },
  notesQuoteBar: {
    width: 3,
    height: '100%',
    backgroundColor: '#F2B824',
    borderRadius: 1.5,
  },
  breakdownNotesText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12.5,
    lineHeight: 18,
    fontFamily: Fonts.inter,
    fontStyle: 'italic',
    flex: 1,
  },
  noNotesText: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 11,
    fontFamily: Fonts.inter,
    fontStyle: 'italic',
    paddingVertical: 2,
  },
  miniScalesWrapper: {
    gap: 8,
    marginTop: 4,
  },
  miniScaleContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 3,
  },
  miniScaleLabel: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    fontFamily: Fonts.spaceGroteskBold,
  },
  miniScaleTrackWrapper: {
    paddingVertical: 3,
  },
  miniScaleTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    position: 'relative',
    overflow: 'visible',
  },
  miniScaleFill: {
    height: '100%',
    borderRadius: 2,
  },
  miniScalePin: {
    position: 'absolute',
    top: -3,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    transform: [{ translateX: -5 }],
  },
  miniScaleLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  miniScaleOption: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 9.5,
    fontFamily: Fonts.inter,
  },
  miniScaleOptionActive: {
    color: '#F2B824',
    fontWeight: 'bold',
  },
  subNoteBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 8,
    borderRadius: 8,
    gap: 2,
    marginTop: 2,
  },
  subNoteLabel: {
    fontSize: 10,
    fontFamily: Fonts.manropeBold,
    color: '#F2B824',
  },
  subNoteText: {
    fontSize: 11.5,
    fontFamily: Fonts.inter,
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  flightStrengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 8,
    borderRadius: 8,
    marginTop: 2,
  },
  flightStrengthLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
    fontFamily: Fonts.inter,
  },
  flightStrengthPill: {
    backgroundColor: 'rgba(242, 184, 36, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(242, 184, 36, 0.4)',
  },
  flightStrengthPillText: {
    fontSize: 10,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#F2B824',
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
  zoomHintBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  lightboxContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  lightboxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    zIndex: 20,
  },
  lightboxTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: Fonts.spaceGroteskBold,
  },
  lightboxHint: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 11,
    fontFamily: Fonts.inter,
    marginTop: 2,
  },
  lightboxCloseBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  lightboxCloseText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  zoomScrollView: {
    flex: 1,
  },
  zoomScrollContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  fullScreenImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.78,
  },
  lightboxBottomBar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingTop: 10,
    zIndex: 20,
  },
  lightboxBottomDismissBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  lightboxBottomDismissText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: Fonts.spaceGroteskBold,
  },

  // Toast Banner Styles
  savedToastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderColor: '#52B788',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: Spacing.four,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
    gap: 10,
  },
  savedToastIcon: {
    fontSize: 20,
  },
  savedToastContent: {
    flex: 1,
  },
  savedToastTitle: {
    color: '#52B788',
    fontSize: 13,
    fontFamily: Fonts.spaceGroteskBold,
  },
  savedToastSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontFamily: Fonts.inter,
    marginTop: 1,
  },
  savedToastCloseBtn: {
    padding: 4,
  },
  savedToastCloseText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
