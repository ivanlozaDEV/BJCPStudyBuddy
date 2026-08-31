import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { ThemedText } from '@/components/themed-text';
import { getQualityTier } from '@/types/tasting';
import { Fonts } from '@/constants/theme';

interface ScoreDialProps {
  score: number;
  maxScore?: number;
  size?: number;
  language?: 'es' | 'en';
}

export function ScoreDial({
  score,
  maxScore = 50,
  size = 110,
  language = 'es',
}: ScoreDialProps) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score / maxScore, 0), 1);
  const strokeDashoffset = circumference * (1 - progress);

  const quality = getQualityTier(score);
  const qualityLabel = language === 'es' ? quality.label_es : quality.label_en;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background Track Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={quality.color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {/* Centered Score and Label */}
      <View style={styles.textContainer}>
        <ThemedText style={[styles.scoreNumber, { color: '#FFFFFF' }]}>
          {score}
        </ThemedText>
        <ThemedText style={styles.maxText}>/ {maxScore}</ThemedText>
        <ThemedText
          style={[styles.tierLabel, { color: quality.color }]}
          numberOfLines={1}
        >
          {qualityLabel}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  scoreNumber: {
    fontSize: 28,
    lineHeight: 30,
    fontFamily: Fonts.spaceGroteskBold,
    fontWeight: '900',
  },
  maxText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: Fonts.inter,
    marginTop: -2,
  },
  tierLabel: {
    fontSize: 9,
    fontFamily: Fonts.manropeBold,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
});
