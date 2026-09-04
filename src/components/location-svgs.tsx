import React from 'react';
import Svg, { Path, Circle, Rect, Line, G } from 'react-native-svg';

interface SvgProps {
  size?: number;
  color?: string;
}

export function LocationPinSvg({ size = 18, color = '#F2B824' }: SvgProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Outer Pin Body */}
      <Path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill="rgba(242, 184, 36, 0.15)"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center Beer Foam / Dot */}
      <Circle cx={12} cy={9} r={2.5} fill={color} />
    </Svg>
  );
}

export function GpsTargetSvg({ size = 18, color = '#52B788' }: SvgProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Outer Target Circle */}
      <Circle cx={12} cy={12} r={7} stroke={color} strokeWidth={1.8} />
      {/* Center Target Dot */}
      <Circle cx={12} cy={12} r={2.5} fill={color} />
      {/* Crosshair lines */}
      <Line x1={12} y1={2} x2={12} y2={5} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1={12} y1={19} x2={12} y2={22} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1={2} y1={12} x2={5} y2={12} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1={19} y1={12} x2={22} y2={12} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function ExternalMapSvg({ size = 16, color = '#3A7D9D' }: SvgProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Map folding lines */}
      <Path
        d="M9 18l-6-3V3l6 3 6-3 6 3v15l-6-3-6 3z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line x1={9} y1={6} x2={9} y2={18} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1={15} y1={3} x2={15} y2={15} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

export function CheckmarkGpsSvg({ size = 14, color = '#52B788' }: SvgProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} fill="rgba(82, 183, 136, 0.18)" stroke={color} strokeWidth={1.5} />
      <Path
        d="M8 12.5l2.5 2.5 5.5-5.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
