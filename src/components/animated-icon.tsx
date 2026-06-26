import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { BeerLogo } from '@/components/beer-logo';
import { Fonts } from '@/constants/theme';

const BRAND_BG = '#2F5D73';
const DISPLAY_DURATION = 1800; // ms before fading out

// ─── Animated dot for the loader ─────────────────────────────────────────────
function LoaderDot({ delay }: { delay: number }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-8, { duration: 350, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 350, easing: Easing.in(Easing.quad) }),
          withTiming(0, { duration: 200 }), // pause before next bounce
        ),
        -1,
        false
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[styles.dot, style]} />;
}

// ─── Main splash overlay ──────────────────────────────────────────────────────
export function AnimatedSplashOverlay({ onDone }: { onDone?: () => void } = {}) {
  const overlayOpacity = useSharedValue(1);
  const logoScale    = useSharedValue(0.6);
  const logoOpacity  = useSharedValue(0);
  const textOpacity  = useSharedValue(0);
  const textTranslY  = useSharedValue(14);
  const dotsOpacity  = useSharedValue(0);

  useEffect(() => {
    // 1. Logo pops in
    logoScale.value   = withTiming(1, { duration: 550, easing: Easing.out(Easing.back(1.6)) });
    logoOpacity.value = withTiming(1, { duration: 400 });

    // 2. Title fades up
    textOpacity.value  = withDelay(300, withTiming(1, { duration: 450 }));
    textTranslY.value  = withDelay(300, withTiming(0,  { duration: 450, easing: Easing.out(Easing.quad) }));

    // 3. Dots fade in
    dotsOpacity.value = withDelay(600, withTiming(1, { duration: 300 }));

    // 4. After DISPLAY_DURATION, fade the whole overlay out
    overlayOpacity.value = withDelay(
      DISPLAY_DURATION,
      withTiming(0, { duration: 500, easing: Easing.in(Easing.quad) }, (finished) => {
        if (finished && onDone) runOnJS(onDone)();
      })
    );
  }, []);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOpacity.value }));
  const logoStyle    = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));
  const textStyle    = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslY.value }],
  }));
  const dotsStyle    = useAnimatedStyle(() => ({ opacity: dotsOpacity.value }));

  return (
    <Animated.View style={[styles.overlay, overlayStyle]} pointerEvents="none">
      {/* Hero */}
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <BeerLogo size={120} />
      </Animated.View>

      {/* Title */}
      <Animated.View style={[styles.titleWrap, textStyle]}>
        <Text style={styles.titleBrew}>BREW</Text>
        <Text style={styles.titleStudy}>Study</Text>
      </Animated.View>

      {/* Subtitle */}
      <Animated.View style={[styles.subtitleWrap, textStyle]}>
        <Text style={styles.subtitle}>BJCP STUDY COMPANION</Text>
      </Animated.View>

      {/* Bouncing dots loader */}
      <Animated.View style={[styles.dotsRow, dotsStyle]}>
        <LoaderDot delay={0} />
        <LoaderDot delay={150} />
        <LoaderDot delay={300} />
      </Animated.View>
    </Animated.View>
  );
}

// ─── Legacy export (unused, kept for compatibility) ───────────────────────────
export function AnimatedIcon() {
  return <View />;
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BRAND_BG,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },
  logoWrap: {
    marginBottom: 24,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  titleBrew: {
    fontSize: 56,
    lineHeight: 60,
    fontFamily: Fonts.spaceGroteskBold,
    color: '#FFFFFF',
    letterSpacing: -1.5,
  },
  titleStudy: {
    fontSize: 52,
    lineHeight: 56,
    fontFamily: Fonts.spaceGrotesk,
    color: '#FFFFFF',
    letterSpacing: -1.0,
  },
  subtitleWrap: {
    marginTop: 8,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: Fonts.manropeMedium,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
});
