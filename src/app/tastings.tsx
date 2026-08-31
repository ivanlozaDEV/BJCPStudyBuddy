import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Pressable,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import Svg, { Path, Rect, Circle, G, Line } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTranslation } from '@/context/language-context';
import { useTastings } from '@/context/tastings-context';
import { TastingNote, getQualityTier } from '@/types/tasting';
import { fuzzyMatch } from '@/utils/fuzzy';
import { BottomTabInset, Fonts, Spacing, MaxContentWidth } from '@/constants/theme';

function EmptyTastingsSvg() {
  return (
    <Svg width={76} height={76} viewBox="0 0 64 64" fill="none">
      {/* Background glow circle */}
      <Circle cx={32} cy={32} r={28} fill="rgba(242, 184, 36, 0.12)" />
      
      {/* Left Beer Mug */}
      <G transform="translate(6, 12)">
        {/* Handle */}
        <Path
          d="M6 14H2a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4"
          stroke="#F2B824"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {/* Mug Body (Liquid) */}
        <Path
          d="M6 5v16a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V5H6z"
          fill="#F2B824"
        />
        {/* Liquid Highlight */}
        <Path
          d="M9 7v13M13 7v13"
          stroke="rgba(255, 255, 255, 0.35)"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        {/* Foam Top */}
        <Path
          d="M5 5c0-2 1.5-3 3-3s2 .8 3 0 1.5-1.5 3-1.5 2.5 1.5 3 1.5 2-1 3.5 0 2 2.5 2 3H5z"
          fill="#FFFFFF"
        />
      </G>

      {/* Right Beer Mug */}
      <G transform="translate(28, 14)">
        {/* Mug Body (Liquid) */}
        <Path
          d="M6 5v16a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V5H6z"
          fill="#E5A81E"
        />
        {/* Liquid Highlight */}
        <Path
          d="M9 7v13M13 7v13"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        {/* Handle */}
        <Path
          d="M22 5h4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-4"
          stroke="#E5A81E"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {/* Foam Top */}
        <Path
          d="M5 5c0-2 1.5-3 3-3s2 .8 3 0 1.5-1.5 3-1.5 2.5 1.5 3 1.5 2-1 3.5 0 2 2.5 2 3H5z"
          fill="#FFFFFF"
        />
      </G>

      {/* Sparkles / Bubbles around glasses */}
      <Circle cx={32} cy={10} r={2} fill="#FFE082" />
      <Circle cx={14} cy={12} r={1.5} fill="#FFE082" />
      <Circle cx={50} cy={16} r={1.5} fill="#FFE082" />
      <Line x1={32} y1={4} x2={32} y2={7} stroke="#FFE082" strokeWidth={1.5} strokeLinecap="round" />
      <Line x1={29} y1={5.5} x2={35} y2={5.5} stroke="#FFE082" strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function BeerGlassThumbSvg({ size = 36 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Goblet / Snifter bowl */}
      <Path
        d="M6 3h12l-1.5 8a4.5 4.5 0 0 1-4.5 4 4.5 4.5 0 0 1-4.5-4L6 3z"
        fill="#F2B824"
        stroke="#E5A81E"
        strokeWidth={1}
      />
      {/* Foam head */}
      <Path
        d="M5.5 3.5c0-1 1-1.5 2-1s1.5.5 2.5 0 1.5-1 2.5-.5 2 1.5 2.5 1.5 2 0 3 .5v1H5.5v-1.5z"
        fill="#FFFFFF"
      />
      {/* Stem */}
      <Rect x={11} y={15} width={2} height={4} fill="#C7D0D9" />
      {/* Base */}
      <Path d="M8 20h8" stroke="#C7D0D9" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export default function TastingsScreen() {
  const { t, language } = useTranslation();
  const { tastings, stats } = useTastings();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'outstanding' | 'excellent' | 'very_good' | 'good' | 'fair'>('all');

  const filteredTastings = tastings.filter((tasting) => {
    // 1. Quality filter
    if (selectedFilter !== 'all') {
      const quality = getQualityTier(tasting.totalScore);
      if (quality.tier !== selectedFilter) return false;
    }

    // 2. Fuzzy search
    return fuzzyMatch(searchQuery, [
      tasting.beerName,
      tasting.brewery,
      tasting.styleId,
      tasting.styleName,
      tasting.vintageOrBatch || '',
    ]);
  });

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              if (router.canGoBack()) router.back();
              else router.replace('/');
            }}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
          >
            <ThemedText style={styles.backBtnText}>←</ThemedText>
          </Pressable>

          <ThemedText style={styles.headerTitle}>{t('myTastings')}</ThemedText>

          <Pressable
            onPress={() => router.push('/judge-simulator' as any)}
            style={({ pressed }) => [styles.newTastingBtn, pressed && { opacity: 0.85 }]}
          >
            <ThemedText style={styles.newTastingBtnText}>+ {t('newTasting')}</ThemedText>
          </Pressable>
        </View>

        {/* Judge Statistics Hero Card */}
        <View style={styles.statsCard}>
          <View style={styles.statBox}>
            <ThemedText style={styles.statNumber}>{stats.totalTastings}</ThemedText>
            <ThemedText style={styles.statLabel}>{t('totalTastingsCount')}</ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <ThemedText style={[styles.statNumber, { color: '#52B788' }]}>
              {stats.averageScore > 0 ? stats.averageScore : '—'}
            </ThemedText>
            <ThemedText style={styles.statLabel}>{t('avgScore')}</ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <ThemedText style={[styles.statNumber, { color: '#F2B824' }]}>
              {stats.highestScore > 0 ? stats.highestScore : '—'}
            </ThemedText>
            <ThemedText style={styles.statLabel}>{t('topScore')}</ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <ThemedText style={styles.statNumber}>{stats.stylesCount}</ThemedText>
            <ThemedText style={styles.statLabel}>{t('stylesEvaluated')}</ThemedText>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchTastings')}
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Chips */}
        <View style={styles.filterChipsRow}>
          <FilterChip
            label={t('all')}
            isSelected={selectedFilter === 'all'}
            onPress={() => setSelectedFilter('all')}
          />
          <FilterChip
            label="45-50 (Sobresaliente)"
            isSelected={selectedFilter === 'outstanding'}
            onPress={() => setSelectedFilter('outstanding')}
            color="#F2B824"
          />
          <FilterChip
            label="38-44 (Excelente)"
            isSelected={selectedFilter === 'excellent'}
            onPress={() => setSelectedFilter('excellent')}
            color="#52B788"
          />
          <FilterChip
            label="30-37 (Muy Bueno)"
            isSelected={selectedFilter === 'very_good'}
            onPress={() => setSelectedFilter('very_good')}
            color="#3A7D9D"
          />
        </View>

        {/* Tastings List */}
        <FlatList
          data={filteredTastings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconWrapper}>
                <EmptyTastingsSvg />
              </View>
              <ThemedText style={styles.emptyTitle}>{t('noTastingsYet')}</ThemedText>
              <ThemedText style={styles.emptySubtitle}>{t('startFirstTasting')}</ThemedText>
              <Pressable
                onPress={() => router.push('/judge-simulator' as any)}
                style={({ pressed }) => [styles.emptyCtaBtn, pressed && { opacity: 0.85 }]}
              >
                <ThemedText style={styles.emptyCtaBtnText}>+ {t('newTasting')}</ThemedText>
              </Pressable>
            </View>
          }
          renderItem={({ item }) => (
            <TastingCard tasting={item} language={language} />
          )}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

function TastingCard({
  tasting,
  language,
}: {
  tasting: TastingNote;
  language: 'es' | 'en';
}) {
  const quality = getQualityTier(tasting.totalScore);
  const formattedDate = new Date(tasting.createdAt).toLocaleDateString(
    language === 'es' ? 'es-ES' : 'en-US',
    {
      month: 'short',
      day: 'numeric',
    }
  );

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/tasting-detail' as any,
          params: { id: tasting.id },
        })
      }
      style={({ pressed }) => [
        styles.tastingCard,
        pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
      ]}
    >
      {/* Thumbnail */}
      <View style={styles.cardThumbnailWrapper}>
        {tasting.photoUrl ? (
          <Image source={{ uri: tasting.photoUrl }} style={styles.cardThumbnail} />
        ) : (
          <View style={styles.cardThumbnailPlaceholder}>
            <BeerGlassThumbSvg />
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.cardInfo}>
        <ThemedText style={styles.cardBeerName} numberOfLines={1}>
          {tasting.beerName}
        </ThemedText>

        {tasting.brewery ? (
          <ThemedText style={styles.cardBrewery} numberOfLines={1}>
            {tasting.brewery} {tasting.vintageOrBatch ? `• ${tasting.vintageOrBatch}` : ''}
          </ThemedText>
        ) : null}

        <View style={styles.cardStyleBadge}>
          <ThemedText style={styles.cardStyleId}>{tasting.styleId}</ThemedText>
          <ThemedText style={styles.cardStyleName} numberOfLines={1}>
            {tasting.styleName}
          </ThemedText>
        </View>

        <ThemedText style={styles.cardDate}>{formattedDate}</ThemedText>
      </View>

      {/* Dedicated High-Visibility Score Box */}
      <View
        style={[
          styles.cardScoreBadge,
          { borderColor: quality.color, backgroundColor: 'rgba(0, 0, 0, 0.35)' },
        ]}
      >
        <View style={styles.scoreRow}>
          <ThemedText style={[styles.cardScoreNumber, { color: quality.color }]}>
            {tasting.totalScore}
          </ThemedText>
          <ThemedText style={styles.cardScoreMax}>/50</ThemedText>
        </View>
        <View style={[styles.cardTierPill, { backgroundColor: quality.color + '25' }]}>
          <ThemedText style={[styles.cardTierText, { color: quality.color }]} numberOfLines={1}>
            {language === 'es' ? quality.label_es : quality.label_en}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

function FilterChip({
  label,
  isSelected,
  onPress,
  color,
}: {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  color?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.filterChip,
        isSelected && styles.filterChipSelected,
        color && isSelected ? { borderColor: color } : null,
      ]}
    >
      <ThemedText
        style={[
          styles.filterChipText,
          isSelected && styles.filterChipTextSelected,
          color && isSelected ? { color } : null,
        ]}
      >
        {label}
      </ThemedText>
    </Pressable>
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
  },
  newTastingBtn: {
    backgroundColor: '#F2B824',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5A81E',
  },
  newTastingBtnText: {
    color: '#161B22',
    fontSize: 12,
    fontFamily: Fonts.spaceGroteskBold,
    fontWeight: '800',
  },
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: Spacing.four,
    marginTop: Spacing.one,
    marginBottom: Spacing.two,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 18,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: Fonts.spaceGroteskBold,
    fontWeight: '900',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 9,
    fontFamily: Fonts.manropeBold,
    textTransform: 'uppercase',
    marginTop: 2,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  searchContainer: {
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.two,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: Fonts.inter,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterChipsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
    gap: 6,
    marginBottom: Spacing.two,
    overflow: 'hidden',
  },
  filterChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterChipSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: '#FFFFFF',
  },
  filterChipText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 11,
    fontFamily: Fonts.manropeBold,
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.six,
    gap: Spacing.two,
  },
  tastingCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    padding: Spacing.two + 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    gap: Spacing.two + 2,
    alignItems: 'center',
  },
  cardThumbnailWrapper: {
    width: 78,
    height: 78,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  cardThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardThumbnailPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardThumbnailIcon: {
    fontSize: 24,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 3,
  },
  cardBeerName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: Fonts.spaceGroteskBold,
  },
  cardBrewery: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
    fontFamily: Fonts.inter,
  },
  cardStyleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  cardStyleId: {
    color: '#F2B824',
    fontSize: 11,
    fontFamily: Fonts.spaceGroteskBold,
    fontWeight: '700',
  },
  cardStyleName: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 11,
    fontFamily: Fonts.inter,
    flex: 1,
  },
  cardDate: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 10,
    fontFamily: Fonts.inter,
  },
  cardScoreBadge: {
    minWidth: 72,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 1,
  },
  cardScoreNumber: {
    fontSize: 22,
    lineHeight: 26,
    fontFamily: Fonts.spaceGroteskBold,
    fontWeight: '900',
  },
  cardScoreMax: {
    fontSize: 11,
    fontFamily: Fonts.inter,
    color: 'rgba(255, 255, 255, 0.55)',
    fontWeight: '600',
  },
  cardTierPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 78,
  },
  cardTierText: {
    fontSize: 9.5,
    fontFamily: Fonts.manropeBold,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
    gap: Spacing.two,
  },
  emptyIconWrapper: {
    marginBottom: Spacing.one,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: Fonts.spaceGroteskBold,
  },
  emptySubtitle: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 13,
    fontFamily: Fonts.inter,
    textAlign: 'center',
  },
  emptyCtaBtn: {
    backgroundColor: '#F2B824',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5A81E',
    marginTop: Spacing.three,
  },
  emptyCtaBtnText: {
    color: '#161B22',
    fontSize: 14,
    fontFamily: Fonts.spaceGroteskBold,
    fontWeight: '800',
  },
});
