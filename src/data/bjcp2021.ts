import rawBilingualData from './bjcp2021_bilingual.json';

export interface VitalStats {
  og: string;  // Original Gravity range (e.g. "1.040 - 1.050")
  fg: string;  // Final Gravity range (e.g. "1.008 - 1.012")
  abv: string; // Alcohol by Volume range (e.g. "4.2% - 5.3%")
  ibu: string; // Bitterness range (e.g. "8 - 12")
  srm: string; // Color range (e.g. "2 - 4")
}

// Localized single-language beer style representation returned to UI components
export interface BeerStyle {
  id: string; // e.g. "21A"
  name: string; // e.g. "American IPA"
  category: string; // e.g. "21. IPA"
  overallImpression: string;
  aroma: string;
  appearance: string;
  flavor: string;
  mouthfeel: string;
  comments: string;
  history: string;
  comparison: string;
  ingredients: string;
  vitalStatistics: VitalStats;
  abvMin: number;
  abvMax: number;
  ibuMin: number;
  ibuMax: number;
  srmMin: number;
  srmMax: number;
  commercialExamples: string[];
  tags: string[];
}

// Raw dual-language database structure matching our parsed JSON
export interface BilingualBeerStyle {
  id: string;
  name_es: string;
  name_en: string;
  category_es: string;
  category_en: string;
  overallImpression_es: string;
  overallImpression_en: string;
  aroma_es: string;
  aroma_en: string;
  appearance_es: string;
  appearance_en: string;
  flavor_es: string;
  flavor_en: string;
  mouthfeel_es: string;
  mouthfeel_en: string;
  comments_es: string;
  comments_en: string;
  history_es: string;
  history_en: string;
  comparison_es: string;
  comparison_en: string;
  ingredients_es: string;
  ingredients_en: string;
  vitalStatistics: VitalStats;
  abvMin: number;
  abvMax: number;
  ibuMin: number;
  ibuMax: number;
  srmMin: number;
  srmMax: number;
  commercialExamples: string[];
  tags_es: string[];
  tags_en: string[];
}

// 1. Raw array of 108 fully processed bilingual styles
export const BILINGUAL_BJCP_DATA = rawBilingualData as BilingualBeerStyle[];

// 2. Helper to project a raw bilingual style into a single-language structure
export function localizeStyle(style: BilingualBeerStyle, lang: 'es' | 'en'): BeerStyle {
  return {
    id: style.id,
    name: lang === 'es' ? style.name_es : style.name_en,
    category: lang === 'es' ? style.category_es : style.category_en,
    overallImpression: lang === 'es' ? style.overallImpression_es : style.overallImpression_en,
    aroma: lang === 'es' ? style.aroma_es : style.aroma_en,
    appearance: lang === 'es' ? style.appearance_es : style.appearance_en,
    flavor: lang === 'es' ? style.flavor_es : style.flavor_en,
    mouthfeel: lang === 'es' ? style.mouthfeel_es : style.mouthfeel_en,
    comments: lang === 'es' ? style.comments_es : style.comments_en,
    history: lang === 'es' ? style.history_es : style.history_en,
    comparison: lang === 'es' ? style.comparison_es : style.comparison_en,
    ingredients: lang === 'es' ? style.ingredients_es : style.ingredients_en,
    vitalStatistics: style.vitalStatistics,
    abvMin: style.abvMin,
    abvMax: style.abvMax,
    ibuMin: style.ibuMin,
    ibuMax: style.ibuMax,
    srmMin: style.srmMin,
    srmMax: style.srmMax,
    commercialExamples: style.commercialExamples,
    tags: lang === 'es' ? style.tags_es : style.tags_en,
  };
}

// 3. Dynamic lists mapped on demand
export function getBJCPStyles(lang: 'es' | 'en'): BeerStyle[] {
  return BILINGUAL_BJCP_DATA.map(style => localizeStyle(style, lang));
}

// 4. Backward-compatible static default array mapping (defaults to Spanish)
export const BJCP_2021_DATA: BeerStyle[] = BILINGUAL_BJCP_DATA.map(style => localizeStyle(style, 'es'));

// Helper Functions for BJCP Study Buddy App

export function getBeerStyleById(id: string, lang: 'es' | 'en' = 'es'): BeerStyle | undefined {
  const found = BILINGUAL_BJCP_DATA.find(style => style.id.toLowerCase() === id.toLowerCase());
  return found ? localizeStyle(found, lang) : undefined;
}

export function searchBeerStyles(query: string, lang: 'es' | 'en' = 'es'): BeerStyle[] {
  const styles = getBJCPStyles(lang);
  if (!query) return styles;
  const lowerQuery = query.toLowerCase();
  return styles.filter(style => 
    style.id.toLowerCase().includes(lowerQuery) ||
    style.name.toLowerCase().includes(lowerQuery) ||
    style.category.toLowerCase().includes(lowerQuery) ||
    style.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    style.overallImpression.toLowerCase().includes(lowerQuery)
  );
}

export function filterBeerStyles(filters: {
  category?: string;
  minAbv?: number;
  maxAbv?: number;
  minIbu?: number;
  maxIbu?: number;
}, lang: 'es' | 'en' = 'es'): BeerStyle[] {
  const styles = getBJCPStyles(lang);
  return styles.filter(style => {
    if (filters.category && !style.category.toLowerCase().includes(filters.category.toLowerCase())) {
      return false;
    }
    if (filters.minAbv !== undefined && style.abvMax < filters.minAbv) {
      return false;
    }
    if (filters.maxAbv !== undefined && style.abvMin > filters.maxAbv) {
      return false;
    }
    if (filters.minIbu !== undefined && style.ibuMax < filters.minIbu) {
      return false;
    }
    if (filters.maxIbu !== undefined && style.ibuMin > filters.maxIbu) {
      return false;
    }
    return true;
  });
}

export function getAllCategories(lang: 'es' | 'en' = 'es'): string[] {
  const styles = getBJCPStyles(lang);
  const categories = styles.map(style => style.category);
  return Array.from(new Set(categories));
}
