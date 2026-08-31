import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Alert,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTranslation } from '@/context/language-context';
import { usePurchases } from '@/context/purchases-context';
import { useTastings } from '@/context/tastings-context';
import { getBJCPStyles, BeerStyle } from '@/data/bjcp2021';
import { fuzzyMatch } from '@/utils/fuzzy';
import {
  TastingScoresheet,
  StructuredAttributes,
  calculateTotalScore,
  getQualityTier,
} from '@/types/tasting';
import { ScoreDial } from '@/components/score-dial';
import {
  AttributeScale,
  RadioGroup,
  CategoryScoreSlider,
} from '@/components/attribute-scale';
import { BottomTabInset, Fonts, Spacing, MaxContentWidth } from '@/constants/theme';
import Svg, { Path, Rect, Circle, Line } from 'react-native-svg';

function CameraIconSvg({ size = 26, color = '#F2B824' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Camera Body */}
      <Path
        d="M4 7h3l1.5-2.5h7L17 7h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"
        fill="rgba(255, 255, 255, 0.12)"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Lens outer circle */}
      <Circle cx={12} cy={14} r={4.2} stroke={color} strokeWidth={1.6} fill="rgba(22, 27, 34, 0.7)" />
      {/* Lens center / glass reflection */}
      <Circle cx={12} cy={14} r={2} fill={color} />
      {/* Flash lamp */}
      <Circle cx={18} cy={10} r={1} fill="#FFE082" />
    </Svg>
  );
}

function GlassIconSvg({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Tulip glass body */}
      <Path
        d="M7 3h10c0 4-1.5 7.5-4 8.5v5.5h3v2H8v-2h3V11.5C8.5 10.5 7 7 7 3z"
        fill="#F2B824"
        stroke="#E5A81E"
        strokeWidth={1.2}
      />
      {/* White foam */}
      <Path
        d="M7 3c0-1 1-1.5 2.5-1.5S11 2 12 1.5s1.5 0 2.5.5S17 2 17 3H7z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

function LabelIconSvg({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Price / Bottle Tag */}
      <Path
        d="M3 11V4a1 1 0 0 1 1-1h7l10 10-8 8L3 11z"
        fill="#52B788"
        stroke="#3E9B6E"
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      {/* Hole */}
      <Circle cx={7.5} cy={7.5} r={1.8} fill="#161B22" />
      {/* Lines on tag */}
      <Line x1={11} y1={12} x2={16} y2={17} stroke="rgba(255, 255, 255, 0.6)" strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  );
}

export default function JudgeSimulatorScreen() {
  const { t, language } = useTranslation();
  const { isPro } = usePurchases();
  const { saveTasting, getTastingById } = useTastings();
  const params = useLocalSearchParams<{ styleId?: string; editId?: string }>();

  // Check PRO
  useEffect(() => {
    if (!isPro) {
      router.replace('/paywall' as any);
    }
  }, [isPro]);

  const allStyles = getBJCPStyles(language);

  // States
  const [selectedStyle, setSelectedStyle] = useState<BeerStyle | null>(null);
  const [beerName, setBeerName] = useState('');
  const [brewery, setBrewery] = useState('');
  const [vintageOrBatch, setVintageOrBatch] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
  const [labelPhotoUri, setLabelPhotoUri] = useState<string | undefined>(undefined);

  // 50-Points Scoresheet State
  const [scoresheet, setScoresheet] = useState<TastingScoresheet>({
    appearanceScore: 3,
    appearanceNotes: '',
    aromaScore: 9,
    aromaNotes: '',
    flavorScore: 15,
    flavorNotes: '',
    mouthfeelScore: 4,
    mouthfeelNotes: '',
    aftertasteNotes: '',
    overallScore: 7,
    overallNotes: '',
  });

  // Structured Scale Attributes (Beer Awards Platform / BJCP Structured)
  const [structuredAttributes, setStructuredAttributes] = useState<StructuredAttributes>({
    appearanceColor: 0.5, // 0.5 = 100% Apropiada
    appearanceClarity: 0.5, // 0.5 = 100% Apropiada
    appearanceHead: 0.5, // 0.5 = 100% Apropiada
    aromaAppropriate: 0.0, // 0.0 = 100% Apropiada
    flavorSweetness: 0.5, // 0.5 = 100% Apropiada
    flavorBitterness: 0.5, // 0.5 = 100% Apropiada
    flavorAcidity: 0.5, // 0.5 = 100% Apropiada
    mouthfeelAlcohol: 0.5, // 0.5 = 100% Apropiada
    mouthfeelCarbonation: 0.5, // 0.5 = 100% Apropiada
    mouthfeelBody: 0.5, // 0.5 = 100% Apropiada
    aftertasteDuration: 0.5, // 0.5 = 100% Apropiada / Equilibrado
    aftertasteCharacter: 0.5, // 0.5 = 100% Limpio / Agradable
    generalTechnicalQuality: 0.25, // 0.0 = Excelente, 0.25 = Muy Bueno...
    generalStyleRepresentation: 0.0, // 0.0 = Muy representativa
    generalRelativeStrength: 'cut', // Casi alcanza el corte
  });

  // Modals
  const [stylePickerVisible, setStylePickerVisible] = useState(false);
  const [styleSearchQuery, setStyleSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load existing data if editing or pre-selecting style
  useEffect(() => {
    if (params.editId) {
      const existing = getTastingById(params.editId);
      if (existing) {
        setBeerName(existing.beerName);
        setBrewery(existing.brewery);
        setVintageOrBatch(existing.vintageOrBatch || '');
        setPhotoUri(existing.photoUrl);
        setLabelPhotoUri(existing.labelPhotoUrl);
        setScoresheet(existing.scoresheet);
        if (existing.structuredAttributes) {
          setStructuredAttributes(existing.structuredAttributes);
        }
        const st = allStyles.find((s) => s.id === existing.styleId);
        if (st) setSelectedStyle(st);
      }
    } else if (params.styleId) {
      const st = allStyles.find((s) => s.id.toLowerCase() === params.styleId?.toLowerCase());
      if (st) setSelectedStyle(st);
    } else if (!selectedStyle && allStyles.length > 0) {
      // Default to 21A American IPA as reference
      const defaultSt = allStyles.find((s) => s.id === '21A') || allStyles[0];
      setSelectedStyle(defaultSt);
    }
  }, [params.editId, params.styleId]);

  const totalScore = calculateTotalScore(scoresheet);
  const quality = getQualityTier(totalScore);

  // Photo handlers
  const handlePickImage = async (target: 'glass' | 'label') => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          language === 'es' ? 'Permiso requerido' : 'Permission needed',
          language === 'es'
            ? 'Necesitamos acceso a la galería para añadir fotos de cervezas.'
            : 'We need camera roll permissions to add beer photos.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        if (target === 'glass') {
          setPhotoUri(result.assets[0].uri);
        } else {
          setLabelPhotoUri(result.assets[0].uri);
        }
      }
    } catch {
      Alert.alert(
        language === 'es' ? 'Error' : 'Error',
        language === 'es'
          ? 'No se pudo abrir la galería de fotos.'
          : 'Could not open the photo library.'
      );
    }
  };

  const handleTakePhoto = async (target: 'glass' | 'label') => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          language === 'es' ? 'Permiso requerido' : 'Permission needed',
          language === 'es'
            ? 'Necesitamos acceso a la cámara para fotografiar la cerveza.'
            : 'We need camera permissions to take a beer photo.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        if (target === 'glass') {
          setPhotoUri(result.assets[0].uri);
        } else {
          setLabelPhotoUri(result.assets[0].uri);
        }
      }
    } catch {
      Alert.alert(
        language === 'es' ? 'Error' : 'Error',
        language === 'es'
          ? 'No se pudo activar la cámara.'
          : 'Could not activate the camera.'
      );
    }
  };

  const promptPhotoAction = (target: 'glass' | 'label') => {
    const isGlass = target === 'glass';
    const currentUri = isGlass ? photoUri : labelPhotoUri;
    const title = isGlass
      ? (language === 'es' ? 'Foto de la Cerveza Servida' : 'Beer in Glass Photo')
      : (language === 'es' ? 'Foto de la Etiqueta / Lata' : 'Label / Bottle Photo');

    Alert.alert(
      title,
      language === 'es' ? 'Selecciona una opción' : 'Select an option',
      [
        { text: t('takePhoto'), onPress: () => handleTakePhoto(target) },
        { text: t('chooseFromGallery'), onPress: () => handlePickImage(target) },
        ...(currentUri
          ? [
              {
                text: t('removePhoto'),
                onPress: () => (isGlass ? setPhotoUri(undefined) : setLabelPhotoUri(undefined)),
                style: 'destructive' as const,
              },
            ]
          : []),
        { text: t('cancel'), style: 'cancel' },
      ]
    );
  };

  const handleScoreValue = (field: keyof TastingScoresheet, value: number) => {
    setScoresheet((prev) => ({ ...prev, [field]: value }));
  };

  // Helper to compute adherence percentage (0.0 to 1.0)
  const getCenterAdherence = (v: number | undefined) => {
    const val = typeof v === 'number' ? v : 0.5;
    return Math.max(0, 1 - 2 * Math.abs(val - 0.5));
  };

  const getStartAdherence = (v: number | undefined) => {
    const val = typeof v === 'number' ? v : 0.0;
    return Math.max(0, 1 - val);
  };

  const handleAttributeChange = (field: keyof StructuredAttributes, val: any) => {
    const updated = { ...structuredAttributes, [field]: val };
    setStructuredAttributes(updated);

    // Automatically recalculate corresponding category score in real time
    if (
      field === 'appearanceColor' ||
      field === 'appearanceClarity' ||
      field === 'appearanceHead'
    ) {
      const adh =
        (getCenterAdherence(updated.appearanceColor) +
          getCenterAdherence(updated.appearanceClarity) +
          getCenterAdherence(updated.appearanceHead)) /
        3;
      setScoresheet((prev) => ({ ...prev, appearanceScore: Math.round(adh * 3) }));
    } else if (field === 'aromaAppropriate') {
      const adh = getStartAdherence(updated.aromaAppropriate);
      setScoresheet((prev) => ({ ...prev, aromaScore: Math.round(adh * 12) }));
    } else if (
      field === 'flavorSweetness' ||
      field === 'flavorBitterness' ||
      field === 'flavorAcidity' ||
      field === 'aftertasteDuration' ||
      field === 'aftertasteCharacter'
    ) {
      const adh =
        (getCenterAdherence(updated.flavorSweetness) +
          getCenterAdherence(updated.flavorBitterness) +
          getCenterAdherence(updated.flavorAcidity) +
          getCenterAdherence(updated.aftertasteDuration) +
          getCenterAdherence(updated.aftertasteCharacter)) /
        5;
      setScoresheet((prev) => ({ ...prev, flavorScore: Math.round(adh * 20) }));
    } else if (
      field === 'mouthfeelAlcohol' ||
      field === 'mouthfeelCarbonation' ||
      field === 'mouthfeelBody'
    ) {
      const adh =
        (getCenterAdherence(updated.mouthfeelAlcohol) +
          getCenterAdherence(updated.mouthfeelCarbonation) +
          getCenterAdherence(updated.mouthfeelBody)) /
        3;
      setScoresheet((prev) => ({ ...prev, mouthfeelScore: Math.round(adh * 5) }));
    } else if (
      field === 'generalTechnicalQuality' ||
      field === 'generalStyleRepresentation'
    ) {
      const adh =
        getStartAdherence(updated.generalTechnicalQuality) * 0.6 +
        getStartAdherence(updated.generalStyleRepresentation) * 0.4;
      setScoresheet((prev) => ({ ...prev, overallScore: Math.round(adh * 10) }));
    }
  };

  const handleSave = async () => {
    if (!beerName.trim()) {
      Alert.alert(
        language === 'es' ? 'Falta el nombre' : 'Name missing',
        language === 'es'
          ? 'Por favor ingresa el nombre de la cerveza a evaluar.'
          : 'Please enter the name of the beer being evaluated.'
      );
      return;
    }

    if (!selectedStyle) {
      Alert.alert(
        language === 'es' ? 'Falta el estilo' : 'Style missing',
        language === 'es'
          ? 'Por favor selecciona el estilo BJCP correspondiente.'
          : 'Please select the corresponding BJCP style.'
      );
      return;
    }

    try {
      setIsSaving(true);
      const saved = await saveTasting({
        id: params.editId,
        styleId: selectedStyle.id,
        styleName: selectedStyle.name,
        beerName: beerName.trim(),
        brewery: brewery.trim(),
        vintageOrBatch: vintageOrBatch.trim(),
        photoUrl: photoUri,
        labelPhotoUrl: labelPhotoUri,
        scoresheet,
        structuredAttributes,
        descriptors: [],
        feedbackNotes: '',
      });

      Alert.alert(
        t('tastingSaved'),
        `${saved.beerName} (${saved.totalScore}/50 - ${language === 'es' ? quality.label_es : quality.label_en})`,
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/tastings' as any);
            },
          },
        ]
      );
    } catch {
      Alert.alert(
        language === 'es' ? 'Error' : 'Error',
        language === 'es' ? 'No se pudo guardar la cata.' : 'Could not save tasting.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const hasUnsavedChanges =
    beerName.trim().length > 0 ||
    brewery.trim().length > 0 ||
    vintageOrBatch.trim().length > 0 ||
    !!photoUri ||
    !!labelPhotoUri ||
    scoresheet.aromaNotes.trim().length > 0 ||
    scoresheet.appearanceNotes.trim().length > 0 ||
    scoresheet.flavorNotes.trim().length > 0 ||
    scoresheet.mouthfeelNotes.trim().length > 0 ||
    scoresheet.overallNotes.trim().length > 0;

  const handleBack = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        language === 'es' ? '¿Salir sin guardar?' : 'Leave without saving?',
        language === 'es'
          ? 'Tienes notas ingresadas en esta cata. Si sales ahora, se perderán los cambios.'
          : 'You have unsaved tasting notes. If you leave now, your entered data will be lost.',
        [
          {
            text: language === 'es' ? 'Continuar Editando' : 'Keep Editing',
            style: 'cancel',
          },
          {
            text: language === 'es' ? 'Descartar y Salir' : 'Discard & Leave',
            style: 'destructive',
            onPress: () => {
              if (router.canGoBack()) router.back();
              else router.replace('/tastings' as any);
            },
          },
        ]
      );
    } else {
      if (router.canGoBack()) router.back();
      else router.replace('/tastings' as any);
    }
  };

  const filteredStylesForPicker = allStyles.filter((s) =>
    fuzzyMatch(styleSearchQuery, [s.id, s.name, s.category])
  );

  return (
    <ThemedView style={styles.container}>
      {/* Disable swipe-back gesture exclusively for this screen */}
      <Stack.Screen
        options={{
          gestureEnabled: false,
          fullScreenGestureEnabled: false,
        }}
      />
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Header */}
        <View style={styles.header}>
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
          >
            <ThemedText style={styles.backBtnText}>←</ThemedText>
          </Pressable>

          <ThemedText style={styles.headerTitle} numberOfLines={1}>
            {params.editId ? t('editTasting') : t('judgeSimulator')}
          </ThemedText>

          <View style={{ width: 38 }} />
        </View>

        {/* Second Line: Sub-header Tool Bar for Off-Flavors & Style Guide */}
        <View style={styles.subHeaderToolBar}>
          <Pressable
            onPress={() => router.push('/offflavors' as any)}
            style={({ pressed }) => [styles.subHeaderToolBtn, pressed && { opacity: 0.8 }]}
          >
            <ThemedText style={styles.subHeaderToolBtnText}>
              {language === 'es' ? '🔬 Defectos (Off-Flavors)' : '🔬 Off-Flavors'}
            </ThemedText>
          </Pressable>

          {selectedStyle && (
            <Pressable
              onPress={() => router.push(`/style/${selectedStyle.id}` as any)}
              style={({ pressed }) => [styles.subHeaderToolBtn, styles.subHeaderGuideBtn, pressed && { opacity: 0.8 }]}
            >
              <ThemedText style={styles.subHeaderGuideBtnText}>
                {language === 'es' ? `📖 Guía BJCP (${selectedStyle.id})` : `📖 BJCP Guide (${selectedStyle.id})`}
              </ThemedText>
            </Pressable>
          )}
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets={true}
        >
          {/* Main Score Hero Card */}
          <View style={styles.heroScoreCard}>
            <ScoreDial score={totalScore} maxScore={50} size={115} language={language} />
            <View style={styles.heroScoreMeta}>
              <ThemedText style={styles.heroBadgeTitle}>
                SCORESHEET
              </ThemedText>
              <ThemedText style={[styles.heroQualityTier, { color: quality.color }]}>
                {language === 'es' ? quality.label_es : quality.label_en}
              </ThemedText>
              <ThemedText style={styles.heroRangeText}>
                {quality.range} pts • {selectedStyle?.id || '—'} {selectedStyle?.name || ''}
              </ThemedText>
              {selectedStyle && (
                <Pressable
                  onPress={() => router.push(`/style/${selectedStyle.id}` as any)}
                  style={({ pressed }) => [styles.heroGuidePill, pressed && { opacity: 0.75 }]}
                >
                  <ThemedText style={styles.heroGuidePillText}>
                    {language === 'es'
                      ? `Ver Guía Completa (${selectedStyle.id}) ➔`
                      : `Open Full Guide (${selectedStyle.id}) ➔`}
                  </ThemedText>
                </Pressable>
              )}
            </View>
          </View>

          {/* Section 1: Beer Info & 2 Photos */}
          <View style={styles.sectionCard}>
            <ThemedText style={styles.sectionHeaderTitle}>
              {language === 'es' ? '1. DATOS DE LA CERVEZA & FOTOS' : '1. BEER DETAILS & PHOTOS'}
            </ThemedText>

            {/* Two Photo Frames: Beer in Glass + Can/Bottle Label */}
            <View style={styles.twoPhotosRow}>
              {/* Photo 1: Beer in Glass */}
              <View style={styles.photoColumn}>
                <View style={styles.photoColumnLabelRow}>
                  <GlassIconSvg size={15} />
                  <ThemedText style={styles.photoColumnLabel}>
                    {language === 'es' ? 'Vaso / Servida' : 'In Glass'}
                  </ThemedText>
                </View>
                <Pressable
                  onPress={() => promptPhotoAction('glass')}
                  style={({ pressed }) => [styles.photoFrameDouble, pressed && { opacity: 0.8 }]}
                >
                  {photoUri ? (
                    <Image source={{ uri: photoUri }} style={styles.photoImage} />
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <CameraIconSvg size={26} color="#F2B824" />
                      <ThemedText style={styles.photoText}>
                        {language === 'es' ? '+ Foto Vaso' : '+ Glass Photo'}
                      </ThemedText>
                    </View>
                  )}
                </Pressable>
              </View>

              {/* Photo 2: Label / Bottle */}
              <View style={styles.photoColumn}>
                <View style={styles.photoColumnLabelRow}>
                  <LabelIconSvg size={15} />
                  <ThemedText style={styles.photoColumnLabel}>
                    {language === 'es' ? 'Etiqueta / Lata' : 'Label / Bottle'}
                  </ThemedText>
                </View>
                <Pressable
                  onPress={() => promptPhotoAction('label')}
                  style={({ pressed }) => [styles.photoFrameDouble, pressed && { opacity: 0.8 }]}
                >
                  {labelPhotoUri ? (
                    <Image source={{ uri: labelPhotoUri }} style={styles.photoImage} />
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <CameraIconSvg size={26} color="#52B788" />
                      <ThemedText style={styles.photoText}>
                        {language === 'es' ? '+ Foto Etiqueta' : '+ Label Photo'}
                      </ThemedText>
                    </View>
                  )}
                </Pressable>
              </View>
            </View>

            {/* Style Selector Button */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.fieldLabel}>{t('selectBeerStyle')}</ThemedText>
              <Pressable
                onPress={() => setStylePickerVisible(true)}
                style={({ pressed }) => [
                  styles.styleSelectBtn,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.styleSelectId}>
                    {selectedStyle ? selectedStyle.id : '—'}
                  </ThemedText>
                  <ThemedText
                    style={styles.styleSelectName}
                    numberOfLines={2}
                  >
                    {selectedStyle ? selectedStyle.name : t('selectBeerStyle')}
                  </ThemedText>
                </View>
                <ThemedText style={styles.styleSelectArrow}>▼</ThemedText>
              </Pressable>
            </View>

            {/* Inputs: Beer Name & Brewery */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.fieldLabel}>{t('beerName')} *</ThemedText>
              <TextInput
                style={styles.textInput}
                placeholder={language === 'es' ? 'Ej. Pliny the Elder, Torpedo...' : 'e.g. Sierra Nevada Pale Ale...'}
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={beerName}
                onChangeText={setBeerName}
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <ThemedText style={styles.fieldLabel}>{t('brewery')}</ThemedText>
                <TextInput
                  style={styles.textInput}
                  placeholder={language === 'es' ? 'Ej. Russian River' : 'e.g. Sierra Nevada'}
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={brewery}
                  onChangeText={setBrewery}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <ThemedText style={styles.fieldLabel}>{t('vintageOrBatch')}</ThemedText>
                <TextInput
                  style={styles.textInput}
                  placeholder={language === 'es' ? 'Ej. #2026-A' : 'e.g. #2026-A'}
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={vintageOrBatch}
                  onChangeText={setVintageOrBatch}
                />
              </View>
            </View>
          </View>

          {/* Section 2: APARIENCIA (3 pts) */}
          <View style={styles.sectionCard}>
            <View style={styles.categoryTitleRow}>
              <ThemedText style={styles.sectionHeaderTitle}>
                {language === 'es' ? '2. APARIENCIA (3 PTS)' : '2. APPEARANCE (3 PTS)'}
              </ThemedText>
              <ThemedText style={styles.categoryGuideText}>
                {t('appearanceGuidelines')}
              </ThemedText>
            </View>

            {/* Color */}
            <AttributeScale
              label={language === 'es' ? 'Color' : 'Color'}
              options={
                language === 'es'
                  ? ['Muy Clara', 'Apropiada', 'Muy Oscura']
                  : ['Too Light', 'Appropriate', 'Too Dark']
              }
              value={structuredAttributes.appearanceColor}
              onChange={(val) => handleAttributeChange('appearanceColor', val)}
              language={language}
            />

            {/* Claridad */}
            <AttributeScale
              label={language === 'es' ? 'Claridad' : 'Clarity'}
              options={
                language === 'es'
                  ? ['Muy Cristalina', 'Apropiada', 'Muy Turbia']
                  : ['Too Clear', 'Appropriate', 'Too Hazy / Turbid']
              }
              value={structuredAttributes.appearanceClarity}
              onChange={(val) => handleAttributeChange('appearanceClarity', val)}
              language={language}
            />

            {/* Espuma */}
            <AttributeScale
              label={language === 'es' ? 'Espuma' : 'Head / Foam'}
              options={
                language === 'es'
                  ? ['Espuma baja', 'Apropiada', 'Espuma alta']
                  : ['Too Low', 'Appropriate', 'Too High']
              }
              value={structuredAttributes.appearanceHead}
              onChange={(val) => handleAttributeChange('appearanceHead', val)}
              language={language}
            />

            {/* Appearance Score Bar */}
            <CategoryScoreSlider
              score={scoresheet.appearanceScore}
              maxScore={3}
              onChange={(val) => handleScoreValue('appearanceScore', val)}
              language={language}
            />

            {/* Comments */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.fieldLabel}>{language === 'es' ? 'Comentarios' : 'Comments'}</ThemedText>
              <TextInput
                style={[styles.textInput, styles.categoryCommentInput]}
                placeholder={language === 'es' ? 'Describe color, claridad, textura y retención de espuma...' : 'Describe color, clarity, head texture and retention...'}
                placeholderTextColor="rgba(255, 255, 255, 0.35)"
                multiline
                value={scoresheet.appearanceNotes}
                onChangeText={(text) => setScoresheet({ ...scoresheet, appearanceNotes: text })}
              />
            </View>
          </View>

          {/* Section 3: AROMA (12 pts) */}
          <View style={styles.sectionCard}>
            <View style={styles.categoryTitleRow}>
              <ThemedText style={styles.sectionHeaderTitle}>
                {language === 'es' ? '3. AROMA (12 PTS)' : '3. AROMA (12 PTS)'}
              </ThemedText>
              <ThemedText style={styles.categoryGuideText}>
                {t('aromaGuidelines')}
              </ThemedText>
            </View>

            {/* Aroma Attribute Scale */}
            <AttributeScale
              label={language === 'es' ? 'Adecuación aromática' : 'Aroma Appropriateness'}
              options={
                language === 'es'
                  ? ['Apropiada', 'No apropiada']
                  : ['Appropriate', 'Inappropriate']
              }
              scoringMode="start-ideal"
              value={structuredAttributes.aromaAppropriate}
              onChange={(val) => handleAttributeChange('aromaAppropriate', val)}
              language={language}
            />

            {/* Aroma Score Bar */}
            <CategoryScoreSlider
              score={scoresheet.aromaScore}
              maxScore={12}
              onChange={(val) => handleScoreValue('aromaScore', val)}
              language={language}
            />

            {/* Comments */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.fieldLabel}>{language === 'es' ? 'Comentarios' : 'Comments'}</ThemedText>
              <TextInput
                style={[styles.textInput, styles.categoryCommentInput]}
                placeholder={language === 'es' ? 'Describe malta, lúpulo, ésteres y perfil aromático...' : 'Describe malt, hops, esters and aroma profile...'}
                placeholderTextColor="rgba(255, 255, 255, 0.35)"
                multiline
                value={scoresheet.aromaNotes}
                onChangeText={(text) => setScoresheet({ ...scoresheet, aromaNotes: text })}
              />
            </View>
          </View>

          {/* Section 4: SABOR & RETROGUSTO (20 pts) */}
          <View style={styles.sectionCard}>
            <View style={styles.categoryTitleRow}>
              <ThemedText style={styles.sectionHeaderTitle}>
                {language === 'es' ? '4. SABOR & RETROGUSTO (20 PTS)' : '4. FLAVOR & AFTERTASTE (20 PTS)'}
              </ThemedText>
              <ThemedText style={styles.categoryGuideText}>
                {t('flavorGuidelines')}
              </ThemedText>
            </View>

            {/* Dulzor */}
            <AttributeScale
              label={language === 'es' ? 'Dulzor' : 'Sweetness'}
              options={
                language === 'es'
                  ? ['Muy baja', 'Apropiada', 'Muy alta']
                  : ['Too Low', 'Appropriate', 'Too Sweet']
              }
              value={structuredAttributes.flavorSweetness}
              onChange={(val) => handleAttributeChange('flavorSweetness', val)}
              language={language}
            />

            {/* Amargor */}
            <AttributeScale
              label={language === 'es' ? 'Amargor' : 'Bitterness'}
              options={
                language === 'es'
                  ? ['Muy baja', 'Apropiada', 'Muy alta']
                  : ['Too Low', 'Appropriate', 'Too Bitter']
              }
              value={structuredAttributes.flavorBitterness}
              onChange={(val) => handleAttributeChange('flavorBitterness', val)}
              language={language}
            />

            {/* Acidez */}
            <AttributeScale
              label={language === 'es' ? 'Acidez' : 'Acidity / Sourness'}
              options={
                language === 'es'
                  ? ['Muy baja', 'Apropiada', 'Muy alta']
                  : ['Too Low', 'Appropriate', 'Too Acidic']
              }
              value={structuredAttributes.flavorAcidity}
              onChange={(val) => handleAttributeChange('flavorAcidity', val)}
              language={language}
            />

            {/* Duración / Persistencia del Retrogusto */}
            <AttributeScale
              label={language === 'es' ? 'Duración del Retrogusto' : 'Aftertaste Duration'}
              options={
                language === 'es'
                  ? ['Muy corto', 'Apropiado / Equilibrado', 'Muy persistente / Largo']
                  : ['Too Short', 'Appropriate / Balanced', 'Too Long / Lingering']
              }
              value={structuredAttributes.aftertasteDuration}
              onChange={(val) => handleAttributeChange('aftertasteDuration', val)}
              language={language}
            />

            {/* Carácter del Final */}
            <AttributeScale
              label={language === 'es' ? 'Carácter del Final' : 'Finish Character'}
              options={
                language === 'es'
                  ? ['Muy seco / Cortante', 'Limpio / Agradable', 'Astringente / Áspero']
                  : ['Too Dry / Abrupt', 'Clean / Pleasant', 'Harsh / Astringent']
              }
              value={structuredAttributes.aftertasteCharacter}
              onChange={(val) => handleAttributeChange('aftertasteCharacter', val)}
              language={language}
            />

            {/* Flavor Score Bar (0 - 20 pts) */}
            <CategoryScoreSlider
              score={scoresheet.flavorScore}
              maxScore={20}
              onChange={(val) => handleScoreValue('flavorScore', val)}
              language={language}
            />

            {/* Comments */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.fieldLabel}>{language === 'es' ? 'Comentarios de Sabor y Final' : 'Flavor & Finish Comments'}</ThemedText>
              <TextInput
                style={[styles.textInput, styles.categoryCommentInput]}
                placeholder={
                  language === 'es'
                    ? 'Describe balance de maltas, lúpulo, fermentación, amargor residual, final y retrogusto...'
                    : 'Describe malt balance, hops, fermentation, residual bitterness, finish and aftertaste...'
                }
                placeholderTextColor="rgba(255, 255, 255, 0.35)"
                multiline
                value={scoresheet.flavorNotes}
                onChangeText={(text) => setScoresheet({ ...scoresheet, flavorNotes: text })}
              />
            </View>
          </View>

          {/* Section 5: SENSACIÓN EN BOCA (5 pts) */}
          <View style={styles.sectionCard}>
            <View style={styles.categoryTitleRow}>
              <ThemedText style={styles.sectionHeaderTitle}>
                {language === 'es' ? '5. SENSACIÓN EN BOCA (5 PTS)' : '5. MOUTHFEEL (5 PTS)'}
              </ThemedText>
              <ThemedText style={styles.categoryGuideText}>
                {t('mouthfeelGuidelines')}
              </ThemedText>
            </View>

            {/* Cuerpo */}
            <AttributeScale
              label={language === 'es' ? 'Cuerpo' : 'Body'}
              options={
                language === 'es'
                  ? ['Muy baja', 'Apropiada', 'Muy alta']
                  : ['Too Low / Light', 'Appropriate', 'Too High / Heavy']
              }
              value={structuredAttributes.mouthfeelBody}
              onChange={(val) => handleAttributeChange('mouthfeelBody', val)}
              language={language}
            />

            {/* Carbonatación */}
            <AttributeScale
              label={language === 'es' ? 'Carbonatación' : 'Carbonation'}
              options={
                language === 'es'
                  ? ['Muy baja', 'Apropiada', 'Muy alta']
                  : ['Too Low', 'Appropriate', 'Too High']
              }
              value={structuredAttributes.mouthfeelCarbonation}
              onChange={(val) => handleAttributeChange('mouthfeelCarbonation', val)}
              language={language}
            />

            {/* Alcohol */}
            <AttributeScale
              label={language === 'es' ? 'Alcohol / Calidez' : 'Alcohol Warmth'}
              options={
                language === 'es'
                  ? ['Muy baja', 'Apropiada', 'Muy alta']
                  : ['Too Low', 'Appropriate', 'Too High']
              }
              value={structuredAttributes.mouthfeelAlcohol}
              onChange={(val) => handleAttributeChange('mouthfeelAlcohol', val)}
              language={language}
            />

            {/* Mouthfeel Score Bar */}
            <CategoryScoreSlider
              score={scoresheet.mouthfeelScore}
              maxScore={5}
              onChange={(val) => handleScoreValue('mouthfeelScore', val)}
              language={language}
            />

            {/* Comments */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.fieldLabel}>{language === 'es' ? 'Comentarios' : 'Comments'}</ThemedText>
              <TextInput
                style={[styles.textInput, styles.categoryCommentInput]}
                placeholder={language === 'es' ? 'Describe textura, cremosidad y calidez alcohólica...' : 'Describe texture, creaminess and alcohol warmth...'}
                placeholderTextColor="rgba(255, 255, 255, 0.35)"
                multiline
                value={scoresheet.mouthfeelNotes}
                onChangeText={(text) => setScoresheet({ ...scoresheet, mouthfeelNotes: text })}
              />
            </View>
          </View>

          {/* Section 6: GENERAL / IMPRESIÓN GENERAL (10 pts) */}
          <View style={styles.sectionCard}>
            <View style={styles.categoryTitleRow}>
              <ThemedText style={styles.sectionHeaderTitle}>
                {language === 'es' ? '6. GENERAL (10 PTS)' : '6. OVERALL IMPRESSION (10 PTS)'}
              </ThemedText>
              <ThemedText style={styles.categoryGuideText}>
                {t('overallGuidelines')}
              </ThemedText>
            </View>

            {/* Calidad técnica (5 steps) */}
            <AttributeScale
              label={language === 'es' ? 'Calidad técnica' : 'Technical Quality'}
              options={
                language === 'es'
                  ? ['Excelente', 'Muy Bueno', 'Bueno', 'Aceptable', 'Necesita mejoras']
                  : ['Outstanding', 'Very Good', 'Good', 'Fair', 'Needs Improvement']
              }
              scoringMode="start-ideal"
              value={structuredAttributes.generalTechnicalQuality}
              onChange={(val) => handleAttributeChange('generalTechnicalQuality', val)}
              language={language}
            />

            {/* Representación de Estilo (3 steps) */}
            <AttributeScale
              label={language === 'es' ? 'Estilo' : 'Style Representation'}
              options={
                language === 'es'
                  ? ['Muy representativa', 'Algo Representativa', 'No representativa']
                  : ['Classic to Style', 'Somewhat Representative', 'Not Representative']
              }
              scoringMode="start-ideal"
              value={structuredAttributes.generalStyleRepresentation}
              onChange={(val) => handleAttributeChange('generalStyleRepresentation', val)}
              language={language}
            />

            {/* Fuerza relativa en la cata (Radio buttons) */}
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
              selectedId={structuredAttributes.generalRelativeStrength}
              onChange={(id) => handleAttributeChange('generalRelativeStrength', id)}
            />

            {/* Overall Score Bar */}
            <CategoryScoreSlider
              score={scoresheet.overallScore}
              maxScore={10}
              onChange={(val) => handleScoreValue('overallScore', val)}
              language={language}
            />

            {/* Devolución / Comentarios generales */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.fieldLabel}>
                {language === 'es' ? 'Devolución y Conclusiones' : 'Verdict & Notes'}
              </ThemedText>
              <TextInput
                style={[styles.textInput, styles.feedbackInput]}
                placeholder={
                  language === 'es'
                    ? 'Veredicto general, balance, disfrutabilidad o sugerencias...'
                    : 'Overall verdict, balance, drinkability, or suggestions...'
                }
                placeholderTextColor="rgba(255, 255, 255, 0.35)"
                multiline
                value={scoresheet.overallNotes}
                onChangeText={(text) => setScoresheet({ ...scoresheet, overallNotes: text })}
              />
            </View>
          </View>

          {/* Save Action Button */}
          <Pressable
            onPress={handleSave}
            disabled={isSaving}
            style={({ pressed }) => [
              styles.saveButton,
              pressed && { opacity: 0.85 },
              isSaving && { opacity: 0.5 },
            ]}
          >
            <ThemedText style={styles.saveButtonText}>
              {isSaving ? (language === 'es' ? 'Guardando...' : 'Saving...') : t('saveTasting')} ({totalScore}/50)
            </ThemedText>
          </Pressable>
        </ScrollView>

        {/* Style Picker Modal */}
        <Modal
          visible={stylePickerVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setStylePickerVisible(false)}
        >
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerCard}>
              <View style={styles.pickerHeader}>
                <ThemedText style={styles.pickerTitle}>{t('selectBeerStyle')}</ThemedText>
                <Pressable
                  onPress={() => setStylePickerVisible(false)}
                  style={({ pressed }) => [styles.pickerCloseBtn, pressed && { opacity: 0.7 }]}
                >
                  <ThemedText style={styles.pickerCloseText}>✕</ThemedText>
                </Pressable>
              </View>

              <TextInput
                style={styles.pickerSearchInput}
                placeholder={language === 'es' ? 'Buscar estilo (ej. IPA, Stout, 21A)...' : 'Search style...'}
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={styleSearchQuery}
                onChangeText={setStyleSearchQuery}
                autoFocus
              />

              <FlatList
                data={filteredStylesForPicker}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setSelectedStyle(item);
                      setStylePickerVisible(false);
                      setStyleSearchQuery('');
                    }}
                    style={({ pressed }) => [
                      styles.pickerItemRow,
                      selectedStyle?.id === item.id && styles.pickerItemRowSelected,
                      pressed && { opacity: 0.7 },
                    ]}
                  >
                    <View style={styles.pickerItemIdBadge}>
                      <ThemedText style={styles.pickerItemIdText}>{item.id}</ThemedText>
                    </View>
                    <View style={{ flex: 1 }}>
                      <ThemedText style={styles.pickerItemName}>{item.name}</ThemedText>
                      <ThemedText style={styles.pickerItemCat}>{item.category}</ThemedText>
                    </View>
                  </Pressable>
                )}
              />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ThemedView>
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
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
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
    textAlign: 'center',
    flex: 1,
  },
  subHeaderToolBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  subHeaderToolBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  subHeaderToolBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: Fonts.manropeBold,
  },
  subHeaderGuideBtn: {
    backgroundColor: '#F2B824',
    borderColor: '#E5A81E',
  },
  subHeaderGuideBtnText: {
    color: '#161B22',
    fontSize: 12,
    fontFamily: Fonts.spaceGroteskBold,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.three,
  },
  heroScoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 22,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    gap: Spacing.three,
  },
  heroScoreMeta: {
    flex: 1,
  },
  heroBadgeTitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    fontFamily: Fonts.manropeBold,
    letterSpacing: 1,
  },
  heroQualityTier: {
    fontSize: 22,
    lineHeight: 26,
    fontFamily: Fonts.spaceGroteskBold,
    fontWeight: '900',
    marginTop: 2,
  },
  heroRangeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontFamily: Fonts.inter,
    marginTop: 2,
  },
  heroGuidePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 8,
  },
  heroGuidePillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: Fonts.manropeBold,
  },
  sectionCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    borderRadius: 20,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: Spacing.two,
  },
  sectionHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: Fonts.spaceGroteskBold,
    letterSpacing: 0.5,
  },
  categoryTitleRow: {
    marginBottom: Spacing.one,
  },
  categoryGuideText: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 12,
    fontFamily: Fonts.inter,
    marginTop: 2,
  },
  sectionDesc: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontFamily: Fonts.inter,
    marginTop: -2,
    marginBottom: 4,
  },
  twoPhotosRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.one,
    marginBottom: Spacing.two,
  },
  photoColumn: {
    flex: 1,
    gap: 4,
  },
  photoColumnLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  photoColumnLabel: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11,
    fontFamily: Fonts.manropeBold,
  },
  photoFrameDouble: {
    width: '100%',
    height: 100,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    alignItems: 'center',
    padding: 4,
  },
  photoIcon: {
    fontSize: 24,
  },
  photoText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 10,
    fontFamily: Fonts.spaceGroteskBold,
    textAlign: 'center',
    marginTop: 2,
  },
  styleSelectorColumn: {
    flex: 1,
  },
  fieldLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontFamily: Fonts.manropeBold,
    marginBottom: 4,
  },
  styleSelectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  styleSelectId: {
    color: '#F2B824',
    fontSize: 12,
    fontFamily: Fonts.spaceGroteskBold,
  },
  styleSelectName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: Fonts.spaceGroteskBold,
  },
  styleSelectArrow: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    marginLeft: 6,
  },
  inputGroup: {
    gap: 4,
    marginTop: Spacing.one,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Fonts.inter,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryCommentInput: {
    minHeight: 56,
    textAlignVertical: 'top',
    fontSize: 13,
  },
  feedbackInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  descriptorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: Spacing.one,
  },
  descriptorChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  descriptorChipSelected: {
    backgroundColor: 'rgba(242, 184, 36, 0.2)',
    borderColor: '#F2B824',
  },
  descriptorChipText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontFamily: Fonts.inter,
  },
  descriptorChipTextSelected: {
    color: '#F2B824',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#52B788',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginTop: Spacing.two,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: Fonts.spaceGroteskBold,
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  pickerCard: {
    backgroundColor: '#1E3C4B',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: '75%',
    padding: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  pickerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: Fonts.spaceGroteskBold,
  },
  pickerCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerCloseText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pickerSearchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Fonts.inter,
    marginBottom: Spacing.three,
  },
  pickerItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    gap: Spacing.three,
  },
  pickerItemRowSelected: {
    backgroundColor: 'rgba(242, 184, 36, 0.15)',
    borderRadius: 10,
  },
  pickerItemIdBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 44,
    alignItems: 'center',
  },
  pickerItemIdText: {
    color: '#F2B824',
    fontSize: 12,
    fontFamily: Fonts.spaceGroteskBold,
  },
  pickerItemName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Fonts.spaceGroteskBold,
  },
  pickerItemCat: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    fontFamily: Fonts.inter,
    marginTop: 2,
  },
});
