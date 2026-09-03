import AsyncStorage from '@react-native-async-storage/async-storage';
import { Share, Platform, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

export interface BrewStudyBackupPayload {
  version: number;
  appName: 'BrewStudy';
  exportedAt: string;
  tastings: any[];
  profile: {
    fullName: string;
    bjcpRank: string;
    bjcpId?: string;
    avatarUrl?: string;
    avatarBase64?: string;
  };
  quizSeenIds: string[];
  failedQuestionsPool: any[];
  fcProgress: string[];
  fcMastered: string[];
  fcHistoryStyles?: any;
  fcHistoryGlossary?: any;
  fcHistoryOffFlavors?: any;
  answeredStyles?: string[];
  answeredGlossary?: string[];
  answeredOffFlavors?: string[];
  fcScore?: number;
  streakCount?: number;
  lastStudyDate?: string;
  language?: string;
}

const BACKUP_VERSION = 2; // Version 2 supports full embedded photo encoding and comprehensive study memory

/**
 * Lazy loaders para módulos nativos opcionales que evitan que la app se caiga si no se ha recompilado el binario
 */
function getDocumentPickerModule(): any {
  try {
    const isRegistered =
      Boolean((global as any)?.expo?.modules?.ExpoDocumentPicker) ||
      Boolean((global as any)?.ExpoModules?.ExpoDocumentPicker);

    if (!isRegistered) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('expo-document-picker');
  } catch {
    return null;
  }
}

function getSharingModule(): any {
  try {
    const isRegistered =
      Boolean((global as any)?.expo?.modules?.ExpoSharing) ||
      Boolean((global as any)?.ExpoModules?.ExpoSharing);

    if (!isRegistered) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('expo-sharing');
  } catch {
    return null;
  }
}

/**
 * Convierte una URI de archivo local a Base64 de forma segura
 */
async function fileUriToBase64(uri?: string): Promise<string | undefined> {
  if (!uri || !uri.startsWith('file://')) return undefined;
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (!info.exists) return undefined;

    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType?.Base64 || 'base64',
    });
    return base64;
  } catch (e) {
    console.warn('Could not encode photo to base64:', e);
    return undefined;
  }
}

/**
 * Guarda una cadena Base64 en el almacenamiento local permanente del nuevo dispositivo
 */
async function base64ToLocalFile(base64Data: string, fileName: string): Promise<string | undefined> {
  try {
    const docDir = FileSystem.documentDirectory || FileSystem.cacheDirectory || '';
    const photosDir = `${docDir}tasting_photos/`;

    const dirInfo = await FileSystem.getInfoAsync(photosDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(photosDir, { intermediates: true });
    }

    const targetUri = `${photosDir}${fileName}`;
    const cleanBase64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');

    await FileSystem.writeAsStringAsync(targetUri, cleanBase64, {
      encoding: FileSystem.EncodingType?.Base64 || 'base64',
    });

    return targetUri;
  } catch (e) {
    console.warn('Could not restore photo from base64:', e);
    return undefined;
  }
}

/**
 * Recopila todos los datos locales de la app y genera el objeto de respaldo exhaustivo
 */
export async function generateBackupPayload(): Promise<BrewStudyBackupPayload> {
  const [
    tastingsRaw,
    profileRaw,
    quizSeenRaw,
    failedQuestionsRaw,
    fcProgressRaw,
    fcMasteredRaw,
    fcHistStylesRaw,
    fcHistGlossaryRaw,
    fcHistOffFlavorsRaw,
    answeredStylesRaw,
    answeredGlossaryRaw,
    answeredOffFlavorsRaw,
    fcScoreRaw,
    streakRaw,
    lastDateRaw,
    langRaw,
  ] = await Promise.all([
    AsyncStorage.getItem('@bjcp_tastings'),
    AsyncStorage.getItem('@bjcp_user_profile'),
    AsyncStorage.getItem('@bjcp_quiz_seen_ids'),
    AsyncStorage.getItem('@bjcp_failed_questions_pool'),
    AsyncStorage.getItem('@bjcp_fc_progress'),
    AsyncStorage.getItem('@bjcp_fc_mastered'),
    AsyncStorage.getItem('@bjcp_fc_history_styles'),
    AsyncStorage.getItem('@bjcp_fc_history_glossary'),
    AsyncStorage.getItem('@bjcp_fc_history_offflavors'),
    AsyncStorage.getItem('@BJCPStudyBuddy:answeredStyles'),
    AsyncStorage.getItem('@BJCPStudyBuddy:answeredGlossary'),
    AsyncStorage.getItem('@BJCPStudyBuddy:answeredOffFlavors'),
    AsyncStorage.getItem('@BJCPStudyBuddy:fcScore'),
    AsyncStorage.getItem('@BJCPStudyBuddy:streakCount'),
    AsyncStorage.getItem('@BJCPStudyBuddy:lastStudyDate'),
    AsyncStorage.getItem('@BJCPStudyBuddy:language'),
  ]);

  let parsedTastings: any[] = tastingsRaw ? JSON.parse(tastingsRaw) : [];

  // Incrustar fotos de vaso y etiqueta en Base64 dentro del archivo de respaldo
  const enrichedTastings = await Promise.all(
    parsedTastings.map(async (tasting) => {
      const enriched = { ...tasting };
      if (tasting.photoUrl) {
        const photoB64 = await fileUriToBase64(tasting.photoUrl);
        if (photoB64) {
          enriched.photoBase64 = photoB64;
        }
      }
      if (tasting.labelPhotoUrl) {
        const labelB64 = await fileUriToBase64(tasting.labelPhotoUrl);
        if (labelB64) {
          enriched.labelPhotoBase64 = labelB64;
        }
      }
      return enriched;
    })
  );

  let enrichedProfile = profileRaw
    ? JSON.parse(profileRaw)
    : { fullName: 'Juez en Formación', bjcpRank: 'Apprentice' };

  if (enrichedProfile?.avatarUrl) {
    const avatarB64 = await fileUriToBase64(enrichedProfile.avatarUrl);
    if (avatarB64) {
      enrichedProfile.avatarBase64 = avatarB64;
    }
  }

  return {
    version: BACKUP_VERSION,
    appName: 'BrewStudy',
    exportedAt: new Date().toISOString(),
    tastings: enrichedTastings,
    profile: enrichedProfile,
    quizSeenIds: quizSeenRaw ? JSON.parse(quizSeenRaw) : [],
    failedQuestionsPool: failedQuestionsRaw ? JSON.parse(failedQuestionsRaw) : [],
    fcProgress: fcProgressRaw ? JSON.parse(fcProgressRaw) : [],
    fcMastered: fcMasteredRaw ? JSON.parse(fcMasteredRaw) : [],
    fcHistoryStyles: fcHistStylesRaw ? JSON.parse(fcHistStylesRaw) : undefined,
    fcHistoryGlossary: fcHistGlossaryRaw ? JSON.parse(fcHistGlossaryRaw) : undefined,
    fcHistoryOffFlavors: fcHistOffFlavorsRaw ? JSON.parse(fcHistOffFlavorsRaw) : undefined,
    answeredStyles: answeredStylesRaw ? JSON.parse(answeredStylesRaw) : undefined,
    answeredGlossary: answeredGlossaryRaw ? JSON.parse(answeredGlossaryRaw) : undefined,
    answeredOffFlavors: answeredOffFlavorsRaw ? JSON.parse(answeredOffFlavorsRaw) : undefined,
    fcScore: fcScoreRaw ? parseInt(fcScoreRaw, 10) : undefined,
    streakCount: streakRaw ? parseInt(streakRaw, 10) : 0,
    lastStudyDate: lastDateRaw || undefined,
    language: langRaw || 'es',
  };
}

/**
 * Exporta el archivo de respaldo con fotos incrustadas y abre el diálogo nativo de compartir
 */
export async function exportBackupFile(lang: 'es' | 'en' = 'es'): Promise<{ success: boolean; message?: string }> {
  try {
    const payload = await generateBackupPayload();
    const jsonString = JSON.stringify(payload, null, 2);

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const fileName = `BrewStudy_Backup_${dateStr}.brewstudy`;
    const tempDir = FileSystem.cacheDirectory || FileSystem.documentDirectory || '';
    const fileUri = `${tempDir}${fileName}`;

    await FileSystem.writeAsStringAsync(fileUri, jsonString, {
      encoding: FileSystem.EncodingType?.UTF8 || 'utf8',
    });

    // 1. Intentar expo-sharing si está disponible
    const Sharing = getSharingModule();
    if (Sharing && typeof Sharing.shareAsync === 'function') {
      try {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'application/json',
            dialogTitle: lang === 'es' ? 'Exportar Respaldo de BrewStudy' : 'Export BrewStudy Backup',
            UTI: 'public.json',
          });
          return { success: true };
        }
      } catch (sharingError) {
        console.warn('Sharing error, falling back to React Native Share:', sharingError);
      }
    }

    // 2. Fallback con Share nativo de React Native (100% compatible sin dependencias)
    await Share.share({
      title: lang === 'es' ? 'Respaldo BrewStudy' : 'BrewStudy Backup',
      url: fileUri,
      message: Platform.OS === 'android' ? jsonString : undefined,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error exporting backup file:', error);
    return {
      success: false,
      message: error?.message || (lang === 'es' ? 'No se pudo exportar el archivo de respaldo.' : 'Could not export backup file.'),
    };
  }
}

/**
 * Abre el selector de archivos, lee el archivo seleccionado, restaura las fotos al disco del nuevo dispositivo
 * y guarda todos los datos en AsyncStorage
 */
export async function importBackupFile(lang: 'es' | 'en' = 'es'): Promise<{ success: boolean; count?: number; message?: string }> {
  try {
    const DocumentPicker = getDocumentPickerModule();
    if (!DocumentPicker || typeof DocumentPicker.getDocumentAsync !== 'function') {
      return {
        success: false,
        message: lang === 'es'
          ? 'Para usar el selector de archivos nativo, por favor recompila la app en Xcode (`npx expo run:ios`).'
          : 'To use native document picker, please rebuild the app in Xcode (`npx expo run:ios`).',
      };
    }

    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/json', 'application/octet-stream', '*/*'],
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return { success: false, message: 'canceled' };
    }

    const asset = result.assets[0];
    const fileContent = await FileSystem.readAsStringAsync(asset.uri, {
      encoding: FileSystem.EncodingType?.UTF8 || 'utf8',
    });

    const parsed: BrewStudyBackupPayload = JSON.parse(fileContent);

    if (!parsed || parsed.appName !== 'BrewStudy' || !Array.isArray(parsed.tastings)) {
      return {
        success: false,
        message: lang === 'es'
          ? 'El archivo seleccionado no es una copia de seguridad válida de BrewStudy.'
          : 'The selected file is not a valid BrewStudy backup.',
      };
    }

    // Reconstruir y guardar fotos en el almacenamiento permanente del nuevo dispositivo
    const restoredTastings = await Promise.all(
      parsed.tastings.map(async (tasting, index) => {
        const item = { ...tasting };
        const id = item.id || `tasting_${Date.now()}_${index}`;

        if (item.photoBase64) {
          const newPhotoUri = await base64ToLocalFile(item.photoBase64, `${id}_glass.jpg`);
          if (newPhotoUri) {
            item.photoUrl = newPhotoUri;
          }
          delete item.photoBase64;
        }

        if (item.labelPhotoBase64) {
          const newLabelUri = await base64ToLocalFile(item.labelPhotoBase64, `${id}_label.jpg`);
          if (newLabelUri) {
            item.labelPhotoUrl = newLabelUri;
          }
          delete item.labelPhotoBase64;
        }

        return item;
      })
    );

    // Restaurar todas las claves en AsyncStorage
    const storageOperations: [string, string][] = [
      ['@bjcp_tastings', JSON.stringify(restoredTastings)],
      ['@bjcp_tastings_history', JSON.stringify(restoredTastings)],
    ];

    if (parsed.profile) {
      const prof = { ...parsed.profile };
      if ((prof as any).avatarBase64) {
        const newAvatarUri = await base64ToLocalFile((prof as any).avatarBase64, 'judge_avatar.jpg');
        if (newAvatarUri) {
          prof.avatarUrl = newAvatarUri;
        }
        delete (prof as any).avatarBase64;
      }
      storageOperations.push(['@bjcp_user_profile', JSON.stringify(prof)]);
    }
    if (parsed.quizSeenIds) {
      storageOperations.push(['@bjcp_quiz_seen_ids', JSON.stringify(parsed.quizSeenIds)]);
    }
    if (parsed.failedQuestionsPool) {
      storageOperations.push(['@bjcp_failed_questions_pool', JSON.stringify(parsed.failedQuestionsPool)]);
    }
    if (parsed.fcProgress) {
      storageOperations.push(['@bjcp_fc_progress', JSON.stringify(parsed.fcProgress)]);
    }
    if (parsed.fcMastered) {
      storageOperations.push(['@bjcp_fc_mastered', JSON.stringify(parsed.fcMastered)]);
    }
    if (parsed.fcHistoryStyles) {
      storageOperations.push(['@bjcp_fc_history_styles', JSON.stringify(parsed.fcHistoryStyles)]);
    }
    if (parsed.fcHistoryGlossary) {
      storageOperations.push(['@bjcp_fc_history_glossary', JSON.stringify(parsed.fcHistoryGlossary)]);
    }
    if (parsed.fcHistoryOffFlavors) {
      storageOperations.push(['@bjcp_fc_history_offflavors', JSON.stringify(parsed.fcHistoryOffFlavors)]);
    }
    if (parsed.answeredStyles) {
      storageOperations.push(['@BJCPStudyBuddy:answeredStyles', JSON.stringify(parsed.answeredStyles)]);
    }
    if (parsed.answeredGlossary) {
      storageOperations.push(['@BJCPStudyBuddy:answeredGlossary', JSON.stringify(parsed.answeredGlossary)]);
    }
    if (parsed.answeredOffFlavors) {
      storageOperations.push(['@BJCPStudyBuddy:answeredOffFlavors', JSON.stringify(parsed.answeredOffFlavors)]);
    }
    if (parsed.fcScore !== undefined) {
      storageOperations.push(['@BJCPStudyBuddy:fcScore', parsed.fcScore.toString()]);
    }
    if (parsed.streakCount !== undefined) {
      storageOperations.push(['@BJCPStudyBuddy:streakCount', parsed.streakCount.toString()]);
    }
    if (parsed.lastStudyDate) {
      storageOperations.push(['@BJCPStudyBuddy:lastStudyDate', parsed.lastStudyDate]);
    }
    if (parsed.language) {
      storageOperations.push(['@BJCPStudyBuddy:language', parsed.language]);
    }

    await AsyncStorage.multiSet(storageOperations);

    return {
      success: true,
      count: restoredTastings.length,
    };
  } catch (error: any) {
    console.error('Error importing backup file:', error);
    return {
      success: false,
      message: error?.message || (lang === 'es' ? 'Error al leer o procesar el archivo.' : 'Error reading or processing file.'),
    };
  }
}
