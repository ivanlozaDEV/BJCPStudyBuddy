import React, { useState } from 'react';
import {
  StyleSheet,
  Pressable,
  View,
  ScrollView,
  Alert,
  Linking,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/context/language-context';
import { useAuth } from '@/context/auth-context';
import { useTastings } from '@/context/tastings-context';
import { isSupabaseConfigured } from '@/services/supabase';

const BJCP_RANKS = [
  'Apprentice',
  'Recognized',
  'Certified',
  'National',
  'Master',
  'Grand Master',
] as const;

export default function SettingsScreen() {
  const theme = useTheme();
  const { t, language, setLanguage } = useTranslation();
  const { profile, updateProfile, user } = useAuth();
  const { syncWithCloud } = useTastings();

  // Edit Profile Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const isDefaultJudgeName =
    !profile.fullName ||
    profile.fullName === 'Juez en Formación' ||
    profile.fullName === 'Judge in Training';
  const displayJudgeName = isDefaultJudgeName
    ? language === 'es'
      ? 'Juez en Formación'
      : 'Judge in Training'
    : profile.fullName;

  const [tempName, setTempName] = useState(profile.fullName);
  const [tempRank, setTempRank] = useState(profile.bjcpRank);
  const [tempId, setTempId] = useState(profile.bjcpId || '');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSaveProfile = async () => {
    await updateProfile({
      fullName: tempName.trim() || displayJudgeName,
      bjcpRank: tempRank,
      bjcpId: tempId.trim() || undefined,
    });
    setEditModalVisible(false);
    Alert.alert(
      language === 'es' ? 'Perfil Actualizado' : 'Profile Updated',
      language === 'es' ? 'Tus datos de juez han sido guardados.' : 'Your judge profile has been saved.'
    );
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await syncWithCloud();
    setIsSyncing(false);
    Alert.alert(
      language === 'es' ? 'Sincronización' : 'Sync',
      language === 'es'
        ? isSupabaseConfigured()
          ? 'Tus datos han sido sincronizados con la nube de Supabase.'
          : 'Modo Local activo. Los datos están respaldados localmente en tu dispositivo.'
        : isSupabaseConfigured()
        ? 'Your data has been synchronized with Supabase cloud.'
        : 'Local Mode active. Data is backed up on your device.'
    );
  };

  const handleResetProgress = () => {
    Alert.alert(
      t('resetTitle'),
      t('resetMessage'),
      [
        { text: language === 'es' ? 'Cancelar' : 'Cancel', style: 'cancel' },
        { 
          text: language === 'es' ? 'Restablecer' : 'Reset', 
          style: 'destructive', 
          onPress: async () => {
            try {
              const keys = [
                '@BJCPStudyBuddy:fcStudyMode',
                '@BJCPStudyBuddy:selectedCategory',
                '@BJCPStudyBuddy:answeredStyles',
                '@BJCPStudyBuddy:answeredGlossary',
                '@BJCPStudyBuddy:answeredOffFlavors',
                '@BJCPStudyBuddy:fcScore',
                '@BJCPStudyBuddy:sessionStylesIds',
                '@BJCPStudyBuddy:currentStyleId',
                '@BJCPStudyBuddy:sessionGlossaryIds',
                '@BJCPStudyBuddy:currentGlossaryId',
                '@BJCPStudyBuddy:sessionOffFlavorsIds',
                '@BJCPStudyBuddy:currentOffFlavorId',
                '@bjcp_flashcard_history',
              ];
              await AsyncStorage.multiRemove(keys);
              Alert.alert(
                language === 'es' ? 'Completado' : 'Success',
                t('resetSuccess')
              );
            } catch {
              Alert.alert(
                language === 'es' ? 'Error' : 'Error',
                language === 'es' ? 'No se pudo restablecer.' : 'Failed to reset.'
              );
            }
          }
        }
      ]
    );
  };

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  const renderSettingRow = (
    icon: string, 
    title: string, 
    valueText?: string, 
    onPress?: () => void, 
    rightElement?: React.ReactNode
  ) => {
    return (
      <Pressable 
        onPress={onPress}
        disabled={!onPress}
        style={({ pressed }) => [
          styles.rowPressable,
          pressed && onPress && styles.rowPressed
        ]}
      >
        <View style={styles.rowLeft}>
          <ThemedText style={styles.rowIcon}>{icon}</ThemedText>
          <ThemedText type="default" style={styles.rowTitle}>{title}</ThemedText>
        </View>
        <View style={styles.rowRight}>
          {valueText && (
            <ThemedText type="small" themeColor="textSecondary" style={styles.valueText}>
              {valueText}
            </ThemedText>
          )}
          {rightElement}
          {onPress && !rightElement && (
            <ThemedText style={{ color: theme.textSecondary, fontSize: 16 }}>➔</ThemedText>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <ThemedView type="tint" style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        
        {/* Header with Back Button */}
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
            <ThemedText style={styles.backText}>←</ThemedText>
          </Pressable>
          
          <ThemedText type="subtitle" style={styles.title}>
            {t('settings')}
          </ThemedText>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Judge Profile Card */}
          <View style={styles.sectionHeader}>
            <ThemedText type="smallBold" style={styles.sectionTitle}>
              {t('accountAndSync')}
            </ThemedText>
          </View>
          <ThemedView type="backgroundElement" style={styles.settingsGroup}>
            <Pressable
              onPress={() => {
                setTempName(isDefaultJudgeName ? displayJudgeName : profile.fullName);
                setTempRank(profile.bjcpRank);
                setTempId(profile.bjcpId || '');
                setEditModalVisible(true);
              }}
              style={styles.profileRow}
            >
              <View style={styles.profileAvatar}>
                <ThemedText style={{ fontSize: 24 }}>🎓</ThemedText>
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.profileNameText}>{displayJudgeName}</ThemedText>
                <ThemedText style={styles.profileRankText}>
                  {profile.bjcpRank} Judge {profile.bjcpId ? `• #${profile.bjcpId}` : ''}
                </ThemedText>
              </View>
              <ThemedText style={styles.editProfilePill}>{t('editProfile')}</ThemedText>
            </Pressable>
            <View style={styles.divider} />
            {renderSettingRow(
              "☁️",
              t('syncStatus'),
              isSupabaseConfigured() ? (user ? t('synced') : 'Conectado (Invitado)') : t('offlineMode'),
              handleManualSync
            )}
          </ThemedView>

          {/* Group 1: Guide Information */}
          <View style={styles.sectionHeader}>
            <ThemedText type="smallBold" style={styles.sectionTitle}>
              {t('guideInfo')}
            </ThemedText>
          </View>
          <ThemedView type="backgroundElement" style={styles.settingsGroup}>
            {renderSettingRow("📚", t('activeGuide'), "BJCP 2021")}
          </ThemedView>

          {/* Group 2: Study Configuration */}
          <View style={styles.sectionHeader}>
            <ThemedText type="smallBold" style={styles.sectionTitle}>
              {t('studyConfig')}
            </ThemedText>
          </View>
          <ThemedView type="backgroundElement" style={styles.settingsGroup}>
            {renderSettingRow(
              "🌐", 
              t('appLanguage'), 
              language === 'es' ? '🇪🇸 Español' : '🇬🇧 English', 
              toggleLanguage
            )}
          </ThemedView>

          {/* Group 3: Resources & Links */}
          <View style={styles.sectionHeader}>
            <ThemedText type="smallBold" style={styles.sectionTitle}>
              {t('resources')}
            </ThemedText>
          </View>
          <ThemedView type="backgroundElement" style={styles.settingsGroup}>
            {renderSettingRow("🌐", t('officialSite'), undefined, () => Linking.openURL('https://www.bjcp.org'))}
            <View style={styles.divider} />
            {renderSettingRow("📬", t('appFeedback'), undefined, () => {
              Linking.openURL('mailto:soporte@banana-computer.com').catch(() => {
                Alert.alert(
                  language === 'es' ? 'Contacto' : 'Contact',
                  'soporte@banana-computer.com'
                );
              });
            })}
          </ThemedView>

          {/* Danger Zone */}
          <View style={styles.sectionHeader}>
            <ThemedText type="smallBold" style={styles.sectionTitle}>
              {t('dangerZone')}
            </ThemedText>
          </View>
          <Pressable 
            onPress={handleResetProgress}
            style={({ pressed }) => [
              styles.resetBtn,
              { backgroundColor: theme.backgroundElement },
              pressed && styles.rowPressed
            ]}
          >
            <ThemedText type="smallBold" style={{ color: '#D90429' }}>
              {t('resetStudyProgress')}
            </ThemedText>
          </Pressable>

          {/* Legal Disclaimer */}
          <View style={styles.sectionHeader}>
            <ThemedText type="smallBold" style={styles.sectionTitle}>
              {t('legalSection')}
            </ThemedText>
          </View>
          <View style={styles.disclaimerCard}>
            <ThemedText style={styles.disclaimerText}>
              {t('disclaimer')}
            </ThemedText>
          </View>

          {/* App Credits */}
          <View style={styles.creditsContainer}>
            <ThemedText type="code" style={styles.creditsText}>
              {t('credits1')}
            </ThemedText>
            <ThemedText type="code" style={styles.creditsText}>
              {t('credits2')}
            </ThemedText>
          </View>

        </ScrollView>

        {/* Edit Judge Profile Modal */}
        <Modal
          visible={editModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalTitle}>{t('editProfile')}</ThemedText>
                <Pressable
                  onPress={() => setEditModalVisible(false)}
                  style={({ pressed }) => [styles.modalCloseBtn, pressed && { opacity: 0.7 }]}
                >
                  <ThemedText style={styles.modalCloseText}>✕</ThemedText>
                </Pressable>
              </View>

              <View style={styles.modalBody}>
                <ThemedText style={styles.inputLabel}>{t('judgeName')}</ThemedText>
                <TextInput
                  style={styles.modalInput}
                  placeholder={language === 'es' ? 'Tu nombre o alias' : 'Your name or handle'}
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={tempName}
                  onChangeText={setTempName}
                />

                <ThemedText style={styles.inputLabel}>{t('judgeRank')}</ThemedText>
                <View style={styles.rankChipsRow}>
                  {BJCP_RANKS.map((rk) => (
                    <Pressable
                      key={rk}
                      onPress={() => setTempRank(rk)}
                      style={[
                        styles.rankChip,
                        tempRank === rk && styles.rankChipSelected,
                      ]}
                    >
                      <ThemedText
                        style={[
                          styles.rankChipText,
                          tempRank === rk && styles.rankChipTextSelected,
                        ]}
                      >
                        {rk}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>

                <ThemedText style={styles.inputLabel}>
                  {language === 'es' ? 'BJCP ID (Opcional)' : 'BJCP ID (Optional)'}
                </ThemedText>
                <TextInput
                  style={styles.modalInput}
                  placeholder={language === 'es' ? 'Ej. B1234, J5678...' : 'e.g. B1234, J5678...'}
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={tempId}
                  onChangeText={setTempId}
                />

                <Pressable
                  onPress={handleSaveProfile}
                  style={({ pressed }) => [styles.modalSaveBtn, pressed && { opacity: 0.85 }]}
                >
                  <ThemedText style={styles.modalSaveBtnText}>{t('save')}</ThemedText>
                </Pressable>
              </View>
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
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#2F5D73',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    marginBottom: Spacing.two,
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
  title: {
    fontSize: 20,
    fontWeight: '900',
    fontFamily: Fonts.spaceGroteskBold,
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.six,
    gap: Spacing.three,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    gap: Spacing.three,
  },
  profileAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileNameText: {
    fontSize: 16,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#0A0C10',
  },
  profileRankText: {
    fontSize: 12,
    fontFamily: Fonts.inter,
    color: '#555555',
    marginTop: 2,
  },
  editProfilePill: {
    color: '#2F5D73',
    fontSize: 12,
    fontFamily: Fonts.spaceGroteskBold,
    textDecorationLine: 'underline',
  },
  sectionHeader: {
    marginTop: Spacing.three,
    marginBottom: Spacing.half,
    paddingHorizontal: Spacing.one,
  },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 1,
    fontFamily: Fonts.manropeBold,
    color: '#FFFFFF',
  },
  settingsGroup: {
    borderRadius: Spacing.four,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  rowPressable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.three + Spacing.half,
    paddingHorizontal: Spacing.four,
  },
  rowPressed: {
    opacity: 0.7,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  rowIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Fonts.inter,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  valueText: {
    fontSize: 13,
    fontFamily: Fonts.inter,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128,128,128,0.08)',
    marginHorizontal: Spacing.four,
  },
  resetBtn: {
    borderRadius: Spacing.four,
    paddingVertical: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  creditsContainer: {
    alignItems: 'center',
    marginTop: Spacing.five,
    gap: Spacing.half,
  },
  creditsText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    fontFamily: Fonts.manrope,
  },
  disclaimerCard: {
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: Spacing.three,
  },
  disclaimerText: {
    fontSize: 11,
    lineHeight: 17,
    color: 'rgba(255,255,255,0.55)',
    fontFamily: Fonts.inter,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#1E3C4B',
    borderRadius: 24,
    padding: Spacing.four,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: Fonts.spaceGroteskBold,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalBody: {
    gap: Spacing.two,
  },
  inputLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    fontFamily: Fonts.manropeBold,
    textTransform: 'uppercase',
  },
  modalInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Fonts.inter,
    marginBottom: 4,
  },
  rankChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  rankChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  rankChipSelected: {
    backgroundColor: 'rgba(242, 184, 36, 0.2)',
    borderColor: '#F2B824',
  },
  rankChipText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11,
    fontFamily: Fonts.inter,
  },
  rankChipTextSelected: {
    color: '#F2B824',
    fontFamily: Fonts.spaceGroteskBold,
    fontWeight: 'bold',
  },
  modalSaveBtn: {
    backgroundColor: '#52B788',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.two,
  },
  modalSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: Fonts.spaceGroteskBold,
  },
});
