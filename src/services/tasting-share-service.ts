import { Share, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { TastingNote, UserProfile, getQualityTier } from '@/types/tasting';

export interface SharedTastingPayload {
  version: 1;
  type: 'single_tasting';
  exportedAt: string;
  judge: {
    fullName: string;
    bjcpRank: string;
    bjcpId?: string;
  };
  tasting: TastingNote & {
    photoBase64?: string;
    labelPhotoBase64?: string;
  };
}

/**
 * Convierte una URI de archivo local a Base64
 */
async function fileUriToBase64(uri?: string): Promise<string | undefined> {
  if (!uri || !uri.startsWith('file://')) return undefined;
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (!info.exists) return undefined;

    return await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType?.Base64 || 'base64',
    });
  } catch (e) {
    console.warn('Could not encode photo:', e);
    return undefined;
  }
}

/**
 * Guarda una cadena Base64 en el almacenamiento local permanente
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
    console.warn('Could not restore photo:', e);
    return undefined;
  }
}

/**
 * Genera el texto formateado de la cata listo para enviar por WhatsApp o redes sociales
 */
export function generateTastingTextSummary(tasting: TastingNote, judge?: UserProfile, lang: 'es' | 'en' = 'es'): string {
  const tier = getQualityTier(tasting.totalScore);
  const judgeName = judge?.fullName || (lang === 'es' ? 'Juez BJCP' : 'BJCP Judge');
  const judgeRank = judge?.bjcpRank ? `(${judge.bjcpRank}${judge.bjcpId ? ` #${judge.bjcpId}` : ''})` : '';

  if (lang === 'es') {
    return `🍺 *FICHA DE CATA BJCP (50 PTS)*
━━━━━━━━━━━━━━━━━━━━━━
🏷️ *Cerveza:* ${tasting.beerName || 'Sin Nombre'}${tasting.brewery ? ` (${tasting.brewery})` : ''}
📚 *Estilo:* ${tasting.styleId} - ${tasting.styleName}
⭐ *Puntuación Total:* ${tasting.totalScore} / 50 pts (${tier.label_es.toUpperCase()})

📊 *Desglose Sensorial:*
• Aroma: ${tasting.scoresheet.aromaScore || 0} / 12 pts
• Aspecto: ${tasting.scoresheet.appearanceScore || 0} / 3 pts
• Sabor: ${tasting.scoresheet.flavorScore || 0} / 20 pts
• Sensación en Boca: ${tasting.scoresheet.mouthfeelScore || 0} / 5 pts
• Impresión General: ${tasting.scoresheet.overallScore || 0} / 10 pts
${tasting.descriptors && tasting.descriptors.length > 0 ? `\n🏷️ *Descriptores:* ${tasting.descriptors.join(', ')}` : ''}
${tasting.feedbackNotes ? `\n💡 *Consejos al Cervecero:* ${tasting.feedbackNotes}` : ''}
👤 *Juez Evaluador:* ${judgeName} ${judgeRank}
━━━━━━━━━━━━━━━━━━━━━━
_Evaluado con BrewStudy PRO 🍻_`;
  }

  return `🍺 *BJCP SCORESHEET (50 PTS)*
━━━━━━━━━━━━━━━━━━━━━━
🏷️ *Beer:* ${tasting.beerName || 'Unnamed'}${tasting.brewery ? ` (${tasting.brewery})` : ''}
📚 *Style:* ${tasting.styleId} - ${tasting.styleName}
⭐ *Total Score:* ${tasting.totalScore} / 50 pts (${tier.label_en.toUpperCase()})

📊 *Sensory Breakdown:*
• Aroma: ${tasting.scoresheet.aromaScore || 0} / 12 pts
• Appearance: ${tasting.scoresheet.appearanceScore || 0} / 3 pts
• Flavor: ${tasting.scoresheet.flavorScore || 0} / 20 pts
• Mouthfeel: ${tasting.scoresheet.mouthfeelScore || 0} / 5 pts
• Overall Impression: ${tasting.scoresheet.overallScore || 0} / 10 pts
${tasting.descriptors && tasting.descriptors.length > 0 ? `\n🏷️ *Descriptors:* ${tasting.descriptors.join(', ')}` : ''}
${tasting.feedbackNotes ? `\n💡 *Feedback for Brewer:* ${tasting.feedbackNotes}` : ''}
👤 *Evaluator Judge:* ${judgeName} ${judgeRank}
━━━━━━━━━━━━━━━━━━━━━━
_Evaluated with BrewStudy PRO 🍻_`;
}

/**
 * Comparte el texto formateado por WhatsApp / Redes Sociales
 */
export async function shareTastingText(tasting: TastingNote, judge?: UserProfile, lang: 'es' | 'en' = 'es'): Promise<boolean> {
  try {
    const text = generateTastingTextSummary(tasting, judge, lang);
    await Share.share({
      message: text,
      title: `${tasting.beerName} (${tasting.totalScore}/50 pts)`,
    });
    return true;
  } catch (e) {
    console.warn('Error sharing tasting text:', e);
    return false;
  }
}

/**
 * Exporta un archivo de ficha `.bjcptasting` para enviarlo por AirDrop, WhatsApp o Archivos a otro juez
 */
export async function shareTastingFile(
  tasting: TastingNote,
  judge?: UserProfile,
  lang: 'es' | 'en' = 'es'
): Promise<{ success: boolean; message?: string }> {
  try {
    // 1. Incrustar fotos si existen
    const enrichedTasting: TastingNote & { photoBase64?: string; labelPhotoBase64?: string } = { ...tasting };
    if (tasting.photoUrl) {
      enrichedTasting.photoBase64 = await fileUriToBase64(tasting.photoUrl);
    }
    if (tasting.labelPhotoUrl) {
      enrichedTasting.labelPhotoBase64 = await fileUriToBase64(tasting.labelPhotoUrl);
    }

    let judgeAvatarB64: string | undefined;
    const avatarToEncode = judge?.avatarUrl || tasting.judgeAvatarUrl;
    if (avatarToEncode) {
      judgeAvatarB64 = await fileUriToBase64(avatarToEncode);
    }

    const payload: SharedTastingPayload = {
      version: 1,
      type: 'single_tasting',
      exportedAt: new Date().toISOString(),
      judge: {
        fullName: judge?.fullName || tasting.judgeName || 'Juez BJCP',
        bjcpRank: judge?.bjcpRank || tasting.judgeRank || 'Apprentice',
        bjcpId: judge?.bjcpId || tasting.judgeId,
        avatarBase64: judgeAvatarB64,
      } as any,
      tasting: enrichedTasting,
    };

    const cleanBeerName = (tasting.beerName || 'Beer').replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${tasting.styleId || 'Cata'}_${cleanBeerName}.bjcptasting`;
    const tempDir = FileSystem.cacheDirectory || FileSystem.documentDirectory || '';
    const fileUri = `${tempDir}${fileName}`;

    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(payload, null, 2), {
      encoding: FileSystem.EncodingType?.UTF8 || 'utf8',
    });

    // Abrir hoja nativa de compartir
    await Share.share({
      title: `${tasting.beerName} - Ficha BJCP (${tasting.totalScore} pts)`,
      url: fileUri,
      message: Platform.OS === 'android' ? JSON.stringify(payload) : undefined,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error sharing single tasting:', error);
    return {
      success: false,
      message: error?.message || (lang === 'es' ? 'No se pudo compartir la ficha.' : 'Could not share scoresheet.'),
    };
  }
}

/**
 * Desempaqueta y restaura una ficha de cata recibida (.bjcptasting)
 */
export async function parseSharedTasting(fileContent: string): Promise<{
  tasting: TastingNote;
  judge: { fullName: string; bjcpRank: string; bjcpId?: string; avatarUrl?: string };
} | null> {
  try {
    const parsed: SharedTastingPayload = JSON.parse(fileContent);
    if (!parsed || parsed.type !== 'single_tasting' || !parsed.tasting || !parsed.tasting.scoresheet) {
      return null;
    }

    const item = { ...parsed.tasting };
    const id = `tasting_shared_${Date.now()}`;

    // Restaurar foto de vaso
    if (item.photoBase64) {
      const photoPath = await base64ToLocalFile(item.photoBase64, `${id}_glass.jpg`);
      if (photoPath) item.photoUrl = photoPath;
      delete item.photoBase64;
    }

    // Restaurar foto de etiqueta
    if (item.labelPhotoBase64) {
      const labelPath = await base64ToLocalFile(item.labelPhotoBase64, `${id}_label.jpg`);
      if (labelPath) item.labelPhotoUrl = labelPath;
      delete item.labelPhotoBase64;
    }

    // Restaurar avatar del juez
    let restoredJudgeAvatar: string | undefined;
    if ((parsed.judge as any)?.avatarBase64) {
      restoredJudgeAvatar = await base64ToLocalFile((parsed.judge as any).avatarBase64, `${id}_judge.jpg`);
    }

    item.id = id;
    item.judgeName = parsed.judge.fullName;
    item.judgeRank = parsed.judge.bjcpRank;
    item.judgeId = parsed.judge.bjcpId;
    if (restoredJudgeAvatar) {
      item.judgeAvatarUrl = restoredJudgeAvatar;
    }

    return {
      tasting: item,
      judge: {
        fullName: parsed.judge.fullName,
        bjcpRank: parsed.judge.bjcpRank,
        bjcpId: parsed.judge.bjcpId,
        avatarUrl: restoredJudgeAvatar,
      },
    };
  } catch (e) {
    console.warn('Error parsing shared tasting:', e);
    return null;
  }
}
