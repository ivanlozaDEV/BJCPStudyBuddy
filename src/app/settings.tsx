import React, { useState } from 'react';
import { StyleSheet, Pressable, View, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/context/language-context';

export default function SettingsScreen() {
  const theme = useTheme();
  const { t, language, setLanguage } = useTranslation();

  // Settings state toggles
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);

  const handleResetProgress = () => {
    Alert.alert(
      t('resetTitle'),
      t('resetMessage'),
      [
        { text: language === 'es' ? 'Cancelar' : 'Cancel', style: 'cancel' },
        { 
          text: language === 'es' ? 'Restablecer' : 'Reset', 
          style: 'destructive', 
          onPress: () => alert(t('resetSuccess')) 
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
    <ThemedView style={styles.container}>
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
          {/* Profile Card */}
          <ThemedView type="backgroundElement" style={styles.profileCard}>
            <View style={[styles.profileAvatar, { backgroundColor: theme.backgroundSelected }]}>
              <ThemedText style={styles.avatarEmoji}>🎓</ThemedText>
            </View>
            <View style={styles.profileInfo}>
              <ThemedText type="default" style={styles.profileName}>
                {t('profileName')}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {t('profileRank')}
              </ThemedText>
            </View>
          </ThemedView>

          {/* Group 1: Study Configuration */}
          <View style={styles.sectionHeader}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
              {t('studyConfig')}
            </ThemedText>
          </View>
          <ThemedView type="backgroundElement" style={styles.settingsGroup}>
            {renderSettingRow("📚", t('activeGuide'), "BJCP 2021")}
            <View style={styles.divider} />
            
            {/* Dynamic Language Toggle Row */}
            {renderSettingRow(
              "🌐", 
              t('appLanguage'), 
              language === 'es' ? '🇪🇸 Español' : '🇬🇧 English', 
              toggleLanguage
            )}
            
            <View style={styles.divider} />
            {renderSettingRow(
              "⏰", 
              t('reminders'), 
              undefined, 
              undefined, 
              <Switch
                value={remindersEnabled}
                onValueChange={setRemindersEnabled}
                trackColor={{ false: theme.backgroundSelected, true: theme.tint }}
                thumbColor="#FFFFFF"
              />
            )}
            <View style={styles.divider} />
            {renderSettingRow(
              "📳", 
              t('hapticFeedback'), 
              undefined, 
              undefined, 
              <Switch
                value={hapticFeedback}
                onValueChange={setHapticFeedback}
                trackColor={{ false: theme.backgroundSelected, true: theme.tint }}
                thumbColor="#FFFFFF"
              />
            )}
          </ThemedView>

          {/* Group 2: Resources & Links */}
          <View style={styles.sectionHeader}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
              {t('resources')}
            </ThemedText>
          </View>
          <ThemedView type="backgroundElement" style={styles.settingsGroup}>
            {renderSettingRow("🌐", t('officialSite'), undefined, () => alert(language === 'es' ? 'Navegando a BJCP.org...' : 'Navigating to BJCP.org...'))}
            <View style={styles.divider} />
            {renderSettingRow("📜", t('downloadPdf'), undefined, () => alert(language === 'es' ? 'Abriendo PDF de Estilos...' : 'Opening Style Guide PDF...'))}
            <View style={styles.divider} />
            {renderSettingRow("📬", t('appFeedback'), undefined, () => alert(language === 'es' ? 'Contacto: soporte@bjcpbuddy.com' : 'Contact: support@bjcpbuddy.com'))}
          </ThemedView>

          {/* Danger Zone */}
          <View style={styles.sectionHeader}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
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
            <ThemedText type="smallBold" style={{ color: theme.accent }}>
              {t('resetStudyProgress')}
            </ThemedText>
          </Pressable>

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
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.four,
    borderRadius: Spacing.four,
    gap: Spacing.four,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 32,
  },
  profileInfo: {
    flex: 1,
    gap: Spacing.half,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Fonts.spaceGroteskBold,
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
    color: 'rgba(128,128,128,0.5)',
    textAlign: 'center',
    fontFamily: Fonts.manrope,
  },
});
