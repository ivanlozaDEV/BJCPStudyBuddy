import { BeerStyle, getBJCPStyles } from './bjcp2021';
import { CURATED_BJCP_QUESTIONS, CuratedQuestion } from './curated-questions';
import { GLOSSARY_DATA, TAG_DEFINITIONS_DATA } from './glossary';
import { OFF_FLAVORS_DATA, OffFlavor } from './offflavors';

export type QuizMode = 'styles' | 'offflavors' | 'procedures' | 'processes' | 'glossary' | 'tags' | 'mixed' | 'exam_simulator';

export type QuestionType =
  | 'style_name'
  | 'style_aroma'
  | 'style_flavor'
  | 'style_history'
  | 'style_abv'
  | 'style_ibu'
  | 'style_srm'
  | 'style_comparison'
  | 'style_ingredients'
  | 'bjcp_scoring'
  | 'bjcp_ethics'
  | 'bjcp_procedure'
  | 'bjcp_rank'
  | 'brewing_process'
  | 'water_chemistry'
  | 'fermentation_science'
  | 'hop_science'
  | 'malt_science'
  | 'glossary_term'
  | 'tag_name'
  | 'offflavor_sensation'
  | 'offflavor_cause'
  | 'offflavor_prevention';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  category: 'styles' | 'offflavors' | 'procedures' | 'processes' | 'glossary' | 'tags' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  judgeTip?: string;
  relatedStyleId?: string;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

function buildOptions(correct: string, distractors: string[]): { options: string[]; correctIndex: number } {
  const uniqueDistractors = Array.from(new Set(distractors.filter(d => d && d.trim() !== '' && d !== correct)));
  const pool = pickRandom(uniqueDistractors, 3);
  
  while (pool.length < 3) {
    const filler = `Alternativa ${pool.length + 1}`;
    if (!pool.includes(filler) && filler !== correct) pool.push(filler);
    else pool.push(`Opción ${pool.length + 1}`);
  }

  const all = shuffle([correct, ...pool]);
  return { options: all, correctIndex: all.indexOf(correct) };
}

function getSmartStyleDistractors(targetStyle: BeerStyle, allStyles: BeerStyle[]): string[] {
  const sameCategory = allStyles
    .filter(s => s.id !== targetStyle.id && s.category === targetStyle.category)
    .map(s => s.name);

  const sharedTags = allStyles
    .filter(s => s.id !== targetStyle.id && s.tags.some(t => targetStyle.tags.includes(t)))
    .map(s => s.name);

  const allOther = allStyles.filter(s => s.id !== targetStyle.id).map(s => s.name);
  return Array.from(new Set([...sameCategory, ...sharedTags, ...allOther]));
}

// ─────────────────────────────────────────────
// 1. EXTENSIVE OFFICIAL BJCP PROCEDURES & ETHICS
// ─────────────────────────────────────────────

interface QuestionTemplate {
  type: QuestionType;
  difficulty: 'easy' | 'medium' | 'hard';
  q_es: string;
  q_en: string;
  correct_es: string;
  correct_en: string;
  distractors_es: string[];
  distractors_en: string[];
  exp_es: string;
  exp_en: string;
  tip_es: string;
  tip_en: string;
}

const BJCP_PROCEDURES_DATA: QuestionTemplate[] = [
  {
    type: 'bjcp_scoring',
    difficulty: 'easy',
    q_es: 'En la hoja de cata BJCP (Scoresheet de 50 puntos), ¿cuántos puntos máximos se asignan a la sección de SABOR (Flavor)?',
    q_en: 'On the 50-point BJCP Beer Scoresheet, how many maximum points are allocated to the FLAVOR section?',
    correct_es: '20 puntos',
    correct_en: '20 points',
    distractors_es: ['12 puntos', '10 puntos', '15 puntos'],
    distractors_en: ['12 points', '10 points', '15 points'],
    exp_es: 'El desglose de la hoja BJCP es: Aroma (12), Aspecto (3), Sabor (20), Sensación en Boca (5) e Impresión General (10) = Total 50 pts.',
    exp_en: 'The BJCP scoresheet breakdown is: Aroma (12), Appearance (3), Flavor (20), Mouthfeel (5), and Overall Impression (10) = Total 50 pts.',
    tip_es: 'Tip de Examen BJCP: El Sabor (20 pts) es la sección más determinante de la hoja, seguido del Aroma (12 pts).',
    tip_en: 'BJCP Exam Tip: Flavor (20 pts) is the most heavily weighted section, followed by Aroma (12 pts).'
  },
  {
    type: 'bjcp_scoring',
    difficulty: 'easy',
    q_es: '¿Cuántos puntos máximos asigna la hoja de cata BJCP a la sección de ASPECTO (Appearance)?',
    q_en: 'How many maximum points does the BJCP Beer Scoresheet allocate to the APPEARANCE section?',
    correct_es: '3 puntos',
    correct_en: '3 points',
    distractors_es: ['5 puntos', '2 puntos', '6 puntos'],
    distractors_en: ['5 points', '2 points', '6 points'],
    exp_es: 'El Aspecto otorga 3 puntos: Color, Claridad y Retención/Textura de la espuma (Head).',
    exp_en: 'Appearance accounts for 3 points: Color, Clarity, and Head retention/texture.',
    tip_es: 'Tip de Examen BJCP: Aunque solo vale 3 puntos, describe siempre color, claridad y espuma detalladamente.',
    tip_en: 'BJCP Exam Tip: Though only 3 points, always describe color, clarity, and head in full detail.'
  },
  {
    type: 'bjcp_scoring',
    difficulty: 'easy',
    q_es: '¿Cuántos puntos máximos asigna la hoja de cata BJCP a la sección de SENSACIÓN EN BOCA (Mouthfeel)?',
    q_en: 'How many maximum points does the BJCP Beer Scoresheet allocate to the MOUTHFEEL section?',
    correct_es: '5 puntos',
    correct_en: '5 points',
    distractors_es: ['10 puntos', '3 puntos', '8 puntos'],
    distractors_en: ['10 points', '3 points', '8 points'],
    exp_es: 'Sensación en Boca vale 5 puntos: evalúa Cuerpo, Carbonatación, Calidez de alcohol, Astringencia y Cremosis/textura.',
    exp_en: 'Mouthfeel is 5 points: evaluates Body, Carbonation, Warmth, Astringency, and Creaminess/texture.',
    tip_es: 'Tip de Examen BJCP: No confundas cuerpo con carbonatación o viscosidad.',
    tip_en: 'BJCP Exam Tip: Do not confuse body with carbonation or viscosity.'
  },
  {
    type: 'bjcp_scoring',
    difficulty: 'medium',
    q_es: 'Según la escala de cata BJCP, ¿qué rango de puntaje define a una cerveza "Muy Buena" (Very Good)?',
    q_en: 'According to the BJCP score scale, what score range defines a "Very Good" beer?',
    correct_es: '30 a 37 puntos',
    correct_en: '30 to 37 points',
    distractors_es: ['21 a 29 puntos', '38 a 44 puntos', '14 a 20 puntos'],
    distractors_en: ['21 to 29 points', '38 to 44 points', '14 to 20 points'],
    exp_es: 'Escala BJCP: Outstanding (45-50), Excellent (38-44), Very Good (30-37), Good (21-29), Fair (14-20) y Problematic (0-13).',
    exp_en: 'BJCP scale: Outstanding (45-50), Excellent (38-44), Very Good (30-37), Good (21-29), Fair (14-20), and Problematic (0-13).',
    tip_es: 'Tip de Examen BJCP: Cervezas en el rango 30-37 representan bien el estilo pero tienen fallas menores de balance o técnica.',
    tip_en: 'BJCP Exam Tip: Beers in 30-37 range generally fit the style well but have minor technical or balance flaws.'
  },
  {
    type: 'bjcp_scoring',
    difficulty: 'medium',
    q_es: '¿Qué rango de puntaje corresponde a una muestra calificada como "Buena" (Good) que no pasa a finales?',
    q_en: 'Which score range corresponds to a sample rated as "Good" that misses medal rounds?',
    correct_es: '21 a 29 puntos',
    correct_en: '21 to 29 points',
    distractors_es: ['14 a 20 puntos', '30 a 37 puntos', '0 a 13 puntos'],
    distractors_en: ['14 to 20 points', '30 to 37 points', '0 to 13 points'],
    exp_es: 'El rango "Good" (21-29) indica que la cerveza pierde características clave del estilo o presenta defectos sensoriales menores notorios.',
    exp_en: 'The "Good" tier (21-29) indicates the beer misses key style hallmarks or displays noticeable minor flaws.',
    tip_es: 'Tip de Examen BJCP: Una puntuación menor a 30 rara vez avanza a rondas de medalla en mesas competitivas.',
    tip_en: 'BJCP Exam Tip: Scores below 30 rarely advance to medal rounds in competitive tables.'
  },
  {
    type: 'bjcp_procedure',
    difficulty: 'medium',
    q_es: '¿Cuál es la discrepancia máxima recomendada de puntaje entre dos jueces en una mesa antes de requerir calibración?',
    q_en: 'What is the maximum recommended score difference between two table judges before requiring discussion and calibration?',
    correct_es: '5 a 7 puntos de diferencia',
    correct_en: '5 to 7 points difference',
    distractors_es: ['10 a 12 puntos de diferencia', '1 a 2 puntos de diferencia', '15 puntos de diferencia'],
    distractors_en: ['10 to 12 points difference', '1 to 2 points difference', '15 points difference'],
    exp_es: 'Si los jueces difieren por más de 5-7 puntos, deben hablar sobre sus descriptores y consensuar un puntaje representativo.',
    exp_en: 'If judges differ by more than 5-7 points, they must discuss descriptors and calibrate to a representative score.',
    tip_es: 'Tip de Examen BJCP: Los jueces no deben promediar a ciegas sin justificar sus cambios en la hoja.',
    tip_en: 'BJCP Exam Tip: Judges should not blindly average scores without justifying descriptor adjustments.'
  },
  {
    type: 'bjcp_procedure',
    difficulty: 'medium',
    q_es: '¿En qué orden debe evaluar el panel un vuelo (flight) de cervezas en competencia?',
    q_en: 'In what order should a judging panel evaluate a flight of beers in competition?',
    correct_es: 'De menor a mayor intensidad de alcohol, amargor, lúpulo, tostado y acidez',
    correct_en: 'From lower to higher alcohol, bitterness, hop intensity, roast, and acidity',
    distractors_es: [
      'De mayor a menor graduación alcohólica para calibrar el paladar con intensidad',
      'En orden estrictamente numérico según la secuencia de llegada de las botellas',
      'Las cervezas oscuras y ácidas al inicio y las lagers rubias delicadas al final'
    ],
    distractors_en: [
      'From higher to lower alcohol strength to calibrate palate intensity early',
      'In strictly sequential registration number order regardless of beer style',
      'Dark and sour beers first leaving delicate pale lagers for table conclusion'
    ],
    exp_es: 'El orden de vuelo busca minimizar la saturación y fatiga del paladar: las cervezas ligeras y sutiles se juzgan antes que las de alto alcohol, torrefactas o ácidas.',
    exp_en: 'Flight order minimizes palate fatigue: delicate beers are judged before high ABV, heavily roasted, or sour beers.',
    tip_es: 'Tip de Examen BJCP: Los Stewards y el Head Judge organizan las muestras de menor a mayor impacto sensorial.',
    tip_en: 'BJCP Exam Tip: Stewards and Head Judges order samples from lowest to highest sensory impact.'
  },
  {
    type: 'bjcp_ethics',
    difficulty: 'easy',
    q_es: 'Si un juez tiene una cerveza inscrita en una categoría de una competencia, ¿cuál es su deber ético?',
    q_en: 'If a judge has entered a beer into a competition category, what is their ethical duty?',
    correct_es: 'Recusarse por completo de juzgar esa categoría o cualquier vuelo de desempate directo',
    correct_en: 'Completely recuse themselves from judging that category or direct medal flight',
    distractors_es: [
      'Juzgar la mesa completa pero delegar la evaluación de su propia muestra al co-juez',
      'Evaluar normalmente si considera que no reconoce el código numérico de su botella',
      'Asignar una nota fija promedio de 30 puntos a todas las muestras de la categoría'
    ],
    distractors_en: [
      'Judge the entire flight but delegate scoring of their own entry to the table co-judge',
      'Evaluate normally as long as they believe they do not recognize their bottle entry code',
      'Assign a flat average baseline score of 30 points to all category entries'
    ],
    exp_es: 'El Código de Ética BJCP prohíbe evaluar categorías con muestras propias para garantizar imparcialidad total.',
    exp_en: 'The BJCP Code of Ethics strictly prohibits judging categories with personal entries to ensure total impartiality.',
    tip_es: 'Tip de Examen BJCP: La integridad y la ausencia de conflicto de interés son innegociables en el programa.',
    tip_en: 'BJCP Exam Tip: Integrity and lack of conflict of interest are non-negotiable in the program.'
  },
  {
    type: 'bjcp_rank',
    difficulty: 'hard',
    q_es: '¿Qué puntaje de examen y puntos de experiencia requiere un Juez Reconocido (Recognized Judge)?',
    q_en: 'What exam score and experience points does a Recognized Judge require?',
    correct_es: 'Entre 70% y 79% en el examen de cata y al menos 5 puntos de experiencia',
    correct_en: 'Between 70% and 79% on the tasting exam and at least 5 experience points',
    distractors_es: [
      'Menos de 60% en el examen online y 1 punto de experiencia de juzgamiento',
      'Mínimo 80% en el examen de cata y 10 puntos de experiencia de competencia',
      'Mínimo 90% en ambos exámenes BJCP y 40 puntos de experiencia total'
    ],
    distractors_en: [
      'Under 60% on the online entrance exam and 1 judging experience point',
      'At least 80% on the tasting exam and 10 competition experience points',
      'At least 90% on both BJCP exams and 40 total experience points'
    ],
    exp_es: 'Aprendiz: pasa el online. Reconocido: 70-79% + 5 pts. Certificado: >=80% + 10 pts. Nacional: >=80% (ambos) + 20 pts. Master: >=90% (ambos) + 40 pts.',
    exp_en: 'Apprentice: passes online. Recognized: 70-79% + 5 pts. Certified: >=80% + 10 pts. National: >=80% + 20 pts. Master: >=90% + 40 pts.',
    tip_es: 'Tip de Examen BJCP: Para ser Juez Certificado o superior se necesita al menos 80% en el examen de cata.',
    tip_en: 'BJCP Exam Tip: Achieving Certified rank or higher requires at least an 80% on the tasting exam.'
  },
  {
    type: 'bjcp_procedure',
    difficulty: 'medium',
    q_es: '¿Qué muestras tienen derecho a avanzar a la mesa de Best of Show (BOS)?',
    q_en: 'Which entries are eligible to advance to the Best of Show (BOS) panel?',
    correct_es: 'Únicamente las cervezas ganadoras del 1er lugar (Medalla de Oro) de cada categoría calificada',
    correct_en: 'Only the 1st place (Gold medal) winning beers from each qualifying category flight',
    distractors_es: [
      'Todas las cervezas que hayan obtenido una puntuación superior a 38 puntos en sus mesas',
      'Las tres cervezas ganadoras de medalla de oro, plata y bronce de cada categoría de la mesa',
      'Cualquier cerveza seleccionada por votación popular de los participantes y el público general'
    ],
    distractors_en: [
      'All competition entries that earned a score higher than 38 points in their flights',
      'All three gold, silver, and bronze medal-winning entries from each table category',
      'Any entry selected through a popular choice ballot by entrants and the public'
    ],
    exp_es: 'En el Best of Show tradicional, solo las cervezas de 1er lugar de cada mesa compiten entre sí por el premio supremo de la competencia.',
    exp_en: 'In traditional Best of Show, only the 1st place beers from each table compete for the overarching competition prize.',
    tip_es: 'Tip de Examen BJCP: En el BOS no se llenan hojas numéricas; los jueces debaten y ordenan las cervezas por consenso.',
    tip_en: 'BJCP Exam Tip: Numerical scoresheets are not filled in BOS; senior judges rank top beers through structured discussion.'
  },
  {
    type: 'bjcp_procedure',
    difficulty: 'easy',
    q_es: '¿Cuál es el rol principal del Juez de Mesa al redactar la sección de "Overall Impression"?',
    q_en: 'What is the judge\'s primary role when writing the "Overall Impression" section?',
    correct_es: 'Brindar una evaluación resumida del balance y feedback constructivo y técnico para ayudar al cervecero a mejorar',
    correct_en: 'Provide a summary of balance and constructive technical feedback to help the brewer improve',
    distractors_es: [
      'Detallar el aspecto comercial del envase y sugerir estrategias de venta para distribución masiva en el mercado',
      'Transcribir literalmente las líneas de aroma y sabor de la guía de estilos BJCP sin aportar notas personales',
      'Describir exclusivamente la espuma y la cristalinidad de la cerveza sin hacer mención a la fermentación o balance'
    ],
    distractors_en: [
      'Detail commercial bottle packaging aspects and advise on market retail distribution sales strategies',
      'Literally transcribe aroma and flavor lines from the BJCP style guidelines without personalized notes',
      'Describe exclusively head foam retention and clarity without mentioning fermentation balance'
    ],
    exp_es: 'La sección de Impresión General (10 pts) debe ofrecer sugerencias claras sobre cómo corregir defectos de proceso, fermentación o ingredientes.',
    exp_en: 'Overall Impression (10 pts) must offer actionable advice on fixing brewing, fermentation, or recipe issues.',
    tip_es: 'Tip de Examen BJCP: El feedback constructivo es el servicio más valioso que una competencia brinda al cervecero participante.',
    tip_en: 'BJCP Exam Tip: Constructive feedback is the single most valuable service a competition provides to brewers.'
  }
];

// ─────────────────────────────────────────────
// 2. EXTENSIVE BREWING PROCESSES & SCIENCE
// ─────────────────────────────────────────────

const BREWING_PROCESSES_DATA: QuestionTemplate[] = [
  {
    type: 'water_chemistry',
    difficulty: 'hard',
    q_es: 'En la química del agua cervecera, ¿qué efecto produce una alta concentración de iones Sulfato (SO4) frente a Cloruro (Cl)?',
    q_en: 'In brewing water chemistry, what effect does a high Sulfate (SO4) to Chloride (Cl) ratio produce?',
    correct_es: 'Acentúa el amargor del lúpulo, dando un carácter seco y crujiente al final',
    correct_en: 'Accentuates hop bitterness, yielding a crisp, dry finish',
    distractors_es: [
      'Incrementa la plenitud maltosa y la sensación sedosa en boca',
      'Eleva el pH de maceración por encima de 6.0',
      'Previene completamente la formación de turbidez por frío (chill haze)'
    ],
    distractors_en: [
      'Enhances malt fullness and velvety mouthfeel',
      'Raises mash pH above 6.0',
      'Completely prevents chill haze formation'
    ],
    exp_es: 'El sulfato realza la percepción del amargor del lúpulo (perfil Burton), mientras que el cloruro aporta redondez y dulzor maltoso.',
    exp_en: 'Sulfate accentuates hop bitterness crispness (Burton profile), while chloride enhances round malt sweetness.',
    tip_es: 'Tip de Examen BJCP: En IPAs tradicionales se busca relación SO4:Cl > 2:1; en estilos maltosos se busca SO4:Cl < 1:1.',
    tip_en: 'BJCP Exam Tip: Traditional IPAs use SO4:Cl > 2:1; malt-accentuated styles prefer SO4:Cl < 1:1.'
  },
  {
    type: 'water_chemistry',
    difficulty: 'medium',
    q_es: '¿Por qué el agua de la ciudad de Pilsen (República Checa) es ideal para elaborar la Czech Premium Pale Lager?',
    q_en: 'Why is the natural water of Pilsen (Czech Republic) ideal for brewing Czech Premium Pale Lager?',
    correct_es: 'Porque es extremadamente blanda y baja en minerales disueltos, permitiendo un amargor suave y limpio con maltas pálidas',
    correct_en: 'Because it is extremely soft and low in dissolved minerals, allowing smooth, clean bitterness with pale malts',
    distractors_es: [
      'Por su altísimo contenido de carbonatos de calcio que neutralizan la acidez del lúpulo',
      'Porque contiene niveles elevados de sulfatos que hacen el amargor astringente',
      'Por su abundancia de sodio que aporta salinidad mineral característica'
    ],
    distractors_en: [
      'Due to very high calcium carbonate that neutralizes hop acids',
      'Because it has high sulfates that make bitterness astringent',
      'Due to high sodium that adds characteristic mineral salinity'
    ],
    exp_es: 'El agua de Pilsen tiene casi cero dureza y alcalinidad residual, lo que evita amargores ásperos con el lúpulo Saaz y produce el perfil limpio legendario.',
    exp_en: 'Pilsen water has almost zero hardness and residual alkalinity, preventing harsh bitterness with Saaz hops and yielding iconic clean smoothness.',
    tip_es: 'Tip de Examen BJCP: Las aguas blandas resaltan la delicadeza del lúpulo noble sin astringencia.',
    tip_en: 'BJCP Exam Tip: Soft brewing water highlights delicate Noble hop character without harshness.'
  },
  {
    type: 'brewing_process',
    difficulty: 'medium',
    q_es: '¿Cuál es la función enzimática principal de la Beta-Amilasa durante la maceración cervecera (62°C - 65°C)?',
    q_en: 'What is the primary enzymatic function of Beta-Amylase during mashing (62°C - 65°C)?',
    correct_es: 'Cortar enlaces desde los extremos no reductores del almidón para producir maltosa altamente fermentable',
    correct_en: 'Chop sugars from non-reducing starch ends to yield highly fermentable maltose',
    distractors_es: [
      'Cortar enlaces internos aleatorios para generar dextrinas no fermentables',
      'Degradar lípidos para mejorar la estabilidad de la espuma',
      'Descomponer proteínas de alto peso molecular en polifenoles'
    ],
    distractors_en: [
      'Randomly cleave internal bonds to produce unfermentable dextrins',
      'Break down lipids to enhance head stability',
      'Decompose high molecular weight proteins into polyphenols'
    ],
    exp_es: 'La Beta-amilasa produce maltosa (azúcar fermentable por levadura), favoreciendo cervezas de cuerpo ligero y final seco (alta atenuación).',
    exp_en: 'Beta-amylase produces fermentable maltose, yielding lighter body and drier finishes (higher attenuation).',
    tip_es: 'Tip de Examen BJCP: Maceraciones a temperaturas bajas (62-65°C) resultan en cervezas más atenuadas y secas.',
    tip_en: 'BJCP Exam Tip: Lower mash temperatures (62-65°C) produce more fermentable wort and drier finishes.'
  },
  {
    type: 'brewing_process',
    difficulty: 'medium',
    q_es: '¿A qué temperatura de maceración predomina la Alfa-Amilasa produciendo mostos con mayor contenido de dextrinas y cuerpo?',
    q_en: 'At what mash temperature does Alpha-Amylase dominate, producing higher dextrins and fuller body?',
    correct_es: '68°C a 72°C',
    correct_en: '68°C to 72°C',
    distractors_es: ['50°C a 55°C', '60°C a 63°C', '78°C a 82°C'],
    distractors_en: ['50°C to 55°C', '60°C to 63°C', '78°C to 82°C'],
    exp_es: 'La Alfa-amilasa corta cadenas internas de almidón al azar, generando dextrinas no fermentables que aportan cuerpo y viscosidad residual.',
    exp_en: 'Alpha-amylase randomly cleaves internal starch bonds, producing unfermentable dextrins that contribute body and residual mouthfeel.',
    tip_es: 'Tip de Examen BJCP: Para estilos maltosos y con cuerpo pleno (ej. Wee Heavy o Sweet Stout), se macera a 68-70°C.',
    tip_en: 'BJCP Exam Tip: For full-bodied malt-forward beers (e.g. Wee Heavy, Sweet Stout), mash around 68-70°C.'
  },
  {
    type: 'fermentation_science',
    difficulty: 'hard',
    q_es: '¿Qué compuesto químico es el responsable del aroma a plátano/banana en las cervezas de trigo alemanas (Weissbier)?',
    q_en: 'Which chemical compound is responsible for the banana aroma in German Weissbier?',
    correct_es: 'Acetato de isoamilo (Éster)',
    correct_en: 'Isoamyl acetate (Ester)',
    distractors_es: ['4-vinilguayacol (Fenol)', 'Acetaldehído', 'Butirato de etilo'],
    distractors_en: ['4-vinyl guaiacol (Phenol)', 'Acetaldehyde', 'Ethyl butyrate'],
    exp_es: 'El acetato de isoamilo es el éster que aporta el perfil de plátano/banana. El 4-vinilguayacol aporta el perfil fenólico a clavo de olor.',
    exp_en: 'Isoamyl acetate is the ester providing banana aroma. 4-vinyl guaiacol is the phenol providing clove notes.',
    tip_es: 'Tip de Examen BJCP: El balance clásico de una Weissbier requiere armonía entre plátano (éster) y clavo (fenol).',
    tip_en: 'BJCP Exam Tip: Classic Weissbier requires balance between banana ester and clove phenol.'
  },
  {
    type: 'hop_science',
    difficulty: 'medium',
    q_es: '¿Cuáles son las cuatro variedades tradicionales consideradas "Lúpulos Nobles" de Europa continental?',
    q_en: 'Which four traditional varieties are considered the classic continental "Noble Hops"?',
    correct_es: 'Hallertau Mittelfrüh, Spalt, Tettnang y Saaz',
    correct_en: 'Hallertau Mittelfrüh, Spalt, Tettnang, and Saaz',
    distractors_es: [
      'Cascade, Centennial, Columbus y Chinook',
      'East Kent Goldings, Fuggles, Challenger y Target',
      'Citra, Mosaic, Simcoe y Galaxy'
    ],
    distractors_en: [
      'Cascade, Centennial, Columbus, and Chinook',
      'East Kent Goldings, Fuggles, Challenger, and Target',
      'Citra, Mosaic, Simcoe, and Galaxy'
    ],
    exp_es: 'Los lúpulos nobles se caracterizan por bajo contenido de alfa-ácidos, bajo nivel de cohumulona y un perfil aromático herbal, floral y especiado sutil.',
    exp_en: 'Noble hops feature low alpha acids, low cohumulone, and subtle herbal, floral, and spicy aroma qualities.',
    tip_es: 'Tip de Examen BJCP: Son obligatorios para autenticidad en lagers tradicionales alemanas y checas.',
    tip_en: 'BJCP Exam Tip: Essential for true authenticity in classic German and Czech lagers.'
  },
  {
    type: 'malt_science',
    difficulty: 'medium',
    q_es: '¿Qué malta tradicional aporta intensas notas ahumadas a madera de haya en una auténtica Rauchbier de Bamberg?',
    q_en: 'What traditional malt provides intense beechwood smoke notes in an authentic Bamberg Rauchbier?',
    correct_es: 'Rauchmalz (malta secada sobre fuego de madera de haya)',
    correct_en: 'Rauchmalz (malt dried over beechwood fire)',
    distractors_es: [
      'Malta de turba escocesa (Peat-smoked malt)',
      'Malta Caramunich III',
      'Malta tostada Black Patent sin cáscara'
    ],
    distractors_en: [
      'Scottish peat-smoked malt',
      'Caramunich III malt',
      'Dehusked Black Patent roasted malt'
    ],
    exp_es: 'La Rauchbier tradicional de Bamberg utiliza malta ahumada con madera de haya (beechwood), otorgando un aroma limpio a panceta/madera sin el carácter medicinal o a turba del whisky.',
    exp_en: 'Traditional Bamberg Rauchbier uses beechwood-smoked malt (Rauchmalz), delivering savory bacon/wood smoke without medicinal peat flavors.',
    tip_es: 'Tip de Examen BJCP: El humo de turba (peat) es una falta grave en una Rauchbier estilo BJCP 6B.',
    tip_en: 'BJCP Exam Tip: Peat smoke is a severe fault in a classic BJCP 6B Rauchbier.'
  }
];

// ─────────────────────────────────────────────
// 3. DYNAMIC STYLE QUESTIONS GENERATOR (NO COMMERCIAL EXAMPLES)
// ─────────────────────────────────────────────

function generateStyleQuestions(lang: 'es' | 'en', count: number): QuizQuestion[] {
  const styles = getBJCPStyles(lang);
  const questions: QuizQuestion[] = [];
  const pool = shuffle(styles);
  const isSpanish = lang === 'es';

  for (const style of pool) {
    if (questions.length >= count) break;

    const roll = Math.random();

    if (roll < 0.22) {
      // Q1: Style by Overall Impression
      const distractors = getSmartStyleDistractors(style, styles);
      const { options, correctIndex } = buildOptions(style.name, distractors);
      
      questions.push({
        id: `style-name-${style.id}-${Date.now()}-${Math.random()}`,
        type: 'style_name',
        category: 'styles',
        difficulty: 'medium',
        relatedStyleId: style.id,
        question: isSpanish
          ? `¿Cuál estilo BJCP corresponde a esta descripción sensorial?\n\n"${style.overallImpression.slice(0, 230)}..."`
          : `Which BJCP style matches this sensory description?\n\n"${style.overallImpression.slice(0, 230)}..."`,
        options,
        correctIndex,
        explanation: isSpanish
          ? `Es el estilo ${style.id} ${style.name} (${style.category}). ABV: ${style.vitalStatistics.abv}, IBU: ${style.vitalStatistics.ibu}, SRM: ${style.vitalStatistics.srm}.`
          : `This is style ${style.id} ${style.name} (${style.category}). ABV: ${style.vitalStatistics.abv}, IBU: ${style.vitalStatistics.ibu}, SRM: ${style.vitalStatistics.srm}.`,
        judgeTip: isSpanish
          ? `Tip de Examen BJCP: Enfócate en los descriptores aromáticos y el balance de fermentación para distinguirlo de la categoría ${style.category}.`
          : `BJCP Exam Tip: Focus on aroma descriptors and fermentation balance to set it apart in category ${style.category}.`,
      });

    } else if (roll < 0.42 && style.comparison && style.comparison.length > 30) {
      // Q2: Sibling Style Comparison / Discrimination
      const distractors = getSmartStyleDistractors(style, styles);
      const { options, correctIndex } = buildOptions(style.name, distractors);

      let cleanedComp = style.comparison;
      const regexName = new RegExp(style.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      cleanedComp = cleanedComp.replace(regexName, isSpanish ? 'este estilo' : 'this style');

      questions.push({
        id: `style-comp-${style.id}-${Date.now()}-${Math.random()}`,
        type: 'style_comparison',
        category: 'styles',
        difficulty: 'hard',
        relatedStyleId: style.id,
        question: isSpanish
          ? `En la guía BJCP, ¿a qué estilo corresponde esta comparación sensorial frente a estilos similares?\n\n"${cleanedComp.slice(0, 240)}..."`
          : `In the BJCP guidelines, which style does this sensory comparison describe?\n\n"${cleanedComp.slice(0, 240)}..."`,
        options,
        correctIndex,
        explanation: isSpanish
          ? `Corresponde a ${style.id} ${style.name}. ${style.comparison.slice(0, 160)}...`
          : `Matches ${style.id} ${style.name}. ${style.comparison.slice(0, 160)}...`,
        judgeTip: isSpanish
          ? `Tip de Examen BJCP: El examen de cata penaliza confundir estilos hermanos. Presta atención al cuerpo, final y nivel de lúpulo.`
          : `BJCP Exam Tip: The tasting exam penalizes mixing up sibling styles. Pay close attention to body, finish, and hop presence.`,
      });

    } else if (roll < 0.60 && style.aroma && style.aroma.length > 40) {
      // Q3: Aroma Descriptors
      const distractors = getSmartStyleDistractors(style, styles);
      const { options, correctIndex } = buildOptions(style.name, distractors);

      let cleanedAroma = style.aroma;
      const regexName = new RegExp(style.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      cleanedAroma = cleanedAroma.replace(regexName, isSpanish ? 'este estilo' : 'this style');

      questions.push({
        id: `style-aroma-${style.id}-${Date.now()}-${Math.random()}`,
        type: 'style_aroma',
        category: 'styles',
        difficulty: 'medium',
        relatedStyleId: style.id,
        question: isSpanish
          ? `¿Qué estilo cervecero se caracteriza por el siguiente perfil en AROMA?\n\n"${cleanedAroma.slice(0, 230)}..."`
          : `Which beer style is characterized by the following AROMA profile?\n\n"${cleanedAroma.slice(0, 230)}..."`,
        options,
        correctIndex,
        explanation: isSpanish
          ? `Aroma de ${style.id} ${style.name}: ${style.aroma.slice(0, 160)}...`
          : `Aroma for ${style.id} ${style.name}: ${style.aroma.slice(0, 160)}...`,
        judgeTip: isSpanish
          ? `Tip de Examen BJCP: En la hoja de cata, evalúa malta, lúpulo, ésteres de fermentación y otros aromas característicos por separado.`
          : `BJCP Exam Tip: On the scoresheet, evaluate malt, hops, fermentation esters, and other distinct aromas separately.`,
      });

    } else if (roll < 0.78 && style.ingredients && style.ingredients.length > 25) {
      // Q4: Characteristic Ingredients & Brewing Methods
      const distractors = getSmartStyleDistractors(style, styles);
      const { options, correctIndex } = buildOptions(style.name, distractors);

      let cleanIngr = style.ingredients;
      const regexName = new RegExp(style.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      cleanIngr = cleanIngr.replace(regexName, isSpanish ? 'este estilo' : 'this style');

      questions.push({
        id: `style-ingr-${style.id}-${Date.now()}-${Math.random()}`,
        type: 'style_ingredients',
        category: 'styles',
        difficulty: 'medium',
        relatedStyleId: style.id,
        question: isSpanish
          ? `¿Qué estilo cervecero se caracteriza por estos ingredientes y métodos tradicionales?\n\n"${cleanIngr.slice(0, 220)}..."`
          : `Which beer style is characterized by these traditional ingredients and brewing methods?\n\n"${cleanIngr.slice(0, 220)}..."`,
        options,
        correctIndex,
        explanation: isSpanish
          ? `Ingredientes de ${style.id} ${style.name}: ${style.ingredients.slice(0, 150)}...`
          : `Ingredients for ${style.id} ${style.name}: ${style.ingredients.slice(0, 150)}...`,
        judgeTip: isSpanish
          ? `Tip de Examen BJCP: Las variedades de lúpulo (Nobles continentales vs ingleses vs americanos) y levaduras definen el perfil auténtico.`
          : `BJCP Exam Tip: Hop varieties (Continental Noble vs English vs American) and yeast strains define authentic style profiles.`,
      });

    } else if (roll < 0.90 && style.history && style.history.length > 35) {
      // Q5: History, Origin & Regional Traditions
      const distractors = getSmartStyleDistractors(style, styles);
      const { options, correctIndex } = buildOptions(style.name, distractors);

      let cleanHist = style.history;
      const regexName = new RegExp(style.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      cleanHist = cleanHist.replace(regexName, isSpanish ? 'este estilo' : 'this style');

      questions.push({
        id: `style-hist-${style.id}-${Date.now()}-${Math.random()}`,
        type: 'style_history',
        category: 'styles',
        difficulty: 'medium',
        relatedStyleId: style.id,
        question: isSpanish
          ? `¿Qué estilo cervecero posee esta historia y origen tradicional?\n\n"${cleanHist.slice(0, 230)}..."`
          : `Which beer style has this historical origin and tradition?\n\n"${cleanHist.slice(0, 230)}..."`,
        options,
        correctIndex,
        explanation: isSpanish
          ? `Historia de ${style.id} ${style.name}: ${style.history.slice(0, 160)}...`
          : `History of ${style.id} ${style.name}: ${style.history.slice(0, 160)}...`,
        judgeTip: isSpanish
          ? `Tip de Examen BJCP: Conocer el contexto histórico (ej. cervezas de abadía, lagers de Franconia o exportaciones coloniales) fundamenta las decisiones de cata.`
          : `BJCP Exam Tip: Knowing historical context (e.g. Abbey beers, Franconian lagers, colonial exports) grounds judging decisions.`,
      });

    } else {
      // Q6: Vital Statistics (ABV / IBU / SRM)
      const statType = Math.random();
      
      if (statType < 0.45) {
        const correctAbv = style.vitalStatistics.abv;
        const sameCategoryAbvs = styles.filter(s => s.id !== style.id && s.category === style.category).map(s => s.vitalStatistics.abv);
        const otherAbvs = styles.filter(s => s.id !== style.id).map(s => s.vitalStatistics.abv);
        const { options, correctIndex } = buildOptions(correctAbv, [...sameCategoryAbvs, ...otherAbvs]);

        questions.push({
          id: `style-abv-${style.id}-${Date.now()}-${Math.random()}`,
          type: 'style_abv',
          category: 'styles',
          difficulty: 'medium',
          relatedStyleId: style.id,
          question: isSpanish
            ? `¿Cuál es el rango de ABV (alcohol por volumen) para el estilo ${style.id} ${style.name}?`
            : `What is the ABV (alcohol by volume) range for style ${style.id} ${style.name}?`,
          options,
          correctIndex,
          explanation: isSpanish
            ? `${style.name} tiene un ABV de ${correctAbv}. IBU: ${style.vitalStatistics.ibu}, SRM: ${style.vitalStatistics.srm}.`
            : `${style.name} has an ABV of ${correctAbv}. IBU: ${style.vitalStatistics.ibu}, SRM: ${style.vitalStatistics.srm}.`,
          judgeTip: isSpanish
            ? `Tip de Examen BJCP: Los límites de ABV permiten identificar si una muestra tiene calidez excesiva o falta de fermentación.`
            : `BJCP Exam Tip: ABV boundaries help evaluate appropriate alcohol warmth versus underattenuation.`,
        });
      } else if (statType < 0.80) {
        const correctIbu = style.vitalStatistics.ibu;
        const sameCategoryIbus = styles.filter(s => s.id !== style.id && s.category === style.category).map(s => s.vitalStatistics.ibu);
        const otherIbus = styles.filter(s => s.id !== style.id).map(s => s.vitalStatistics.ibu);
        const { options, correctIndex } = buildOptions(correctIbu, [...sameCategoryIbus, ...otherIbus]);

        questions.push({
          id: `style-ibu-${style.id}-${Date.now()}-${Math.random()}`,
          type: 'style_ibu',
          category: 'styles',
          difficulty: 'medium',
          relatedStyleId: style.id,
          question: isSpanish
            ? `¿Cuál es el rango de amargor (IBU) para el estilo ${style.id} ${style.name}?`
            : `What is the bitterness (IBU) range for style ${style.id} ${style.name}?`,
          options,
          correctIndex,
          explanation: isSpanish
            ? `${style.name} tiene ${correctIbu} IBU. ABV: ${style.vitalStatistics.abv}, SRM: ${style.vitalStatistics.srm}.`
            : `${style.name} has ${correctIbu} IBU. ABV: ${style.vitalStatistics.abv}, SRM: ${style.vitalStatistics.srm}.`,
          judgeTip: isSpanish
            ? `Tip de Examen BJCP: Considera siempre la relación BU/GU para calibrar el balance percibido.`
            : `BJCP Exam Tip: Always evaluate the BU/GU ratio to calibrate perceived balance.`,
        });
      } else {
        const correctSrm = style.vitalStatistics.srm;
        const otherSrms = styles.filter(s => s.id !== style.id).map(s => s.vitalStatistics.srm);
        const { options, correctIndex } = buildOptions(correctSrm, otherSrms);

        questions.push({
          id: `style-srm-${style.id}-${Date.now()}-${Math.random()}`,
          type: 'style_srm',
          category: 'styles',
          difficulty: 'medium',
          relatedStyleId: style.id,
          question: isSpanish
            ? `¿Cuál es el rango de color (SRM) para el estilo ${style.id} ${style.name}?`
            : `What is the color (SRM) range for style ${style.id} ${style.name}?`,
          options,
          correctIndex,
          explanation: isSpanish
            ? `${style.name} tiene ${correctSrm} SRM. ABV: ${style.vitalStatistics.abv}, IBU: ${style.vitalStatistics.ibu}.`
            : `${style.name} has ${correctSrm} SRM. ABV: ${style.vitalStatistics.abv}, IBU: ${style.vitalStatistics.ibu}.`,
          judgeTip: isSpanish
            ? `Tip de Examen BJCP: El color (SRM) debe coincidir con el estilo en la copa bajo iluminación adecuada.`
            : `BJCP Exam Tip: SRM color must align with expected style visual standards in good lighting.`,
        });
      }
    }
  }

  return questions.slice(0, count);
}

// ─────────────────────────────────────────────
// 4. OFF-FLAVORS & BREWING FAULTS
// ─────────────────────────────────────────────

function generateOffFlavorQuestions(lang: 'es' | 'en', count: number): QuizQuestion[] {
  const flavors = shuffle(OFF_FLAVORS_DATA);
  const questions: QuizQuestion[] = [];
  const isSpanish = lang === 'es';

  for (const flavor of flavors) {
    if (questions.length >= count) break;

    const name = isSpanish ? flavor.name_es : flavor.name_en;
    const sensation = isSpanish ? flavor.sensation_es : flavor.sensation_en;
    const causes = isSpanish ? flavor.causes_es : flavor.causes_en;
    const prevention = isSpanish ? flavor.prevention_es : flavor.prevention_en;

    const otherNames = OFF_FLAVORS_DATA.filter(f => f.id !== flavor.id).map(f => isSpanish ? f.name_es : f.name_en);
    const roll = Math.random();

    if (roll < 0.35) {
      // Sensory Recognition
      const { options, correctIndex } = buildOptions(name, otherNames);
      questions.push({
        id: `off-sens-${flavor.id}-${Date.now()}-${Math.random()}`,
        type: 'offflavor_sensation',
        category: 'offflavors',
        difficulty: 'easy',
        question: isSpanish
          ? `¿Qué defecto cervecero (off-flavor) produce esta sensación organoléptica en copa?\n\n"${sensation}"`
          : `Which beer defect (off-flavor) produces this sensory description in the glass?\n\n"${sensation}"`,
        options,
        correctIndex,
        explanation: isSpanish
          ? `${name}: ${causes.slice(0, 160)}...`
          : `${name}: ${causes.slice(0, 160)}...`,
        judgeTip: isSpanish
          ? `Tip de Examen BJCP: En la hoja de cata debes señalar la intensidad percibida (bajo, medio, alto) y si es descalificante para el estilo.`
          : `BJCP Exam Tip: State perceived intensity (low, med, high) on the scoresheet and whether it is a fault for the entered style.`,
      });

    } else if (roll < 0.70) {
      // Root Cause
      const { options, correctIndex } = buildOptions(name, otherNames);
      let cleanedCauses = causes;
      [flavor.name_es, flavor.name_en].forEach(n => {
        if (n) {
          const r = new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
          cleanedCauses = cleanedCauses.replace(r, isSpanish ? 'este compuesto' : 'this compound');
        }
      });

      questions.push({
        id: `off-cause-${flavor.id}-${Date.now()}-${Math.random()}`,
        type: 'offflavor_cause',
        category: 'offflavors',
        difficulty: 'hard',
        question: isSpanish
          ? `Un juez identifica un defecto originado por la siguiente causa técnica:\n\n"${cleanedCauses.slice(0, 210)}..."\n\n¿Qué off-flavor se generó?`
          : `A judge identifies a flaw caused by the following brewing issue:\n\n"${cleanedCauses.slice(0, 210)}..."\n\nWhich off-flavor was produced?`,
        options,
        correctIndex,
        explanation: isSpanish
          ? `Causa de ${name}: ${causes}. Prevención: ${prevention}.`
          : `Cause of ${name}: ${causes}. Prevention: ${prevention}.`,
        judgeTip: isSpanish
          ? `Tip de Examen BJCP: El feedback constructivo en la hoja vale hasta el 20% del puntaje del juez. Conocer la causa química es esencial.`
          : `BJCP Exam Tip: Constructive feedback accounts for up to 20% of your judge score. Knowing the chemical cause is essential.`,
      });

    } else {
      // Prevention
      const { options, correctIndex } = buildOptions(name, otherNames);
      let cleanedPrev = prevention;
      [flavor.name_es, flavor.name_en].forEach(n => {
        if (n) {
          const r = new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
          cleanedPrev = cleanedPrev.replace(r, isSpanish ? 'este defecto' : 'this fault');
        }
      });

      questions.push({
        id: `off-prev-${flavor.id}-${Date.now()}-${Math.random()}`,
        type: 'offflavor_prevention',
        category: 'offflavors',
        difficulty: 'hard',
        question: isSpanish
          ? `¿Para prevenir qué defecto cervecero se recomienda la siguiente acción correctiva en elaboración?\n\n"${cleanedPrev.slice(0, 210)}..."`
          : `Which beer defect is prevented by following this corrective brewing action?\n\n"${cleanedPrev.slice(0, 210)}..."`,
        options,
        correctIndex,
        explanation: isSpanish
          ? `Prevención de ${name}: ${prevention}. Causa: ${causes}.`
          : `Prevention of ${name}: ${prevention}. Cause: ${causes}.`,
        judgeTip: isSpanish
          ? `Tip de Examen BJCP: Aconseja siempre soluciones prácticas y precisas (control de temperatura, pitch rate o sanitización).`
          : `BJCP Exam Tip: Always recommend practical and precise advice (temperature control, pitch rate, or sanitation).`,
      });
    }
  }

  return questions.slice(0, count);
}

// ─────────────────────────────────────────────
// 5. PROCEDURES & PROCESSES GENERATORS
// ─────────────────────────────────────────────

function generateProcedureQuestions(lang: 'es' | 'en', count: number): QuizQuestion[] {
  const isSpanish = lang === 'es';
  const shuffled = shuffle(BJCP_PROCEDURES_DATA);
  const questions: QuizQuestion[] = [];

  for (const item of shuffled) {
    if (questions.length >= count) break;
    const q = isSpanish ? item.q_es : item.q_en;
    const correct = isSpanish ? item.correct_es : item.correct_en;
    const distractors = isSpanish ? item.distractors_es : item.distractors_en;
    const { options, correctIndex } = buildOptions(correct, distractors);

    questions.push({
      id: `proc-${Date.now()}-${Math.random()}`,
      type: item.type,
      category: 'procedures',
      difficulty: item.difficulty,
      question: q,
      options,
      correctIndex,
      explanation: isSpanish ? item.exp_es : item.exp_en,
      judgeTip: isSpanish ? item.tip_es : item.tip_en,
    });
  }

  return questions.slice(0, count);
}

function generateProcessQuestions(lang: 'es' | 'en', count: number): QuizQuestion[] {
  const isSpanish = lang === 'es';
  const shuffled = shuffle(BREWING_PROCESSES_DATA);
  const questions: QuizQuestion[] = [];

  for (const item of shuffled) {
    if (questions.length >= count) break;
    const q = isSpanish ? item.q_es : item.q_en;
    const correct = isSpanish ? item.correct_es : item.correct_en;
    const distractors = isSpanish ? item.distractors_es : item.distractors_en;
    const { options, correctIndex } = buildOptions(correct, distractors);

    questions.push({
      id: `proc-chem-${Date.now()}-${Math.random()}`,
      type: item.type,
      category: 'processes',
      difficulty: item.difficulty,
      question: q,
      options,
      correctIndex,
      explanation: isSpanish ? item.exp_es : item.exp_en,
      judgeTip: isSpanish ? item.tip_es : item.tip_en,
    });
  }

  return questions.slice(0, count);
}

function generateGlossaryQuestions(lang: 'es' | 'en', count: number): QuizQuestion[] {
  const terms = shuffle(GLOSSARY_DATA);
  const questions: QuizQuestion[] = [];
  const isSpanish = lang === 'es';

  for (const term of terms) {
    if (questions.length >= count) break;
    const name = isSpanish ? term.name_es : term.name_en;
    const def = isSpanish ? term.definition_es : term.definition_en;
    const otherNames = GLOSSARY_DATA.filter(t => t.id !== term.id).map(t => isSpanish ? t.name_es : t.name_en);
    const { options, correctIndex } = buildOptions(name, otherNames);

    questions.push({
      id: `gloss-${term.id}-${Date.now()}-${Math.random()}`,
      type: 'glossary_term',
      category: 'glossary',
      difficulty: 'medium',
      question: isSpanish
        ? `¿Qué término técnico cervecero corresponde a esta definición?\n\n"${def.slice(0, 210)}..."`
        : `Which brewing technical term matches this definition?\n\n"${def.slice(0, 210)}..."`,
      options,
      correctIndex,
      explanation: `${name}: ${def}`,
      judgeTip: isSpanish
        ? `Tip de Examen BJCP: El vocabulario técnico preciso diferencia a un Juez Aprendiz de un Juez Certificado o Nacional.`
        : `BJCP Exam Tip: Precise technical vocabulary is what separates an Apprentice Judge from a Certified or National Judge.`,
    });
  }

  return questions.slice(0, count);
}

function generateTagQuestions(lang: 'es' | 'en', count: number): QuizQuestion[] {
  const tags = shuffle(TAG_DEFINITIONS_DATA);
  const questions: QuizQuestion[] = [];
  const isSpanish = lang === 'es';

  for (const tag of tags) {
    if (questions.length >= count) break;
    const name = isSpanish ? tag.name_es : tag.name_en;
    const desc = isSpanish ? tag.description_es : tag.description_en;
    const tagLabel = isSpanish ? (tag.tag_es || tag.tag) : tag.tag;
    const otherNames = TAG_DEFINITIONS_DATA.filter(t => t.tag !== tag.tag).map(t => isSpanish ? t.name_es : t.name_en);
    const { options, correctIndex } = buildOptions(name, otherNames);

    questions.push({
      id: `tag-${tag.tag}-${Date.now()}-${Math.random()}`,
      type: 'tag_name',
      category: 'tags',
      difficulty: 'easy',
      question: isSpanish
        ? `¿Qué etiqueta de agrupación BJCP corresponde a esta descripción?\n\n"${desc.slice(0, 190)}..."`
        : `Which BJCP tag matches this description?\n\n"${desc.slice(0, 190)}..."`,
      options,
      correctIndex,
      explanation: `Etiqueta "${tagLabel}" (${name}): ${desc}`,
      judgeTip: isSpanish
        ? `Tip de Examen BJCP: Las etiquetas agrupan cervezas por familias transversales (ej. 'high-strength', 'wild-fermented', 'traditional-ale').`
        : `BJCP Exam Tip: Tags group beers across categories by common traits (e.g. 'high-strength', 'wild-fermented', 'traditional-ale').`,
    });
  }

  return questions.slice(0, count);
}

function getCuratedQuizQuestions(lang: 'es' | 'en'): QuizQuestion[] {
  const isSpanish = lang === 'es';
  return CURATED_BJCP_QUESTIONS.map(c => {
    const rawOptions = isSpanish ? c.options_es : c.options_en;
    const correctAnswer = rawOptions[c.correctIndex];
    const shuffledOptions = shuffle([...rawOptions]);
    const correctIndex = shuffledOptions.indexOf(correctAnswer);

    return {
      id: c.id,
      type: 'bjcp_procedure' as QuestionType,
      category: (c.category === 'scenarios' ? 'procedures' : c.category) as any,
      difficulty: c.difficulty,
      question: isSpanish ? c.question_es : c.question_en,
      options: shuffledOptions,
      correctIndex: correctIndex !== -1 ? correctIndex : 0,
      explanation: isSpanish ? c.explanation_es : c.explanation_en,
      judgeTip: isSpanish ? c.judgeTip_es : c.judgeTip_en,
    };
  });
}

function prioritizeUnseen(questions: QuizQuestion[], seenIds: string[] = [], targetCount: number): QuizQuestion[] {
  if (!seenIds || seenIds.length === 0) {
    return shuffle(questions).slice(0, targetCount);
  }

  const seenSet = new Set(seenIds);
  const unseen = questions.filter(q => !seenSet.has(q.id));
  const seen = questions.filter(q => seenSet.has(q.id));

  if (unseen.length >= targetCount) {
    return shuffle(unseen).slice(0, targetCount);
  }

  const neededFromSeen = targetCount - unseen.length;
  return [...shuffle(unseen), ...shuffle(seen).slice(0, neededFromSeen)];
}

// ─────────────────────────────────────────────
// 6. OFFICIAL BJCP ENTRANCE EXAM SIMULATOR
// ─────────────────────────────────────────────

function generateExamSimulator(lang: 'es' | 'en', totalCount = 40, seenIds: string[] = []): QuizQuestion[] {
  const curated = getCuratedQuizQuestions(lang);
  const curatedUnseen = prioritizeUnseen(curated, seenIds, Math.min(6, curated.length));

  const remainingNeeded = totalCount - curatedUnseen.length;
  const stylesCount = Math.round(remainingNeeded * 0.45);
  const faultsCount = Math.round(remainingNeeded * 0.25);
  const procCount = Math.round(remainingNeeded * 0.15);
  const processCount = remainingNeeded - stylesCount - faultsCount - procCount;

  const stylePool = prioritizeUnseen(generateStyleQuestions(lang, 120), seenIds, stylesCount);
  const faultPool = prioritizeUnseen(generateOffFlavorQuestions(lang, 50), seenIds, faultsCount);
  const procPool = prioritizeUnseen(generateProcedureQuestions(lang, 30), seenIds, procCount);
  const processPool = prioritizeUnseen(generateProcessQuestions(lang, 30), seenIds, processCount);

  return shuffle([...curatedUnseen, ...stylePool, ...faultPool, ...procPool, ...processPool]).slice(0, totalCount);
}

// ─────────────────────────────────────────────
// MAIN GENERATOR EXPORT
// ─────────────────────────────────────────────

export function generateQuiz(
  mode: QuizMode,
  lang: 'es' | 'en',
  totalCount: number,
  seenIds: string[] = []
): QuizQuestion[] {
  const curated = getCuratedQuizQuestions(lang);

  if (mode === 'exam_simulator') {
    return generateExamSimulator(lang, totalCount || 40, seenIds);
  }
  if (mode === 'styles') {
    const curatedStyles = curated.filter(c => c.category === 'styles');
    const all = [...curatedStyles, ...generateStyleQuestions(lang, 200)];
    return prioritizeUnseen(all, seenIds, totalCount);
  }
  if (mode === 'offflavors') {
    const curatedFaults = curated.filter(c => c.category === 'offflavors');
    const all = [...curatedFaults, ...generateOffFlavorQuestions(lang, 60)];
    return prioritizeUnseen(all, seenIds, totalCount);
  }
  if (mode === 'procedures') {
    const curatedProc = curated.filter(c => c.category === 'procedures');
    const all = [...curatedProc, ...generateProcedureQuestions(lang, 30)];
    return prioritizeUnseen(all, seenIds, totalCount);
  }
  if (mode === 'processes') {
    const curatedProc = curated.filter(c => c.category === 'processes');
    const all = [...curatedProc, ...generateProcessQuestions(lang, 30)];
    return prioritizeUnseen(all, seenIds, totalCount);
  }
  if (mode === 'glossary') {
    const all = generateGlossaryQuestions(lang, 60);
    return prioritizeUnseen(all, seenIds, totalCount);
  }
  if (mode === 'tags') {
    const all = generateTagQuestions(lang, 40);
    return prioritizeUnseen(all, seenIds, totalCount);
  }

  // Mixed Mode: blend curated questions + balanced core areas
  const perSource = Math.ceil(totalCount / 4);
  const s = prioritizeUnseen([...curated.filter(c => c.category === 'styles'), ...generateStyleQuestions(lang, 100)], seenIds, perSource);
  const f = prioritizeUnseen([...curated.filter(c => c.category === 'offflavors'), ...generateOffFlavorQuestions(lang, 50)], seenIds, perSource);
  const pr = prioritizeUnseen([...curated.filter(c => c.category === 'procedures'), ...generateProcedureQuestions(lang, 30)], seenIds, perSource);
  const pc = prioritizeUnseen([...curated.filter(c => c.category === 'processes'), ...generateProcessQuestions(lang, 30)], seenIds, perSource);

  return shuffle([...s, ...f, ...pr, ...pc]).slice(0, totalCount);
}
