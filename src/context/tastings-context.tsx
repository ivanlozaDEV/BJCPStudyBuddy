import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { TastingNote, calculateTotalScore } from '@/types/tasting';
import { useAuth } from './auth-context';

const PRIMARY_TASTINGS_KEY = '@bjcp_tastings';
const LEGACY_TASTINGS_KEY = '@bjcp_tastings_history';

interface TastingsContextData {
  tastings: TastingNote[];
  isLoading: boolean;
  saveTasting: (tasting: Omit<TastingNote, 'id' | 'createdAt' | 'updatedAt' | 'totalScore'> & { id?: string }) => Promise<TastingNote>;
  deleteTasting: (id: string) => Promise<boolean>;
  getTastingById: (id: string) => TastingNote | undefined;
  getTastingsByStyle: (styleId: string) => TastingNote[];
  syncWithCloud: () => Promise<void>;
  reloadTastings: () => Promise<void>;
  stats: {
    totalTastings: number;
    averageScore: number;
    highestScore: number;
    stylesCount: number;
  };
}

const TastingsContext = createContext<TastingsContextData | null>(null);

export function TastingsProvider({ children }: { children: React.ReactNode }) {
  const { guestId } = useAuth();
  const [tastings, setTastings] = useState<TastingNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Initial Load from Local Storage
  const loadLocalTastings = async () => {
    try {
      let stored = await AsyncStorage.getItem(PRIMARY_TASTINGS_KEY);
      if (!stored) {
        stored = await AsyncStorage.getItem(LEGACY_TASTINGS_KEY);
      }
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
  };

  useEffect(() => {
    loadLocalTastings();
  }, []);

  const saveTasting = async (
    input: Omit<TastingNote, 'id' | 'createdAt' | 'updatedAt' | 'totalScore'> & { id?: string }
  ): Promise<TastingNote> => {
    const totalScore = calculateTotalScore(input.scoresheet);
    const now = new Date().toISOString();
    const id = input.id || Crypto.randomUUID();

    const newTasting: TastingNote = {
      ...input,
      id,
      userId: guestId || 'judge_local',
      totalScore,
      createdAt: input.id ? (tastings.find((t) => t.id === input.id)?.createdAt || now) : now,
      updatedAt: now,
    };

    const updated = [newTasting, ...tastings.filter((t) => t.id !== id)];
    setTastings(updated);

    // Save locally
    await AsyncStorage.setItem(PRIMARY_TASTINGS_KEY, JSON.stringify(updated));
    await AsyncStorage.setItem(LEGACY_TASTINGS_KEY, JSON.stringify(updated));

    return newTasting;
  };

  const deleteTasting = async (id: string): Promise<boolean> => {
    try {
      const updated = tastings.filter((t) => t.id !== id);
      setTastings(updated);
      await AsyncStorage.setItem(PRIMARY_TASTINGS_KEY, JSON.stringify(updated));
      await AsyncStorage.setItem(LEGACY_TASTINGS_KEY, JSON.stringify(updated));
      return true;
    } catch (e) {
      console.warn('Error deleting tasting:', e);
      return false;
    }
  };

  const getTastingById = (id: string) => tastings.find((t) => t.id === id);

  const getTastingsByStyle = (styleId: string) =>
    tastings.filter((t) => t.styleId.toLowerCase() === styleId.toLowerCase());

  // Stub de compatibilidad
  const syncWithCloud = async () => {
    await loadLocalTastings();
  };

  const reloadTastings = async () => {
    await loadLocalTastings();
  };

  // Stats calculation
  const totalTastings = tastings.length;
  const averageScore =
    totalTastings > 0
      ? Math.round((tastings.reduce((sum, t) => sum + (t.totalScore || 0), 0) / totalTastings) * 10) / 10
      : 0;
  const highestScore =
    totalTastings > 0 ? Math.max(...tastings.map((t) => t.totalScore || 0)) : 0;
  const stylesCount = new Set(tastings.map((t) => t.styleId)).size;

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
        reloadTastings,
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
