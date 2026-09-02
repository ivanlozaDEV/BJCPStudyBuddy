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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Fonts } from '@/constants/theme';
import { useTranslation } from '@/context/language-context';
import { useAuth } from '@/context/auth-context';
import { usePurchases } from '@/context/purchases-context';
import { useTastings } from '@/context/tastings-context';
import { exportBackupFile, importBackupFile } from '@/services/backup-service';

const BJCP_RANKS = [
  'Apprentice',
  'Recognized',
  'Certified',
  'National',
  'Master',
  'Grand Master',
] as const;

export default function SettingsScreen() {
  const { t, language, setLanguage } = useTranslation();
  const { profile, updateProfile } = useAuth();
  const { isPro, restorePurchases } = usePurchases();
  const { reloadTastings, stats } = useTastings();

  // Edit Profile Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

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

  const handleSaveProfile = async () => {
    await updateProfile({
      fullName: tempName.trim() || displayJudgeName,
      bjcpRank: tempRank,
      bjcpId: tempId.trim() || undefined,
    });
    setEditModalVisible(false);
    Alert.alert(
      language === 'es' ? 'Perfil Actualizado' : 'Profile Updated',
      language === 'es' ? 'Tus datos de juez han sido guardados localmente.' : 'Your judge profile has been saved locally.'
    );
  };

  const handleExportBackup = async () => {
    try {
      setIsExporting(true);
      const res = await exportBackupFile(language);
      if (!res.success && res.message) {
        Alert.alert(
          language === 'es' ? 'Exportar Respaldo' : 'Export Backup',
          res.message
        );
      }
    } catch (e: any) {
      Alert.alert(
        language === 'es' ? 'Error' : 'Error',
        e?.message || (language === 'es' ? 'No se pudo exportar.' : 'Export failed.')
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportBackup = async () => {
    Alert.alert(
      language === 'es' ? '📥 Importar Copia de Seguridad' : '📥 Import Backup File',
      language === 'es'
        ? 'Al importar el archivo se restaurarán todas las catas, puntuaciones y progreso en este dispositivo. ¿Deseas continuar?'
        : 'Importing will restore all tastings, scoresheets, and progress onto this device. Continue?',
      [
        { text: language === 'es' ? 'Cancelar' : 'Cancel', style: 'cancel' },
        {
          text: language === 'es' ? 'Seleccionar Archivo' : 'Choose File',
          onPress: async () => {
            try {
              setIsImporting(true);
              const res = await importBackupFile(language);
              if (res.success) {
                await reloadTastings();
                Alert.alert(
                  language === 'es' ? '¡Restauración Exitosa!' : 'Restore Successful!',
                  language === 'es'
                    ? `Se han restaurado correctamente ${res.count || 0} catas y todo tu progreso de estudio.`
                    : `Successfully restored ${res.count || 0} tastings and study progress.`
                );
              } else if (res.message && res.message !== 'canceled') {
                Alert.alert(
                  language === 'es' ? 'Error al Importar' : 'Import Error',
                  res.message
                );
              }
            } catch (e: any) {
              Alert.alert(
                language === 'es' ? 'Error' : 'Error',
                e?.message || (language === 'es' ? 'No se pudo importar.' : 'Import failed.')
              );
            } finally {
              setIsImporting(false);
            }
          },
        },
      ]
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
                '@bjcp_failed_questions_pool',
                '@bjcp_quiz_seen_ids',
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
          <ThemedText style={styles.rowTitle}>{title}</ThemedText>
        </View>
        <View style={styles.rowRight}>
          {valueText && (
            <ThemedText style={styles.rowValue}>{valueText}</ThemedText>
          )}
          {rightElement}
          {onPress && !rightElement && (
            <ThemedText style={styles.rowChevron}>›</ThemedText>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>{t('settings')}</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            {language === 'es' ? 'Configuración, perfil y respaldo local' : 'Settings, judge profile & local backup'}
          </ThemedText>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* 1. Judge Profile Card */}
          <View style={styles.sectionContainer}>
            <ThemedText style={styles.sectionHeader}>
              {language === 'es' ? 'PERFIL DE JUEZ BJCP' : 'BJCP JUDGE PROFILE'}
            </ThemedText>
            
            <View style={styles.card}>
              <View style={styles.profileHeader}>
                <View style={styles.avatarCircle}>
                  <ThemedText style={styles.avatarText}>
                    {displayJudgeName.charAt(0).toUpperCase()}
                  </ThemedText>
                </View>
                <View style={styles.profileInfo}>
                  <ThemedText style={styles.judgeName} numberOfLines={1}>
                    {displayJudgeName}
                  </ThemedText>
                  <View style={styles.rankBadge}>
                    <ThemedText style={styles.rankBadgeText}>
                      {profile.bjcpRank.toUpperCase()}
                    </ThemedText>
                  </View>
                  {profile.bjcpId ? (
                    <ThemedText style={styles.judgeId}>ID: {profile.bjcpId}</ThemedText>
                  ) : null}
                </View>
                <Pressable
                  style={styles.editProfileButton}
                  onPress={() => {
                    setTempName(profile.fullName);
                    setTempRank(profile.bjcpRank);
                    setTempId(profile.bjcpId || '');
                    setEditModalVisible(true);
                  }}
                >
                  <ThemedText style={styles.editProfileText}>
                    {language === 'es' ? 'Editar' : 'Edit'}
                  </ThemedText>
                </Pressable>
              </View>

              <View style={styles.divider} />

              <View style={styles.profileStatsRow}>
                <View style={styles.profileStatItem}>
                  <ThemedText style={styles.profileStatValue}>{stats.totalTastings}</ThemedText>
                  <ThemedText style={styles.profileStatLabel}>
                    {language === 'es' ? 'Catas' : 'Tastings'}
                  </ThemedText>
                </View>
                <View style={styles.profileStatDivider} />
                <View style={styles.profileStatItem}>
                  <ThemedText style={styles.profileStatValue}>{stats.averageScore || '-'}</ThemedText>
                  <ThemedText style={styles.profileStatLabel}>
                    {language === 'es' ? 'Promedio' : 'Avg Score'}
                  </ThemedText>
                </View>
                <View style={styles.profileStatDivider} />
                <View style={styles.profileStatItem}>
                  <ThemedText style={styles.profileStatValue}>{stats.stylesCount}</ThemedText>
                  <ThemedText style={styles.profileStatLabel}>
                    {language === 'es' ? 'Estilos' : 'Styles'}
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>

          {/* 2. Respaldo y Traslado entre Teléfonos */}
          <View style={styles.sectionContainer}>
            <ThemedText style={styles.sectionHeader}>
              {language === 'es' ? 'RESPALDO Y TRASLADO DE DATOS' : 'DATA BACKUP & TRANSFER'}
            </ThemedText>

            <View style={styles.card}>
              <View style={styles.privacyBadgeRow}>
                <ThemedText style={styles.privacyIcon}>🔒</ThemedText>
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.privacyTitle}>
                    {language === 'es' ? 'Almacenamiento 100% Local y Privado' : '100% Local & Private Storage'}
                  </ThemedText>
                  <ThemedText style={styles.privacyDesc}>
                    {language === 'es'
                      ? 'Tus notas de cata y progreso se guardan de forma segura en este teléfono sin servidores externos.'
                      : 'Your tasting notes and study records are stored securely on this phone with zero external servers.'}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.divider} />

              {renderSettingRow(
                '📤',
                language === 'es' ? 'Exportar Copia de Seguridad' : 'Export Backup File',
                undefined,
                handleExportBackup,
                isExporting ? <ActivityIndicator size="small" color="#f59e0b" /> : undefined
              )}

              <View style={styles.divider} />

              {renderSettingRow(
                '📥',
                language === 'es' ? 'Importar Copia de Seguridad' : 'Import Backup File',
                undefined,
                handleImportBackup,
                isImporting ? <ActivityIndicator size="small" color="#f59e0b" /> : undefined
              )}
            </View>

            <ThemedText style={styles.backupHint}>
              {language === 'es'
                ? '💡 Consejo: Al cambiar de teléfono, exporta tu copia por AirDrop, WhatsApp o Archivos de iCloud e impórtala en tu nuevo dispositivo en 1 segundo.'
                : '💡 Tip: When switching phones, export your backup via AirDrop, WhatsApp, or iCloud Files and import it onto your new device in 1 second.'}
            </ThemedText>
          </View>

          {/* 3. Suscripción PRO / Lifetime */}
          <View style={styles.sectionContainer}>
            <ThemedText style={styles.sectionHeader}>
              {language === 'es' ? 'MEMBRESÍA PRO' : 'PRO MEMBERSHIP'}
            </ThemedText>

            <View style={[styles.card, isPro && styles.proCardGlow]}>
              {isPro ? (
                <View style={styles.proActiveCard}>
                  <View style={styles.proActiveHeader}>
                    <ThemedText style={styles.proActiveTitle}>
                      BrewStudy <ThemedText style={styles.proGolden}>PRO</ThemedText>
                    </ThemedText>
                    <View style={styles.lifetimeBadge}>
                      <ThemedText style={styles.lifetimeBadgeText}>
                        {language === 'es' ? 'LIFETIME' : 'LIFETIME'}
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText style={styles.proActiveDesc}>
                    {language === 'es'
                      ? '✨ Tienes acceso ilimitado de por vida al simulador de 50 pts, banco curado de preguntas y comparador avanzado.'
                      : '✨ You have lifetime unlimited access to 50-pt simulator, curated question bank, and style comparator.'}
                  </ThemedText>
                  
                  <View style={styles.divider} />

                  {renderSettingRow(
                    '🔄',
                    language === 'es' ? 'Restaurar Compras de Apple' : 'Restore Apple Purchases',
                    undefined,
                    async () => {
                      const ok = await restorePurchases();
                      Alert.alert(
                        language === 'es' ? 'Restaurar Compras' : 'Restore Purchases',
                        ok
                          ? language === 'es' ? 'Tu acceso PRO de por vida ha sido verificado.' : 'Your lifetime PRO access has been verified.'
                          : language === 'es' ? 'No se encontraron compras previas.' : 'No previous purchases found.'
                      );
                    }
                  )}
                </View>
              ) : (
                <Pressable
                  style={styles.proUpgradeBanner}
                  onPress={() => router.push('/paywall' as any)}
                >
                  <View style={styles.proUpgradeLeft}>
                    <ThemedText style={styles.proUpgradeTitle}>
                      {language === 'es' ? 'Desbloquear BrewStudy PRO' : 'Unlock BrewStudy PRO'}
                    </ThemedText>
                    <ThemedText style={styles.proUpgradeSubtitle}>
                      {language === 'es' ? '$9.99 Pago Único • Para Siempre' : '$9.99 One-Time Payment • Lifetime'}
                    </ThemedText>
                  </View>
                  <View style={styles.proUpgradeButton}>
                    <ThemedText style={styles.proUpgradeButtonText}>
                      {language === 'es' ? 'Ver PRO' : 'Get PRO'}
                    </ThemedText>
                  </View>
                </Pressable>
              )}
            </View>
          </View>

          {/* 4. Preferencias y Estudio */}
          <View style={styles.sectionContainer}>
            <ThemedText style={styles.sectionHeader}>
              {language === 'es' ? 'PREFERENCIAS' : 'PREFERENCES'}
            </ThemedText>

            <View style={styles.card}>
              {renderSettingRow(
                '🌐',
                language === 'es' ? 'Idioma' : 'Language',
                language === 'es' ? 'Español' : 'English',
                toggleLanguage
              )}

              <View style={styles.divider} />

              {renderSettingRow(
                '🔄',
                language === 'es' ? 'Restablecer Progreso de Estudio' : 'Reset Study Progress',
                undefined,
                handleResetProgress
              )}
            </View>
          </View>

          {/* 5. Información Legal & BJCP */}
          <View style={styles.sectionContainer}>
            <ThemedText style={styles.sectionHeader}>
              {language === 'es' ? 'INFORMACIÓN' : 'ABOUT'}
            </ThemedText>

            <View style={styles.card}>
              {renderSettingRow(
                '🍺',
                language === 'es' ? 'Guía Oficial BJCP 2021' : 'Official BJCP Guidelines 2021',
                undefined,
                () => Linking.openURL('https://www.bjcp.org/style/2021/beer/')
              )}

              <View style={styles.divider} />

              {renderSettingRow(
                '📱',
                language === 'es' ? 'Versión de la App' : 'App Version',
                '2.1.0 (Lifetime)',
                undefined
              )}
            </View>
          </View>

          <View style={{ height: BottomTabInset + 40 }} />
        </ScrollView>
      </SafeAreaView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>
              {language === 'es' ? 'Editar Perfil de Juez' : 'Edit Judge Profile'}
            </ThemedText>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>
                {language === 'es' ? 'Nombre o Alias de Juez' : 'Judge Name or Alias'}
              </ThemedText>
              <TextInput
                style={styles.textInput}
                value={tempName}
                onChangeText={setTempName}
                placeholder={language === 'es' ? 'Ej. Juan Pérez' : 'e.g. John Doe'}
                placeholderTextColor="#64748b"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>
                {language === 'es' ? 'Rango BJCP' : 'BJCP Rank'}
              </ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rankPicker}>
                {BJCP_RANKS.map((r) => (
                  <Pressable
                    key={r}
                    onPress={() => setTempRank(r)}
                    style={[
                      styles.rankOption,
                      tempRank === r && styles.rankOptionSelected,
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.rankOptionText,
                        tempRank === r && styles.rankOptionTextSelected,
                      ]}
                    >
                      {r}
                    </ThemedText>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>
                {language === 'es' ? 'ID BJCP (Opcional)' : 'BJCP ID (Optional)'}
              </ThemedText>
              <TextInput
                style={styles.textInput}
                value={tempId}
                onChangeText={setTempId}
                placeholder="Ej. B1234"
                placeholderTextColor="#64748b"
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <ThemedText style={styles.cancelButtonText}>
                  {language === 'es' ? 'Cancelar' : 'Cancel'}
                </ThemedText>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveProfile}
              >
                <ThemedText style={styles.saveButtonText}>
                  {language === 'es' ? 'Guardar' : 'Save'}
                </ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1d',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#f8fafc',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
    fontFamily: Fonts.inter,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 11,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#64748b',
    letterSpacing: 1,
    marginBottom: 6,
    marginLeft: 4,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    overflow: 'hidden',
  },
  proCardGlow: {
    borderColor: 'rgba(245, 158, 11, 0.3)',
    backgroundColor: 'rgba(245, 158, 11, 0.04)',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 22,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#0f172a',
  },
  profileInfo: {
    flex: 1,
  },
  judgeName: {
    fontSize: 17,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#f8fafc',
  },
  rankBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  rankBadgeText: {
    fontSize: 10,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#f59e0b',
    letterSpacing: 0.5,
  },
  judgeId: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 3,
    fontFamily: Fonts.inter,
  },
  editProfileButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  editProfileText: {
    fontSize: 12,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#cbd5e1',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  profileStatsRow: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  profileStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  profileStatValue: {
    fontSize: 17,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#f59e0b',
  },
  profileStatLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
    fontFamily: Fonts.inter,
  },
  profileStatDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  privacyBadgeRow: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  privacyIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  privacyTitle: {
    fontSize: 14,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#f8fafc',
  },
  privacyDesc: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
    lineHeight: 16,
    fontFamily: Fonts.inter,
  },
  backupHint: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 6,
    marginLeft: 6,
    lineHeight: 15,
    fontFamily: Fonts.inter,
  },
  rowPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  rowTitle: {
    fontSize: 14,
    fontFamily: Fonts.inter,
    color: '#f1f5f9',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowValue: {
    fontSize: 13,
    color: '#94a3b8',
    marginRight: 6,
    fontFamily: Fonts.inter,
  },
  rowChevron: {
    fontSize: 18,
    color: '#64748b',
  },
  proActiveCard: {
    padding: 16,
  },
  proActiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  proActiveTitle: {
    fontSize: 17,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#f8fafc',
  },
  proGolden: {
    color: '#f59e0b',
    fontFamily: Fonts.spaceGroteskBold,
  },
  lifetimeBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  lifetimeBadgeText: {
    fontSize: 9,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#0f172a',
    letterSpacing: 0.5,
  },
  proActiveDesc: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 6,
    marginBottom: 8,
    lineHeight: 16,
    fontFamily: Fonts.inter,
  },
  proUpgradeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
  },
  proUpgradeLeft: {
    flex: 1,
    paddingRight: 10,
  },
  proUpgradeTitle: {
    fontSize: 15,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#f59e0b',
  },
  proUpgradeSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
    fontFamily: Fonts.inter,
  },
  proUpgradeButton: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  proUpgradeButtonText: {
    fontSize: 12,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#0f172a',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#f8fafc',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#94a3b8',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#f8fafc',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    fontFamily: Fonts.inter,
  },
  rankPicker: {
    flexDirection: 'row',
  },
  rankOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rankOptionSelected: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: '#f59e0b',
  },
  rankOptionText: {
    fontSize: 12,
    color: '#94a3b8',
    fontFamily: Fonts.inter,
  },
  rankOptionTextSelected: {
    color: '#f59e0b',
    fontFamily: Fonts.spaceGroteskBold,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#cbd5e1',
    fontFamily: Fonts.spaceGroteskBold,
  },
  saveButton: {
    backgroundColor: '#f59e0b',
  },
  saveButtonText: {
    fontSize: 14,
    color: '#0f172a',
    fontFamily: Fonts.spaceGroteskBold,
  },
});
