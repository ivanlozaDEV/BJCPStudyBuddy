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

interface DetailIconProps extends SvgProps {
  name: 'impression' | 'aroma' | 'appearance' | 'flavor' | 'mouthfeel' | 'history' | 'ingredients' | 'examples' | 'tags' | 'comments' | 'comparison';
}

export function DetailIcon({ name, ...props }: DetailIconProps) {
  const defaultProps = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    ...props
  };

  switch (name) {
    case "impression": // Star Badge
      return (
        <Svg {...defaultProps}>
          <Path 
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
            fill="#FFC107" 
            stroke="#FFA000"
            strokeWidth={1}
            strokeLinejoin="round"
          />
        </Svg>
      );

    case "aroma": // Styled Nose + Fragrance waves
      return (
        <Svg {...defaultProps}>
          {/* Nose Outline */}
          <Path 
            d="M12 3v11.5a2.5 2.5 0 0 0 2.5 2.5h.5c.8 0 1.5-.7 1.5-1.5 0-.8-.7-1.5-1.5-1.5" 
            stroke="#4DB6AC" 
            strokeWidth={1.8} 
            strokeLinecap="round" 
          />
          <Path 
            d="M12 14.5a2.5 2.5 0 0 1-2.5 2.5h-.5C8.2 17 7.5 16.3 7.5 15.5c0-.8.7-1.5 1.5-1.5" 
            stroke="#4DB6AC" 
            strokeWidth={1.8} 
            strokeLinecap="round" 
          />
          {/* Aroma Scent Waves */}
          <Path 
            d="M6 6c.5-1 1.5-1 2 0s1.5 1 2 0M14 6c.5-1 1.5-1 2 0s1.5 1 2 0" 
            stroke="#80CBC4" 
            strokeWidth={1.2} 
            strokeLinecap="round" 
          />
        </Svg>
      );

    case "appearance": // Eye Icon
      return (
        <Svg {...defaultProps}>
          {/* Eye outer lids */}
          <Path 
            d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" 
            stroke="#2196F3" 
            strokeWidth={1.8} 
            strokeLinejoin="round" 
          />
          {/* Iris */}
          <Circle cx={12} cy={12} r={3.8} fill="#90CAF9" stroke="#2196F3" strokeWidth={1.2} />
          {/* Pupil */}
          <Circle cx={12} cy={12} r={1.8} fill="#1565C0" />
          {/* Shine reflection */}
          <Circle cx={13.2} cy={10.8} r={0.6} fill="#FFF" />
        </Svg>
      );

    case "flavor": // Mouth/Tongue
      return (
        <Svg {...defaultProps}>
          {/* Smiling Lips Outline */}
          <Path 
            d="M3 11c3 4 15 4 18 0" 
            stroke="#FF8A80" 
            strokeWidth={1.8} 
            strokeLinecap="round" 
          />
          {/* Tongue sticking out */}
          <Path 
            d="M9.5 12v3c0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5v-3H9.5z" 
            fill="#FF5252" 
            stroke="#FF8A80"
            strokeWidth={1.2}
          />
          {/* Center line of tongue */}
          <Line x1={12} y1={12} x2={12} y2={16.5} stroke="#FF8A80" strokeWidth={1.2} strokeLinecap="round" />
          {/* Taste droplets */}
          <Circle cx={7} cy={7} r={0.8} fill="#FF8A80" />
          <Circle cx={17} cy={7} r={0.8} fill="#FF8A80" />
        </Svg>
      );

    case "mouthfeel": // Palate texture waves + effervescence bubbles
      return (
        <Svg {...defaultProps}>
          {/* Soft texture waves */}
          <Path 
            d="M4 14c2-1.5 4-1.5 6 0s4 1.5 6 0 2-1.5 4 0" 
            stroke="#BA68C8" 
            strokeWidth={1.8} 
            strokeLinecap="round" 
            fill="none"
          />
          <Path 
            d="M4 18c2-1.5 4-1.5 6 0s4 1.5 6 0 2-1.5 4 0" 
            stroke="#CE93D8" 
            strokeWidth={1.2} 
            strokeLinecap="round" 
            fill="none"
            opacity={0.7}
          />
          {/* Tiny sparkling carbonation bubbles */}
          <Circle cx={8} cy={7} r={1.5} fill="#BA68C8" />
          <Circle cx={15} cy={5} r={1} fill="#CE93D8" />
          <Circle cx={11} cy={9} r={0.8} fill="#E1BEE7" />
          <Circle cx={18} cy={9} r={1.2} fill="#BA68C8" />
        </Svg>
      );

    case "history": // Scroll / Parchment
      return (
        <Svg {...defaultProps}>
          {/* Roll cylinder left */}
          <Path 
            d="M4 6V18c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2z" 
            fill="#FFE0B2" 
            stroke="#A1887F" 
            strokeWidth={1.8} 
          />
          {/* Scroll scroll lines of history text */}
          <Line x1={8} y1={8} x2={16} y2={8} stroke="#8D6E63" strokeWidth={1.5} strokeLinecap="round" />
          <Line x1={8} y1={12} x2={16} y2={12} stroke="#8D6E63" strokeWidth={1.5} strokeLinecap="round" />
          <Line x1={8} y1={16} x2={13} y2={16} stroke="#8D6E63" strokeWidth={1.5} strokeLinecap="round" />
        </Svg>
      );

    case "ingredients": // Hops blossom leaf + grain cereal head
      return (
        <Svg {...defaultProps}>
          {/* Hops cone leaf overlay */}
          <Path 
            d="M12 4.5c-3 0-5 3.5-3 6.5l3 4.5 3-4.5c2-3 0-6.5-3-6.5z" 
            fill="#81C784" 
            stroke="#4CAF50" 
            strokeWidth={1.2} 
          />
          <Path d="M9.5 8c1-1.5 2.5-2.5 2.5-2.5s1.5 1 2.5 2.5M10.5 11c1-1 1.5-1.5 1.5-1.5s.5.5 1.5 1.5" stroke="#4CAF50" strokeWidth={1} />
          {/* Hops little stem */}
          <Line x1={12} y1={2} x2={12} y2={4.5} stroke="#4CAF50" strokeWidth={1.5} strokeLinecap="round" />
          {/* Two grass grains leaves on side */}
          <Path d="M4 18c2-2 4 0 4 0s-2 2-4 0M20 18c-2-2-4 0-4 0s2 2 4 0" fill="#A5D6A7" />
        </Svg>
      );

    case "examples": // Clinking Mugs Toast
      return (
        <Svg {...defaultProps}>
          {/* Left mug */}
          <G transform="translate(-1, 0) rotate(10, 10, 12)">
            <Path d="M7 10h4v8H7z" fill="#FFE082" />
            <Path d="M6.5 10c0-1 .8-1.5 1.5-1.5s1.5.5 1.5 0c0 .5.5 1.5 1.5 1.5" fill="#FFF" />
            <Path d="M6 10h6v8c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2v-8z" stroke="#FFB300" strokeWidth={1.2} />
          </G>
          {/* Right mug */}
          <G transform="translate(4, 0) rotate(-10, 14, 12)">
            <Path d="M13 10h4v8h-4z" fill="#FFE082" />
            <Path d="M12.5 10c0-1 .8-1.5 1.5-1.5s1.5.5 1.5 0c0 .5.5 1.5 1.5 1.5" fill="#FFF" />
            <Path d="M12 10h6v8c0 1.1-.9 2-2 2h-2c-1.1 0-2-.9-2-2v-8z" stroke="#FFB300" strokeWidth={1.2} />
          </G>
          {/* Clinking impact sparkles */}
          <Path d="M12 5v2M12 17v2M6 12h2M16 12h2" stroke="#FF8F00" strokeWidth={1.2} strokeLinecap="round" />
        </Svg>
      );

    case "tags": // Label Tag
      return (
        <Svg {...defaultProps}>
          {/* Slanted tag path */}
          <Path 
            d="M4.5 11l6.5 6.5c.6.6 1.4.6 2 0l6.5-6.5c.6-.6.6-1.4 0-2l-5.5-5.5a1.5 1.5 0 0 0-1-.5H6C4.9 3 4 3.9 4 5v4c0 .4.2.8.5 1z" 
            fill="#CFD8DC" 
            stroke="#78909C" 
            strokeWidth={1.8} 
            strokeLinejoin="round"
          />
          {/* Thread punch hole */}
          <Circle cx={8} cy={8} r={1.2} fill="#78909C" />
        </Svg>
      );

    case "comments":
      return (
        <Svg {...defaultProps}>
          {/* Speech bubble outline */}
          <Path 
            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" 
            stroke="#7986CB" 
            strokeWidth={1.8} 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Inner dots representing speech */}
          <Circle cx={9} cy={10} r={1} fill="#5C6BC0" />
          <Circle cx={13} cy={10} r={1} fill="#5C6BC0" />
          <Circle cx={17} cy={10} r={1} fill="#5C6BC0" />
        </Svg>
      );

    case "comparison":
      return (
        <Svg {...defaultProps}>
          {/* Balance Scale outline */}
          <Path 
            d="M12 3v17M19 7l-7-2-7 2M5 7v4c0 2 1.5 3 3 3s3-1 3-3V7M13 7v4c0 2 1.5 3 3 3s3-1 3-3V7M4 21h16" 
            stroke="#FFB74D" 
            strokeWidth={1.8} 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </Svg>
      );
  }
}
