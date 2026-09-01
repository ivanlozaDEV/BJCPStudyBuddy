import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BeerLogo } from '@/components/beer-logo';
import { BeerBubbles } from '@/components/beer-bubbles';
import { Fonts, Spacing, MaxContentWidth } from '@/constants/theme';
import { useTranslation } from '@/context/language-context';
import { useAuth } from '@/context/auth-context';
import { isSupabaseConfigured } from '@/services/supabase';

type AuthTab = 'signin' | 'signup' | 'forgot';

export default function AuthScreen() {
  const { language } = useTranslation();
  const { signIn, signUp, resetPassword, user } = useAuth();

  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [bjcpRank, setBjcpRank] = useState('Apprentice');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      Alert.alert(
        language === 'es' ? 'Campos requeridos' : 'Required fields',
        language === 'es'
          ? 'Por favor ingresa tu correo y contraseña.'
          : 'Please enter your email and password.'
      );
      return;
    }

    if (!isSupabaseConfigured()) {
      Alert.alert(
        language === 'es' ? 'Supabase no conectado' : 'Supabase Not Connected',
        language === 'es'
          ? 'Para usar la autenticación en la nube, debes agregar tus credenciales en el archivo .env.'
          : 'To use cloud authentication, you must add your credentials in the .env file.'
      );
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert(language === 'es' ? 'Error al ingresar' : 'Sign In Error', error);
    } else {
      Alert.alert(
        language === 'es' ? '¡Bienvenido!' : 'Welcome!',
        language === 'es'
          ? 'Has iniciado sesión exitosamente. Tus datos se sincronizarán en la nube.'
          : 'You are now signed in. Your data will sync with the cloud.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  };

  const handleSignUp = async () => {
    if (!email.trim() || !password) {
      Alert.alert(
        language === 'es' ? 'Campos requeridos' : 'Required fields',
        language === 'es'
          ? 'Por favor ingresa un correo y una contraseña.'
          : 'Please enter an email and password.'
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        language === 'es' ? 'Contraseña corta' : 'Short password',
        language === 'es'
          ? 'La contraseña debe tener al menos 6 caracteres.'
          : 'Password must be at least 6 characters.'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        language === 'es' ? 'Las contraseñas no coinciden' : 'Passwords do not match',
        language === 'es'
          ? 'Por favor verifica que ambas contraseñas sean idénticas.'
          : 'Please make sure both passwords match.'
      );
      return;
    }

    if (!isSupabaseConfigured()) {
      Alert.alert(
        language === 'es' ? 'Supabase no conectado' : 'Supabase Not Connected',
        language === 'es'
          ? 'Para crear cuentas en la nube, debes agregar tus credenciales de Supabase en el archivo .env.'
          : 'To create cloud accounts, you must add your Supabase credentials in the .env file.'
      );
      return;
    }

    setLoading(true);
    const { error, user: newUser } = await signUp(email, password, fullName, bjcpRank);
    setLoading(false);

    if (error) {
      Alert.alert(language === 'es' ? 'Error al registrarse' : 'Sign Up Error', error);
    } else {
      Alert.alert(
        language === 'es' ? '¡Cuenta Creada!' : 'Account Created!',
        language === 'es'
          ? 'Tu cuenta ha sido creada exitosamente. Si se requiere confirmación por email, por favor revisa tu bandeja de entrada.'
          : 'Your account has been created. If email confirmation is enabled, please check your inbox.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert(
        language === 'es' ? 'Correo requerido' : 'Email required',
        language === 'es'
          ? 'Ingresa tu correo para enviarte el enlace de recuperación.'
          : 'Enter your email to receive the password reset link.'
      );
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);

    if (error) {
      Alert.alert(language === 'es' ? 'Error' : 'Error', error);
    } else {
      Alert.alert(
        language === 'es' ? 'Correo Enviado' : 'Email Sent',
        language === 'es'
          ? 'Hemos enviado un enlace a tu correo para restablecer tu contraseña.'
          : 'We have sent a link to your email to reset your password.',
        [{ text: 'OK', onPress: () => setActiveTab('signin') }]
      );
    }
  };

  const safeBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <BeerBubbles />
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header with Close button */}
        <View style={styles.header}>
          <Pressable
            onPress={safeBack}
            style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.7 }]}
          >
            <ThemedText style={styles.closeBtnText}>✕</ThemedText>
          </Pressable>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo and Brand */}
            <View style={styles.heroSection}>
              <BeerLogo size={68} />
              <ThemedText style={styles.appTitle}>BrewStudy</ThemedText>
              <ThemedText style={styles.appSubtitle}>
                {language === 'es'
                  ? 'Copia de Seguridad y Sincronización en la Nube'
                  : 'Cloud Backup & Multi-Device Sync'}
              </ThemedText>
            </View>

            {/* Tab Selector */}
            <View style={styles.tabBar}>
              <Pressable
                onPress={() => setActiveTab('signin')}
                style={[styles.tabBtn, activeTab === 'signin' && styles.tabBtnActive]}
              >
                <ThemedText
                  style={[styles.tabBtnText, activeTab === 'signin' && styles.tabBtnTextActive]}
                >
                  {language === 'es' ? 'Iniciar Sesión' : 'Sign In'}
                </ThemedText>
              </Pressable>

              <Pressable
                onPress={() => setActiveTab('signup')}
                style={[styles.tabBtn, activeTab === 'signup' && styles.tabBtnActive]}
              >
                <ThemedText
                  style={[styles.tabBtnText, activeTab === 'signup' && styles.tabBtnTextActive]}
                >
                  {language === 'es' ? 'Crear Cuenta' : 'Sign Up'}
                </ThemedText>
              </Pressable>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              {activeTab === 'forgot' ? (
                <>
                  <ThemedText style={styles.cardHeaderTitle}>
                    {language === 'es' ? 'Recuperar Contraseña' : 'Reset Password'}
                  </ThemedText>
                  <ThemedText style={styles.cardHeaderDesc}>
                    {language === 'es'
                      ? 'Ingresa tu correo electrónico registrado para enviarte las instrucciones de restablecimiento.'
                      : 'Enter your registered email to receive password reset instructions.'}
                  </ThemedText>

                  <View style={styles.inputGroup}>
                    <ThemedText style={styles.inputLabel}>
                      {language === 'es' ? 'Correo Electrónico' : 'Email Address'}
                    </ThemedText>
                    <TextInput
                      style={styles.textInput}
                      placeholder="juez@ejemplo.com"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  {loading ? (
                    <ActivityIndicator size="large" color="#F2B824" style={{ marginVertical: 16 }} />
                  ) : (
                    <Pressable
                      onPress={handleForgotPassword}
                      style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.85 }]}
                    >
                      <ThemedText style={styles.submitBtnText}>
                        {language === 'es' ? 'Enviar Enlace de Recuperación' : 'Send Reset Link'}
                      </ThemedText>
                    </Pressable>
                  )}

                  <Pressable
                    onPress={() => setActiveTab('signin')}
                    style={({ pressed }) => [styles.linkBtn, pressed && { opacity: 0.7 }]}
                  >
                    <ThemedText style={styles.linkBtnText}>
                      ← {language === 'es' ? 'Volver a Iniciar Sesión' : 'Back to Sign In'}
                    </ThemedText>
                  </Pressable>
                </>
              ) : activeTab === 'signin' ? (
                <>
                  <ThemedText style={styles.cardHeaderTitle}>
                    {language === 'es' ? 'Bienvenido de Nuevo' : 'Welcome Back'}
                  </ThemedText>
                  <ThemedText style={styles.cardHeaderDesc}>
                    {language === 'es'
                      ? 'Accede para sincronizar tus catas, notas de juez y avance de estudio.'
                      : 'Sign in to sync your tastings, judge notes, and study progress.'}
                  </ThemedText>

                  <View style={styles.inputGroup}>
                    <ThemedText style={styles.inputLabel}>
                      {language === 'es' ? 'Correo Electrónico' : 'Email'}
                    </ThemedText>
                    <TextInput
                      style={styles.textInput}
                      placeholder="juez@ejemplo.com"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <ThemedText style={styles.inputLabel}>
                      {language === 'es' ? 'Contraseña' : 'Password'}
                    </ThemedText>
                    <TextInput
                      style={styles.textInput}
                      placeholder="••••••••"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                    />
                  </View>

                  <Pressable
                    onPress={() => setActiveTab('forgot')}
                    style={({ pressed }) => [styles.forgotLink, pressed && { opacity: 0.7 }]}
                  >
                    <ThemedText style={styles.forgotLinkText}>
                      {language === 'es' ? '¿Olvidaste tu contraseña?' : 'Forgot password?'}
                    </ThemedText>
                  </Pressable>

                  {loading ? (
                    <ActivityIndicator size="large" color="#F2B824" style={{ marginVertical: 16 }} />
                  ) : (
                    <Pressable
                      onPress={handleSignIn}
                      style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.85 }]}
                    >
                      <ThemedText style={styles.submitBtnText}>
                        {language === 'es' ? 'Iniciar Sesión' : 'Sign In'}
                      </ThemedText>
                    </Pressable>
                  )}
                </>
              ) : (
                <>
                  <ThemedText style={styles.cardHeaderTitle}>
                    {language === 'es' ? 'Crear Nueva Cuenta' : 'Create New Account'}
                  </ThemedText>
                  <ThemedText style={styles.cardHeaderDesc}>
                    {language === 'es'
                      ? 'Guarda tus catas de forma permanente y accede desde cualquier dispositivo.'
                      : 'Save your tastings permanently and access from any device.'}
                  </ThemedText>

                  <View style={styles.inputGroup}>
                    <ThemedText style={styles.inputLabel}>
                      {language === 'es' ? 'Nombre o Alias de Juez' : 'Judge Name or Nickname'}
                    </ThemedText>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Ivan Loza"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      value={fullName}
                      onChangeText={setFullName}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <ThemedText style={styles.inputLabel}>
                      {language === 'es' ? 'Correo Electrónico' : 'Email'}
                    </ThemedText>
                    <TextInput
                      style={styles.textInput}
                      placeholder="juez@ejemplo.com"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <ThemedText style={styles.inputLabel}>
                      {language === 'es' ? 'Contraseña (mínimo 6 caracteres)' : 'Password (min 6 chars)'}
                    </ThemedText>
                    <TextInput
                      style={styles.textInput}
                      placeholder="••••••••"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <ThemedText style={styles.inputLabel}>
                      {language === 'es' ? 'Confirmar Contraseña' : 'Confirm Password'}
                    </ThemedText>
                    <TextInput
                      style={styles.textInput}
                      placeholder="••••••••"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry
                    />
                  </View>

                  {loading ? (
                    <ActivityIndicator size="large" color="#F2B824" style={{ marginVertical: 16 }} />
                  ) : (
                    <Pressable
                      onPress={handleSignUp}
                      style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.85 }]}
                    >
                      <ThemedText style={styles.submitBtnText}>
                        {language === 'es' ? 'Crear Cuenta' : 'Create Account'}
                      </ThemedText>
                    </Pressable>
                  )}
                </>
              )}
            </View>

            {/* Offline-First Reassurance Note */}
            <View style={styles.reassuranceCard}>
              <ThemedText style={styles.reassuranceText}>
                {language === 'es'
                  ? '🔒 La cuenta en la nube es 100% opcional. Puedes continuar usando la app sin cuenta y todos tus datos se conservarán localmente en tu teléfono.'
                  : '🔒 Cloud accounts are 100% optional. You can keep using the app as a guest and all your data stays stored locally on your device.'}
              </ThemedText>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F5D73',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.three,
  },
  heroSection: {
    alignItems: 'center',
    gap: Spacing.one,
    marginVertical: Spacing.two,
  },
  appTitle: {
    fontSize: 22,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  appSubtitle: {
    fontSize: 13,
    fontFamily: Fonts.inter,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 14,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: '#F2B824',
  },
  tabBtnText: {
    fontSize: 14,
    fontFamily: Fonts.spaceGroteskBold,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  tabBtnTextActive: {
    color: '#161B22',
    fontWeight: '800',
  },
  formCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 20,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    gap: Spacing.three,
  },
  cardHeaderTitle: {
    fontSize: 18,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  cardHeaderDesc: {
    fontSize: 13,
    fontFamily: Fonts.inter,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 18,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: Fonts.manropeBold,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: Fonts.inter,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginTop: -4,
  },
  forgotLinkText: {
    color: '#F2B824',
    fontSize: 12,
    fontFamily: Fonts.manropeBold,
  },
  submitBtn: {
    backgroundColor: '#F2B824',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitBtnText: {
    color: '#161B22',
    fontSize: 15,
    fontFamily: Fonts.spaceGroteskBold,
    fontWeight: '800',
  },
  linkBtn: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  linkBtnText: {
    color: '#F2B824',
    fontSize: 13,
    fontFamily: Fonts.manropeBold,
  },
  reassuranceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  reassuranceText: {
    fontSize: 12,
    fontFamily: Fonts.inter,
    color: 'rgba(255, 255, 255, 0.65)',
    textAlign: 'center',
    lineHeight: 17,
  },
});
