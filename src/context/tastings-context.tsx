import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { TastingNote, calculateTotalScore } from '@/types/tasting';
import { supabase, isSupabaseConfigured, uploadBeerPhoto } from '@/services/supabase';
import { useAuth } from './auth-context';
import { usePurchases } from './purchases-context';

const LOCAL_TASTINGS_KEY = '@bjcp_tastings_history';

interface TastingsContextData {
  tastings: TastingNote[];
  isLoading: boolean;
  saveTasting: (tasting: Omit<TastingNote, 'id' | 'createdAt' | 'updatedAt' | 'totalScore'> & { id?: string }) => Promise<TastingNote>;
  deleteTasting: (id: string) => Promise<boolean>;
  getTastingById: (id: string) => TastingNote | undefined;
  getTastingsByStyle: (styleId: string) => TastingNote[];
  syncWithCloud: () => Promise<void>;
  stats: {
    totalTastings: number;
    averageScore: number;
    highestScore: number;
    stylesCount: number;
  };
}

const TastingsContext = createContext<TastingsContextData | null>(null);

export function TastingsProvider({ children }: { children: React.ReactNode }) {
  const { user, guestId } = useAuth();
  const { isPro } = usePurchases();
  const [tastings, setTastings] = useState<TastingNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Initial Load from Local Storage
  useEffect(() => {
    async function loadLocalTastings() {
      try {
        const stored = await AsyncStorage.getItem(LOCAL_TASTINGS_KEY);
        if (stored) {
          try {
            const parsed: TastingNote[] = JSON.parse(stored);
            setTastings(parsed);
          } catch {}
        }
      } catch (e) {
        console.warn('Error loading local tastings:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadLocalTastings();
  }, []);

  // 2. Sync with Supabase on user/network/Pro change
  useEffect(() => {
    if (isSupabaseConfigured() && user && isPro) {
      syncWithCloud();
    }
  }, [user, isPro]);

  const syncWithCloud = async () => {
    if (!isSupabaseConfigured() || !user || !isPro) return;

    try {
      // 1. Fetch remote tastings
      const { data: remoteData, error } = await supabase
        .from('tasting_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && remoteData) {
        const remoteTastings: TastingNote[] = remoteData.map((row) => ({
          id: row.id,
          userId: row.user_id,
          styleId: row.style_id,
          styleName: row.style_name,
          beerName: row.beer_name,
          brewery: row.brewery || '',
          vintageOrBatch: row.vintage_or_batch || '',
          photoUrl: row.photo_url || undefined,
          labelPhotoUrl: row.label_photo_url || undefined,
          scoresheet: {
            appearanceScore: row.appearance_score,
            appearanceNotes: row.appearance_notes || '',
            aromaScore: row.aroma_score,
            aromaNotes: row.aroma_notes || '',
            flavorScore: row.flavor_score,
            flavorNotes: row.flavor_notes || '',
            mouthfeelScore: row.mouthfeel_score,
            mouthfeelNotes: row.mouthfeel_notes || '',
            aftertasteNotes: row.aftertaste_notes || '',
            overallScore: row.overall_score,
            overallNotes: row.overall_notes || '',
          },
          structuredAttributes: row.structured_attributes || undefined,
          totalScore:
            row.total_score ||
            calculateTotalScore({
              appearanceScore: row.appearance_score,
              appearanceNotes: '',
              aromaScore: row.aroma_score,
              aromaNotes: '',
              flavorScore: row.flavor_score,
              flavorNotes: '',
              mouthfeelScore: row.mouthfeel_score,
              mouthfeelNotes: '',
              aftertasteNotes: '',
              overallScore: row.overall_score,
              overallNotes: '',
            }),
          descriptors: row.descriptors || [],
          feedbackNotes: row.feedback_notes || '',
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          synced: true,
        }));

        // Merge local & remote (favor latest updated)
        setTastings((prevLocal) => {
          const map = new Map<string, TastingNote>();
          prevLocal.forEach((t) => map.set(t.id, t));
          remoteTastings.forEach((t) => map.set(t.id, t));
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          AsyncStorage.setItem(LOCAL_TASTINGS_KEY, JSON.stringify(merged));
          return merged;
        });
      }
    } catch (e) {
      console.warn('Error during cloud sync:', e);
    }
  };

  const saveTasting = async (
    tastingInput: Omit<TastingNote, 'id' | 'createdAt' | 'updatedAt' | 'totalScore'> & { id?: string }
  ): Promise<TastingNote> => {
    const id = tastingInput.id || Crypto.randomUUID();
    const now = new Date().toISOString();
    const effectiveUserId = user?.id || guestId;
    const totalScore = calculateTotalScore(tastingInput.scoresheet);

    let finalPhotoUrl = tastingInput.photoUrl;
    if (finalPhotoUrl && (finalPhotoUrl.startsWith('file://') || finalPhotoUrl.startsWith('ph://'))) {
      try {
        const uploadedUrl = await uploadBeerPhoto(finalPhotoUrl, effectiveUserId, `${id}-glass`);
        if (uploadedUrl) {
          finalPhotoUrl = uploadedUrl;
        }
      } catch (e) {
        console.warn('Error uploading glass photo during save:', e);
      }
    }

    let finalLabelPhotoUrl = tastingInput.labelPhotoUrl;
    if (finalLabelPhotoUrl && (finalLabelPhotoUrl.startsWith('file://') || finalLabelPhotoUrl.startsWith('ph://'))) {
      try {
        const uploadedLabelUrl = await uploadBeerPhoto(finalLabelPhotoUrl, effectiveUserId, `${id}-label`);
        if (uploadedLabelUrl) {
          finalLabelPhotoUrl = uploadedLabelUrl;
        }
      } catch (e) {
        console.warn('Error uploading label photo during save:', e);
      }
    }

    const noteToSave: TastingNote = {
      ...tastingInput,
      id,
      userId: effectiveUserId,
      photoUrl: finalPhotoUrl,
      labelPhotoUrl: finalLabelPhotoUrl,
      totalScore,
      createdAt: now,
      updatedAt: now,
      synced: false,
    };

    // Update local state and AsyncStorage immediately (offline-first)
    const updatedList = [noteToSave, ...tastings.filter((t) => t.id !== id)];
    setTastings(updatedList);
    await AsyncStorage.setItem(LOCAL_TASTINGS_KEY, JSON.stringify(updatedList));

    // Upload to Supabase if online and user is PRO
    if (isSupabaseConfigured() && user && isPro) {
      try {
        await supabase.from('tasting_notes').upsert({
          id,
          user_id: user.id,
          style_id: noteToSave.styleId,
          style_name: noteToSave.styleName,
          beer_name: noteToSave.beerName,
          brewery: noteToSave.brewery,
          vintage_or_batch: noteToSave.vintageOrBatch,
          photo_url: noteToSave.photoUrl,
          label_photo_url: noteToSave.labelPhotoUrl,
          appearance_score: noteToSave.scoresheet.appearanceScore,
          appearance_notes: noteToSave.scoresheet.appearanceNotes,
          aroma_score: noteToSave.scoresheet.aromaScore,
          aroma_notes: noteToSave.scoresheet.aromaNotes,
          flavor_score: noteToSave.scoresheet.flavorScore,
          flavor_notes: noteToSave.scoresheet.flavorNotes,
          mouthfeel_score: noteToSave.scoresheet.mouthfeelScore,
          mouthfeel_notes: noteToSave.scoresheet.mouthfeelNotes,
          aftertaste_notes: noteToSave.scoresheet.aftertasteNotes,
          overall_score: noteToSave.scoresheet.overallScore,
          overall_notes: noteToSave.scoresheet.overallNotes,
          structured_attributes: noteToSave.structuredAttributes,
          total_score: noteToSave.totalScore,
          descriptors: noteToSave.descriptors,
          feedback_notes: noteToSave.feedbackNotes,
          created_at: noteToSave.createdAt,
          updated_at: noteToSave.updatedAt,
        });

        noteToSave.synced = true;
      } catch (e) {
        console.warn('Could not immediately sync tasting note to cloud:', e);
      }
    }

    return noteToSave;
  };

  const deleteTasting = async (id: string): Promise<boolean> => {
    const filtered = tastings.filter((t) => t.id !== id);
    setTastings(filtered);
    await AsyncStorage.setItem(LOCAL_TASTINGS_KEY, JSON.stringify(filtered));

    if (isSupabaseConfigured() && user) {
      try {
        await supabase.from('tasting_notes').delete().eq('id', id);
      } catch (e) {
        console.warn('Error deleting tasting note on cloud:', e);
      }
    }
    return true;
  };

  const getTastingById = (id: string) => {
    return tastings.find((t) => t.id === id);
  };

  const getTastingsByStyle = (styleId: string) => {
    return tastings.filter(
      (t) => t.styleId.toLowerCase() === styleId.toLowerCase()
    );
  };

  // Compute stats
  const totalTastings = tastings.length;
  const averageScore =
    totalTastings > 0
      ? Math.round(
          (tastings.reduce((sum, t) => sum + t.totalScore, 0) / totalTastings) * 10
        ) / 10
      : 0;
  const highestScore =
    totalTastings > 0 ? Math.max(...tastings.map((t) => t.totalScore)) : 0;
  const uniqueStyles = new Set(tastings.map((t) => t.styleId));
  const stylesCount = uniqueStyles.size;

  return (
    <TastingsContext.Provider
      value={{
        tastings,
        isLoading,
        saveTasting,
        deleteTasting,
        getTastingById,
        getTastingsByStyle,
        syncWithCloud,
        stats: {
          totalTastings,
          averageScore,
          highestScore,
          stylesCount,
        },
      }}
    >
      {children}
    </TastingsContext.Provider>
  );
}

export function useTastings() {
  const context = useContext(TastingsContext);
  if (!context) {
    throw new Error('useTastings must be used within a TastingsProvider');
  }
  return context;
}
