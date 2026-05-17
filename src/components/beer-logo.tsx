import React from 'react';
import Svg, { Path, Circle, LinearGradient, Stop, Defs } from 'react-native-svg';

interface BeerLogoProps {
  size?: number;
}

export function BeerLogo({ size = 40 }: BeerLogoProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
    >
      <Defs>
        <LinearGradient id="beerLiquidGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#F2C75C" />
          <Stop offset="100%" stopColor="#D97D24" />
        </LinearGradient>

        <LinearGradient id="foamDepthGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="100%" stopColor="#E2E8F0" />
        </LinearGradient>
      </Defs>

      {/* 1. BEER LIQUID FILL (Tapered tulip glass belly) */}
      <Path
        d="M 32,32 
           C 31,52 38,70 42,76 
           L 58,76 
           C 62,70 69,52 68,32 
           Z"
        fill="url(#beerLiquidGrad)"
      />

      {/* 2. SPARKLING BEER BUBBLES inside the liquid */}
      <Circle cx="40" cy="48" r="1.5" fill="#FFFFFF" opacity="0.7" />
      <Circle cx="48" cy="62" r="2.2" fill="#FFFFFF" opacity="0.6" />
      <Circle cx="60" cy="54" r="1.8" fill="#FFFFFF" opacity="0.8" />
      <Circle cx="44" cy="38" r="2.0" fill="#FFFFFF" opacity="0.5" />
      <Circle cx="56" cy="44" r="1.3" fill="#FFFFFF" opacity="0.7" />

      {/* 3. GLASS STEM AND BASE OUTLINE (Stainless steel look) */}
      {/* Base */}
      <Path
        d="M 36,88 L 64,88"
        stroke="#F4F7FA"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Stem */}
      <Path
        d="M 50,76 L 50,88"
        stroke="#F4F7FA"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* 4. GLASS BODY MAIN BORDER PROFILE */}
      <Path
        d="M 31,32 
           C 30,53 37,72 42,76 
           L 58,76 
           C 63,72 70,53 69,32"
        stroke="#F4F7FA"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 5. FOAMY WHITE FOAM CAP (Overflowing thick beer head) */}
      {/* Back foam layers for thick volume effect */}
      <Path
        d="M 28,34 
           C 22,34 22,22 30,22 
           C 28,12 40,8 46,12 
           C 50,4 62,6 66,12 
           C 74,8 80,18 76,26 
           C 80,34 72,38 68,36 
           C 60,42 40,42 28,34 Z"
        fill="url(#foamDepthGrad)"
      />
      
      {/* Foam highlight texture curves */}
      <Path
        d="M 34,26 C 38,22 46,24 48,28"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.9"
      />
      <Path
        d="M 54,20 C 58,16 64,18 66,24"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.9"
      />
    </Svg>
  );
}
