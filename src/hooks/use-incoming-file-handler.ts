import { useEffect } from 'react';
import { Linking, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { router } from 'expo-router';
import { parseSharedTasting } from '@/services/tasting-share-service';
import { useTastings } from '@/context/tastings-context';
import { useTranslation } from '@/context/language-context';

export function useIncomingFileHandler() {
  const { language } = useTranslation();
  const { saveTasting, reloadTastings } = useTastings();

  const handleUrl = async (url: string | null) => {
    if (!url) return;

    try {
      const decodedUrl = decodeURIComponent(url);

      // 1. Manejo de archivo de ficha individual (.bjcptasting)
      if (decodedUrl.endsWith('.bjcptasting') || decodedUrl.includes('.bjcptasting')) {
        let fileUri = decodedUrl;
        if (!fileUri.startsWith('file://') && !fileUri.startsWith('content://')) {
          fileUri = `file://${fileUri}`;
        }

        const content = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType?.UTF8 || 'utf8',
        });

        const parsed = await parseSharedTasting(content);
        if (parsed) {
          Alert.alert(
            language === 'es' ? '📥 Ficha de Cata Recibida' : '📥 Scoresheet Received',
            language === 'es'
              ? `Has recibido la evaluación de ${parsed.judge.fullName} (${parsed.judge.bjcpRank}) para "${parsed.tasting.beerName}" (${parsed.tasting.totalScore}/50 pts). ¿Deseas agregarla a tus catas?`
              : `Received evaluation by ${parsed.judge.fullName} (${parsed.judge.bjcpRank}) for "${parsed.tasting.beerName}" (${parsed.tasting.totalScore}/50 pts). Add to your tastings?`,
            [
              { text: language === 'es' ? 'Cancelar' : 'Cancel', style: 'cancel' },
              {
                text: language === 'es' ? 'Importar y Ver' : 'Import and View',
                onPress: async () => {
                  const saved = await saveTasting(parsed.tasting);
                  await reloadTastings();
                  router.push({
                    pathname: '/tasting-detail' as any,
                    params: { id: saved.id },
                  });
                },
              },
            ]
          );
        }
      }

      // 2. Manejo de archivo de respaldo completo (.brewstudy)
      else if (decodedUrl.endsWith('.brewstudy') || decodedUrl.includes('.brewstudy')) {
        Alert.alert(
          language === 'es' ? '📥 Copia de Seguridad BrewStudy' : '📥 BrewStudy Backup',
          language === 'es'
            ? 'Para restaurar esta copia de seguridad completa, ve a Ajustes > Importar Copia de Seguridad.'
            : 'To restore this full backup archive, go to Settings > Import Backup File.',
          [
            {
              text: language === 'es' ? 'Ir a Ajustes' : 'Go to Settings',
              onPress: () => router.push('/settings' as any),
            },
            { text: 'OK', style: 'cancel' },
          ]
        );
      }
    } catch (e) {
      console.warn('Error handling incoming file URL:', e);
    }
  };

  useEffect(() => {
    // 1. Manejar si la app se abrió desde un archivo cuando estaba cerrada
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    // 2. Escuchar si se abre un archivo con la app ya en memoria
    const subscription = Linking.addEventListener('url', (event) => {
      if (event.url) handleUrl(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, [language]);
}
