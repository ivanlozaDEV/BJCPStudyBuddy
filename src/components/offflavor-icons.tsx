import Svg, { Path, Circle, Rect, G, Line, Ellipse } from 'react-native-svg';

interface OffFlavorIconProps {
  id: string;
  size?: number;
}

export function OffFlavorIcon({ id, size = 36 }: OffFlavorIconProps) {
  // Common viewport is 24x24 for crisp rendering
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none"
  };

  switch (id) {
    case "acetaldehyde": // Green Apple
      return (
        <Svg {...props}>
          {/* Apple shape */}
          <Path
            d="M12 21c-2.5 0-5.5-1.5-7-4.5s-1.5-6.5.5-8.5c1.5-1.5 3.5-2 5.5-1.5 1 .3 1.5.8 1 .8s.5-.5 1-.8c2-.5 4 0 5.5 1.5 2 2 2 5.5.5 8.5s-4.5 4.5-7 4.5z"
            fill="#8ECA64"
          />
          {/* Apple indent shadow */}
          <Path d="M12 7.3c-.5 0-1-.2-1-.5s.5-.5 1-.5 1 .2 1 .5-.5.5-1 .5z" fill="#75A450" />
          {/* Stem */}
          <Path d="M12 6.5c-.3-1.5-.8-3-2-3.5" stroke="#6D4C41" strokeWidth={1.5} strokeLinecap="round" />
          {/* Leaf */}
          <Path d="M12 4.5c2 0 3.5-1 4-2.5-1.5.5-3 1-4.5 1z" fill="#4E9F3D" />
        </Svg>
      );

    case "alcoholic": // Hot cocktail / Beaker
      return (
        <Svg {...props}>
          {/* Glass base */}
          <Path d="M4 3h16l-7 11v5h3v2H8v-2h3v-5L4 3z" fill="#CFD8DC" />
          {/* Liquid (Spicy hot red/orange) */}
          <Path d="M6.2 6h11.6l-3.2 5H9.4L6.2 6z" fill="#FF5722" />
          {/* Heat waves */}
          <Path d="M9 1.5c.3.5 0 1-.3 1.5M12 1c.3.5 0 1-.3 1.5M15 1.5c.3.5 0 1-.3 1.5" stroke="#FF5722" strokeWidth={1.2} strokeLinecap="round" />
        </Svg>
      );

    case "astringent": // Tea Bag
      return (
        <Svg {...props}>
          {/* Tea bag body */}
          <Rect x={6} y={8} width={12} height={13} rx={1.5} fill="#D7CCC8" stroke="#8D6E63" strokeWidth={1.2} />
          {/* Macerated tea color inside bag */}
          <Rect x={8} y={12} width={8} height={7} rx={0.5} fill="#A1887F" />
          {/* Staple & String */}
          <Line x1={12} y1={8} x2={12} y2={3} stroke="#78909C" strokeWidth={1} />
          <Rect x={11} y={7.5} width={2} height={1} fill="#78909C" />
          {/* Label tag */}
          <Rect x={10} y={1.5} width={4} height={3} rx={0.5} fill="#E53935" />
        </Svg>
      );

    case "chlorophenol": // Band-Aid
      return (
        <Svg {...props}>
          <G transform="rotate(45, 12, 12)">
            {/* Band-aid body */}
            <Rect x={4} y={9} width={16} height={6} rx={3} fill="#F0C9A2" stroke="#D7A175" strokeWidth={1} />
            {/* Center pad */}
            <Rect x={9} y={9} width={6} height={6} fill="#FFE0B2" />
            {/* Tiny pad holes */}
            <Circle cx={11} cy={11} r={0.4} fill="#D7A175" />
            <Circle cx={11} cy={13} r={0.4} fill="#D7A175" />
            <Circle cx={13} cy={11} r={0.4} fill="#D7A175" />
            <Circle cx={13} cy={13} r={0.4} fill="#D7A175" />
          </G>
        </Svg>
      );

    case "cidery": // Sparkling Cider bottle
      return (
        <Svg {...props}>
          {/* Bottle body */}
          <Path d="M10 2h4v3c0 1.5 2 2.5 2 4.5v11c0 .8-.7 1.5-1.5 1.5h-5c-.8 0-1.5-.7-1.5-1.5V9.5c0-2 2-3 2-4.5V2z" fill="#81C784" />
          {/* Golden liquid inside */}
          <Path d="M9 11v8.5c0 .3.2.5.5.5h5c.3 0 .5-.2.5-.5V11H9z" fill="#FFB74D" />
          {/* Bottle neck wrap */}
          <Rect x={10} y={2.5} width={4} height={2} fill="#FFD54F" />
          {/* Carbonation bubbles */}
          <Circle cx={10.5} cy={14} r={0.5} fill="#FFF" />
          <Circle cx={13.5} cy={13} r={0.5} fill="#FFF" />
          <Circle cx={12} cy={16} r={0.5} fill="#FFF" />
        </Svg>
      );

    case "diacetyl": // Butter Block
      return (
        <Svg {...props}>
          {/* Small plate */}
          <Ellipse cx={12} cy={18} rx={9} ry={3} fill="#ECEFF1" stroke="#CFD8DC" strokeWidth={1} />
          {/* 3D Butter cube */}
          <Path d="M7 10l6-3 5 2-6 3-5-2z" fill="#FFF59D" />
          <Path d="M7 10v5.5c0 .3.2.5.5.5L12 18v-6L7 10z" fill="#FFE082" />
          <Path d="M12 12v6l5.5-2c.3-.1.5-.4.5-.7V9l-6 3z" fill="#FFD54F" />
          {/* Melting drip */}
          <Path d="M10 15.5c.3 1 .8 1.5.8 2s-.2.5-.5.5-.3-.5-.3-2.5z" fill="#FFE082" />
        </Svg>
      );

    case "dms": // Sweet Corn
      return (
        <Svg {...props}>
          <G transform="rotate(15, 12, 12)">
            {/* Husk leaves */}
            <Path d="M8 20c-1-3-1-9 2-13 1 2 1 7-2 13z" fill="#81C784" />
            <Path d="M16 20c1-3 1-9-2-13-1 2-1 7 2 13z" fill="#81C784" />
            {/* Corn kernels core */}
            <Path d="M10 6.5C10 4.5 12 3 12 3s2 1.5 2 3.5c0 3 .5 7-1 12.5h-2c-1.5-5.5-1-9.5-1-12.5z" fill="#FFD54F" />
            {/* Kernel texture rows */}
            <Circle cx={12} cy={6} r={0.8} fill="#FFB300" />
            <Circle cx={11.5} cy={9} r={0.8} fill="#FFB300" />
            <Circle cx={12.5} cy={9} r={0.8} fill="#FFB300" />
            <Circle cx={11.2} cy={12} r={0.8} fill="#FFB300" />
            <Circle cx={12.8} cy={12} r={0.8} fill="#FFB300" />
            <Circle cx={12} cy={15} r={0.8} fill="#FFB300" />
          </G>
        </Svg>
      );

    case "estery": // Strawberry (Fruity/Afrutado)
      return (
        <Svg {...props}>
          {/* Strawberry body (rounded red triangle/heart) */}
          <Path
            d="M12 20.5c-3 0-7.5-3.5-7.5-9 0-4 3.5-6.5 7.5-6.5s7.5 2.5 7.5 6.5c0 5.5-4.5 9-7.5 9z"
            fill="#E53935"
          />
          {/* Green leaves/crown on top */}
          <Path
            d="M8.5 4.5c.5-1 1.5-1.5 3.5-1.5s3 .5 3.5 1.5c-1.5 0-2.5.5-3.5 1.5-1-1-2-1.5-3.5-1.5z"
            fill="#4CAF50"
          />
          <Path
            d="M12 5V2"
            stroke="#4CAF50"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          {/* Strawberry seeds (yellow dots) */}
          <Circle cx={9} cy={9} r={0.5} fill="#FFF59D" />
          <Circle cx={15} cy={9} r={0.5} fill="#FFF59D" />
          <Circle cx={12} cy={11} r={0.5} fill="#FFF59D" />
          <Circle cx={9} cy={13} r={0.5} fill="#FFF59D" />
          <Circle cx={15} cy={13} r={0.5} fill="#FFF59D" />
          <Circle cx={12} cy={15} r={0.5} fill="#FFF59D" />
          <Circle cx={10} cy={17} r={0.4} fill="#FFF59D" />
          <Circle cx={14} cy={17} r={0.4} fill="#FFF59D" />
        </Svg>
      );

    case "grassy": // Grass Blades
      return (
        <Svg {...props}>
          {/* Leaf 1 */}
          <Path d="M4 21c3-6 5-13 13-17-4 5-5 12-13 17z" fill="#66BB6A" />
          {/* Leaf 2 */}
          <Path d="M10 21c1.5-5 3-10 9-13-3 4-4 9-9 13z" fill="#4CAF50" />
          {/* Leaf 3 */}
          <Path d="M14 21c.5-4 1.5-8 5-10-1.5 3-2 7-5 10z" fill="#388E3C" />
        </Svg>
      );

    case "grainy": // Wheat / Barley stalk
      return (
        <Svg {...props}>
          <G transform="rotate(25, 12, 12)">
            {/* Stem */}
            <Line x1={12} y1={21} x2={12} y2={3} stroke="#C7A75C" strokeWidth={1.5} strokeLinecap="round" />
            {/* Grain ears left */}
            <Path d="M12 6c-2 0-3.5 1-3.5 2s1.5 1 3.5 0z" fill="#E4C275" />
            <Path d="M12 10c-2 0-3.5 1-3.5 2s1.5 1 3.5 0z" fill="#E4C275" />
            <Path d="M12 14c-2 0-3.5 1-3.5 2s1.5 1 3.5 0z" fill="#E4C275" />
            {/* Grain ears right */}
            <Path d="M12 4c2 0 3.5 1 3.5 2s-1.5 1-3.5 0z" fill="#D2AF5E" />
            <Path d="M12 8c2 0 3.5 1 3.5 2s-1.5 1-3.5 0z" fill="#D2AF5E" />
            <Path d="M12 12c2 0 3.5 1 3.5 2s-1.5 1-3.5 0z" fill="#D2AF5E" />
            <Path d="M12 16c2 0 3.5 1 3.5 2s-1.5 1-3.5 0z" fill="#D2AF5E" />
          </G>
        </Svg>
      );

    case "medicinal": // Medicine beaker / cross
      return (
        <Svg {...props}>
          {/* Apothecary bottle */}
          <Path d="M7 6h10v2l-2 2v9c0 1.5-1 2.5-2.5 2.5h-5C6 21.5 5 20.5 5 19V10L7 8V6z" fill="#00ACC1" />
          {/* White cross symbol */}
          <Path d="M11 11h2v2h2v2h-2v2h-2v-2H9v-2h2v-2z" fill="#FFF" />
          {/* Cap */}
          <Rect x={8} y={2.5} width={8} height={3.5} rx={0.8} fill="#006064" />
        </Svg>
      );

    case "metallic": // Hex Nut
      return (
        <Svg {...props}>
          {/* Hex outer nut */}
          <Path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" fill="#90A4AE" stroke="#607D8B" strokeWidth={1} />
          {/* Hole inside */}
          <Circle cx={12} cy={11} r={4.5} fill="#2F5D73" stroke="#607D8B" strokeWidth={1} />
          {/* Gloss highlight */}
          <Path d="M6 7.5L12 4l6 3.5" stroke="#FFF" strokeWidth={1} strokeLinecap="round" opacity={0.4} />
        </Svg>
      );

    case "moldy": // Wild Mushroom
      return (
        <Svg {...props}>
          {/* Mushroom Stem */}
          <Path d="M10 13h4v6.5c0 1-.8 1.5-2 1.5s-2-.5-2-1.5V13z" fill="#CFD8DC" />
          {/* Cap */}
          <Path d="M4 13c0-4.5 3.5-7.5 8-7.5s8 3 8 7.5H4z" fill="#8D6E63" />
          {/* Moldy spots on cap */}
          <Circle cx={8} cy={9} r={1} fill="#FFF" opacity={0.6} />
          <Circle cx={12} cy={7.5} r={0.8} fill="#FFF" opacity={0.6} />
          <Circle cx={15.5} cy={10} r={1.2} fill="#FFF" opacity={0.6} />
        </Svg>
      );

    case "oxidation": // Cardboard box
      return (
        <Svg {...props}>
          {/* Lower box base */}
          <Path d="M4 9.5l8 4 8-4V18c0 .8-.5 1.5-1.2 1.8l-6.8 3.2-6.8-3.2C4.5 19.5 4 18.8 4 18V9.5z" fill="#A1887F" />
          {/* Top flaps open */}
          <Path d="M12 2.5l8 4-8 4-8-4 8-4z" fill="#BCAAA4" />
          <Path d="M4 6.5l8 4V14L4 9.5V6.5z" fill="#8D6E63" opacity={0.3} />
          {/* Center dividing tape line */}
          <Line x1={12} y1={13.5} x2={12} y2={23} stroke="#5D4037" strokeWidth={1} strokeDasharray="3 3" />
        </Svg>
      );

    case "salty": // Salt shaker
      return (
        <Svg {...props}>
          {/* Shaker body */}
          <Path d="M8 8h8l1 11c0 1.2-.8 2-2 2h-6c-1.2 0-2-.8-2-2L8 8z" fill="#ECEFF1" stroke="#B0BEC5" strokeWidth={1} />
          {/* Salt levels */}
          <Path d="M8 12.5h8L15 19c0 .5-.4.8-1 .8h-4c-.6 0-1-.3-1-.8L8 12.5z" fill="#FFF" />
          {/* Metal Cap */}
          <Path d="M9 3.5h6v4.5H9V3.5z" fill="#90A4AE" />
          {/* Holes / Spilling grains */}
          <Circle cx={10} cy={2} r={0.5} fill="#ECEFF1" />
          <Circle cx={12} cy={1} r={0.5} fill="#ECEFF1" />
          <Circle cx={14} cy={2} r={0.5} fill="#ECEFF1" />
        </Svg>
      );

    case "skunky": // Sun UV rays struck green bottle
      return (
        <Svg {...props}>
          {/* Sun rays back layer */}
          <Line x1={12} y1={12} x2={3} y2={3} stroke="#FFB300" strokeWidth={1.5} />
          <Line x1={12} y1={12} x2={21} y2={3} stroke="#FFB300" strokeWidth={1.5} />
          <Line x1={12} y1={12} x2={3} y2={21} stroke="#FFB300" strokeWidth={1.5} />
          <Line x1={12} y1={12} x2={21} y2={21} stroke="#FFB300" strokeWidth={1.5} />
          {/* Beer bottle */}
          <Path d="M10 6h4v3.5c0 1.5 2 2.5 2 4.5V20c0 .8-.7 1.5-1.5 1.5h-5c-.8 0-1.5-.7-1.5-1.5v-6c0-2 2-3 2-4.5V6z" fill="#4CAF50" />
          {/* Glass gleam */}
          <Path d="M15 13.5v5" stroke="#FFF" strokeWidth={1} opacity={0.5} strokeLinecap="round" />
        </Svg>
      );

    case "soapy": // Bar of Soap / Bubbles
      return (
        <Svg {...props}>
          {/* Bar of Soap */}
          <Rect x={4} y={7} width={16} height={10} rx={2} fill="#80DEEA" stroke="#00ACC1" strokeWidth={1.5} />
          {/* Inner contour label */}
          <Rect x={7} y={9.5} width={10} height={5} rx={1} stroke="#00ACC1" strokeWidth={0.8} fill="none" />
          {/* Floating bubbles */}
          <Circle cx={5} cy={4} r={1.5} fill="#E0F7FA" stroke="#00ACC1" strokeWidth={0.8} />
          <Circle cx={19} cy={4.5} r={2} fill="#E0F7FA" stroke="#00ACC1" strokeWidth={0.8} />
          <Circle cx={20} cy={18} r={1.2} fill="#E0F7FA" stroke="#00ACC1" strokeWidth={0.8} />
        </Svg>
      );

    case "solvent": // Paint Bucket dripping
      return (
        <Svg {...props}>
          {/* Paint bucket */}
          <Path d="M6 7.5h12l-1.5 11c0 1-.8 1.8-1.8 1.8h-5.4c-1 0-1.8-.8-1.8-1.8L6 7.5z" fill="#B0BEC5" />
          {/* Spilling chemical (Hot Pink/Purple) */}
          <Path d="M6.5 9h11L16.2 14c-.3.8-1.2 1.2-2 1.2H9.8c-.8 0-1.7-.4-2-1.2L6.5 9z" fill="#E040FB" />
          {/* Dripping line */}
          <Path d="M11 13.5c.3 1.5.8 2.5.8 3.5s-.2 1-.5 1-.3-1-.3-4.5z" fill="#E040FB" />
          {/* Metal Handle */}
          <Path d="M5.5 8c0-3.5 3-4.5 6.5-4.5s6.5 1 6.5 4.5" stroke="#78909C" strokeWidth={1.2} fill="none" strokeLinecap="round" />
        </Svg>
      );

    case "sulfur": // Broken Rotten Egg
      return (
        <Svg {...props}>
          {/* Cracked shell left */}
          <Path d="M7 11.5C7 7.5 9 5.5 11 5c.5.8-1 2.2-1.5 3.5s1 2.5-.5 3.5l-2 1.5v-2z" fill="#ECEFF1" />
          {/* Cracked shell right */}
          <Path d="M17 11.5C17 7.5 15 5.5 13 5c-.5.8 1 2.2 1.5 3.5s-1 2.5.5 3.5l2 1.5v-2z" fill="#CFD8DC" />
          {/* Rotten bright green yolk slipping out */}
          <Circle cx={12} cy={14} r={3.5} fill="#CDDC39" />
          {/* Smelly gas ripples */}
          <Path d="M9 19c.5.5.5 1.5 0 2M12 18.5c.5.5.5 1.5 0 2M15 19c.5.5.5 1.5 0 2" stroke="#CDDC39" strokeWidth={1} strokeLinecap="round" />
        </Svg>
      );

    case "sour": // Lemon slice
      return (
        <Svg {...props}>
          {/* Outer skin rind */}
          <Circle cx={12} cy={12} r={8.5} fill="#FBC02D" />
          {/* Inner membrane white */}
          <Circle cx={12} cy={12} r={7.5} fill="#FFF" />
          {/* Lemon segment wedges */}
          <Path d="M12 12L7.5 7.5A6.5 6.5 0 0 1 12 5.5z" fill="#FFEB3B" />
          <Path d="M12 12L12 5.5A6.5 6.5 0 0 1 16.5 7.5z" fill="#FFEB3B" />
          <Path d="M12 12L16.5 7.5A6.5 6.5 0 0 1 18.5 12z" fill="#FFEB3B" />
          <Path d="M12 12L18.5 12A6.5 6.5 0 0 1 16.5 16.5z" fill="#FFEB3B" />
          <Path d="M12 12L16.5 16.5A6.5 6.5 0 0 1 12 18.5z" fill="#FFEB3B" />
          <Path d="M12 12L12 18.5A6.5 6.5 0 0 1 7.5 16.5z" fill="#FFEB3B" />
          <Path d="M12 12L7.5 16.5A6.5 6.5 0 0 1 5.5 12z" fill="#FFEB3B" />
          <Path d="M12 12L5.5 12A6.5 6.5 0 0 1 7.5 7.5z" fill="#FFEB3B" />
        </Svg>
      );

    case "sweet": // Wrapped Candy
      return (
        <Svg {...props}>
          <G transform="rotate(10, 12, 12)">
            {/* Twisted wrapper left */}
            <Path d="M8 12L4 8v8l4-4z" fill="#EC407A" />
            {/* Twisted wrapper right */}
            <Path d="M16 12l4-4v8l-4-4z" fill="#EC407A" />
            {/* Center candy core */}
            <Circle cx={12} cy={12} r={5} fill="#F8BBD0" stroke="#EC407A" strokeWidth={1} />
            {/* Candy highlights */}
            <Path d="M9.5 9.5c1-1 3.5-.8 4 .5" stroke="#FFF" strokeWidth={1} strokeLinecap="round" opacity={0.6} />
          </G>
        </Svg>
      );

    case "yeasty": // Loaf of Bread
      return (
        <Svg {...props}>
          {/* Loaf crust outer */}
          <Path d="M5 11c0-3 3-5 7-5s7 2 7 5v5.5c0 1.2-.8 2-2 2H7c-1.2 0-2-.8-2-2V11z" fill="#A1887F" stroke="#5D4037" strokeWidth={1.2} />
          {/* Inner fluffy slice representation */}
          <Path d="M6.5 11.5c0-2.5 2.5-4 5.5-4s5.5 1.5 5.5 4v4c0 .8-.5 1.5-1.2 1.5h-8.6c-.7 0-1.2-.7-1.2-1.5v-4z" fill="#D7CCC8" />
          {/* Slices cuts */}
          <Line x1={9.5} y1={9.5} x2={9.5} y2={15.5} stroke="#8D6E63" strokeWidth={1} />
          <Line x1={12} y1={9} x2={12} y2={16} stroke="#8D6E63" strokeWidth={1} />
          <Line x1={14.5} y1={9.5} x2={14.5} y2={15.5} stroke="#8D6E63" strokeWidth={1} />
        </Svg>
      );

    default:
      return null;
  }
}
