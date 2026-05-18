import { BeerStyle, getBJCPStyles } from './bjcp2021';
import { GLOSSARY_DATA, TAG_DEFINITIONS_DATA } from './glossary';
import { OFF_FLAVORS_DATA } from './offflavors';

export type QuizMode = 'styles' | 'glossary' | 'tags' | 'offflavors' | 'mixed';

export interface QuizQuestion {
  id: string;
  type: 'style_name' | 'style_abv' | 'style_ibu' | 'style_example' | 'glossary_term' | 'glossary_def' | 'tag_name' | 'offflavor_sensation' | 'offflavor_name';
  category: QuizMode;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string; // shown after answering
}

// Shuffle helper
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick N random unique items
function pickRandom<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

// Build a multiple-choice option array with the correct answer placed randomly
function buildOptions(correct: string, distractors: string[]): { options: string[]; correctIndex: number } {
  const pool = pickRandom(distractors.filter(d => d !== correct), 3);
  const all = shuffle([correct, ...pool]);
  return { options: all, correctIndex: all.indexOf(correct) };
}

// ─────────────────────────────────────────────
// 1. BEER STYLE QUESTIONS
// ─────────────────────────────────────────────

function generateStyleQuestions(lang: 'es' | 'en', count: number): QuizQuestion[] {
  const styles = getBJCPStyles(lang);
  const questions: QuizQuestion[] = [];

  const pool = shuffle(styles);

  for (const style of pool) {
    if (questions.length >= count) break;

    const roll = Math.random();

    if (roll < 0.35) {
      // Q-TYPE: "¿Cuál es el nombre de este estilo?" (based on overallImpression)
      const otherNames = styles.filter(s => s.id !== style.id).map(s => s.name);
      const { options, correctIndex } = buildOptions(style.name, otherNames);
      questions.push({
        id: `style-name-${style.id}`,
        type: 'style_name',
        category: 'styles',
        question: lang === 'es'
          ? `¿Cuál estilo de cerveza corresponde a esta descripción?\n\n"${style.overallImpression.slice(0, 200)}..."`
          : `Which beer style matches this description?\n\n"${style.overallImpression.slice(0, 200)}..."`,
        options,
        correctIndex,
        explanation: lang === 'es'
          ? `${style.id} ${style.name}: ${style.overallImpression.slice(0, 120)}...`
          : `${style.id} ${style.name}: ${style.overallImpression.slice(0, 120)}...`,
      });

    } else if (roll < 0.60) {
      // Q-TYPE: ABV range
      const abv = style.vitalStatistics.abv;
      const otherAbvs = shuffle(
        styles.filter(s => s.id !== style.id).map(s => s.vitalStatistics.abv)
      ).slice(0, 3);
      const { options, correctIndex } = buildOptions(abv, otherAbvs);
      questions.push({
        id: `style-abv-${style.id}`,
        type: 'style_abv',
        category: 'styles',
        question: lang === 'es'
          ? `¿Cuál es el rango de ABV (alcohol) para el estilo ${style.id} ${style.name}?`
          : `What is the ABV (alcohol) range for style ${style.id} ${style.name}?`,
        options,
        correctIndex,
        explanation: lang === 'es'
          ? `${style.name} tiene un ABV de ${abv}. IBU: ${style.vitalStatistics.ibu}, SRM: ${style.vitalStatistics.srm}.`
          : `${style.name} has an ABV of ${abv}. IBU: ${style.vitalStatistics.ibu}, SRM: ${style.vitalStatistics.srm}.`,
      });

    } else if (roll < 0.75) {
      // Q-TYPE: IBU range
      const ibu = style.vitalStatistics.ibu;
      const otherIbus = shuffle(
        styles.filter(s => s.id !== style.id).map(s => s.vitalStatistics.ibu)
      ).slice(0, 3);
      const { options, correctIndex } = buildOptions(ibu, otherIbus);
      questions.push({
        id: `style-ibu-${style.id}`,
        type: 'style_ibu',
        category: 'styles',
        question: lang === 'es'
          ? `¿Cuál es el rango de amargor (IBU) del ${style.id} ${style.name}?`
          : `What is the bitterness (IBU) range for ${style.id} ${style.name}?`,
        options,
        correctIndex,
        explanation: lang === 'es'
          ? `${style.name} tiene ${ibu} IBU. ABV: ${style.vitalStatistics.abv}, SRM: ${style.vitalStatistics.srm}.`
          : `${style.name} has ${ibu} IBU. ABV: ${style.vitalStatistics.abv}, SRM: ${style.vitalStatistics.srm}.`,
      });

    } else {
      // Q-TYPE: Commercial Example
      if (!style.commercialExamples || style.commercialExamples.length === 0) continue;
      const correctExample = style.commercialExamples[Math.floor(Math.random() * style.commercialExamples.length)];
      const otherExamples = styles
        .filter(s => s.id !== style.id && s.commercialExamples?.length > 0)
        .map(s => s.commercialExamples[0]);
      const { options, correctIndex } = buildOptions(correctExample, otherExamples);
      questions.push({
        id: `style-example-${style.id}`,
        type: 'style_example',
        category: 'styles',
        question: lang === 'es'
          ? `¿Cuál de estas cervezas es un ejemplo comercial del estilo ${style.id} ${style.name}?`
          : `Which of these beers is a commercial example of ${style.id} ${style.name}?`,
        options,
        correctIndex,
        explanation: lang === 'es'
          ? `Ejemplos del ${style.name}: ${style.commercialExamples.slice(0, 3).join(', ')}.`
          : `Examples of ${style.name}: ${style.commercialExamples.slice(0, 3).join(', ')}.`,
      });
    }
  }

  return questions.slice(0, count);
}

// ─────────────────────────────────────────────
// 2. GLOSSARY QUESTIONS
// ─────────────────────────────────────────────

function generateGlossaryQuestions(lang: 'es' | 'en', count: number): QuizQuestion[] {
  const terms = shuffle(GLOSSARY_DATA);
  const questions: QuizQuestion[] = [];

  for (const term of terms) {
    if (questions.length >= count) break;

    const name = lang === 'es' ? term.name_es : term.name_en;
    const def = lang === 'es' ? term.definition_es : term.definition_en;
    const shortDef = def.slice(0, 180);

    const roll = Math.random();

    if (roll < 0.5) {
      // Q: "¿Qué término describe esta definición?"
      const otherNames = GLOSSARY_DATA.filter(t => t.id !== term.id)
        .map(t => lang === 'es' ? t.name_es : t.name_en);
      const { options, correctIndex } = buildOptions(name, otherNames);
      questions.push({
        id: `glossary-term-${term.id}`,
        type: 'glossary_term',
        category: 'glossary',
        question: lang === 'es'
          ? `¿Qué término técnico describe esta definición?\n\n"${shortDef}..."`
          : `Which technical term matches this definition?\n\n"${shortDef}..."`,
        options,
        correctIndex,
        explanation: lang === 'es'
          ? `${name}: ${def.slice(0, 150)}...`
          : `${name}: ${def.slice(0, 150)}...`,
      });
    } else {
      // Q: "¿Cuál es la definición de [TERM]?"
      const otherDefs = GLOSSARY_DATA.filter(t => t.id !== term.id)
        .map(t => (lang === 'es' ? t.definition_es : t.definition_en).slice(0, 90) + '...');
      const shortCorrect = shortDef + '...';
      const { options, correctIndex } = buildOptions(shortCorrect, otherDefs);
      questions.push({
        id: `glossary-def-${term.id}`,
        type: 'glossary_def',
        category: 'glossary',
        question: lang === 'es'
          ? `¿Cuál es la definición correcta de "${name}"?`
          : `What is the correct definition of "${name}"?`,
        options,
        correctIndex,
        explanation: lang === 'es'
          ? `${name}: ${def.slice(0, 150)}...`
          : `${name}: ${def.slice(0, 150)}...`,
      });
    }
  }

  return questions.slice(0, count);
}

// ─────────────────────────────────────────────
// 3. TAG QUESTIONS
// ─────────────────────────────────────────────

function generateTagQuestions(lang: 'es' | 'en', count: number): QuizQuestion[] {
  const tags = shuffle(TAG_DEFINITIONS_DATA);
  const questions: QuizQuestion[] = [];

  for (const tag of tags) {
    if (questions.length >= count) break;

    const name = lang === 'es' ? tag.name_es : tag.name_en;
    const desc = lang === 'es' ? tag.description_es : tag.description_en;
    const tagLabel = lang === 'es' ? (tag.tag_es || tag.tag) : tag.tag;

    const otherNames = TAG_DEFINITIONS_DATA.filter(t => t.tag !== tag.tag)
      .map(t => lang === 'es' ? t.name_es : t.name_en);
    const { options, correctIndex } = buildOptions(name, otherNames);

    questions.push({
      id: `tag-${tag.tag}`,
      type: 'tag_name',
      category: 'tags',
      question: lang === 'es'
        ? `¿Qué etiqueta BJCP corresponde a esta descripción?\n\n"${desc.slice(0, 160)}..."`
        : `Which BJCP tag matches this description?\n\n"${desc.slice(0, 160)}..."`,
      options,
      correctIndex,
      explanation: lang === 'es'
        ? `La etiqueta es "${tagLabel}" (${name}): ${desc.slice(0, 120)}...`
        : `The tag is "${tagLabel}" (${name}): ${desc.slice(0, 120)}...`,
    });
  }

  return questions.slice(0, count);
}

// ─────────────────────────────────────────────
// 4. OFF-FLAVORS QUESTIONS
// ─────────────────────────────────────────────

function generateOffFlavorQuestions(lang: 'es' | 'en', count: number): QuizQuestion[] {
  const flavors = shuffle(OFF_FLAVORS_DATA);
  const questions: QuizQuestion[] = [];

  for (const flavor of flavors) {
    if (questions.length >= count) break;

    const name = lang === 'es' ? flavor.name_es : flavor.name_en;
    const sensation = lang === 'es' ? flavor.sensation_es : flavor.sensation_en;
    const causes = lang === 'es' ? flavor.causes_es : flavor.causes_en;

    const roll = Math.random();

    if (roll < 0.6) {
      // Q: "¿Cuál off-flavor produce esta sensación?"
      const otherNames = OFF_FLAVORS_DATA.filter(f => f.id !== flavor.id)
        .map(f => lang === 'es' ? f.name_es : f.name_en);
      const { options, correctIndex } = buildOptions(name, otherNames);
      questions.push({
        id: `offflavor-sensation-${flavor.id}`,
        type: 'offflavor_sensation',
        category: 'offflavors',
        question: lang === 'es'
          ? `¿Qué off-flavor produce esta sensación?\n\n"${sensation}"`
          : `Which off-flavor produces this sensation?\n\n"${sensation}"`,
        options,
        correctIndex,
        explanation: lang === 'es'
          ? `${name}: ${causes.slice(0, 150)}...`
          : `${name}: ${causes.slice(0, 150)}...`,
      });
    } else {
      // Q: "¿Cuál es la sensación típica de [OFF-FLAVOR]?"
      const otherSensations = OFF_FLAVORS_DATA.filter(f => f.id !== flavor.id)
        .map(f => lang === 'es' ? f.sensation_es : f.sensation_en);
      const { options, correctIndex } = buildOptions(sensation, otherSensations);
      questions.push({
        id: `offflavor-name-${flavor.id}`,
        type: 'offflavor_name',
        category: 'offflavors',
        question: lang === 'es'
          ? `¿Cuál es la sensación típica del off-flavor "${name}"?`
          : `What is the typical sensation of the off-flavor "${name}"?`,
        options,
        correctIndex,
        explanation: lang === 'es'
          ? `${name}: ${causes.slice(0, 150)}...`
          : `${name}: ${causes.slice(0, 150)}...`,
      });
    }
  }

  return questions.slice(0, count);
}

// ─────────────────────────────────────────────
// MAIN GENERATOR
// ─────────────────────────────────────────────

export function generateQuiz(
  mode: QuizMode,
  lang: 'es' | 'en',
  totalCount: number
): QuizQuestion[] {
  if (mode === 'styles') {
    return shuffle(generateStyleQuestions(lang, totalCount));
  }
  if (mode === 'glossary') {
    return shuffle(generateGlossaryQuestions(lang, totalCount));
  }
  if (mode === 'tags') {
    return shuffle(generateTagQuestions(lang, totalCount));
  }
  if (mode === 'offflavors') {
    return shuffle(generateOffFlavorQuestions(lang, totalCount));
  }

  // Mixed: split evenly across all 4 sources
  const perSource = Math.ceil(totalCount / 4);
  return shuffle([
    ...generateStyleQuestions(lang, perSource),
    ...generateGlossaryQuestions(lang, perSource),
    ...generateTagQuestions(lang, perSource),
    ...generateOffFlavorQuestions(lang, perSource),
  ]).slice(0, totalCount);
}
