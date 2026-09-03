import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppStateStatus, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { TastingNote } from '@/types/tasting';
import { generateBackupPayload, BrewStudyBackupPayload } from './backup-service';

const ICLOUD_SYNC_ENABLED_KEY = '@bjcp_icloud_sync_enabled';
const LAST_ICLOUD_SYNC_TIME_KEY = '@bjcp_last_icloud_sync_time';
const ICLOUD_SYNC_FILE_NAME = 'brewstudy_icloud_sync.json';

export interface ICloudSyncResult {
  success: boolean;
  message?: string;
  mergedCount?: number;
  lastSyncTime?: string;
}

/**
 * Retorna la ruta del archivo de sincronización de iCloud en el dispositivo
 */
function getICloudFilePath(): string {
  const baseDir = FileSystem.documentDirectory || FileSystem.cacheDirectory || '';
  return `${baseDir}${ICLOUD_SYNC_FILE_NAME}`;
}

/**
 * Comprueba si la sincronización de iCloud está habilitada por el usuario (por defecto: true en iOS)
 */
export async function isICloudSyncEnabled(): Promise<boolean> {
  if (Platform.OS !== 'ios') return false;
  try {
    const val = await AsyncStorage.getItem(ICLOUD_SYNC_ENABLED_KEY);
    return val === null ? true : val === 'true';
  } catch {
    return true;
  }
}

/**
 * Activa o desactiva la sincronización con iCloud
 */
export async function setICloudSyncEnabled(enabled: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(ICLOUD_SYNC_ENABLED_KEY, enabled ? 'true' : 'false');
  } catch (e) {
    console.warn('Error setting iCloud sync preference:', e);
  }
}

/**
 * Obtiene la fecha/hora de la última sincronización con iCloud
 */
export async function getLastICloudSyncTime(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(LAST_ICLOUD_SYNC_TIME_KEY);
  } catch {
    return null;
  }
}

/**
 * Algoritmo de Fusión Inteligente (Smart Merge) para notas de cata:
 * - Unifica catas creadas en diferentes dispositivos sin duplicarlas.
 * - Si una misma cata existe en ambos dispositivos, conserva la versión más reciente (por updatedAt/createdAt).
 */
export function smartMergeTastings(localList: TastingNote[], remoteList: TastingNote[]): TastingNote[] {
  const map = new Map<string, TastingNote>();

  // 1. Insertar catas locales
  for (const t of localList) {
    if (t && t.id) {
      map.set(t.id, t);
    }
  }

  // 2. Fusionar con catas remotas
  for (const remote of remoteList) {
    if (!remote || !remote.id) continue;

    const existing = map.get(remote.id);
    if (!existing) {
      // Nueva cata creada en el otro dispositivo -> Añadir
      map.set(remote.id, remote);
    } else {
      // Misma cata -> Comparar marcas de tiempo
      const localTime = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
      const remoteTime = new Date(remote.updatedAt || remote.createdAt || 0).getTime();

      if (remoteTime > localTime) {
        map.set(remote.id, remote);
      }
    }
  }

  // Retornar lista ordenada de más reciente a más antigua
  return Array.from(map.values()).sort((a, b) => {
    const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return timeB - timeA;
  });
}

/**
 * Ejecuta el ciclo completo de sincronización silenciosa con iCloud:
 * 1. Lee la instantánea local.
 * 2. Lee la instantánea remota de iCloud si existe.
 * 3. Ejecuta el Smart Merge.
 * 4. Guarda la instantánea unificada en local y en iCloud.
 */
export async function performICloudSync(): Promise<ICloudSyncResult> {
  if (Platform.OS !== 'ios') {
    return { success: false, message: 'iCloud Sync is only available on iOS.' };
  }

  try {
    const enabled = await isICloudSyncEnabled();
    if (!enabled) {
      return { success: false, message: 'iCloud sync is disabled in settings.' };
    }

    const filePath = getICloudFilePath();
    const localPayload = await generateBackupPayload();

    // 1. Verificar si existe un archivo remoto previo
    let remotePayload: BrewStudyBackupPayload | null = null;
    const fileInfo = await FileSystem.getInfoAsync(filePath);

    if (fileInfo.exists) {
      try {
        const content = await FileSystem.readAsStringAsync(filePath, {
          encoding: FileSystem.EncodingType?.UTF8 || 'utf8',
        });
        const parsed = JSON.parse(content);
        if (parsed && parsed.appName === 'BrewStudy' && Array.isArray(parsed.tastings)) {
          remotePayload = parsed;
        }
      } catch (readErr) {
        console.warn('Could not read existing iCloud sync file:', readErr);
      }
    }

    // 2. Realizar fusión de catas si hay datos remotos
    let mergedTastings = localPayload.tastings;
    if (remotePayload && Array.isArray(remotePayload.tastings)) {
      mergedTastings = smartMergeTastings(localPayload.tastings, remotePayload.tastings);
    }

    // 3. Fusionar datos de estudio (preguntas vistas, flashcards, racha)
    const mergedQuizSeen = Array.from(
      new Set([...localPayload.quizSeenIds, ...(remotePayload?.quizSeenIds || [])])
    );
    const mergedFcProgress = Array.from(
      new Set([...localPayload.fcProgress, ...(remotePayload?.fcProgress || [])])
    );
    const mergedFcMastered = Array.from(
      new Set([...localPayload.fcMastered, ...(remotePayload?.fcMastered || [])])
    );
    const maxStreak = Math.max(
      localPayload.streakCount || 0,
      remotePayload?.streakCount || 0
    );

    const nowIso = new Date().toISOString();

    const unifiedPayload: BrewStudyBackupPayload = {
      version: 2,
      appName: 'BrewStudy',
      exportedAt: nowIso,
      tastings: mergedTastings,
      profile: localPayload.profile?.fullName !== 'Juez en Formación' 
        ? localPayload.profile 
        : (remotePayload?.profile || localPayload.profile),
      quizSeenIds: mergedQuizSeen,
      failedQuestionsPool: localPayload.failedQuestionsPool,
      fcProgress: mergedFcProgress,
      fcMastered: mergedFcMastered,
      streakCount: maxStreak,
      lastStudyDate: localPayload.lastStudyDate || remotePayload?.lastStudyDate,
      language: localPayload.language || remotePayload?.language || 'es',
    };

    // 4. Guardar localmente
    await AsyncStorage.multiSet([
      ['@bjcp_tastings', JSON.stringify(mergedTastings)],
      ['@bjcp_tastings_history', JSON.stringify(mergedTastings)],
      ['@bjcp_quiz_seen_ids', JSON.stringify(mergedQuizSeen)],
      ['@bjcp_fc_progress', JSON.stringify(mergedFcProgress)],
      ['@bjcp_fc_mastered', JSON.stringify(mergedFcMastered)],
      ['@BJCPStudyBuddy:streakCount', maxStreak.toString()],
      [LAST_ICLOUD_SYNC_TIME_KEY, nowIso],
    ]);

    // 5. Escribir archivo unificado en el contenedor de iCloud
    await FileSystem.writeAsStringAsync(filePath, JSON.stringify(unifiedPayload, null, 2), {
      encoding: FileSystem.EncodingType?.UTF8 || 'utf8',
    });

    return {
      success: true,
      mergedCount: mergedTastings.length,
      lastSyncTime: nowIso,
    };
  } catch (error: any) {
    console.error('Error during iCloud sync:', error);
    return {
      success: false,
      message: error?.message || 'Error syncing with iCloud.',
    };
  }
}

/**
 * Escucha cuando la app vuelve del segundo plano para sincronizar silenciosamente
 */
export function setupICloudAutoSyncListener(onSyncCompleted?: (count: number) => void): () => void {
  if (Platform.OS !== 'ios') return () => {};

  // Sincronizar inmediatamente al iniciar
  performICloudSync().then((res) => {
    if (res.success && res.mergedCount !== undefined && onSyncCompleted) {
      onSyncCompleted(res.mergedCount);
    }
  });

  const subscription = AppState.addEventListener('change', async (nextState: AppStateStatus) => {
    if (nextState === 'active') {
      const res = await performICloudSync();
      if (res.success && res.mergedCount !== undefined && onSyncCompleted) {
        onSyncCompleted(res.mergedCount);
      }
    }
  });

  return () => {
    subscription.remove();
  };
}
