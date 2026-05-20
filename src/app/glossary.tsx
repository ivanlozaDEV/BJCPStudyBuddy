import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Pressable, 
  ScrollView, 
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/context/language-context';
import { GLOSSARY_DATA, TAG_DEFINITIONS_DATA } from '@/data/glossary';
import { BottomTabInset, Fonts, Spacing, MaxContentWidth } from '@/constants/theme';
import { fuzzyMatch } from '@/utils/fuzzy';

export default function GlossaryScreen() {
  const theme = useTheme();
  const { t, language } = useTranslation();

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'concepts' | 'tags'>('concepts');

  // 1. Localized and filtered glossary list
  const glossaryList = GLOSSARY_DATA.map(g => ({
    id: g.id,
    name: language === 'es' ? g.name_es : g.name_en,
    definition: language === 'es' ? g.definition_es : g.definition_en,
  }));

  const filteredGlossary = glossaryList
    .filter(g => fuzzyMatch(searchQuery, [g.name, g.definition]))
    .sort((a, b) => a.name.localeCompare(b.name));

  // 2. Localized and filtered tags list
  const tagsList = TAG_DEFINITIONS_DATA.map(tData => ({
    id: tData.tag,
    name: language === 'es' ? tData.name_es : tData.name_en,
    definition: language === 'es' ? tData.description_es : tData.description_en,
  }));

  const filteredTags = tagsList
    .filter(tData => fuzzyMatch(searchQuery, [tData.name, tData.definition]))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Active selection projection
  const activeList = activeTab === 'concepts' ? filteredGlossary : filteredTags;

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Sticky Premium Header */}
        <View style={styles.header}>
          <Pressable 
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/');
              }
            }} 
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <ThemedText style={styles.headerTitle}>{t('glossaryTitle')}</ThemedText>
          <View style={{ width: 40 }} />
        </View>

        {/* Live Search Filter Box */}
        <View style={styles.searchWrapper}>
          <TextInput
            style={[styles.searchInput, { 
              backgroundColor: theme.backgroundElement, 
              color: theme.text,
              borderColor: theme.border
            }]}
            placeholder={t('searchGlossary')}
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>

        {/* Sleek Segmented Control Switcher */}
        <View style={styles.tabContainer}>
          <Pressable 
            style={[
              styles.tabButton, 
              activeTab === 'concepts' && { backgroundColor: theme.tint }
            ]} 
            onPress={() => setActiveTab('concepts')}
          >
            <Text style={[
              styles.tabText, 
              { color: activeTab === 'concepts' ? '#FFFFFF' : theme.textSecondary }
            ]}>
              {language === 'es' ? 'Conceptos' : 'Concepts'}
            </Text>
          </Pressable>
          
          <Pressable 
            style={[
              styles.tabButton, 
              activeTab === 'tags' && { backgroundColor: theme.tint }
            ]} 
            onPress={() => setActiveTab('tags')}
          >
            <Text style={[
              styles.tabText, 
              { color: activeTab === 'tags' ? '#FFFFFF' : theme.textSecondary }
            ]}>
              {language === 'es' ? 'Etiquetas' : 'Style Tags'}
            </Text>
          </Pressable>
        </View>

        {/* Dynamic Scrollable Glossary Dictionary */}
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeList.length === 0 ? (
            <View style={[styles.noResultsContainer, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              <Text style={styles.noResultsIcon}>📖</Text>
              <Text style={[styles.noResultsText, { color: theme.textSecondary }]}>
                {language === 'es' ? 'Ningún término coincide con tu búsqueda.' : 'No terms match your search.'}
              </Text>
            </View>
          ) : (
            activeList.map((item) => (
              <View 
                key={item.id}
                style={[
                  styles.termCard,
                  { 
                    backgroundColor: theme.backgroundElement, 
                    borderColor: theme.border 
                  }
                ]}
              >
                <View style={styles.cardHeader}>
                  {/* Styled Rounded Index/Hash Badge */}
                  <View style={[styles.letterBadge, { backgroundColor: theme.backgroundSelected }]}>
                    <Text style={[styles.letterText, { color: theme.tint }]}>
                      {activeTab === 'concepts' ? item.name.charAt(0).toUpperCase() : '#'}
                    </Text>
                  </View>
                  <Text style={[styles.termName, { color: theme.text }]}>{item.name}</Text>
                </View>

                <View style={styles.cardBody}>
                  <Text style={[styles.termDefinition, { color: theme.textSecondary }]}>
                    {item.definition}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
    height: 48,
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
    fontSize: 22,
    fontWeight: 'bold',
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
  searchWrapper: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
    paddingTop: Spacing.one,
  },
  searchInput: {
    height: 46,
    borderRadius: Spacing.two,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.four,
    fontSize: 14,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.three,
    gap: Spacing.two,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: Fonts.spaceGroteskBold,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.five,
    gap: Spacing.three,
  },
  termCard: {
    borderRadius: Spacing.three,
    borderWidth: 1,
    padding: Spacing.four,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginBottom: Spacing.two,
  },
  letterBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterText: {
    fontSize: 14,
    fontWeight: '900',
    fontFamily: Fonts.spaceGroteskBold,
  },
  termName: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: Fonts.spaceGroteskBold,
    flex: 1,
  },
  cardBody: {
    marginTop: Spacing.one,
  },
  termDefinition: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
  noResultsContainer: {
    padding: Spacing.five,
    borderRadius: Spacing.three,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.five,
  },
  noResultsIcon: {
    fontSize: 48,
    marginBottom: Spacing.three,
  },
  noResultsText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
  },
});
