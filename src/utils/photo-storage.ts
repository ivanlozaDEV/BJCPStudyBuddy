import * as FileSystem from 'expo-file-system/legacy';

const PHOTOS_DIR_NAME = 'tasting_photos/';

/**
 * Obtiene la ruta del directorio permanente de fotos de cata
 */
export function getPermanentPhotosDir(): string {
  const baseDir = FileSystem.documentDirectory || FileSystem.cacheDirectory || '';
  return `${baseDir}${PHOTOS_DIR_NAME}`;
}

/**
 * Asegura que el directorio permanente de fotos exista
 */
export async function ensurePhotosDirectoryExists(): Promise<string> {
  const dir = getPermanentPhotosDir();
  try {
    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
  } catch (e) {
    console.warn('Could not ensure photos directory:', e);
  }
  return dir;
}

/**
 * Guarda una foto temporal (de ImagePicker o Cámara) en el almacenamiento permanente de la app.
 * Devuelve la URI permanente en FileSystem.documentDirectory.
 */
export async function savePermanentPhoto(tempUri: string, prefix = 'beer'): Promise<string> {
  if (!tempUri || !tempUri.startsWith('file://')) {
    return tempUri;
  }

  try {
    const dir = await ensurePhotosDirectoryExists();
    const extension = tempUri.split('.').pop()?.split('?')[0] || 'jpg';
    const fileName = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${extension}`;
    const targetUri = `${dir}${fileName}`;

    await FileSystem.copyAsync({
      from: tempUri,
      to: targetUri,
    });

    return targetUri;
  } catch (error) {
    console.warn('Error saving permanent photo, falling back to temp URI:', error);
    return tempUri;
  }
}

/**
 * Resuelve dinámicamente una URI de foto para que sea inmune a los cambios de Sandbox UUID en iOS.
 * Si la URI guardada contiene un UUID antiguo de iOS (/var/mobile/Containers/Data/Application/OLD_UUID/...),
 * extrae el nombre del archivo y lo apunta al FileSystem.documentDirectory actual.
 */
export function resolvePhotoUri(uri?: string): string | undefined {
  if (!uri) return undefined;

  // Si es un data URI Base64 o URL remota http(s), devolverla tal cual
  if (uri.startsWith('data:') || uri.startsWith('http://') || uri.startsWith('https://')) {
    return uri;
  }

  // Si no es una URI de archivo local, devolverla tal cual
  if (!uri.startsWith('file://')) {
    return uri;
  }

  const docDir = FileSystem.documentDirectory;
  if (!docDir) return uri;

  // Extraer el nombre del archivo de la foto
  // Ejemplos:
  // file:///var/mobile/Containers/Data/Application/OLD_UUID/Documents/tasting_photos/beer_123.jpg -> tasting_photos/beer_123.jpg
  // file:///var/mobile/Containers/Data/Application/OLD_UUID/Documents/beer_123.jpg -> beer_123.jpg
  const parts = uri.split('/');
  const fileName = parts.pop();
  const parentFolder = parts.pop();

  if (!fileName) return uri;

  if (parentFolder === 'tasting_photos') {
    return `${docDir}tasting_photos/${fileName}`;
  }

  return `${docDir}${fileName}`;
}
