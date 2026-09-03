export type BJCPQualityTier = 
  | 'outstanding'   // 45 - 50
  | 'excellent'     // 38 - 44
  | 'very_good'     // 30 - 37
  | 'good'          // 21 - 29
  | 'fair'          // 14 - 20
  | 'problematic';  // 0 - 13

export interface TastingScoresheet {
  appearanceScore: number;  // 0 - 3
  appearanceNotes: string;
  aromaScore: number;       // 0 - 12
  aromaNotes: string;
  flavorScore: number;      // 0 - 20
  flavorNotes: string;
  mouthfeelScore: number;   // 0 - 5
  mouthfeelNotes: string;
  aftertasteNotes?: string; // Retrogusto y Final
  overallScore: number;     // 0 - 10
  overallNotes: string;
}

export interface StructuredAttributes {
  // Appearance
  appearanceColor?: number;        // 0: Muy Clara, 0.5: Apropiada, 1: Muy Oscura
  appearanceClarity?: number;      // 0: Muy Cristalina, 0.5: Apropiada, 1: Muy Turbia
  appearanceHead?: number;         // 0: Espuma baja, 0.5: Apropiada, 1: Espuma alta

  // Aroma
  aromaAppropriate?: number;       // 0.0: Apropiada (100%), 1.0: No apropiada

  // Flavor / Gusto
  flavorSweetness?: number;        // 0: Muy baja, 0.5: Apropiada, 1: Muy alta
  flavorBitterness?: number;       // 0: Muy baja, 0.5: Apropiada, 1: Muy alta
  flavorAcidity?: number;          // 0: Muy baja, 0.5: Apropiada, 1: Muy alta

  // Mouthfeel / Sensación en Boca
  mouthfeelAlcohol?: number;       // 0: Muy baja, 0.5: Apropiada, 1: Muy alta
  mouthfeelCarbonation?: number;   // 0: Muy baja, 0.5: Apropiada, 1: Muy alta
  mouthfeelBody?: number;          // 0: Muy baja, 0.5: Apropiada, 1: Muy alta

  // Aftertaste & Finish / Retrogusto y Final
  aftertasteDuration?: number;     // 0: Muy corto, 0.5: Apropiado / Equilibrado, 1: Muy persistente / Largo
  aftertasteCharacter?: number;    // 0: Muy seco / Cortante, 0.5: Limpio / Agradable, 1: Astringente / Áspero

  // General
  generalTechnicalQuality?: number;    // 0: Excelente, 1: Muy Bueno, 2: Bueno, 3: Aceptable, 4: Necesita mejoras
  generalStyleRepresentation?: number; // 0: Muy representativa, 1: Algo Representativa, 2: No representativa
  generalRelativeStrength?: string;    // 'top3' | 'cut' | 'middle' | 'tail'
}

export interface TastingNote {
  id: string;
  userId?: string;
  styleId: string;
  styleName: string;
  beerName: string;
  brewery: string;
  vintageOrBatch?: string;
  photoUrl?: string;        // Beer in glass photo
  labelPhotoUrl?: string;   // Beer label / bottle photo
  scoresheet: TastingScoresheet;
  structuredAttributes?: StructuredAttributes;
  totalScore: number;       // Sum of all 5 sections (0 - 50)
  descriptors: string[];    // Flaws / Off-flavors checked
  feedbackNotes?: string;   // Suggestions for the brewer
  judgeName?: string;       // Evaluator judge name
  judgeRank?: string;       // Evaluator judge rank
  judgeId?: string;         // Evaluator judge BJCP ID
  judgeAvatarUrl?: string;  // Evaluator judge avatar photo
  createdAt: string;
  updatedAt: string;
  synced?: boolean;
}

export interface UserProfile {
  id: string;
  email?: string;
  fullName: string;
  avatarUrl?: string;
  bjcpRank: 'Apprentice' | 'Recognized' | 'Certified' | 'National' | 'Master' | 'Grand Master';
  bjcpId?: string;
  experienceLevel?: string;
  createdAt?: string;
}

export function calculateTotalScore(scoresheet: TastingScoresheet): number {
  return (
    (scoresheet.aromaScore || 0) +
    (scoresheet.appearanceScore || 0) +
    (scoresheet.flavorScore || 0) +
    (scoresheet.mouthfeelScore || 0) +
    (scoresheet.overallScore || 0)
  );
}

export function getQualityTier(score: number): {
  tier: BJCPQualityTier;
  label_es: string;
  label_en: string;
  color: string;
  range: string;
} {
  if (score >= 45) {
    return {
      tier: 'outstanding',
      label_es: 'Sobresaliente',
      label_en: 'Outstanding',
      color: '#F2B824', // Gold
      range: '45 - 50',
    };
  }
  if (score >= 38) {
    return {
      tier: 'excellent',
      label_es: 'Excelente',
      label_en: 'Excellent',
      color: '#52B788', // Hop Green
      range: '38 - 44',
    };
  }
  if (score >= 30) {
    return {
      tier: 'very_good',
      label_es: 'Muy Bueno',
      label_en: 'Very Good',
      color: '#3A7D9D', // Petroleum Blue Accent
      range: '30 - 37',
    };
  }
  if (score >= 21) {
    return {
      tier: 'good',
      label_es: 'Bueno',
      label_en: 'Good',
      color: '#C45B0E', // Amber
      range: '21 - 29',
    };
  }
  if (score >= 14) {
    return {
      tier: 'fair',
      label_es: 'Aceptable',
      label_en: 'Fair',
      color: '#8D400A', // Copper / Brown
      range: '14 - 20',
    };
  }
  return {
    tier: 'problematic',
    label_es: 'Problemático',
    label_en: 'Problematic',
    color: '#D90429', // Crimson Red
    range: '0 - 13',
  };
}

export const OFFICIAL_BJCP_DESCRIPTORS = [
  { id: 'acetaldehyde', name_es: 'Acetaldehído (Manzana verde)', name_en: 'Acetaldehyde (Green apple)' },
  { id: 'alcoholic', name_es: 'Alcohólico (Caliente/Solvente)', name_en: 'Alcoholic (Hot/Warm)' },
  { id: 'astringent', name_es: 'Astringente (Secante/Taninos)', name_en: 'Astringent (Drying/Tannic)' },
  { id: 'diacetyl', name_es: 'Diacetilo (Mantequilla/Palomitas)', name_en: 'Diacetyl (Butter/Toffee)' },
  { id: 'dms', name_es: 'DMS (Maíz cocido/Verduras)', name_en: 'DMS (Cooked corn/Vegetable)' },
  { id: 'estery', name_es: 'Ésteres Excesivos (Plátano/Fruta)', name_en: 'Estery (Excessive fruit/Banana)' },
  { id: 'grassy', name_es: 'Herbáceo (Pasto recién cortado)', name_en: 'Grassy (Fresh cut grass)' },
  { id: 'lightstruck', name_es: 'Golpe de luz (Zorrillo/Mofeta)', name_en: 'Light-Struck (Skunky)' },
  { id: 'metallic', name_es: 'Metálico (Hierro/Moneda)', name_en: 'Metallic (Iron/Coin)' },
  { id: 'musty', name_es: 'Moho / Humedad', name_en: 'Musty (Moldy/Cellar)' },
  { id: 'oxidized', name_es: 'Oxidado (Cartón/Papel/Jerez)', name_en: 'Oxidized (Cardboard/Sherry)' },
  { id: 'phenolic', name_es: 'Fenólico (Clavo/Plástico/Humo)', name_en: 'Phenolic (Clove/Plastic/Smoke)' },
  { id: 'solvent', name_es: 'Solvente (Quitaesmalte/Acetona)', name_en: 'Solvent (Nail polish/Harsh)' },
  { id: 'sour', name_es: 'Ácido / Agrio (Láctico/Acético)', name_en: 'Sour / Acidic (Lactic/Vinegar)' },
  { id: 'vegetal', name_es: 'Vegetal (Apio/Col cocida)', name_en: 'Vegetal (Cooked cabbage/Celery)' },
  { id: 'yeasty', name_es: 'Levadura Excesiva / Bready', name_en: 'Yeasty (Bread dough/Nutty)' },
];
