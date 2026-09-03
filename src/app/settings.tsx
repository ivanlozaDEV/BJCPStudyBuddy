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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/context/language-context';
import { useAuth } from '@/context/auth-context';
import { usePurchases } from '@/context/purchases-context';
import { useTastings } from '@/context/tastings-context';
import { exportBackupFile, importBackupFile } from '@/services/backup-service';
import { performICloudSync } from '@/services/icloud-sync-service';

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
  const { profile, updateProfile } = useAuth();
  const { isPro, restorePurchases } = usePurchases();
  const { reloadTastings, stats } = useTastings();

  // Defensive Profile State
  const safeProfile = profile || { fullName: 'Juez en Formación', bjcpRank: 'Apprentice' };
  const isDefaultJudgeName =
    !safeProfile.fullName ||
    safeProfile.fullName === 'Juez en Formación' ||
    safeProfile.fullName === 'Judge in Training';
  const displayJudgeName = isDefaultJudgeName
    ? language === 'es'
      ? 'Juez en Formación'
      : 'Judge in Training'
    : safeProfile.fullName;

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [tempName, setTempName] = useState(safeProfile.fullName || '');
  const [tempRank, setTempRank] = useState(safeProfile.bjcpRank || 'Apprentice');
  const [tempId, setTempId] = useState(safeProfile.bjcpId || '');
  const [tempAvatar, setTempAvatar] = useState(safeProfile.avatarUrl || '');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isSyncingICloud, setIsSyncingICloud] = useState(false);

  const safeBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handlePickAvatar = () => {
    Alert.alert(
      language === 'es' ? 'Foto de Perfil de Juez' : 'Judge Profile Photo',
      language === 'es' ? 'Selecciona una opción:' : 'Choose an option:',
      [
        {
          text: language === 'es' ? '📷 Tomar Foto' : '📷 Take Photo',
          onPress: async () => {
            try {
              const perm = await ImagePicker.requestCameraPermissionsAsync();
              if (!perm.granted) {
                Alert.alert(
                  language === 'es' ? 'Permiso Requerido' : 'Permission Required',
                  language === 'es' ? 'Se requiere acceso a la cámara para tomar una foto.' : 'Camera access is required.'
                );
                return;
              }
              const res = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });
              if (!res.canceled && res.assets && res.assets[0]) {
                setTempAvatar(res.assets[0].uri);
              }
            } catch (e) {
              console.warn('Error taking photo:', e);
            }
          },
        },
        {
          text: language === 'es' ? '🖼️ Elegir de la Galería' : '🖼️ Choose from Gallery',
          onPress: async () => {
            try {
              const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (!perm.granted) {
                Alert.alert(
                  language === 'es' ? 'Permiso Requerido' : 'Permission Required',
                  language === 'es' ? 'Se requiere acceso a tus fotos.' : 'Photo gallery access is required.'
                );
                return;
              }
              const res = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });
              if (!res.canceled && res.assets && res.assets[0]) {
                setTempAvatar(res.assets[0].uri);
              }
            } catch (e) {
              console.warn('Error picking image:', e);
            }
          },
        },
        ...(tempAvatar ? [{
          text: language === 'es' ? '🗑️ Eliminar Foto' : '🗑️ Remove Photo',
          style: 'destructive' as const,
          onPress: () => setTempAvatar(''),
        }] : []),
        { text: language === 'es' ? 'Cancelar' : 'Cancel', style: 'cancel' as const },
      ]
    );
  };

  const handleSaveProfile = async () => {
    await updateProfile({
      fullName: tempName.trim() || displayJudgeName,
      bjcpRank: tempRank,
      bjcpId: tempId.trim() || undefined,
      avatarUrl: tempAvatar || undefined,
    });
    setEditModalVisible(false);
    Alert.alert(
      language === 'es' ? 'Perfil Actualizado' : 'Profile Updated',
      language === 'es' ? 'Tus datos y foto de juez han sido guardados.' : 'Your judge profile and photo have been saved.'
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
        ? 'Al importar el archivo se restaurarán todas las catas, fotos y progreso en este dispositivo. ¿Deseas continuar?'
        : 'Importing will restore all tastings, photos, and progress onto this device. Continue?',
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
                    ? `Se han restaurado correctamente ${res.count || 0} catas con sus fotos y todo tu progreso de estudio.`
                    : `Successfully restored ${res.count || 0} tastings with photos and study progress.`
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

  const handleManualICloudSync = async () => {
    try {
      setIsSyncingICloud(true);
      const res = await performICloudSync();
      if (res.success) {
        await reloadTastings();
        Alert.alert(
          language === 'es' ? '☁️ Sincronización iCloud Exitosa' : '☁️ iCloud Sync Successful',
          language === 'es'
            ? `Tus catas y progreso están sincronizados con tu cuenta de Apple ID (${res.mergedCount || 0} catas al día).`
            : `Your tastings and progress are synced with your Apple ID account (${res.mergedCount || 0} tastings up to date).`
        );
      } else {
        Alert.alert(
          language === 'es' ? 'Sincronización iCloud' : 'iCloud Sync',
          res.message || (language === 'es' ? 'No se pudo sincronizar.' : 'Sync failed.')
        );
      }
    } catch (e: any) {
      Alert.alert(
        language === 'es' ? 'Error' : 'Error',
        e?.message || (language === 'es' ? 'Error al sincronizar con iCloud.' : 'iCloud sync error.')
      );
    } finally {
      setIsSyncingICloud(false);
    }
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
    rightElement?: React.ReactNode,
    isDestructive?: boolean
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
          <ThemedText style={[styles.rowTitle, isDestructive && { color: '#D90429' }]}>
            {title}
          </ThemedText>
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
        
        {/* Header with Back Button and Centered Title */}
        <View style={styles.header}>
          <Pressable 
            onPress={safeBack} 
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <ThemedText style={styles.backText}>‹</ThemedText>
          </Pressable>
          <ThemedText style={styles.title}>{t('settings')}</ThemedText>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* 1. Judge Profile Card */}
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              {language === 'es' ? 'PERFIL DE JUEZ BJCP' : 'BJCP JUDGE PROFILE'}
            </ThemedText>
          </View>
          
          <ThemedView style={styles.settingsGroup}>
            <View style={styles.profileRow}>
              <View style={styles.profileAvatar}>
                {safeProfile.avatarUrl ? (
                  <Image source={{ uri: safeProfile.avatarUrl }} style={styles.profileAvatarImg} />
                ) : (
                  <ThemedText style={styles.avatarText}>
                    {displayJudgeName.charAt(0).toUpperCase()}
                  </ThemedText>
                )}
              </View>
              <View style={styles.profileInfo}>
                <ThemedText style={styles.profileNameText} numberOfLines={1}>
                  {displayJudgeName}
                </ThemedText>
                <ThemedText style={styles.profileRankText}>
                  {(safeProfile.bjcpRank || 'Apprentice')} {safeProfile.bjcpId ? `• ID: ${safeProfile.bjcpId}` : ''}
                </ThemedText>
              </View>
              <Pressable
                onPress={() => {
                  setTempName(safeProfile.fullName || '');
                  setTempRank(safeProfile.bjcpRank || 'Apprentice');
                  setTempId(safeProfile.bjcpId || '');
                  setTempAvatar(safeProfile.avatarUrl || '');
                  setEditModalVisible(true);
                }}
              >
                <ThemedText style={styles.editProfilePill}>
                  {language === 'es' ? 'Editar' : 'Edit'}
                </ThemedText>
              </Pressable>
            </View>

            <View style={styles.divider} />

            <View style={styles.profileStatsRow}>
              <View style={styles.profileStatItem}>
                <ThemedText style={styles.profileStatValue}>{stats?.totalTastings ?? 0}</ThemedText>
                <ThemedText style={styles.profileStatLabel}>
                  {language === 'es' ? 'Catas' : 'Tastings'}
                </ThemedText>
              </View>
              <View style={styles.profileStatDivider} />
              <View style={styles.profileStatItem}>
                <ThemedText style={styles.profileStatValue}>{stats?.averageScore || '-'}</ThemedText>
                <ThemedText style={styles.profileStatLabel}>
                  {language === 'es' ? 'Promedio' : 'Avg Score'}
                </ThemedText>
              </View>
              <View style={styles.profileStatDivider} />
              <View style={styles.profileStatItem}>
                <ThemedText style={styles.profileStatValue}>{stats?.stylesCount ?? 0}</ThemedText>
                <ThemedText style={styles.profileStatLabel}>
                  {language === 'es' ? 'Estilos' : 'Styles'}
                </ThemedText>
              </View>
            </View>
          </ThemedView>

          {/* 2. Respaldo y Sincronización iCloud */}
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              {language === 'es' ? 'SINCRONIZACIÓN Y RESPALDO' : 'SYNC & BACKUP'}
            </ThemedText>
          </View>

          <ThemedView style={styles.settingsGroup}>
            <View style={styles.privacyBadgeRow}>
              <ThemedText style={styles.privacyIcon}>☁️</ThemedText>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.privacyTitle}>
                  {language === 'es' ? 'Apple iCloud Sync (Silencioso)' : 'Apple iCloud Sync (Silent)'}
                </ThemedText>
                <ThemedText style={styles.privacyDesc}>
                  {language === 'es'
                    ? 'Sincroniza automáticamente tus catas y notas entre tu iPhone y iPad de forma 100% privada.'
                    : 'Automatically syncs your tastings and notes between your iPhone and iPad privately.'}
                </ThemedText>
              </View>
            </View>

            <View style={styles.divider} />

            {renderSettingRow(
              '🔄',
              language === 'es' ? 'Sincronizar con iCloud Ahora' : 'Sync with iCloud Now',
              undefined,
              handleManualICloudSync,
              isSyncingICloud ? <ActivityIndicator size="small" color="#F2B824" /> : undefined
            )}

            <View style={styles.divider} />

            {renderSettingRow(
              '📤',
              language === 'es' ? 'Exportar Copia de Seguridad' : 'Export Backup File',
              undefined,
              handleExportBackup,
              isExporting ? <ActivityIndicator size="small" color={theme.tint} /> : undefined
            )}

            <View style={styles.divider} />

            {renderSettingRow(
              '📥',
              language === 'es' ? 'Importar Copia de Seguridad' : 'Import Backup File',
              undefined,
              handleImportBackup,
              isImporting ? <ActivityIndicator size="small" color={theme.tint} /> : undefined
            )}
          </ThemedView>

          <ThemedText style={styles.backupHint}>
            {language === 'es'
              ? '💡 Consejo: Al cambiar de teléfono, puedes sincronizar por iCloud o exportar tu copia por AirDrop, WhatsApp o Archivos.'
              : '💡 Tip: When switching phones, sync via iCloud or export your backup via AirDrop, WhatsApp, or Files.'}
          </ThemedText>

          {/* 3. Suscripción PRO / Lifetime */}
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              {language === 'es' ? 'MEMBRESÍA PRO' : 'PRO MEMBERSHIP'}
            </ThemedText>
          </View>

          <ThemedView style={styles.settingsGroup}>
            {isPro ? (
              <View style={styles.proActiveCard}>
                <View style={styles.proActiveHeader}>
                  <ThemedText style={styles.proActiveTitle}>
                    BrewStudy <ThemedText style={styles.proGolden}>PRO</ThemedText>
                  </ThemedText>
                  <View style={styles.lifetimeBadge}>
                    <ThemedText style={styles.lifetimeBadgeText}>
                      LIFETIME
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.proActiveDesc}>
                  {language === 'es'
                    ? '✨ Tienes acceso ilimitado de por vida al simulador de 50 pts, banco curado de preguntas y comparador.'
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
          </ThemedView>

          {/* 4. Preferencias y Estudio */}
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              {language === 'es' ? 'PREFERENCIAS' : 'PREFERENCES'}
            </ThemedText>
          </View>

          <ThemedView style={styles.settingsGroup}>
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
              handleResetProgress,
              undefined,
              true
            )}
          </ThemedView>

          {/* 5. Información & BJCP */}
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              {language === 'es' ? 'INFORMACIÓN' : 'ABOUT'}
            </ThemedText>
          </View>

          <ThemedView style={styles.settingsGroup}>
            {renderSettingRow(
              '🍺',
              language === 'es' ? 'Guía de Estilos BJCP 2021' : 'BJCP Style Guidelines 2021',
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
          </ThemedView>

          {/* 6. Legal Disclaimer */}
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              {t('legalSection')}
            </ThemedText>
          </View>
          <View style={styles.disclaimerCard}>
            <ThemedText style={styles.disclaimerText}>
              {t('disclaimer')}
            </ThemedText>
            <View style={styles.legalLinksRow}>
              <Pressable onPress={() => Linking.openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')}>
                <ThemedText style={styles.legalLinkText}>
                  {language === 'es' ? 'Términos de Uso' : 'Terms of Service'}
                </ThemedText>
              </Pressable>
              <ThemedText style={styles.legalBullet}>•</ThemedText>
              <Pressable onPress={() => Linking.openURL('https://www.banana-computer.com/brew-study/privacy-policy')}>
                <ThemedText style={styles.legalLinkText}>
                  {language === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
                </ThemedText>
              </Pressable>
            </View>
          </View>

          <View style={styles.creditsContainer}>
            <ThemedText style={styles.creditsText}>
              BrewStudy • BJCP 2021 Guidelines
            </ThemedText>
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
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>
                {language === 'es' ? 'Editar Perfil de Juez' : 'Edit Judge Profile'}
              </ThemedText>
              <Pressable
                onPress={() => setEditModalVisible(false)}
                style={({ pressed }) => [styles.modalCloseBtn, pressed && { opacity: 0.7 }]}
              >
                <ThemedText style={styles.modalCloseText}>✕</ThemedText>
              </Pressable>
            </View>

            <View style={styles.modalBody}>
              {/* Avatar Picker Section */}
              <View style={styles.modalAvatarSection}>
                <Pressable onPress={handlePickAvatar} style={styles.modalAvatarTouch}>
                  <View style={styles.modalAvatarCircle}>
                    {tempAvatar ? (
                      <Image source={{ uri: tempAvatar }} style={styles.modalAvatarImg} />
                    ) : (
                      <ThemedText style={styles.modalAvatarInitials}>
                        {(tempName.trim() || displayJudgeName).charAt(0).toUpperCase()}
                      </ThemedText>
                    )}
                  </View>
                  <View style={styles.modalCameraBadge}>
                    <ThemedText style={styles.modalCameraBadgeText}>📷</ThemedText>
                  </View>
                </Pressable>
                <Pressable onPress={handlePickAvatar} style={{ marginTop: 6 }}>
                  <ThemedText style={styles.changePhotoText}>
                    {tempAvatar 
                      ? (language === 'es' ? 'Cambiar Foto de Perfil' : 'Change Profile Photo')
                      : (language === 'es' ? 'Añadir Foto de Perfil' : 'Add Profile Photo')}
                  </ThemedText>
                </Pressable>
              </View>

              <ThemedText style={styles.inputLabel}>
                {language === 'es' ? 'Nombre o Alias de Juez' : 'Judge Name or Alias'}
              </ThemedText>
              <TextInput
                style={styles.modalInput}
                value={tempName}
                onChangeText={setTempName}
                placeholder={language === 'es' ? 'Ej. Juan Pérez' : 'e.g. John Doe'}
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
              />

              <ThemedText style={styles.inputLabel}>
                {language === 'es' ? 'Rango BJCP' : 'BJCP Rank'}
              </ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rankChipsRow}>
                {BJCP_RANKS.map((r) => (
                  <Pressable
                    key={r}
                    onPress={() => setTempRank(r)}
                    style={[
                      styles.rankChip,
                      tempRank === r && styles.rankChipSelected,
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.rankChipText,
                        tempRank === r && styles.rankChipTextSelected,
                      ]}
                    >
                      {r}
                    </ThemedText>
                  </Pressable>
                ))}
              </ScrollView>

              <ThemedText style={styles.inputLabel}>
                {language === 'es' ? 'ID BJCP (Opcional)' : 'BJCP ID (Optional)'}
              </ThemedText>
              <TextInput
                style={styles.modalInput}
                value={tempId}
                onChangeText={setTempId}
                placeholder="Ej. B1234"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                autoCapitalize="characters"
              />

              <Pressable
                style={({ pressed }) => [styles.modalSaveBtn, pressed && { opacity: 0.85 }]}
                onPress={handleSaveProfile}
              >
                <ThemedText style={styles.modalSaveBtnText}>
                  {language === 'es' ? 'Guardar' : 'Save'}
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    width: '100%',
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
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: BottomTabInset + Spacing.six,
    gap: Spacing.two,
  },
  sectionHeader: {
    marginTop: Spacing.two,
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
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    gap: Spacing.three,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F2B824',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileAvatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  avatarText: {
    fontSize: 22,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#0A0C10',
  },
  profileInfo: {
    flex: 1,
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
    fontSize: 13,
    fontFamily: Fonts.spaceGroteskBold,
    textDecorationLine: 'underline',
  },
  profileStatsRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  profileStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  profileStatValue: {
    fontSize: 16,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#2F5D73',
  },
  profileStatLabel: {
    fontSize: 10,
    color: '#666666',
    marginTop: 2,
    fontFamily: Fonts.inter,
  },
  profileStatDivider: {
    width: 1,
    backgroundColor: 'rgba(128,128,128,0.12)',
  },
  privacyBadgeRow: {
    flexDirection: 'row',
    padding: Spacing.three,
    alignItems: 'center',
  },
  privacyIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  privacyTitle: {
    fontSize: 13,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#0A0C10',
  },
  privacyDesc: {
    fontSize: 11,
    color: '#666666',
    marginTop: 2,
    lineHeight: 15,
    fontFamily: Fonts.inter,
  },
  backupHint: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 4,
    marginLeft: 6,
    lineHeight: 15,
    fontFamily: Fonts.inter,
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
    flex: 1,
  },
  rowIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  rowTitle: {
    fontSize: 14,
    fontFamily: Fonts.inter,
    color: '#0A0C10',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  rowValue: {
    fontSize: 13,
    fontFamily: Fonts.inter,
    color: '#666666',
  },
  rowChevron: {
    fontSize: 18,
    color: '#888888',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128,128,128,0.1)',
    marginHorizontal: Spacing.four,
  },
  proActiveCard: {
    padding: Spacing.three,
  },
  proActiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  proActiveTitle: {
    fontSize: 16,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#0A0C10',
  },
  proGolden: {
    color: '#D97706',
    fontFamily: Fonts.spaceGroteskBold,
  },
  lifetimeBadge: {
    backgroundColor: '#F2B824',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  lifetimeBadgeText: {
    fontSize: 9,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#0A0C10',
    letterSpacing: 0.5,
  },
  proActiveDesc: {
    fontSize: 12,
    color: '#555555',
    marginTop: 6,
    marginBottom: 6,
    lineHeight: 16,
    fontFamily: Fonts.inter,
  },
  proUpgradeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    backgroundColor: 'rgba(242, 184, 36, 0.12)',
  },
  proUpgradeLeft: {
    flex: 1,
    paddingRight: 10,
  },
  proUpgradeTitle: {
    fontSize: 14,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#B45309',
  },
  proUpgradeSubtitle: {
    fontSize: 11,
    color: '#666666',
    marginTop: 2,
    fontFamily: Fonts.inter,
  },
  proUpgradeButton: {
    backgroundColor: '#F2B824',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  proUpgradeButtonText: {
    fontSize: 11,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#0A0C10',
  },
  creditsContainer: {
    alignItems: 'center',
    marginTop: Spacing.four,
    gap: Spacing.half,
  },
  creditsText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    fontFamily: Fonts.manrope,
  },
  disclaimerCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: Spacing.three,
    marginTop: Spacing.half,
  },
  disclaimerText: {
    fontSize: 11,
    lineHeight: 17,
    color: 'rgba(255, 255, 255, 0.65)',
    fontFamily: Fonts.inter,
    textAlign: 'center',
  },
  legalLinksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  legalLinkText: {
    fontSize: 12,
    color: '#F2B824',
    textDecorationLine: 'underline',
    fontFamily: Fonts.inter,
  },
  legalBullet: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
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
    marginBottom: Spacing.two,
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
  modalAvatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  modalAvatarTouch: {
    position: 'relative',
  },
  modalAvatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#F2B824',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  modalAvatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 38,
  },
  modalAvatarInitials: {
    fontSize: 32,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#0A0C10',
  },
  modalCameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#2F5D73',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCameraBadgeText: {
    fontSize: 12,
  },
  changePhotoText: {
    fontSize: 12,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#F2B824',
    textDecorationLine: 'underline',
  },
  inputLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    fontFamily: Fonts.manropeBold,
    textTransform: 'uppercase',
    marginBottom: 4,
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
    marginBottom: 6,
  },
  rankChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
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
