/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0A0C10', // Deep Matte Black
    background: '#F4F7FA', // Technical White/Light Gray
    backgroundElement: '#FFFFFF', // Pure White for elements
    backgroundSelected: '#C7D0D9', // Cold Silver for selection
    textSecondary: '#2A313C', // Dark Steel Grey
    tint: '#2F5D73', // Petroleum Blue
    accent: '#161B22', // Gunmetal
    success: '#2D6A4F', // Hop green
    border: '#A7B1BC', // Stainless Steel divider
    gold: '#F2B824',
    amber: '#C45B0E',
    brown: '#60310F',
  },
  dark: {
    text: '#F4F7FA', // Technical White
    background: '#0A0C10', // Deep Matte Black
    backgroundElement: '#161B22', // Gunmetal
    backgroundSelected: '#2A313C', // Dark Steel Grey
    textSecondary: '#A7B1BC', // Stainless Steel
    tint: '#2F5D73', // Petroleum Blue
    accent: '#C7D0D9', // Cold Silver
    success: '#52B788', // Luminous hop green
    border: '#2A313C', // Dark Steel Grey divider
    gold: '#F2B824',
    amber: '#C45B0E',
    brown: '#60310F',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = {
  spaceGrotesk: 'SpaceGrotesk_400Regular',
  spaceGroteskBold: 'SpaceGrotesk_700Bold',
  inter: 'Inter_400Regular',
  interMedium: 'Inter_500Medium',
  interBold: 'Inter_700Bold',
  manrope: 'Manrope_400Regular',
  manropeMedium: 'Manrope_600SemiBold',
  manropeBold: 'Manrope_700Bold',
  sora: 'Sora_400Regular',
  soraBold: 'Sora_700Bold',
  ibmPlex: 'IBMPlexSans_400Regular',
  ibmPlexBold: 'IBMPlexSans_600SemiBold',
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
