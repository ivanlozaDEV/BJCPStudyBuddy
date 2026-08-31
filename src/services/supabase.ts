import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Default Supabase project configuration (can be overridden with EXPO_PUBLIC_ environment variables)
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const isSupabaseConfigured = () => {
  return (
    Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) &&
    process.env.EXPO_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co'
  );
};

// SSR-Safe storage adapter that prevents "window is not defined" during Expo Router static Node.js SSR pre-rendering
const isServer = typeof window === 'undefined' && Platform.OS === 'web';

const SSRSafeAsyncStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (isServer) return null;
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (isServer) return;
    try {
      await AsyncStorage.setItem(key, value);
    } catch {}
  },
  removeItem: async (key: string): Promise<void> => {
    if (isServer) return;
    try {
      await AsyncStorage.removeItem(key);
    } catch {}
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: SSRSafeAsyncStorage,
    autoRefreshToken: !isServer,
    persistSession: !isServer,
    detectSessionInUrl: false,
  },
});

/**
 * Uploads a local beer photo URI to Supabase Storage 'beer-labels' bucket
 * Returns the public URL of the uploaded image
 */
export async function uploadBeerPhoto(uri: string, userId: string, tastingId: string): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    // If Supabase is not yet configured with valid keys, return the local URI for offline preview
    return uri;
  }

  try {
    const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
    const filePath = `${userId}/${tastingId}-${Date.now()}.${fileExt}`;

    const response = await fetch(uri);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from('beer-labels')
      .upload(filePath, arrayBuffer, {
        contentType: `image/${fileExt === 'png' ? 'png' : 'jpeg'}`,
        upsert: true,
      });

    if (uploadError) {
      console.warn('Supabase storage upload error:', uploadError.message);
      return uri; // fallback to local uri
    }

    const { data } = supabase.storage.from('beer-labels').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.warn('Failed to upload photo to Supabase storage:', error);
    return uri; // fallback to local uri
  }
}
