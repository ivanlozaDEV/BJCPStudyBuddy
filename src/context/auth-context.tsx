import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { UserProfile } from '@/types/tasting';

const LOCAL_USER_KEY = '@bjcp_user_profile';
const LOCAL_GUEST_ID_KEY = '@bjcp_guest_user_id';

interface AuthContextData {
  user: null;
  session: null;
  profile: UserProfile;
  guestId: string;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName?: string, bjcpRank?: string) => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  signOut: () => Promise<void>;
}

const defaultProfile: UserProfile = {
  id: 'judge_local',
  fullName: 'Juez en Formación',
  bjcpRank: 'Apprentice',
  experienceLevel: 'Student',
};

const AuthContext = createContext<AuthContextData | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [guestId, setGuestId] = useState<string>('judge_local');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initProfile() {
      try {
        let currentGuestId = await AsyncStorage.getItem(LOCAL_GUEST_ID_KEY);
        if (!currentGuestId) {
          currentGuestId = Crypto.randomUUID();
          await AsyncStorage.setItem(LOCAL_GUEST_ID_KEY, currentGuestId);
        }
        setGuestId(currentGuestId);

        const cachedProfile = await AsyncStorage.getItem(LOCAL_USER_KEY);
        if (cachedProfile) {
          try {
            const parsed = JSON.parse(cachedProfile);
            setProfile({
              ...defaultProfile,
              ...parsed,
              fullName: parsed.fullName || defaultProfile.fullName,
              bjcpRank: parsed.bjcpRank || defaultProfile.bjcpRank,
            });
          } catch {
            setProfile({ ...defaultProfile, id: currentGuestId });
          }
        } else {
          setProfile({ ...defaultProfile, id: currentGuestId });
        }
      } catch (e) {
        console.warn('Error during local profile initialization:', e);
      } finally {
        setIsLoading(false);
      }
    }

    initProfile();
  }, []);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const updated = { ...profile, ...updates };
      setProfile(updated);
      await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error updating local profile:', e);
    }
  };

  // Stubs para compatibilidad
  const signIn = async () => ({ error: undefined });
  const signUp = async () => ({ error: undefined });
  const resetPassword = async () => ({ error: undefined });
  const signOut = async () => {
    setProfile(defaultProfile);
    await AsyncStorage.removeItem(LOCAL_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user: null,
        session: null,
        profile,
        guestId,
        isLoading,
        signIn,
        signUp,
        resetPassword,
        updateProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
