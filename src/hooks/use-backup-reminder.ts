import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { exportBackupFile, LAST_BACKUP_TIMESTAMP_KEY, TASTINGS_COUNT_AT_LAST_BACKUP_KEY } from '@/services/backup-service';

const LAST_REMINDER_DISMISSED_COUNT_KEY = '@bjcp_last_reminder_dismissed_count';

export interface BackupReminderOptions {
  tastingsCount: number;
  language: 'es' | 'en';
  onBackupSuccess?: () => void;
}

/**
 * Evalúa si es momento de recordar al usuario hacer una copia de seguridad en la nube
 */
export async function checkAndPromptBackupReminder({
  tastingsCount,
  language,
  onBackupSuccess,
}: BackupReminderOptions): Promise<void> {
  // No molestar si tiene menos de 5 catas
  if (tastingsCount < 5) return;

  try {
    const [lastBackupIso, countAtLastBackupStr, lastDismissedCountStr] = await Promise.all([
      AsyncStorage.getItem(LAST_BACKUP_TIMESTAMP_KEY),
      AsyncStorage.getItem(TASTINGS_COUNT_AT_LAST_BACKUP_KEY),
      AsyncStorage.getItem(LAST_REMINDER_DISMISSED_COUNT_KEY),
    ]);

    const countAtLastBackup = countAtLastBackupStr ? parseInt(countAtLastBackupStr, 10) : 0;
    const lastDismissedCount = lastDismissedCountStr ? parseInt(lastDismissedCountStr, 10) : 0;

    // Si ya desestimó para este conteo actual de catas, no volver a preguntar hasta que sume al menos 5 más
    if (lastDismissedCount > 0 && tastingsCount - lastDismissedCount < 5) {
      return;
    }

    const unbackedUpTastings = tastingsCount - countAtLastBackup;
    let shouldPrompt = false;

    // Condición 1: Tiene 5 o más catas nuevas sin respaldar
    if (unbackedUpTastings >= 5) {
      shouldPrompt = true;
    } else if (lastBackupIso) {
      // Condición 2: Han pasado más de 30 días y tiene al menos 2 catas sin respaldar
      const lastBackupDate = new Date(lastBackupIso);
      const daysSince = (Date.now() - lastBackupDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince > 30 && unbackedUpTastings > 0) {
        shouldPrompt = true;
      }
    }

    if (!shouldPrompt) return;

    Alert.alert(
      language === 'es' ? '☁️ Respaldo en la Nube Recomendado' : '☁️ Cloud Backup Recommended',
      language === 'es'
        ? `Tienes ${tastingsCount} catas y progreso de estudio en tu dispositivo. Te recomendamos guardar una copia en iCloud Drive o Google Drive para asegurar tus notas y fotos.`
        : `You have ${tastingsCount} tastings and study progress on your device. We recommend saving a backup to iCloud Drive or Google Drive to safeguard your notes and photos.`,
      [
        {
          text: language === 'es' ? 'Recordarme luego' : 'Remind me later',
          style: 'cancel',
          onPress: async () => {
            await AsyncStorage.setItem(LAST_REMINDER_DISMISSED_COUNT_KEY, tastingsCount.toString());
          },
        },
        {
          text: language === 'es' ? 'Guardar en la Nube' : 'Save to Cloud',
          onPress: async () => {
            const res = await exportBackupFile(language);
            if (res.success && onBackupSuccess) {
              onBackupSuccess();
            }
          },
        },
      ]
    );
  } catch (e) {
    console.warn('Error checking backup reminder:', e);
  }
}
