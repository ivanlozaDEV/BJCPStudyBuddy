import React from 'react';
import Svg, { 
  Path, 
  Rect, 
  Circle, 
  G, 
  Line, 
  Ellipse,
  SvgProps 
} from 'react-native-svg';

interface MenuIconProps extends SvgProps {
  name: 'explore' | 'comparator' | 'offflavors' | 'flashcards' | 'settings' | 'glossary';
}

export function MenuIcon({ name, ...props }: MenuIconProps) {
  const defaultProps = {
    width: 34,
    height: 34,
    viewBox: "0 0 24 24",
    fill: "none",
    ...props
  };

  switch (name) {
    case "explore": // Beer Mug + Magnifying Glass
      return (
        <Svg {...defaultProps}>
          {/* Glass body (beer) */}
          <Path 
            d="M7 8.5v8c0 1.5 1 2.5 2.5 2.5h3c1.5 0 2.5-1 2.5-2.5v-8H7z" 
            fill="#FFC107" 
          />
          {/* Foam head */}
          <Path 
            d="M6.5 8c0-1.5 1.2-2 2.5-2s1.5.5 2.5 0 1.2-1 2.5-1 2.5 1.5 2.5 3c0 .5-.5.5-1 .5H7.5c-.5 0-1 0-1-.5z" 
            fill="#FFFFFF" 
          />
          {/* Mug handle */}
          <Path 
            d="M15 10h2c.8 0 1.5.7 1.5 1.5v3c0 .8-.7 1.5-1.5 1.5h-2" 
            stroke="#FFC107" 
            strokeWidth={1.8} 
            strokeLinecap="round" 
          />
          {/* Magnifying glass */}
          <G transform="rotate(-15, 12, 12)">
            {/* Lens outer */}
            <Circle cx={14} cy={14} r={4.5} stroke="#FFFFFF" strokeWidth={1.8} fill="#2F5D73" fillOpacity={0.4} />
            {/* Handle */}
            <Line x1={17.2} y1={17.2} x2={21} y2={21} stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
            {/* Lens inner reflection */}
            <Path d="M12 12.5a2 2 0 0 1 2-2" stroke="#FFFFFF" strokeWidth={0.8} strokeLinecap="round" opacity={0.6} />
          </G>
        </Svg>
      );

    case "comparator": // Dark Stout glass + Gold Pilsner glass + Balance beam
      return (
        <Svg {...defaultProps}>
          {/* Balance base beam */}
          <Line x1={4} y1={20} x2={20} y2={20} stroke="#FFD54F" strokeWidth={1.5} strokeLinecap="round" />
          <Line x1={12} y1={20} x2={12} y2={18} stroke="#FFD54F" strokeWidth={1.5} />
          
          {/* Left Glass: Stout/Dark (SRM 30) */}
          <G transform="translate(-1, 0)">
            {/* Glass frame */}
            <Path 
              d="M6 7.5l.8 7c0 .8.7 1.5 1.5 1.5h1.4c.8 0 1.5-.7 1.5-1.5l.8-7H6z" 
              fill="#5D4037" 
              stroke="#D7CCC8" 
              strokeWidth={0.8} 
            />
            {/* Creamy Foam */}
            <Path d="M6 7c0-.8.6-1.2 1.5-1.2s1 .4 1.8 0 1 .4 1.7 0 .5.8.5 1.2H6z" fill="#FFE0B2" />
          </G>

          {/* Right Glass: Pilsner/Gold (SRM 4) */}
          <G transform="translate(7, -1)">
            {/* Tall Pilsner body */}
            <Path 
              d="M10 6.5l.5 8c0 .8.7 1.5 1.5 1.5h1c.8 0 1.5-.7 1.5-1.5l.5-8h-5z" 
              fill="#FFCA28" 
              stroke="#FFF9C4" 
              strokeWidth={0.8} 
            />
            {/* Fluffy white foam */}
            <Path d="M10 6c0-.8.8-1 1.5-1s1 .2 1.5 0 .5.8.5 1h-3.5z" fill="#FFFFFF" />
          </G>
        </Svg>
      );

    case "offflavors": // Beer glass + Odor waves + Warning exclamation
      return (
        <Svg {...defaultProps}>
          {/* Tasting glass */}
          <Path 
            d="M8.5 8l.5 6c0 1.2 1 2 2.2 2h1.6c1.2 0 2.2-.8 2.2-2l.5-6h-7z" 
            fill="#FFB300" 
            stroke="#FFF" 
            strokeWidth={0.8} 
          />
          {/* Glass stem/base */}
          <Line x1={12} y1={16} x2={12} y2={19.5} stroke="#FFF" strokeWidth={1.5} />
          <Line x1={9.5} y1={19.5} x2={14.5} y2={19.5} stroke="#FFF" strokeWidth={1.5} strokeLinecap="round" />
          
          {/* Off-odor wavy vapor lines (rising in warning green/amber) */}
          <Path 
            d="M9 5c.5-.8 0-1.5.5-2.2M12 4.5c.5-.8 0-1.5.5-2.2M15 5c.5-.8 0-1.5.5-2.2" 
            stroke="#81C784" 
            strokeWidth={1} 
            strokeLinecap="round" 
            fill="none" 
          />

          {/* Alert Exclamation Badge */}
          <G transform="translate(14, 11)">
            <Circle cx={4} cy={4} r={3.5} fill="#E53935" />
            <Rect x={3.5} y={1.8} width={1} height={2.5} rx={0.5} fill="#FFF" />
            <Circle cx={4} cy={5.5} r={0.5} fill="#FFF" />
          </G>
        </Svg>
      );

    case "flashcards": // Study cards with beer/hops star
      return (
        <Svg {...defaultProps}>
          {/* Back Card (Tilted) */}
          <G transform="rotate(-10, 10, 12)">
            <Rect 
              x={4} 
              y={5} 
              width={11} 
              height={14} 
              rx={1.5} 
              fill="#37474F" 
              stroke="#B0BEC5" 
              strokeWidth={1.2} 
            />
            {/* Abstract text lines */}
            <Line x1={6.5} y1={8} x2={12.5} y2={8} stroke="#90A4AE" strokeWidth={1} />
            <Line x1={6.5} y1={11} x2={12.5} y2={11} stroke="#90A4AE" strokeWidth={1} />
          </G>

          {/* Front Card */}
          <G transform="translate(5, 2)">
            <Rect 
              x={2} 
              y={3} 
              width={11} 
              height={14} 
              rx={1.5} 
              fill="#FFFFFF" 
              stroke="#FFD54F" 
              strokeWidth={1.5} 
            />
            {/* Beer Mug Icon printed on card */}
            <Path 
              d="M5.5 8.5v4c0 .8.5 1.3 1.3 1.3h1.4c.8 0 1.3-.5 1.3-1.3v-4H5.5z" 
              fill="#FFB74D" 
            />
            <Path d="M5.5 8c0-.6.4-.8 1-.8s.6.2 1 0 .6.2 1 0 .2.4.2.8h-3.2z" fill="#FFF" />
            <Path d="M9.5 9.5h1c.3 0 .5.2.5.5v1.5c0 .3-.2.5-.5.5h-1" stroke="#FFB74D" strokeWidth={0.8} />
          </G>
        </Svg>
      );

    case "settings": // Beer Crown Bottle Cap + Inner gear teeth
      return (
        <Svg {...defaultProps}>
          {/* Crown cap outer teeth (crinkled edges) */}
          <Path 
            d="M12 2.5l1.5 1.2 1.8-.5.8 1.8 1.9.4-.2 1.9 1.4 1.2-.9 1.6.8 1.7-1.4 1.2.4 1.9-1.8.8-.9 1.7-1.9-.4-1.5 1.2-1.5-1.2-1.9.4-.9-1.7-1.8-.8.4-1.9-1.4-1.2.8-1.7-.9-1.6 1.4-1.2-.2-1.9 1.9-.4.8-1.8 1.8.5z" 
            fill="#CFD8DC" 
            stroke="#90A4AE" 
            strokeWidth={1.2} 
          />
          {/* Inner Cap Ring */}
          <Circle cx={12} cy={12} r={6.5} fill="#FFD54F" stroke="#FFB74D" strokeWidth={1} />
          
          {/* Center gear hole (creates the mechanical gear cap) */}
          <Circle cx={12} cy={12} r={2.2} fill="#2F5D73" />
          
          {/* Tiny cap ridges details */}
          <Circle cx={12} cy={7.5} r={0.6} fill="#FFA000" />
          <Circle cx={12} cy={16.5} r={0.6} fill="#FFA000" />
          <Circle cx={7.5} cy={12} r={0.6} fill="#FFA000" />
          <Circle cx={16.5} cy={12} r={0.6} fill="#FFA000" />
        </Svg>
      );

    case "glossary": // Open dictionary book + Beer mug watermark
      return (
        <Svg {...defaultProps}>
          {/* Opened Book Left Page */}
          <Path 
            d="M12 20c-1.5-1.5-5-1.5-8-1.5v-13c3 0 6.5 0 8 1.5M12 20c1.5-1.5 5-1.5 8-1.5v-13c-3 0-6.5 0-8 1.5" 
            fill="#FFF" 
            stroke="#90A4AE" 
            strokeWidth={1.5} 
            strokeLinejoin="round"
          />
          {/* Book Spine Center Line */}
          <Line x1={12} y1={5} x2={12} y2={20} stroke="#90A4AE" strokeWidth={1.5} />
          
          {/* Left Page Text Lines representing glossary index */}
          <Line x1={6} y1={9} x2={10} y2={9} stroke="#B0BEC5" strokeWidth={1.2} strokeLinecap="round" />
          <Line x1={6} y1={12} x2={10} y2={12} stroke="#B0BEC5" strokeWidth={1.2} strokeLinecap="round" />
          <Line x1={6} y1={15} x2={9} y2={15} stroke="#B0BEC5" strokeWidth={1.2} strokeLinecap="round" />
          
          {/* Right Page Beer Mug Graphic watermark */}
          <G transform="translate(14, 8)">
            <Path 
              d="M1 2v4c0 .8.5 1.3 1.3 1.3h1.4c.8 0 1.3-.5 1.3-1.3v-4H1z" 
              fill="#FFD54F" 
            />
            {/* White Foam */}
            <Path d="M0.8 1.8c0-.4.4-.6.8-.6s.6.2.8 0c.2.2.4.2.8.2c.4 0 .6-.2.8-.2s.2.4.2.6H0.8z" fill="#E0F7FA" />
            {/* Handle */}
            <Path d="M5 3.5h1c.3 0 .5.2.5.5v1c0 .3-.2.5-.5.5h-1" stroke="#FFD54F" strokeWidth={0.8} />
          </G>
        </Svg>
      );
  }
}
