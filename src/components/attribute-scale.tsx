import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import React, { useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

interface AttributeScaleProps {
  label: string;
  options: string[];
  value?: number; // 0.0 to 1.0
  onChange?: (value: number) => void;
  readOnly?: boolean;
  scoringMode?: 'center-ideal' | 'start-ideal'; // center-ideal: 0.5 = 100%; start-ideal: 0.0 = 100%
  showAdherenceBadge?: boolean;
  language?: 'es' | 'en';
}

export function AttributeScale({
  label,
  options,
  value = 0.5,
  onChange,
  readOnly = false,
  scoringMode = 'center-ideal',
  showAdherenceBadge = true,
  language = 'es',
}: AttributeScaleProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const trackRef = useRef<View>(null);
  const trackXRef = useRef(0);
  const trackWidthRef = useRef(0);

  // Clamp value between 0 and 1
  const safeValue = Math.max(0, Math.min(1, typeof value === 'number' ? value : 0.5));
  const count = options.length;

  // Calculate adherence / quality score (0% to 100%)
  const adherencePercent =
    scoringMode === 'center-ideal'
      ? Math.round(Math.max(0, 1 - 2 * Math.abs(safeValue - 0.5)) * 100)
      : Math.round(Math.max(0, 1 - safeValue) * 100);

  const getAdherenceColor = (pct: number) => {
    if (pct >= 85) return '#52B788'; // Green (Ideal)
    if (pct >= 55) return '#F2B824'; // Amber (Slight deviation)
    return '#E63946'; // Red (Flaw / Significant deviation)
  };

  const measureTrack = () => {
    trackRef.current?.measure((_x, _y, width, _height, pageX) => {
      if (width && width > 0) {
        trackWidthRef.current = width;
        trackXRef.current = pageX;
        setTrackWidth(width);
      }
    });
  };

  const handleTrackLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    trackWidthRef.current = w;
    setTrackWidth(w);
    measureTrack();
  };

  const lastRatioRef = useRef(safeValue);

  const updatePosition = (pageX: number, isFinal = false) => {
    if (readOnly || !onChange || trackWidthRef.current <= 0) return;
    const localX = pageX - trackXRef.current;
    const ratio = Math.max(0, Math.min(1, localX / trackWidthRef.current));
    const rounded = Number(ratio.toFixed(3));

    // Solo notificar si cambió al menos 0.008 (~1%) o al soltar el dedo
    if (!isFinal && Math.abs(rounded - lastRatioRef.current) < 0.008) return;

    lastRatioRef.current = rounded;
    onChange(rounded);
  };

  // PanResponder configured for instant response with zero perceived lag:
  // Allows vertical scrolling when swiping vertically, but immediately grabs when sliding horizontally.
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onStartShouldSetPanResponderCapture: () => false,
        onMoveShouldSetPanResponder: (_evt, gestureState) =>
          !readOnly &&
          Math.abs(gestureState.dx) > 3 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
        onMoveShouldSetPanResponderCapture: (_evt, gestureState) =>
          !readOnly &&
          Math.abs(gestureState.dx) > 3 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => true,
        onPanResponderGrant: (evt) => {
          if (readOnly || !onChange) return;
          const touchPageX = evt.nativeEvent.pageX;
          trackRef.current?.measure((_x, _y, width, _height, pageX) => {
            if (width && width > 0) {
              trackWidthRef.current = width;
              trackXRef.current = pageX;
              const localX = touchPageX - pageX;
              const ratio = Math.max(0, Math.min(1, localX / width));
              lastRatioRef.current = Number(ratio.toFixed(3));
              onChange(Number(ratio.toFixed(3)));
            }
          });
          updatePosition(touchPageX);
        },
        onPanResponderMove: (evt) => {
          if (readOnly || !onChange) return;
          updatePosition(evt.nativeEvent.pageX);
        },
        onPanResponderRelease: (evt) => {
          if (readOnly || !onChange) return;
          updatePosition(evt.nativeEvent.pageX, true);
        },
        onPanResponderTerminate: (evt) => {
          if (readOnly || !onChange) return;
          updatePosition(evt.nativeEvent.pageX, true);
        },
      }),
    [readOnly, onChange]
  );

  const handleLabelPress = (index: number) => {
    if (readOnly || !onChange || count <= 1) return;
    const targetRatio = index / (count - 1);
    onChange(Number(targetRatio.toFixed(3)));
  };

  return (
    <View style={styles.container}>
      {/* Attribute Title & Adherence Badge */}
      <View style={styles.headerRow}>
        <ThemedText style={styles.attributeLabel}>{label}</ThemedText>
        {showAdherenceBadge && (
          <View
            style={[
              styles.adherenceBadge,
              { borderColor: getAdherenceColor(adherencePercent) },
            ]}
          >
            <ThemedText
              style={[
                styles.adherenceText,
                { color: getAdherenceColor(adherencePercent) },
              ]}
            >
              {adherencePercent === 100
                ? (language === 'es' ? '⭐ 100% Ideal' : '⭐ 100% Ideal')
                : `${adherencePercent}% ${language === 'es' ? 'Adecuación' : 'Adherence'}`}
            </ThemedText>
          </View>
        )}
      </View>

      {/* Scale Track & Labels Area */}
      <View style={styles.scaleArea}>
        {/* Discrete Labels Row */}
        <View style={styles.labelsRow}>
          {options.map((opt, index) => {
            const labelRatio = count > 1 ? index / (count - 1) : 0.5;
            const isNearThisLabel = Math.abs(safeValue - labelRatio) < 0.15;

            let textAlign: 'left' | 'center' | 'right' = 'center';
            if (index === 0) textAlign = 'left';
            else if (index === count - 1) textAlign = 'right';

            return (
              <Pressable
                key={index}
                disabled={readOnly}
                onPress={() => handleLabelPress(index)}
                hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                style={[
                  styles.optionCell,
                  {
                    alignItems:
                      index === 0
                        ? 'flex-start'
                        : index === count - 1
                        ? 'flex-end'
                        : 'center',
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.optionText,
                    { textAlign },
                    isNearThisLabel && styles.optionTextSelected,
                  ]}
                  numberOfLines={2}
                >
                  {opt}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        {/* Continuous Interactive Touch/Drag Track with PanResponder */}
        <View
          ref={trackRef}
          style={styles.trackContainer}
          onLayout={handleTrackLayout}
          {...(readOnly ? {} : panResponder.panHandlers)}
        >
          {/* Base Horizontal Track Line */}
          <View style={styles.trackLine} />

          {/* Tick Marks for each option position */}
          {options.map((_, index) => {
            const tickPercent = count > 1 ? (index / (count - 1)) * 100 : 50;
            return (
              <View
                key={index}
                pointerEvents="none"
                style={[
                  styles.tickMarkAbsolute,
                  {
                    left: `${tickPercent}%`,
                    transform: [{ translateX: -1 }],
                  },
                ]}
              />
            );
          })}

          {/* Ergonomic Tactile Handle / Thumb Knob positioned at safeValue % */}
          <View
            pointerEvents="none"
            style={[
              styles.markerHandle,
              {
                left: `${safeValue * 100}%`,
                transform: [{ translateX: -22 }],
              },
            ]}
          >
            <View style={styles.handleGripLine} />
            <View style={styles.handleGripLine} />
            <View style={styles.handleGripLine} />
          </View>
        </View>
      </View>
    </View>
  );
}

interface RadioOption {
  id: string;
  label: string;
}

interface RadioGroupProps {
  title?: string;
  options: RadioOption[];
  selectedId?: string;
  onChange?: (id: string) => void;
  readOnly?: boolean;
}

export function RadioGroup({
  title,
  options,
  selectedId,
  onChange,
  readOnly = false,
}: RadioGroupProps) {
  return (
    <View style={styles.radioGroupContainer}>
      {title && <ThemedText style={styles.radioGroupTitle}>{title}</ThemedText>}
      <View style={styles.radioOptionsList}>
        {options.map((opt) => {
          const isSelected = opt.id === selectedId;
          return (
            <Pressable
              key={opt.id}
              disabled={readOnly}
              onPress={() => onChange && onChange(opt.id)}
              style={({ pressed }) => [
                styles.radioRow,
                pressed && !readOnly && { opacity: 0.8 },
              ]}
            >
              <View
                style={[
                  styles.radioCircleOuter,
                  isSelected && styles.radioCircleOuterSelected,
                ]}
              >
                {isSelected && <View style={styles.radioCircleInner} />}
              </View>
              <ThemedText
                style={[
                  styles.radioLabel,
                  isSelected && styles.radioLabelSelected,
                ]}
              >
                {opt.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

interface CategoryScoreSliderProps {
  score: number;
  maxScore: number;
  onChange: (score: number) => void;
  readOnly?: boolean;
  language?: 'es' | 'en';
}

export function CategoryScoreSlider({
  score,
  maxScore,
  onChange,
  readOnly = false,
  language = 'es',
}: CategoryScoreSliderProps) {
  const points = Array.from({ length: maxScore + 1 }, (_, i) => i);

  const handleSelect = (val: number) => {
    if (readOnly) return;
    onChange(val);
  };

  return (
    <View style={styles.scoreSliderContainer}>
      <View style={styles.scoreSliderHeader}>
        <ThemedText style={styles.scoreSliderTitle}>
          {language === 'es' ? 'Puntaje Asignado:' : 'Assigned Score:'}
        </ThemedText>
        <View style={styles.scoreBadge}>
          <ThemedText style={styles.scoreBadgeCurrent}>{score}</ThemedText>
          <ThemedText style={styles.scoreBadgeMax}> / {maxScore} pts</ThemedText>
        </View>
      </View>

      {/* Discrete Points Tap Bar */}
      <View style={styles.scorePointsRow}>
        {points.map((pt) => {
          const isSelected = pt === score;
          return (
            <Pressable
              key={pt}
              disabled={readOnly}
              onPress={() => handleSelect(pt)}
              style={[
                styles.scorePointBtn,
                isSelected && styles.scorePointBtnSelected,
              ]}
            >
              <ThemedText
                style={[
                  styles.scorePointText,
                  isSelected && styles.scorePointTextSelected,
                ]}
              >
                {pt}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.three,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  attributeLabel: {
    fontSize: 16,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#FFFFFF',
  },
  adherenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  adherenceText: {
    fontSize: 11,
    fontFamily: Fonts.manropeBold,
    fontWeight: '700',
  },
  scaleArea: {
    paddingHorizontal: Spacing.one,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  optionCell: {
    flex: 1,
    paddingHorizontal: 2,
  },
  optionText: {
    fontSize: 13,
    fontFamily: Fonts.inter,
    color: 'rgba(255, 255, 255, 0.65)',
    lineHeight: 16,
  },
  optionTextSelected: {
    color: '#F2B824',
    fontFamily: Fonts.manropeBold,
    fontWeight: '700',
  },
  trackContainer: {
    position: 'relative',
    height: 52,
    justifyContent: 'center',
    paddingVertical: 10,
    cursor: 'pointer' as any,
  },
  trackLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    borderRadius: 3,
  },
  tickMarkAbsolute: {
    position: 'absolute',
    width: 2,
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 1,
  },
  markerHandle: {
    position: 'absolute',
    zIndex: 10,
    top: 11,
    width: 44,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#F2B824',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 6,
  },
  handleGripLine: {
    width: 2.5,
    height: 14,
    backgroundColor: '#161B22',
    borderRadius: 1.5,
    opacity: 0.85,
  },

  // Radio Group Styles
  radioGroupContainer: {
    marginVertical: Spacing.three,
  },
  radioGroupTitle: {
    fontSize: 16,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#FFFFFF',
    marginBottom: Spacing.three,
  },
  radioOptionsList: {
    gap: Spacing.two,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  radioCircleOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.three,
  },
  radioCircleOuterSelected: {
    borderColor: '#F2B824',
  },
  radioCircleInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F2B824',
  },
  radioLabel: {
    fontSize: 14,
    fontFamily: Fonts.inter,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  radioLabelSelected: {
    color: '#FFFFFF',
    fontFamily: Fonts.manropeBold,
    fontWeight: '700',
  },

  // Score Slider Styles
  scoreSliderContainer: {
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
  scoreSliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  scoreSliderTitle: {
    fontSize: 13,
    fontFamily: Fonts.inter,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreBadgeCurrent: {
    fontSize: 18,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#F2B824',
  },
  scoreBadgeMax: {
    fontSize: 12,
    fontFamily: Fonts.inter,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  scorePointsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  scorePointBtn: {
    minWidth: 26,
    height: 28,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  scorePointBtnSelected: {
    backgroundColor: '#F2B824',
  },
  scorePointText: {
    fontSize: 12,
    fontFamily: Fonts.manropeBold,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  scorePointTextSelected: {
    color: '#161B22',
    fontWeight: '800',
  },
});
