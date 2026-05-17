import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withDelay, 
  withSequence,
  Easing
} from 'react-native-reanimated';

interface BubbleProps {
  delay: number;
  duration: number;
  size: number;
  startX: number;
  screenHeight: number;
}

function Bubble({ delay, duration, size, startX, screenHeight }: BubbleProps) {
  const translateY = useSharedValue(screenHeight + 20);
  const translateX = useSharedValue(startX);
  const opacity = useSharedValue(0.25 + Math.random() * 0.35); // Higher opacity range for crisp contrast

  useEffect(() => {
    // Infinite Vertical Rise Animation
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(-30, {
          duration: duration,
          easing: Easing.linear,
        }),
        -1, // Infinitely loop
        false // Do not reverse (restart at bottom)
      )
    );

    // Beer Carbonation Wobble (Horizontal Sway)
    const wobbleRange = 8 + Math.random() * 12;
    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(startX - wobbleRange, { duration: duration / 4, easing: Easing.inOut(Easing.ease) }),
          withTiming(startX + wobbleRange, { duration: duration / 4, easing: Easing.inOut(Easing.ease) }),
          withTiming(startX - wobbleRange, { duration: duration / 4, easing: Easing.inOut(Easing.ease) }),
          withTiming(startX, { duration: duration / 4, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    );
  }, [delay, duration, startX, screenHeight]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.bubble,
        animatedStyle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    />
  );
}

export function BeerBubbles() {
  const { width, height } = useWindowDimensions();

  // Pre-generate static delicate bubble traits to prevent unnecessary re-renders
  const bubbleConfig = useMemo(() => {
    return Array.from({ length: 22 }).map((_, i) => {
      const size = 3 + Math.random() * 7; // Small, delicate carbonation bubbles
      const duration = 8000 + Math.random() * 8000; // Slow, elegant rise (8 to 16s)
      const delay = Math.random() * 8000; // Stagger start delays up to 8s
      const startX = Math.random() * width; // Dynamically spread across screen width
      return { id: i, size, duration, delay, startX };
    });
  }, [width]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {bubbleConfig.map((bubble) => (
        <Bubble
          key={bubble.id}
          delay={bubble.delay}
          duration={bubble.duration}
          size={bubble.size}
          startX={bubble.startX}
          screenHeight={height}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 223, 128, 0.28)', // Crisp glowing beer gold
    borderColor: 'rgba(255, 223, 128, 0.6)', // Bright shimmering gold shell outline
    borderWidth: 0.8, // Slightly thicker border to define bubbles clearly over blue background
  },
});
