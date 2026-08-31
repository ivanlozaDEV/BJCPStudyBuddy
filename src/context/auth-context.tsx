import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import * as Crypto from 'expo-crypto';
import { supabase, isSupabaseConfigured } from '@/services/supabase';
import { UserProfile } from '@/types/tasting';

const LOCAL_USER_KEY = '@bjcp_local_user_profile';
const LOCAL_GUEST_ID_KEY = '@bjcp_guest_user_id';

interface AuthContextData {
  user: User | null;
  session: Session | null;
  profile: UserProfile;
  guestId: string;
  isLoading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  signOut: () => Promise<void>;
}

const defaultProfile: UserProfile = {
  id: 'guest',
  fullName: 'Juez en Formación',
  bjcpRank: 'Apprentice',
  experienceLevel: 'Student',
};

const AuthContext = createContext<AuthContextData | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [guestId, setGuestId] = useState<string>('guest');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        // 1. Get or generate persistent Guest ID
        let currentGuestId = await AsyncStorage.getItem(LOCAL_GUEST_ID_KEY);
        if (!currentGuestId) {
          currentGuestId = Crypto.randomUUID();
          await AsyncStorage.setItem(LOCAL_GUEST_ID_KEY, currentGuestId);
        }
        setGuestId(currentGuestId);

        // 2. Load cached profile
        const cachedProfile = await AsyncStorage.getItem(LOCAL_USER_KEY);
        if (cachedProfile) {
          try {
            setProfile(JSON.parse(cachedProfile));
          } catch {}
        } else {
          setProfile({ ...defaultProfile, id: currentGuestId });
        }

        // 3. Check Supabase session if configured
        if (isSupabaseConfigured()) {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            setSession(data.session);
            setUser(data.session.user);
            await fetchSupabaseProfile(data.session.user.id);
          }

          const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, newSession) => {
              setSession(newSession);
              setUser(newSession?.user ?? null);
              if (newSession?.user) {
                await fetchSupabaseProfile(newSession.user.id);
              }
            }
          );

          return () => {
            authListener.subscription.unsubscribe();
          };
        }
      } catch (e) {
        console.warn('Error during auth initialization:', e);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const fetchSupabaseProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        const updated: UserProfile = {
          id: data.id,
          email: data.email,
          fullName: data.full_name || profile.fullName,
          avatarUrl: data.avatar_url,
          bjcpRank: data.bjcp_rank || 'Apprentice',
          bjcpId: data.bjcp_id,
          experienceLevel: data.experience_level,
        };
        setProfile(updated);
        await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('Failed to fetch profile from Supabase:', e);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));

    if (isSupabaseConfigured() && user) {
      try {
        await supabase.from('user_profiles').upsert({
          id: user.id,
          full_name: updated.fullName,
          avatar_url: updated.avatarUrl,
          bjcp_rank: updated.bjcpRank,
          bjcp_id: updated.bjcpId,
          experience_level: updated.experienceLevel,
          updated_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Error syncing profile updates to Supabase:', e);
      }
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile({ ...defaultProfile, id: guestId });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        guestId,
        isLoading,
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
