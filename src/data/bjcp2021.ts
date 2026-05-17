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

// Official BJCP 2021 Categories mapping in Spanish and English
const BJCP_CATEGORIES: Record<string, { es: string; en: string }> = {
  '1': { en: 'Standard American Beer', es: 'Cerveza Americana Estándar' },
  '2': { en: 'European Pale Lager', es: 'Lager Pálida Europea' },
  '3': { en: 'Czech Lager', es: 'Lager Checa' },
  '4': { en: 'Pale Malty European Lager', es: 'Lager Europea Pálida y Maltosa' },
  '5': { en: 'Pale Bitter European Lager', es: 'Lager Europea Pálida y Amarga' },
  '6': { en: 'Amber Malty European Lager', es: 'Lager Europea Ámbar y Maltosa' },
  '7': { en: 'Amber Bitter European Lager', es: 'Lager Europea Ámbar y Amarga' },
  '8': { en: 'Dark European Lager', es: 'Lager Europea Oscura' },
  '9': { en: 'Strong European Lager', es: 'Lager Europea Fuerte' },
  '10': { en: 'German Wheat Beer', es: 'Cerveza de Trigo Alemana' },
  '11': { en: 'British Bitter', es: 'Bitter Británica' },
  '12': { en: 'Pale Commonwealth Beer', es: 'Cerveza Commonwealth Pálida' },
  '13': { en: 'Brown British Beer', es: 'Cerveza Británica Marrón' },
  '14': { en: 'Scottish Ale', es: 'Ale Escocesa' },
  '15': { en: 'Irish Beer', es: 'Cerveza Irlandesa' },
  '16': { en: 'Dark British Beer', es: 'Cerveza Británica Oscura' },
  '17': { en: 'Strong British Ale', es: 'Ale Británica Fuerte' },
  '18': { en: 'Pale American Ale', es: 'Ale Americana Pálida' },
  '19': { en: 'Amber and Brown American Beer', es: 'Cerveza Americana Ámbar y Marrón' },
  '20': { en: 'American Porter and Stout', es: 'Porter y Stout Americana' },
  '21': { en: 'IPA', es: 'IPA' },
  '22': { en: 'Strong American Ale', es: 'Ale Americana Fuerte' },
  '23': { en: 'European Sour Ale', es: 'Ale Ácida Europea' },
  '24': { en: 'Belgian Ale', es: 'Ale Belga' },
  '25': { en: 'Strong Belgian Ale', es: 'Ale Belga Fuerte' },
  '26': { en: 'Monastic Ale', es: 'Ale Monástica' },
  '27': { en: 'Historical Beer', es: 'Cerveza Histórica' },
  '28': { en: 'American Wild Ale', es: 'Ale Salvaje Americana' },
  '29': { en: 'Fruit Beer', es: 'Cerveza con Fruta' },
  '30': { en: 'Spiced Beer', es: 'Cerveza con Especias' },
  '31': { en: 'Alternative Fermentables Beer', es: 'Cerveza con Fermentables Alternativos' },
  '32': { en: 'Smoked Beer', es: 'Cerveza Ahumada' },
  '33': { en: 'Wood-Aged Beer', es: 'Cerveza Envejecida en Madera' },
  '34': { en: 'Specialty Beer', es: 'Cerveza de Especialidad' }
};

export function getCorrectCategory(styleId: string, lang: 'es' | 'en'): string {
  const match = styleId.match(/^(\d+)/);
  if (match) {
    const num = match[1];
    const cat = BJCP_CATEGORIES[num];
    if (cat) {
      return `${num}. ${lang === 'es' ? cat.es : cat.en}`;
    }
  }
  return `${styleId.match(/^(\d+)/)?.[1] || ''}. Style`;
}

// 2. Helper to project a raw bilingual style into a single-language structure
export function localizeStyle(style: BilingualBeerStyle, lang: 'es' | 'en'): BeerStyle {
  return {
    id: style.id,
    name: lang === 'es' ? style.name_es : style.name_en,
    category: getCorrectCategory(style.id, lang),
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
