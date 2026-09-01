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
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName?: string, bjcpRank?: string) => Promise<{ error?: string; user?: User | null }>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
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
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        const updated: UserProfile = {
          id: data.id,
          email: data.email,
          fullName: data.display_name || profile.fullName,
          bjcpRank: data.judge_level || 'Apprentice',
          bjcpId: data.bjcp_id,
          experienceLevel: profile.experienceLevel,
        };
        setProfile(updated);
        await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('Failed to fetch profile from Supabase:', e);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured()) {
      return { error: 'Supabase no está configurado aún con credenciales válidas.' };
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) return { error: error.message };
      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        await fetchSupabaseProfile(data.user.id);
      }
      return {};
    } catch (e: any) {
      return { error: e?.message || 'Error al iniciar sesión' };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName?: string,
    bjcpRank?: string
  ): Promise<{ error?: string; user?: User | null }> => {
    if (!isSupabaseConfigured()) {
      return { error: 'Supabase no está configurado aún con credenciales válidas.' };
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName?.trim() || email.split('@')[0],
            judge_level: bjcpRank || 'Apprentice',
          },
        },
      });
      if (error) return { error: error.message };
      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        if (fullName || bjcpRank) {
          await updateProfile({
            fullName: fullName || profile.fullName,
            bjcpRank: (bjcpRank as any) || profile.bjcpRank,
            email: data.user.email,
          });
        }
      }
      return { user: data.user };
    } catch (e: any) {
      return { error: e?.message || 'Error al registrarse' };
    }
  };

  const resetPassword = async (email: string): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured()) {
      return { error: 'Supabase no está configurado aún con credenciales válidas.' };
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) return { error: error.message };
      return {};
    } catch (e: any) {
      return { error: e?.message || 'Error al enviar correo de recuperación' };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));

    if (isSupabaseConfigured() && user) {
      try {
        await supabase.from('profiles').upsert({
          id: user.id,
          display_name: updated.fullName,
          judge_level: updated.bjcpRank,
          bjcp_id: updated.bjcpId,
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
    await AsyncStorage.removeItem(LOCAL_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
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
