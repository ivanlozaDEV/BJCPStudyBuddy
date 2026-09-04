import * as Location from 'expo-location';
import { LocationCoordinates } from '@/types/tasting';

/**
 * Obtiene la ubicación GPS actual del dispositivo y realiza geocodificación inversa
 * para extraer la ciudad y el país.
 */
export async function getCurrentDeviceLocation(
  lang: 'es' | 'en' = 'es'
): Promise<{ success: boolean; coords?: LocationCoordinates; error?: string }> {
  try {
    // 1. Solicitar permisos de ubicación en primer plano
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return {
        success: false,
        error:
          lang === 'es'
            ? 'Se requiere permiso de ubicación para registrar las coordenadas del lugar.'
            : 'Location permission is required to record place coordinates.',
      };
    }

    // 2. Obtener posición GPS
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const latitude = parseFloat(position.coords.latitude.toFixed(6));
    const longitude = parseFloat(position.coords.longitude.toFixed(6));

    let city: string | undefined = undefined;
    let country: string | undefined = undefined;

    // 3. Geocodificación Inversa (Reverse Geocoding)
    try {
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geocode && geocode.length > 0) {
        const place = geocode[0];
        city = place.city || place.subregion || place.district || place.region || undefined;
        country = place.country || undefined;
      }
    } catch (geoError) {
      console.warn('Could not reverse geocode coordinates:', geoError);
    }

    return {
      success: true,
      coords: {
        latitude,
        longitude,
        city,
        country,
      },
    };
  } catch (error: any) {
    console.warn('Error getting device location:', error);
    return {
      success: false,
      error:
        error?.message ||
        (lang === 'es'
          ? 'No se pudo obtener la ubicación GPS actual.'
          : 'Could not obtain current GPS location.'),
    };
  }
}
