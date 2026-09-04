import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
    FlatList,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    TextInput,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Fonts, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { usePurchases } from '@/context/purchases-context';
import { useTranslation } from '@/context/language-context';
import { useTastings } from '@/context/tastings-context';
import { TastingNote, getQualityTier } from '@/types/tasting';
import { fuzzyMatch } from '@/utils/fuzzy';
import { checkAndPromptBackupReminder } from '@/hooks/use-backup-reminder';

function FilterIconSvg({ size = 16, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ShareIconSvg({ size = 15, color = '#F2B824' }: { size?: number; color?: string }) {
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

function EmptyTastingsSvg() {
  return (
    <Svg width={76} height={76} viewBox="0 0 64 64" fill="none">
      <Circle cx={32} cy={32} r={28} fill="rgba(242, 184, 36, 0.12)" />
      
      {/* Left Beer Mug */}
      <G transform="translate(6, 12)">
        <Path
          d="M6 14H2a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4"
          stroke="#F2B824"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <Path
          d="M6 5v16a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V5H6z"
          fill="#F2B824"
        />
        <Path
          d="M9 7v13M13 7v13"
          stroke="rgba(255, 255, 255, 0.35)"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <Path
          d="M5 5c0-2 1.5-3 3-3s2 .8 3 0 1.5-1.5 3-1.5 2.5 1.5 3 1.5 2-1 3.5 0 2 2.5 2 3H5z"
          fill="#FFFFFF"
        />
      </G>

      {/* Right Beer Mug */}
      <G transform="translate(28, 14)">
        <Path
          d="M6 5v16a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V5H6z"
          fill="#E5A81E"
        />
        <Path
          d="M9 7v13M13 7v13"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <Path
          d="M22 5h4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-4"
          stroke="#E5A81E"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <Path
          d="M5 5c0-2 1.5-3 3-3s2 .8 3 0 1.5-1.5 3-1.5 2.5 1.5 3 1.5 2-1 3.5 0 2 2.5 2 3H5z"
          fill="#FFFFFF"
        />
      </G>

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
      <Path
        d="M6 3h12l-1.5 8a4.5 4.5 0 0 1-4.5 4 4.5 4.5 0 0 1-4.5-4L6 3z"
        fill="#F2B824"
        stroke="#E5A81E"
        strokeWidth={1}
      />
      <Path
        d="M5.5 3.5c0-1 1-1.5 2-1s1.5.5 2.5 0 1.5-1 2.5-.5 2 1.5 2.5 1.5 2 0 3 .5v1H5.5v-1.5z"
        fill="#FFFFFF"
      />
      <Rect x={11} y={15} width={2} height={4} fill="#C7D0D9" />
      <Path d="M8 20h8" stroke="#C7D0D9" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export default function TastingsScreen() {
  const { t, language } = useTranslation();
  const { profile } = useAuth();
  const { tastings, stats } = useTastings();
  const { isPro } = usePurchases();

  const [activeTab, setActiveTab] = useState<'my_tastings' | 'shared_tastings'>('my_tastings');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Recordatorio inteligente de respaldo en la nube
  useEffect(() => {
    if (tastings.length >= 5) {
      const timeout = setTimeout(() => {
        checkAndPromptBackupReminder({
          tastingsCount: tastings.length,
          language,
        });
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [tastings.length, language]);

  // Clasificar catas propias vs catas recibidas de otros jueces
  const isOwnTasting = (t: TastingNote) => {
    if (t.isShared) return false;
    if (!t.judgeName) return true;
    if (t.judgeName === 'Juez en Formación' || t.judgeName === 'Judge in Training') return true;
    if (profile?.fullName && t.judgeName.trim().toLowerCase() === profile.fullName.trim().toLowerCase()) return true;
    if (t.userId && profile?.id && t.userId === profile.id) return true;
    return false;
  };

  const myTastings = tastings.filter(isOwnTasting);
  const sharedTastings = tastings.filter((t) => !isOwnTasting(t));

  const currentTabTastings = activeTab === 'my_tastings' ? myTastings : sharedTastings;

  const filteredTastings = currentTabTastings.filter((tasting) => {
    // 1. Filtro de puntuación (Default: 'all')
    if (selectedFilter !== 'all') {
      const quality = getQualityTier(tasting.totalScore);
      if (quality.tier !== selectedFilter) return false;
    }

    // 2. Búsqueda por texto
    return fuzzyMatch(searchQuery, [
      tasting.beerName,
      tasting.brewery,
      tasting.styleId,
      tasting.styleName,
      tasting.vintageOrBatch || '',
      tasting.judgeName || '',
    ]);
  });

  const filterOptions = [
    { id: 'all', label_es: 'Todas las Puntuaciones', label_en: 'All Scores', color: '#FFFFFF' },
    { id: 'outstanding', label_es: '45-50 pts • Sobresaliente', label_en: '45-50 pts • Outstanding', color: '#F2B824' },
    { id: 'excellent', label_es: '38-44 pts • Excelente', label_en: '38-44 pts • Excellent', color: '#52B788' },
    { id: 'very_good', label_es: '30-37 pts • Muy Bueno', label_en: '30-37 pts • Very Good', color: '#457B9D' },
    { id: 'good', label_es: '21-29 pts • Bueno', label_en: '21-29 pts • Good', color: '#F4A261' },
    { id: 'fair', label_es: '14-20 pts • Aceptable', label_en: '14-20 pts • Fair', color: '#E76F51' },
    { id: 'problematic', label_es: '0-13 pts • Problemático', label_en: '0-13 pts • Problematic', color: '#D90429' },
  ];

  const activeFilterObj = filterOptions.find((f) => f.id === selectedFilter);

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        
        {/* 1. Header with Title & New Tasting Button */}
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
            onPress={() => {
              if (!isPro) {
                router.push('/paywall' as any);
              } else {
                router.push('/judge-simulator' as any);
              }
            }}
            style={({ pressed }) => [styles.newTastingBtn, pressed && { opacity: 0.85 }]}
          >
            <ThemedText style={styles.newTastingBtnText}>+ {t('newTasting')}</ThemedText>
          </Pressable>
        </View>

        {/* 4. Two Segment Tabs: My Tastings vs Shared Tastings */}
        <View style={styles.tabBarContainer}>
          <Pressable
            onPress={() => setActiveTab('my_tastings')}
            style={[styles.tabButton, activeTab === 'my_tastings' && styles.tabButtonActive]}
          >
            <ThemedText
              style={[
                styles.tabButtonText,
                activeTab === 'my_tastings' && styles.tabButtonTextActive,
              ]}
            >
              {language === 'es' ? 'Mis Evaluaciones' : 'My Tastings'} ({myTastings.length})
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('shared_tastings')}
            style={[styles.tabButton, activeTab === 'shared_tastings' && styles.tabButtonActive]}
          >
            <ThemedText
              style={[
                styles.tabButtonText,
                activeTab === 'shared_tastings' && styles.tabButtonTextActive,
              ]}
            >
              {language === 'es' ? 'Recibidas / Calibración' : 'Received / Shared'} ({sharedTastings.length})
            </ThemedText>
          </Pressable>
        </View>

        {/* Judge Statistics Hero Card (Only shown in My Tastings) */}
        {activeTab === 'my_tastings' && (
          <View style={styles.statsCard}>
            <View style={styles.statBox}>
              <ThemedText style={styles.statNumber}>{myTastings.length}</ThemedText>
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
        )}

        {/* 2 & 3. Search Bar + Single Filter Button (Default: All) */}
        <View style={styles.searchAndFilterRow}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder={
                activeTab === 'my_tastings'
                  ? (language === 'es' ? 'Buscar en mis catas...' : 'Search my tastings...')
                  : (language === 'es' ? 'Buscar en catas recibidas...' : 'Search received tastings...')
              }
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <Pressable
            onPress={() => setFilterModalVisible(true)}
            style={({ pressed }) => [
              styles.filterBtn,
              selectedFilter !== 'all' && styles.filterBtnActive,
              pressed && { opacity: 0.8 },
            ]}
          >
            <FilterIconSvg
              size={16}
              color={selectedFilter !== 'all' ? '#0A0C10' : '#FFFFFF'}
            />
            {selectedFilter !== 'all' && <View style={styles.filterActiveDot} />}
          </Pressable>
        </View>

        {/* Active Filter Indicator Tag */}
        {selectedFilter !== 'all' && activeFilterObj && (
          <View style={styles.activeFilterTagRow}>
            <View style={[styles.activeFilterTag, { borderColor: activeFilterObj.color }]}>
              <ThemedText style={[styles.activeFilterTagText, { color: activeFilterObj.color }]}>
                {language === 'es' ? activeFilterObj.label_es : activeFilterObj.label_en}
              </ThemedText>
              <Pressable onPress={() => setSelectedFilter('all')} hitSlop={6}>
                <ThemedText style={styles.activeFilterRemoveText}>✕</ThemedText>
              </Pressable>
            </View>
          </View>
        )}

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
              <ThemedText style={styles.emptyTitle}>
                {activeTab === 'my_tastings'
                  ? t('noTastingsYet')
                  : (language === 'es' ? 'Sin Catas Recibidas' : 'No Received Tastings')}
              </ThemedText>
              <ThemedText style={styles.emptySubtitle}>
                {activeTab === 'my_tastings'
                  ? t('startFirstTasting')
                  : (language === 'es'
                      ? 'Cuando otro juez te comparta una ficha por WhatsApp o AirDrop, aparecerá aquí.'
                      : 'When a co-judge shares a scoresheet with you via WhatsApp or AirDrop, it will appear here.')}
              </ThemedText>
              {activeTab === 'my_tastings' && (
                <Pressable
                  onPress={() => router.push('/judge-simulator' as any)}
                  style={({ pressed }) => [styles.emptyCtaBtn, pressed && { opacity: 0.85 }]}
                >
                  <ThemedText style={styles.emptyCtaBtnText}>+ {t('newTasting')}</ThemedText>
                </Pressable>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <TastingCard
              tasting={item}
              language={language}
              judgeProfile={profile}
              isShared={!isOwnTasting(item)}
            />
          )}
        />

        {/* Filter Selection Modal Sheet */}
        <Modal
          visible={filterModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setFilterModalVisible(false)}
          >
            <Pressable style={styles.filterModalCard} onPress={(e) => e.stopPropagation()}>
              <View style={styles.filterModalHeader}>
                <ThemedText style={styles.filterModalTitle}>
                  {language === 'es' ? 'Filtrar por Puntuación' : 'Filter by Score'}
                </ThemedText>
                <Pressable
                  onPress={() => {
                    setSelectedFilter('all');
                    setFilterModalVisible(false);
                  }}
                >
                  <ThemedText style={styles.filterResetText}>
                    {language === 'es' ? 'Restablecer' : 'Reset'}
                  </ThemedText>
                </Pressable>
              </View>

              <View style={styles.filterOptionsList}>
                {filterOptions.map((opt) => {
                  const isSelected = selectedFilter === opt.id;
                  return (
                    <Pressable
                      key={opt.id}
                      onPress={() => {
                        setSelectedFilter(opt.id);
                        setFilterModalVisible(false);
                      }}
                      style={[
                        styles.filterOptionItem,
                        isSelected && styles.filterOptionItemSelected,
                      ]}
                    >
                      <View style={styles.filterOptionLeft}>
                        <View
                          style={[
                            styles.filterOptionColorDot,
                            { backgroundColor: opt.color },
                          ]}
                        />
                        <ThemedText
                          style={[
                            styles.filterOptionText,
                            isSelected && { color: '#FFFFFF', fontWeight: 'bold' },
                          ]}
                        >
                          {language === 'es' ? opt.label_es : opt.label_en}
                        </ThemedText>
                      </View>
                      {isSelected && (
                        <ThemedText style={styles.filterOptionCheck}>✓</ThemedText>
                      )}
                    </Pressable>
                  );
                })}
              </View>

              <Pressable
                onPress={() => setFilterModalVisible(false)}
                style={styles.filterApplyBtn}
              >
                <ThemedText style={styles.filterApplyBtnText}>
                  {language === 'es' ? 'Cerrar' : 'Close'}
                </ThemedText>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </ThemedView>
  );
}

function TastingCard({
  tasting,
  language,
  judgeProfile,
  isShared,
}: {
  tasting: TastingNote;
  language: 'es' | 'en';
  judgeProfile?: any;
  isShared?: boolean;
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
      {/* 1. Large Vertical Thumbnail */}
      <View style={styles.cardThumbnailWrapper}>
        {tasting.photoUrl ? (
          <Image source={{ uri: tasting.photoUrl }} style={styles.cardThumbnail} />
        ) : tasting.labelPhotoUrl ? (
          <Image source={{ uri: tasting.labelPhotoUrl }} style={styles.cardThumbnail} />
        ) : (
          <View style={styles.cardThumbnailPlaceholder}>
            <BeerGlassThumbSvg size={38} />
          </View>
        )}
      </View>

      {/* 2. Beer Info */}
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

        {/* Evaluator Judge Tag (for shared tastings) */}
        {isShared && tasting.judgeName ? (
          <View style={styles.sharedJudgeBadge}>
            <ThemedText style={styles.sharedJudgeBadgeText} numberOfLines={1}>
              👤 {tasting.judgeName}
            </ThemedText>
          </View>
        ) : null}

        <ThemedText style={styles.cardDate}>{formattedDate}</ThemedText>
      </View>

      {/* 3. Large Prominent Score Badge */}
      <View
        style={[
          styles.cardScoreBadge,
          { borderColor: quality.color, backgroundColor: 'rgba(0, 0, 0, 0.4)' },
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
    paddingHorizontal: 24,
    paddingVertical: 8,
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
    borderRadius: 14,
  },
  newTastingBtnText: {
    color: '#0A0C10',
    fontSize: 13,
    fontFamily: Fonts.spaceGroteskBold,
  },
  tabBarContainer: {
    flexDirection: 'row',
    marginHorizontal: Spacing.four,
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 14,
    padding: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  tabButtonText: {
    fontSize: 12,
    fontFamily: Fonts.inter,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontFamily: Fonts.spaceGroteskBold,
    fontWeight: '700',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    marginHorizontal: Spacing.four,
    borderRadius: 16,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    marginBottom: Spacing.two,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: Fonts.spaceGroteskBold,
    lineHeight: 22,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 10,
    fontFamily: Fonts.inter,
    marginTop: 2,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchAndFilterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
    gap: 8,
    marginBottom: Spacing.two,
  },
  searchContainer: {
    flex: 1,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: Fonts.inter,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  filterBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    position: 'relative',
  },
  filterBtnActive: {
    backgroundColor: '#F2B824',
    borderColor: '#F2B824',
  },
  filterActiveDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0A0C10',
  },
  activeFilterTagRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.two,
  },
  activeFilterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  activeFilterTagText: {
    fontSize: 11,
    fontFamily: Fonts.manropeBold,
  },
  activeFilterRemoveText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.six,
    gap: Spacing.two,
  },
  tastingCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    gap: 12,
  },
  cardThumbnailWrapper: {
    width: 72,
    height: 90,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
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
  cardInfo: {
    flex: 1,
    gap: 3,
  },
  cardBeerName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: Fonts.spaceGroteskBold,
  },
  cardBrewery: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontFamily: Fonts.inter,
  },
  cardStyleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  cardStyleId: {
    color: '#F2B824',
    fontSize: 11,
    fontFamily: Fonts.spaceGroteskBold,
    fontWeight: '800',
  },
  cardStyleName: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    fontFamily: Fonts.inter,
    flex: 1,
  },
  sharedJudgeBadge: {
    backgroundColor: 'rgba(242, 184, 36, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 2,
    borderWidth: 1,
    borderColor: 'rgba(242, 184, 36, 0.3)',
  },
  sharedJudgeBadgeText: {
    color: '#F2B824',
    fontSize: 10,
    fontFamily: Fonts.manropeBold,
  },
  cardDate: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 10,
    fontFamily: Fonts.inter,
    marginTop: 2,
  },
  cardScoreBadge: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  cardScoreNumber: {
    fontSize: 24,
    fontFamily: Fonts.spaceGroteskBold,
    fontWeight: '900',
  },
  cardScoreMax: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    marginLeft: 1,
  },
  cardTierPill: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 3,
  },
  cardTierText: {
    fontSize: 8.5,
    fontFamily: Fonts.spaceGroteskBold,
    textTransform: 'uppercase',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.six,
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  emptyIconWrapper: {
    marginBottom: Spacing.two,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: Fonts.spaceGroteskBold,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    fontFamily: Fonts.inter,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 260,
  },
  emptyCtaBtn: {
    backgroundColor: '#F2B824',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: Spacing.two,
  },
  emptyCtaBtnText: {
    color: '#0A0C10',
    fontSize: 14,
    fontFamily: Fonts.spaceGroteskBold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  filterModalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#1C3E4F',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 16,
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterModalTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: Fonts.spaceGroteskBold,
  },
  filterResetText: {
    color: '#F2B824',
    fontSize: 12,
    fontFamily: Fonts.manropeBold,
  },
  filterOptionsList: {
    gap: 6,
  },
  filterOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  filterOptionItemSelected: {
    backgroundColor: 'rgba(242, 184, 36, 0.2)',
    borderWidth: 1,
    borderColor: '#F2B824',
  },
  filterOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  filterOptionColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  filterOptionText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    fontFamily: Fonts.inter,
  },
  filterOptionCheck: {
    color: '#F2B824',
    fontSize: 14,
    fontWeight: 'bold',
  },
  filterApplyBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterApplyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: Fonts.spaceGroteskBold,
  },
});
