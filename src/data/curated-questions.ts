export interface CuratedQuestion {
  id: string;
  category: 'styles' | 'offflavors' | 'procedures' | 'processes' | 'scenarios';
  difficulty: 'easy' | 'medium' | 'hard';
  question_es: string;
  question_en: string;
  options_es: string[];
  options_en: string[];
  correctIndex: number;
  explanation_es: string;
  explanation_en: string;
  judgeTip_es: string;
  judgeTip_en: string;
}

export const CURATED_BJCP_QUESTIONS: CuratedQuestion[] = [
  // ─────────────────────────────────────────────
  // 1. ESCENARIOS REALES EN MESA DE JUZGAMIENTO (SCENARIOS)
  // ─────────────────────────────────────────────
  {
    id: 'curated-scenario-01',
    category: 'scenarios',
    difficulty: 'hard',
    question_es: 'En una mesa de juzgamiento, dos jueces evalúan una muestra en categoría 10A Weissbier. El Juez A califica 41 puntos (Excelente). El Juez B califica 29 puntos (Buena), justificando que la cerveza tiene "un marcado aroma a clavo de olor que arruina el balance". ¿Cuál es el procedimiento correcto para consensuar la mesa?',
    question_en: 'At a judging table, two judges evaluate an entry in category 10A Weissbier. Judge A scores 41 (Excellent). Judge B scores 29 (Good), stating the beer has "intense clove aroma that ruins the balance". What is the correct procedure to calibrate the table?',
    options_es: [
      'El Juez A debe recordar que el fenol a clavo (4-VG) es obligatorio en el estilo y consensuar calibrando hacia 38-41 pts',
      'El Juez B debe imponer su criterio porque cualquier fenol perceptible en lagers o ales de trigo se considera defecto técnico',
      'Ambos jueces deben promediar matemáticamente sus puntajes en 35 puntos exactos sin modificar sus notas en la hoja',
      'El panel debe solicitar una segunda botella al Steward y calificarla únicamente con el criterio del juez con mayor rango'
    ],
    options_en: [
      'Judge A should remind that clove phenol (4-VG) is mandatory in the style and calibrate towards the 38-41 pt range',
      'Judge B must prevail because any noticeable phenolic aroma in wheat beers is considered a brewing flaw',
      'Both judges must mathematically average their scores to exactly 35 points without adjusting written notes',
      'The table must request a second bottle from the Steward and judge it using only the higher-ranked judge’s criteria'
    ],
    correctIndex: 0,
    explanation_es: 'El 4-vinilguayacol (clavo de olor) es un atributo fundamental y esperado en la levadura de Weissbier alemana. Un juez no puede penalizar un rasgo auténtico del estilo por gusto personal. Ambos jueces deben discutir los parámetros de la guía y calibrar con una diferencia máxima de 5 a 7 puntos.',
    explanation_en: '4-vinyl guaiacol (clove) is a foundational, required hallmark of German Weissbier yeast. A judge cannot penalize an authentic style trait based on personal preference. Both judges must calibrate within 5-7 points based on style guidelines.',
    judgeTip_es: 'Tip de Examen BJCP: El juzgamiento BJCP es objetivo según la guía de estilos, nunca basado en preferencias subjetivas del juez.',
    judgeTip_en: 'BJCP Exam Tip: BJCP judging is objective against the style guidelines, never based on personal subjective likes/dislikes.'
  },
  {
    id: 'curated-scenario-02',
    category: 'scenarios',
    difficulty: 'medium',
    question_es: 'Un participante inscribe una cerveza en 21A American IPA, pero en la cata el panel detecta 4.3% ABV, cuerpo muy ligero, final seco y un amargor limpio y punzante de 50 IBU. ¿Qué retroalimentación técnica y ajuste debe sugerir el juez en la hoja?',
    question_en: 'An entrant registers a beer in 21A American IPA, but on tasting the panel detects 4.3% ABV, light body, dry finish, and clean assertive bitterness of 50 IBU. What constructive feedback and category reclassification should the judge suggest?',
    options_es: [
      'Aconsejar aumentar la malta base para alcanzar el mínimo de 5.5% ABV o inscribirla en 21B Specialty IPA: Session IPA',
      'Descalificar la muestra inmediatamente por no cumplir con el límite mínimo de amargor establecido para cervezas lupuladas',
      'Sugerir el uso de maltas tostadas oscuras para incrementar la densidad final sin modificar la fermentabilidad del mosto',
      'Otorgar 45 puntos porque la cerveza carece de defectos técnicos independientemente de su graduación alcohólica real'
    ],
    options_en: [
      'Advise increasing base malt to reach the 5.5% ABV minimum or entering it into 21B Specialty IPA: Session IPA',
      'Disqualify the entry immediately for failing to reach the minimum bitterness threshold set for hoppy beers',
      'Suggest adding dark roasted specialty malts to raise final gravity without altering wort fermentability',
      'Award 45 points because the beer lacks technical flaws regardless of its actual alcohol by volume strength'
    ],
    correctIndex: 0,
    explanation_es: 'La 21A American IPA requiere un ABV oficial de 5.5% a 7.5%. Con 4.3% ABV, la cerveza carece del soporte alcohólico y maltoso para la categoría tradicional, pero califica excelentemente como 21B Session IPA (3.0% - 5.0% ABV).',
    explanation_en: '21A American IPA requires an official ABV of 5.5% to 7.5%. At 4.3% ABV, it lacks the malt/alcohol backbone for standard IPA, but excels as 21B Session IPA (3.0% - 5.0% ABV).',
    judgeTip_es: 'Tip de Examen BJCP: Sugerir la categoría correcta en la que la cerveza habría ganado medalla demuestra excelencia y empatía en el juzgamiento.',
    judgeTip_en: 'BJCP Exam Tip: Suggesting the category where a beer could medal shows elite judging empathy and competence.'
  },
  {
    id: 'curated-scenario-03',
    category: 'scenarios',
    difficulty: 'hard',
    question_es: 'Al abrir una botella en competencia, la cerveza brota espontáneamente en espuma abundante ("gushing") y pierde carbonatación rápida. En cata, la cerveza está hiperatenuada (cuerpo acuoso) y presenta notas fenólicas medicinales no deseadas. ¿Cuál es la causa técnica más probable?',
    question_en: 'Upon opening a competition bottle, the beer gushes foam uncontrollably and loses effervescence. On tasting, it is super-attenuated (watery thin) with unwanted medicinal phenolic notes. What is the most probable root cause?',
    options_es: [
      'Contaminación por levaduras salvajes o variantes diastáticas (S. cerevisiae var. diastaticus) que consumen dextrinas',
      'Exceso de lúpulo añadido en el whirlpool que incrementa los puntos de nucleación de CO2 sin afectar la densidad',
      'Uso de agua con balance de sales orientado a cloruros que inhibe la floculación natural de las levaduras cerveceras',
      'Maceración a temperaturas elevadas (69-71°C) que produce exceso de azúcares no fermentables en el producto final'
    ],
    options_en: [
      'Contamination by wild yeast or diastatic variants (S. cerevisiae var. diastaticus) that ferment residual dextrins',
      'Excess whirlpool hops creating CO2 nucleation points in the bottle without altering terminal gravity',
      'Brewing water with high chloride-to-sulfate balance that inhibits natural yeast flocculation in package',
      'High temperature mashing (69-71°C) generating an excess of unfermentable sugars in the finished product'
    ],
    correctIndex: 0,
    explanation_es: 'El "gushing" acompañado de sobre-atenuación (densidad final por debajo de lo esperado) y fenoles medicinales es síntoma clásico de contaminación por cepas Diastaticus o levaduras salvajes que fermentan dextrinas residuales en la botella generando sobrepresión extrema.',
    explanation_en: 'Gushing accompanied by super-attenuation (gravity below target) and medicinal phenols is a classic sign of Diastaticus or wild yeast contamination consuming unfermentable dextrins in package.',
    judgeTip_es: 'Tip de Examen BJCP: El gushing no siempre es por exceso de azúcar de cebado; la sobre-atenuación con fenoles apunta a infección microbiológica.',
    judgeTip_en: 'BJCP Exam Tip: Gushing is not just over-priming; super-attenuation with off-phenols points to microbiological contamination.'
  },
  {
    id: 'curated-scenario-04',
    category: 'scenarios',
    difficulty: 'medium',
    question_es: 'Un juez evalúa una 18B American Pale Ale. En los primeros 10 segundos tras servir percibe un aroma a mantequilla tibia y palomitas de maíz. Al agitar la copa y calentarla con la mano, el aroma se intensifica y en boca siente una película aceitosa en el paladar. ¿Qué defecto es y cómo afecta la puntuación?',
    question_en: 'A judge evaluates an 18B American Pale Ale. In the first 10 seconds of pouring, warm butter and popcorn aroma is detected. Warming the glass intensifies it and leaves an oily film on the palate. What is this fault and how does it impact score?',
    options_es: [
      'Diacetilo (2,3-butanodiona): Es una falta grave en American Pale Ale que reduce el puntaje al rango Fair (< 25 pts)',
      'Acetaldehído: Es un éster frutal derivado de la fermentación limpia que permite mantener la cerveza en rango Excellent (> 38 pts)',
      'Sulfuro de Dimetilo (DMS): Es un compuesto azufrado volátil que solo debe penalizarse si persiste tras 15 minutos en copa',
      'Ácido Caprílico: Es un ácido graso de autólisis que no afecta el puntaje de sabor siempre que la espuma sea estable y densa'
    ],
    options_en: [
      'Diacetyl (2,3-butanedione): Severe flaw in American Pale Ale dropping the score to the Fair tier (< 25 pts)',
      'Acetaldehyde: Clean fermentation fruit ester that allows keeping the beer in the Excellent tier (> 38 pts)',
      'Dimethyl Sulfide (DMS): Volatile sulfur compound that should only be penalized if it persists after 15 minutes in glass',
      'Caprylic Acid: Fatty acid autolysis byproduct that does not impact flavor score as long as head retention is dense'
    ],
    correctIndex: 0,
    explanation_es: 'El diacetilo es un defecto descalificante en cervezas lupuladas americanas limpias. Afecta aroma (mantequilla), sabor (toffee rancio) y textura (sensación grasosa en boca), reduciendo sustancialmente el puntaje global.',
    explanation_en: 'Diacetyl is a disqualifying flaw in clean American hop-forward styles. It impairs aroma (butter), flavor (toffee), and mouthfeel (slick coat), heavily dropping the total score.',
    judgeTip_es: 'Tip de Examen BJCP: La sensación aceitosa / resbaladiza en el paladar es clave para confirmar diacetilo cuando el aroma es sutil.',
    judgeTip_en: 'BJCP Exam Tip: The slick, oily coat on the palate is vital to confirm diacetyl when aroma is subtle.'
  },
  {
    id: 'curated-scenario-05',
    category: 'scenarios',
    difficulty: 'hard',
    question_es: 'En una mesa de 3 jueces concurrida, el Juez 1 califica 39 pts, el Juez 2 califica 38 pts y el Juez 3 (Juez Aprendiz) califica 22 pts porque "personalmente no le gustan las cervezas oscuras y tostadas" en una categoría 15C Irish Extra Stout. ¿Cómo debe actuar el Table Captain (Capitán de Mesa)?',
    question_en: 'At a 3-judge table, Judge 1 scores 39, Judge 2 scores 38, and Judge 3 (Apprentice) scores 22 because "they personally dislike dark roasted beers" in category 15C Irish Extra Stout. How should the Table Captain handle this?',
    options_es: [
      'Orientar al Juez Aprendiz para evaluar según la guía BJCP separando gustos personales y calibrar en 37-39 pts',
      'Promediar directamente las tres notas en 33 puntos sin abrir debate técnico entre los miembros de la mesa',
      'Permitir que el Juez Aprendiz mantenga sus 22 puntos para asegurar diversidad estadística en la competencia',
      'Exigir a los Jueces 1 y 2 que reduzcan su calificación a 28 puntos para acercarse al criterio del juez novato'
    ],
    options_en: [
      'Mentor the Apprentice Judge to evaluate per BJCP guidelines setting aside personal bias and calibrate at 37-39 pts',
      'Directly average the three scores to 33 points without opening technical debate among table judges',
      'Allow the Apprentice Judge to keep their 22 score to ensure statistical diversity in the competition',
      'Require Judges 1 and 2 to reduce their scores down to 28 points to meet the novice judge halfway'
    ],
    correctIndex: 0,
    explanation_es: 'Una de las responsabilidades principales de los jueces certificados/seniores es mentorear a jueces novatos, enseñándoles a dejar de lado sesgos personales para evaluar objetivamente según la guía BJCP.',
    explanation_en: 'A core duty of senior/certified judges is mentoring novice judges, teaching them to separate personal preferences from objective evaluation against style guidelines.',
    judgeTip_es: 'Tip de Examen BJCP: Los sesgos personales ("no me gustan las cervezas amargas / ácidas / oscuras") violan el principio fundamental de la cata BJCP.',
    judgeTip_en: 'BJCP Exam Tip: Personal bias ("I dislike bitter/sour/dark beers") violates core BJCP judging ethics.'
  },
  {
    id: 'curated-scenario-06',
    category: 'scenarios',
    difficulty: 'medium',
    question_es: 'En una competencia de 800 muestras, un juez se da cuenta de que la siguiente cerveza en el flight de su mesa fue elaborada por su socio comercial en una cervecería donde tiene participación accionaria. ¿Qué debe hacer inmediatamente?',
    question_en: 'In an 800-entry competition, a judge notices the next beer in their table flight was brewed by their business partner in a brewery where they own equity. What must they do immediately?',
    options_es: [
      'Notificar al Table Captain y al Head Judge para recusarse de inmediato y solicitar un juez sustituto para ese vuelo',
      'Evaluar la muestra de forma anónima asignando 35 puntos para mantener una postura neutral que no levante sospechas',
      'Pedir a su compañero de mesa que juzgue la botella en solitario mientras él firma la hoja de cata como testigo',
      'Retirar la botella de la mesa y calificarla al final de la jornada cuando todos los vuelos hayan concluido'
    ],
    options_en: [
      'Notify the Table Captain and Head Judge to immediately recuse themselves and request a replacement judge for that flight',
      'Judge the entry anonymously assigning 35 points to maintain a neutral stance that avoids raising suspicion',
      'Ask the table co-judge to evaluate the bottle alone while co-signing the completed scoresheet as a witness',
      'Remove the bottle from the flight and evaluate it at the end of the day when all table sessions have concluded'
    ],
    correctIndex: 0,
    explanation_es: 'El Código de Ética BJCP exige la recusación inmediata ante cualquier conflicto de interés financiero, personal o comercial con una muestra inscrita.',
    explanation_en: 'The BJCP Code of Ethics mandates immediate recusal in the presence of any financial, personal, or commercial conflict of interest with an entry.',
    judgeTip_es: 'Tip de Examen BJCP: La transparencia y la integridad ética son evaluadas en el examen de juez y en la conducta oficial.',
    judgeTip_en: 'BJCP Exam Tip: Transparency and ethical integrity are actively tested on judge exams and official conduct.'
  },
  {
    id: 'curated-scenario-07',
    category: 'scenarios',
    difficulty: 'hard',
    question_es: 'Al finalizar un flight de 12 cervezas en categoría 21A American IPA, los dos jueces tienen empate técnico en el 1er lugar entre dos muestras excepcionales (ambas con 44 pts). ¿Cómo se resuelve oficialmente este desempate de mesa (Mini-BOS)?',
    question_en: 'At the end of a 12-beer flight in category 21A American IPA, both judges have a tie for 1st place between two exceptional entries (both scored 44 pts). How is this table tie-breaker (Mini-BOS) officially resolved?',
    options_es: [
      'Servir ambas muestras lado a lado en copas nuevas, comparar balance y fidelidad al estilo, y consensuar el 1er lugar',
      'Asignar el primer puesto a la muestra con menor graduación alcohólica para favorecer la tomabilidad de la cerveza',
      'Entregar dos medallas de oro compartidas en la mesa y omitir la entrega de la medalla de plata en la premiación',
      'Consultar la fecha de elaboración reportada en el formulario de inscripción para desempatar por frescura de lúpulo'
    ],
    options_en: [
      'Repour both entries side-by-side in fresh glassware, compare style balance fidelity, and consensus-rank 1st place',
      'Award 1st place to the entry with lower ABV strength to reward superior sessionability and drinkability',
      'Award two shared gold medals at the table and eliminate the silver medal presentation in the category',
      'Check the brew date declared on entry registration forms to break ties based on hop freshness'
    ],
    correctIndex: 0,
    explanation_es: 'En el Mini-BOS de mesa, las mejores cervezas se reevalúan en copas frescas una junto a la otra ("side-by-side") para definir el 1er, 2do y 3er lugar por consenso directo.',
    explanation_en: 'In table Mini-BOS, top beers are repoured into fresh glasses and evaluated side-by-side to determine 1st, 2nd, and 3rd places by consensus.',
    judgeTip_es: 'Tip de Examen BJCP: La evaluación "side-by-side" en Mini-BOS permite detectar matices de balance que definen una medalla de oro.',
    judgeTip_en: 'BJCP Exam Tip: Side-by-side Mini-BOS evaluation reveals subtle balance nuances that decide a gold medal.'
  },

  // ─────────────────────────────────────────────
  // 2. DISCRIMINACIÓN FINA DE ESTILOS HERMANOS (STYLES)
  // ─────────────────────────────────────────────
  {
    id: 'curated-style-comp-01',
    category: 'styles',
    difficulty: 'hard',
    question_es: '¿Cuáles son las diferencias sensoriales clave entre una 5D German Pils y una 3B Czech Premium Pale Lager según la guía BJCP?',
    question_en: 'What are the key sensory distinctions between a 5D German Pils and a 3B Czech Premium Pale Lager according to BJCP?',
    options_es: [
      'La German Pils es más seca, pálida y atenuada; la Czech es más dorada, con rica malta por decocción y bajo diacetilo aceptable',
      'La German Pils tiene mayor graduación alcohólica (6.5-7.5%) y marcado diacetilo; la Czech es completamente libre de lúpulo',
      'La Czech Premium Pale Lager utiliza lúpulos cítricos americanos con dry hopping intenso y agua con alta carga de sulfatos',
      'Ambos estilos son químicamente indistinguibles compartiendo los mismos parámetros exactos de SRM, IBU y fermentabilidad'
    ],
    options_en: [
      'German Pils is drier, paler, and more attenuated; Czech is deeper gold, richer malt via decoction and low diacetyl is acceptable',
      'German Pils has higher alcohol (6.5-7.5%) and prominent diacetyl; Czech is entirely devoid of hop bitterness',
      'Czech Premium Pale Lager utilizes American citrus hops with heavy dry hopping and high sulfate brewing water',
      'Both styles are chemically indistinguishable sharing identical SRM color, IBU bitterness, and attenuation targets'
    ],
    correctIndex: 0,
    explanation_es: 'La German Pils busca máxima atenuación, agua sulfatada y final seco y limpio. La Czech Premium Pale Lager (Bohemian Pilsner) tiene agua ultra blanda, malta rica por decocción, lúpulo Saaz floral y tolera una nota baja de diacetilo.',
    explanation_en: 'German Pils targets high attenuation, mineral water, and crisp dry bitterness. Czech Premium Pale Lager features ultra-soft water, decoction malt depth, spicy Saaz hops, and acceptable low diacetyl.',
    judgeTip_es: 'Tip de Examen BJCP: El diacetilo bajo es aceptable en Czech Premium Pale Lager pero es una falla en German Pils.',
    judgeTip_en: 'BJCP Exam Tip: Low diacetyl is acceptable in Czech Premium Pale Lager but is considered a flaw in German Pils.'
  },
  {
    id: 'curated-style-comp-02',
    category: 'styles',
    difficulty: 'medium',
    question_es: 'Al evaluar dos lagers alemanas ámbar tradicionales: 6A Märzen y 7A Vienna Lager, ¿qué rasgo distingue principalmente a la Märzen?',
    question_en: 'When evaluating two traditional amber German lagers: 6A Märzen and 7A Vienna Lager, what primary trait distinguishes Märzen?',
    options_es: [
      'La Märzen posee mayor graduación alcohólica (5.8-6.3%), cuerpo más pleno y notas a pan tostado; la Vienna es más ligera y seca',
      'La Märzen se caracteriza por una acidez láctica refrescante mientras que la Vienna Lager debe tener notas a café torrefacto',
      'La Vienna Lager se elabora exclusivamente con levadura de fermentación alta (Ale) y la Märzen con levadura de baja fermentación',
      'La Märzen debe presentar un amargor punzante de más de 50 IBU mientras que la Vienna Lager no supera los 10 IBU en cata'
    ],
    options_en: [
      'Märzen has higher alcohol (5.8-6.3%), fuller body, and rich bready malt; Vienna is lighter in strength with a drier finish',
      'Märzen is characterized by refreshing lactic tartness while Vienna Lager must display intense roasted coffee notes',
      'Vienna Lager is brewed exclusively with top-fermenting Ale yeast and Märzen is brewed with bottom-fermenting Lager yeast',
      'Märzen must feature assertive bitterness exceeding 50 IBU while Vienna Lager does not exceed 10 IBU in evaluation'
    ],
    correctIndex: 0,
    explanation_es: 'La Märzen es la cerveza festiva tradicional de mayor densidad y alcohol diseñada para el Oktoberfest histórico. La Vienna Lager es una cerveza de mesa más elegante, ligera y con final tostado más seco.',
    explanation_en: 'Märzen is the higher-strength festival beer brewed for historical Oktoberfest. Vienna Lager is a lighter, more elegant everyday amber lager with a drier toasty finish.',
    judgeTip_es: 'Tip de Examen BJCP: La Vienna Lager es más ligera y seca que una Märzen, pero más tostada y compleja que una Helles.',
    judgeTip_en: 'BJCP Exam Tip: Vienna Lager is lighter and drier than Märzen, but toastier than Helles.'
  },
  {
    id: 'curated-style-comp-03',
    category: 'styles',
    difficulty: 'hard',
    question_es: '¿Qué ingrediente tradicional y perfil sensorial distingue a una 23F Gose frente a una 23A Berliner Weisse?',
    question_en: 'What traditional ingredients and sensory profile distinguish a 23F Gose from a 23A Berliner Weisse?',
    options_es: [
      'La Gose incluye sal marina y semillas de cilantro con acidez láctica; la Berliner Weisse es puramente ácida y sin especias',
      'La Gose es una cerveza negra imperial de alta graduación; la Berliner Weisse es una lager rubia de baja fermentación',
      'La Berliner Weisse se caracteriza por lúpulos americanos en dry hopping; la Gose utiliza lúpulos nobles ahumados con turba',
      'La Gose no contiene trigo en su formulación mientras que la Berliner Weisse se elabora con 100% malta de trigo malteada'
    ],
    options_en: [
      'Gose includes sea salt and coriander seeds with lactic tartness; Berliner Weisse is pure clean lactic acidity with no spices',
      'Gose is a strong imperial dark ale; Berliner Weisse is a clean pale bottom-fermented German lager',
      'Berliner Weisse features heavy American dry hopping; Gose utilizes peat-smoked continental noble hop varieties',
      'Gose grist contains zero wheat while Berliner Weisse is formulated exclusively with 100% malted wheat grist'
    ],
    correctIndex: 0,
    explanation_es: 'La Gose histórica de Leipzig se caracteriza por su adición de sal mineral y semillas de cilantro, que redondean la acidez láctica y la carbonatación efervescente de trigo.',
    explanation_en: 'Historical Leipzig Gose features mineral salt and coriander seed additions, complementing lactic tartness and high effervescent wheat carbonation.',
    judgeTip_es: 'Tip de Examen BJCP: La sal en una Gose debe complementar la frescura en boca, no saber a agua de mar salada.',
    judgeTip_en: 'BJCP Exam Tip: Salt in a Gose should refresh and enhance mouthfeel, never taste like seawater brine.'
  },
  {
    id: 'curated-style-comp-04',
    category: 'styles',
    difficulty: 'hard',
    question_es: '¿Cómo se diferencian sensorialmente una 13C English Porter y una 20A American Porter?',
    question_en: 'How do an 13C English Porter and a 20A American Porter differ sensorially?',
    options_es: [
      'La English Porter es más suave con malta caramelo/nuez y lúpulo terroso; la American Porter tiene mayor ABV, amargor y lúpulo cítrico',
      'La English Porter tiene más de 8% ABV con café torrefacto intenso; la American Porter es ligera, rubia y sin tostado',
      'La American Porter se elabora con levadura lager a 10°C; la English Porter utiliza fermentación espontánea con Brettanomyces',
      'Ambos estilos son idénticos en perfil de lúpulo diferenciándose únicamente por el uso de avena en la versión inglesa'
    ],
    options_en: [
      'English Porter is milder with caramel/nutty malt and earthy hops; American Porter has higher ABV, roast, and citrusy hops',
      'English Porter exceeds 8% ABV with intense roast; American Porter is a light, pale golden beer with no roast',
      'American Porter is fermented with lager yeast at 10°C; English Porter utilizes spontaneous fermentation with Brettanomyces',
      'Both styles share identical hop profiles differing exclusively by the mandatory use of flaked oats in the British version'
    ],
    correctIndex: 0,
    explanation_es: 'Las versiones americanas de estilos clásicos británicos aumentan la intensidad alcohólica, el carácter torrefacto y el perfil de lúpulo cítrico/resinoso del Nuevo Mundo.',
    explanation_en: 'American adaptations of classic British styles elevate alcohol strength, roast character, and New World citrus/pine hop presence.',
    judgeTip_es: 'Tip de Examen BJCP: En English Porter el tostado es a chocolate con leche y nuez, nunca a quemado áspero o lúpulo cítrico punzante.',
    judgeTip_en: 'BJCP Exam Tip: English Porter features nutty, milk chocolate roast, never harsh burnt acridity or pungent citrus hops.'
  },
  {
    id: 'curated-style-comp-05',
    category: 'styles',
    difficulty: 'hard',
    question_es: '¿Qué distingue a una 25B Saison de una 26C Belgian Tripel en términos de perfil de fermentación y final en boca?',
    question_en: 'What distinguishes a 25B Saison from a 26C Belgian Tripel in terms of fermentation profile and finish?',
    options_es: [
      'La Saison es hiperatenuada con fenoles a pimienta y acidez cítrica; la Tripel es más alcohólica con ésteres frutales y final redondo',
      'La Saison es una cerveza negra opaca con malta chocolate; la Tripel es una cerveza ácida de trigo sin alcohol',
      'La Tripel fermenta a 12°C con levadura alemana limpia; la Saison fermenta con bacterias acéticas anaeróbicas en barrica',
      'La Saison debe presentar un cuerpo espeso y dulce por lactosa; la Tripel es completamente seca y con amargor ausente'
    ],
    options_en: [
      'Saison is hyper-attenuated with peppery phenols and tartness; Tripel is higher ABV with fruit esters and rounded finish',
      'Saison is an opaque black ale with chocolate malt; Tripel is a non-alcoholic lactic sour wheat beer',
      'Tripel ferments at 12°C with clean German lager yeast; Saison ferments with anaerobic acetic bacteria in wooden barrels',
      'Saison must display a heavy cloying body from lactose; Tripel is completely bone dry with absent hop bitterness'
    ],
    correctIndex: 0,
    explanation_es: 'La Saison belga tradicional de granja (Farmhouse Ale) destaca por su sequedad extrema (atenuación > 90%), fenoles especiados (pimienta) y alta carbonatación, mientras que la Tripel de abadía tiene mayor cuerpo, graduación y sofisticación frutal.',
    explanation_en: 'Belgian Farmhouse Saison is famed for extreme dryness (>90% attenuation), peppery phenols, and spritzy effervescence, whereas Abbey Tripel is richer, stronger, and more fruit-forward.',
    judgeTip_es: 'Tip de Examen BJCP: Una Saison con cuerpo denso o dulzor residual falla gravemente en la atenuación requerida.',
    judgeTip_en: 'BJCP Exam Tip: A Saison with heavy body or residual sweetness severely fails the core attenuation standard.'
  },
  {
    id: 'curated-style-comp-06',
    category: 'styles',
    difficulty: 'medium',
    question_es: 'Al comparar una 15A Irish Stout (Dry Stout) con una 16A Sweet Stout (Milk Stout), ¿cuál es el factor clave de formulación y cata que las diferencia?',
    question_en: 'Comparing a 15A Irish Stout (Dry Stout) with a 16A Sweet Stout (Milk Stout), what is the key formulation and tasting factor differentiating them?',
    options_es: [
      'La Irish Stout usa cebada tostada con final amargo seco a café solo; la Sweet Stout añade lactosa aportando dulzor cremoso',
      'La Irish Stout tiene color ámbar claro con bajo amargor; la Sweet Stout es negra azabache con lúpulo americano intenso',
      'La Sweet Stout fermenta con levadura lager a 8°C; la Irish Stout se elabora exclusivamente con trigo sin maltear',
      'Ambas comparten el mismo dulzor residual diferenciándose únicamente por el uso de nitrógeno en el servicio de barril'
    ],
    options_en: [
      'Irish Stout uses roasted barley with a dry black coffee finish; Sweet Stout adds lactose providing creamy sweetness',
      'Irish Stout is light amber in color with low bitterness; Sweet Stout is pitch black with intense American hops',
      'Sweet Stout is fermented with lager yeast at 8°C; Irish Stout is brewed exclusively with unmalted wheat grist',
      'Both share identical residual sweetness differing only by the use of nitrogen dispense gas at service'
    ],
    correctIndex: 0,
    explanation_es: 'La Irish Stout (Guinness clásica) es famosa por su amargor tostado seco a café solo. La Sweet Stout incorpora lactosa, que las levaduras cerveceras no pueden metabolizar, dejando un dulzor suave a chocolate con leche.',
    explanation_en: 'Irish Stout is defined by dry, bitter black coffee roast. Sweet Stout incorporates unfermentable lactose, leaving smooth, milky chocolate residual sweetness.',
    judgeTip_es: 'Tip de Examen BJCP: En Irish Stout el final debe ser amargo y seco, nunca dulce o empalagoso.',
    judgeTip_en: 'BJCP Exam Tip: Irish Stout finish must be dry and bitter, never sweet or cloying.'
  },
  {
    id: 'curated-style-comp-07',
    category: 'styles',
    difficulty: 'hard',
    question_es: '¿Cómo se distingue una 9A Doppelbock de una 9B Eisbock en una cata a ciegas según los parámetros BJCP?',
    question_en: 'How is a 9A Doppelbock distinguished from a 9B Eisbock in a blind tasting per BJCP guidelines?',
    options_es: [
      'La Eisbock es más concentrada (9.0-14.0% ABV) y licorosa por congelación; la Doppelbock tiene 7.0-10.0% ABV con mayor tomabilidad',
      'La Doppelbock es una cerveza de trigo ácida con frutas rojas; la Eisbock es una lager rubia de sesión con bajo alcohol',
      'La Eisbock presenta más de 90 IBU de lúpulo resinoso americano; la Doppelbock es una ale belga con azúcar candi oscuro',
      'Ambos estilos son idénticos en alcohol diferenciándose solo por el uso de malta ahumada en la formulación de la Eisbock'
    ],
    options_en: [
      'Eisbock is more concentrated (9.0-14.0% ABV) and syrupy from freeze-concentration; Doppelbock is 7.0-10.0% ABV with higher drinkability',
      'Doppelbock is a sour wheat ale with red fruit; Eisbock is a session pale lager with low alcohol strength',
      'Eisbock features over 90 IBU of piney American hops; Doppelbock is a Belgian abbey ale with dark candi sugar',
      'Both styles have identical alcohol differing only by the addition of beechwood-smoked malt in the Eisbock grist'
    ],
    correctIndex: 0,
    explanation_es: 'La Eisbock tradicional de Kulmbach se obtiene congelando una Doppelbock madura y retirando los cristales de hielo, concentrando alcohol, azúcares, color y cuerpo en un licor cervecero extraordinario.',
    explanation_en: 'Traditional Kulmbach Eisbock is created by freezing mature Doppelbock and removing ice crystals, concentrating alcohol, sugars, color, and body into a rich dessert-like beer.',
    judgeTip_es: 'Tip de Examen BJCP: La calidez de alcohol en una Eisbock debe ser suave y sedosa, nunca punzante, solvente o quemante.',
    judgeTip_en: 'BJCP Exam Tip: Alcohol warmth in Eisbock must be smooth and velvety, never hot, solventy, or burning.'
  },

  // ─────────────────────────────────────────────
  // 3. DEFECTOS, QUÍMICA & ACCIONES CORRECTIVAS (OFF-FLAVORS)
  // ─────────────────────────────────────────────
  {
    id: 'curated-fault-01',
    category: 'offflavors',
    difficulty: 'hard',
    question_es: 'Durante la cata de una English Bitter, el juez percibe un aroma a cartón mojado, papel húmedo y notas a jerez añejo con pérdida de frescura del lúpulo. ¿Cuál es el compuesto químico responsable y cómo prevenirlo?',
    question_en: 'During an English Bitter evaluation, the judge detects wet cardboard, stale paper, and sherry-like notes with dulled hop character. What is the chemical compound and how to prevent it?',
    options_es: [
      'Trans-2-nonenal (Oxidación): Evitar la incorporación de oxígeno disuelto en transferencias frías y purgar con CO2 al envasar',
      'Dimetilsulfuro (DMS): Hervir el mosto con la olla herméticamente tapada durante los primeros 45 minutos de cocción',
      'Diacetilo (2,3-butanodiona): Enfriar el fermentador a 0°C inmediatamente tras inocular la levadura en el mosto',
      'Ácido Butírico: Incrementar la dosis de sales de calcio para elevar el pH de maceración por encima de 6.2'
    ],
    options_en: [
      'Trans-2-nonenal (Oxidation): Minimize dissolved oxygen during cold-side transfers and purge bottles/kegs with CO2',
      'Dimethyl Sulfide (DMS): Boil wort with a tightly covered kettle lid during the first 45 minutes of the process',
      'Diacetyl (2,3-butanedione): Cold crash the fermenter to 0°C immediately upon pitching yeast into aerated wort',
      'Butyric Acid: Increase calcium salt dosage to elevate mashing pH values above 6.2 in the mash tun'
    ],
    correctIndex: 0,
    explanation_es: 'El trans-2-nonenal y los compuestos carbonílicos son los causantes del sabor a papel/cartón por oxidación en frío de los lípidos y alcoholes de la cerveza.',
    explanation_en: 'Trans-2-nonenal and carbonyl compounds produce cardboard/papery staling through cold-side oxidation of beer lipids and alcohols.',
    judgeTip_es: 'Tip de Examen BJCP: La oxidación apaga los aromas del lúpulo fresco y oscurece el color de cervezas claras.',
    judgeTip_en: 'BJCP Exam Tip: Oxidation dulls hop aromatics and darkens the color of pale beers.'
  },
  {
    id: 'curated-fault-02',
    category: 'offflavors',
    difficulty: 'medium',
    question_es: 'Una cerveza rubia presenta aroma a manzana verde recién cortada o calabaza cruda y una sensación áspera en garganta. ¿Qué defecto es y cuál es su causa técnica en cervecería?',
    question_en: 'A pale beer displays fresh green apple or raw pumpkin aroma with a harsh bite in the throat. What is this flaw and its technical brewing cause?',
    options_es: [
      'Acetaldehído: Cerveza verde retirada prematuramente de la levadura antes de completar el acondicionamiento final',
      'Mercaptano: Exceso de lúpulo aromático añadido en los primeros 10 minutos de hervor vigoroso en el bloque de cocción',
      'Ácido Isovalérico: Uso de maltas oscuras especiales con alto porcentaje de humedad durante el almacenamiento en bodega',
      'Éster de Plátano (Acetato de Isoamilo): Fermentación a temperaturas bajas (< 14°C) con levaduras ale tradicionales'
    ],
    options_en: [
      'Acetaldehyde: Green beer pulled prematurely from yeast before completing maturation and conditioning stages',
      'Mercaptan: Excess aroma hops added during the first 10 minutes of vigorous kettle boiling in the brewhouse',
      'Isovaleric Acid: Use of dark specialty malts with high moisture content during grain warehouse storage',
      'Banana Ester (Isoamyl Acetate): Low temperature fermentation (< 14°C) using traditional British ale strains'
    ],
    correctIndex: 0,
    explanation_es: 'El acetaldehído es el precursor inmediato del etanol. La levadura sana lo reabsorbe y convierte en alcohol al final de la fermentación; retirar la cerveza antes de tiempo ("cerveza verde") deja acetaldehído residual.',
    explanation_en: 'Acetaldehyde is the immediate precursor to ethanol. Healthy yeast reduces it to alcohol during conditioning; pulling beer off yeast too early leaves green apple notes.',
    judgeTip_es: 'Tip de Examen BJCP: El acetaldehído es común en cervezas jóvenes caseras y siempre penaliza la madurez técnica.',
    judgeTip_en: 'BJCP Exam Tip: Acetaldehyde is common in young homebrew and always indicates lack of proper conditioning.'
  },
  {
    id: 'curated-fault-03',
    category: 'offflavors',
    difficulty: 'hard',
    question_es: 'Al evaluar una cerveza servida en botella de vidrio transparente que estuvo expuesta a luz fluorescente en góndola, el juez percibe un aroma a zorrillo (skunky) o goma quemada de inmediato. ¿Qué compuesto químico se formó?',
    question_en: 'Evaluating a beer packaged in clear glass exposed to fluorescent supermarket lighting, the judge immediately detects skunky or rubbery notes. What chemical compound was formed?',
    options_es: [
      '3-metil-2-buteno-1-tiol (MBT): Reacción fotoquímica de las isohumulonas del lúpulo con riboflavinas bajo luz visible o UV',
      'Ácido Caprílico: Hidrólisis de lípidos celulares por maceración prolongada a pH inferior a 4.5 en el macerador',
      'Trans-2-nonenal: Descomposición oxidativa de proteínas de alto peso molecular durante la recirculación del mosto',
      'Sulfuro de Dimetilo: Síntesis enzimática de S-metilmetionina durante el enfriamiento rápido en intercambiador de placas'
    ],
    options_en: [
      '3-methyl-2-butene-1-thiol (MBT): Photochemical reaction of hop isohumulones with riboflavin under visible or UV light',
      'Caprylic Acid: Cellular lipid hydrolysis from extended mash rests below pH 4.5 in the mash conversion vessel',
      'Trans-2-nonenal: Oxidative breakdown of high molecular weight malt proteins during lautering recirculation',
      'Dimethyl Sulfide: Enzymatic synthesis of S-methylmethionine during rapid chilling in plate heat exchangers'
    ],
    correctIndex: 0,
    explanation_es: 'El "golpe de luz" (Lightstruck / Skunky) es generado por la molécula MBT (mercaptano del zorrillo), perceptible en concentraciones de partes por trillón tras pocos segundos de exposición a la luz en botellas claras o verdes.',
    explanation_en: 'Lightstruck (Skunky) flavor is caused by 3-methyl-2-butene-1-thiol (MBT), detectable in parts per trillion after mere seconds of light exposure in clear or green bottles.',
    judgeTip_es: 'Tip de Examen BJCP: Las botellas marrones/ámbar bloquean el 98% de la radiación UV/azul causante del MBT.',
    judgeTip_en: 'BJCP Exam Tip: Brown/amber bottles block 98% of the UV/blue light wavelengths that produce MBT.'
  },
  {
    id: 'curated-fault-04',
    category: 'offflavors',
    difficulty: 'medium',
    question_es: '¿Qué aroma y sabor genera el Dimetilsulfuro (DMS) y cuál es el procedimiento en bloque de cocción para evitarlo en lagers con alta proporción de malta Pilsner?',
    question_en: 'What aroma/flavor does Dimethyl Sulfide (DMS) produce and what brewhouse procedure prevents it in lagers with high Pilsner malt?',
    options_es: [
      'Maíz dulce o repollo cocido; se previene con un hervor vigoroso destapado de 75-90 min y enfriamiento rápido del mosto',
      'Vinagre acético penetrante; se previene añadiendo metabisulfito de potasio en el agua de maceración a 65°C',
      'Cuero húmedo y establo rústico; se previene mediante filtración con placas de celulosa antes del empaque',
      'Plátano maduro y clavo de olor; se previene inoculando levaduras lager a temperaturas superiores a 24°C'
    ],
    options_en: [
      'Sweet corn or cooked cabbage; prevented by vigorous uncovered 75-90 min boil and rapid wort chilling',
      'Pungent acetic vinegar; prevented by adding potassium metabisulfite into mashing liquor at 65°C',
      'Wet leather and barnyard horse blanket; prevented by depth filtration using cellulose filter pads',
      'Ripe banana and clove phenolics; prevented by pitching bottom-fermenting strains at temperatures above 24°C'
    ],
    correctIndex: 0,
    explanation_es: 'La malta Pilsner contiene altos niveles de S-metilmetionina (SMM), precursor del DMS. Hervir vigorosamente con la olla abierta volatiliza el DMS al vapor; enfriar rápido evita que el SMM residual se convierta en DMS caliente.',
    explanation_en: 'Pilsner malt contains high S-methylmethionine (SMM), precursor to DMS. A vigorous rolling boil with open kettle vents DMS into steam; rapid chilling stops hot-side SMM reversion.',
    judgeTip_es: 'Tip de Examen BJCP: Niveles muy bajos de DMS son comunes en lagers americanas comerciales, pero es una falla en lagers alemanas clásicas.',
    judgeTip_en: 'BJCP Exam Tip: Low DMS is common in American light lagers, but is considered a flaw in German lagers.'
  },
  {
    id: 'curated-fault-05',
    category: 'offflavors',
    difficulty: 'hard',
    question_es: 'Una cerveza de guarda presenta un intenso aroma a queso añejo rancio, pies sudorosos o calcetines usados. ¿Qué compuesto químico es y cuál fue la causa en la elaboración?',
    question_en: 'An aged beer exhibits pungent aroma of stale stinky cheese, sweaty feet, or old socks. What is this chemical compound and what was the brewing cause?',
    options_es: [
      'Ácido Isovalérico: Uso de lúpulos viejos y oxidados por mala conservación donde los alfa-ácidos se degradaron con calor',
      'Diacetilo: Fermentación de levadura ale a temperaturas inferiores a 12°C sin realizar descanso de maduración en tibio',
      'Ácido Butírico: Presencia de bacterias anaeróbicas Clostridium por maceración prolongada a temperatura ambiente',
      'Clorofenol: Reacción de desinfectantes clorados con los taninos solubles extraídos de las cáscaras de la malta'
    ],
    options_en: [
      'Isovaleric Acid: Use of old, oxidized hops from poor storage where alpha acids degraded via heat and oxygen',
      'Diacetyl: Ale yeast fermentation below 12°C without conducting a warm maturation diacetyl rest at terminal gravity',
      'Butyric Acid: Anaerobic Clostridium bacterial spoilage from extended sour mashing at ambient room temperatures',
      'Chlorophenol: Chlorine-based sanitizers reacting with soluble husk tannins extracted during sparging'
    ],
    correctIndex: 0,
    explanation_es: 'El ácido isovalérico se produce cuando los lúpulos envejecen y se oxidan por mala conservación (calor y oxígeno). En la mayoría de estilos es un defecto grave, aunque en Lambic tradicional con lúpulos viejos (surannés) es parcialmente metabolizado por Brettanomyces.',
    explanation_en: 'Isovaleric acid arises from aged, oxidized hops exposed to air and heat. In almost all styles it is a severe defect, except in traditional Lambic where Brettanomyces partially converts it.',
    judgeTip_es: 'Tip de Examen BJCP: Salvo en cervezas de fermentación espontánea (Lambic/Gueuze), el queso rancio penaliza severamente el aroma.',
    judgeTip_en: 'BJCP Exam Tip: Except in spontaneous Lambic/Gueuze, cheesy isovaleric acid heavily penalizes aroma.'
  },
  {
    id: 'curated-fault-06',
    category: 'offflavors',
    difficulty: 'medium',
    question_es: 'Al dar un sorbo a una muestra, el juez experimenta un intenso sabor a esparadrapo, jarabe para la tos medicinal, enjuague bucal y plástico quemado. ¿Qué compuesto es y cómo llegó a la cerveza?',
    question_en: 'Taking a sip of a sample, the judge experiences intense Band-Aid, medicinal cough syrup, mouthwash, and burnt plastic flavors. What compound is this and how did it enter the beer?',
    options_es: [
      'Clorofenol: Uso de agua municipal con cloro/cloraminas sin filtrar o contacto con desinfectantes a base de lejía/cloro',
      'Acetato de Etilo: Formación excesiva de solvente por fermentación a temperaturas descontroladas superiores a 32°C',
      'Sulfuro de Hidrógeno (H2S): Aroma a huevo podrido generado por levaduras estresadas con deficiencia de zinc y nitrógeno',
      'Melanoidinas: Compuestos aromáticos tostados generados por reacciones de Maillard durante hervidos vigorosos de mosto'
    ],
    options_en: [
      'Chlorophenol: Use of municipal chlorinated water without carbon filtration or contact with bleach sanitizers',
      'Ethyl Acetate: Excessive solvent formation from runaway fermentation temperatures exceeding 32°C in the cellar',
      'Hydrogen Sulfide (H2S): Rotten egg aroma synthesized by stressed yeast suffering from zinc and FAN nutrient deficiency',
      'Melanoidins: Rich toasty aromatic compounds synthesized via Maillard reactions during extended vigorous kettle boiling'
    ],
    correctIndex: 0,
    explanation_es: 'Los clorofenoles tienen un umbral de detección bajísimo (partes por billón). Se forman cuando el cloro o la cloramina del agua de grifo o de desinfectantes clorados reacciona con los polifenoles del grano.',
    explanation_en: 'Chlorophenols have an extremely low flavor threshold (ppb). They form when chlorine/chloramines in municipal water or bleach sanitizers bind to grain polyphenols.',
    judgeTip_es: 'Tip de Examen BJCP: El clorofenol a "curita / esparadrapo" es 100% prevenible con filtración por carbón activado o pastillas Campden (metabisulfito).',
    judgeTip_en: 'BJCP Exam Tip: Band-Aid chlorophenol is 100% preventable using activated carbon filtration or Campden tablets (metabisulfite).'
  },

  // ─────────────────────────────────────────────
  // 4. CIENCIA CERVECERA & QUÍMICA AVANZADA (PROCESSES)
  // ─────────────────────────────────────────────
  {
    id: 'curated-science-01',
    category: 'processes',
    difficulty: 'hard',
    question_es: '¿Por qué un pH de lavado de granos (sparge water) superior a 6.0 o una temperatura de lavado superior a 77°C - 80°C provoca defectos sensoriales en la cerveza final?',
    question_en: 'Why does sparge water with pH above 6.0 or temperatures exceeding 77°C - 80°C cause sensory defects in finished beer?',
    options_es: [
      'Provoca la extracción excesiva de polifenoles y taninos de las cáscaras de malta generando astringencia áspera y sequedad',
      'Convierte los azúcares fermentables en ácido láctico inhibiendo la atenuación de las levaduras en el fermentador',
      'Destruye la capacidad de la levadura de producir ésteres frutales durante las primeras 48 horas de fermentación',
      'Precipita completamente los iones de sulfato haciendo que la cerveza pierda toda percepción de amargor de lúpulo'
    ],
    options_en: [
      'Extracts excessive polyphenols and tannins from malt husks causing harsh astringency and puckering dryness',
      'Converts fermentable sugars into lactic acid inhibiting yeast attenuation kinetics inside fermentation tanks',
      'Destroys the biological capability of yeast to synthesize fruity esters during the primary 48-hour fermentation window',
      'Completely precipitates sulfate ions causing the finished beer to lose all perceived hop bitterness crispness'
    ],
    correctIndex: 0,
    explanation_es: 'El agua alcalina (pH > 6.0) y muy caliente solubiliza los taninos de la cáscara del grano, transfiriendo una sensación táctil de astringencia (como té negro sobre-infusionado) que arruina el balance.',
    explanation_en: 'Alkaline (pH > 6.0) and overly hot sparge water leaches husk polyphenols (tannins), imparting a harsh puckering astringency (like over-steeped black tea).',
    judgeTip_es: 'Tip de Examen BJCP: La astringencia es una sensación táctil en la boca, no un sabor básico; se evalúa en "Mouthfeel".',
    judgeTip_en: 'BJCP Exam Tip: Astringency is a tactile drying sensation, not a basic taste; evaluate it under Mouthfeel.'
  },
  {
    id: 'curated-science-02',
    category: 'processes',
    difficulty: 'medium',
    question_es: '¿Qué diferencia biológica fundamental existe entre la levadura ale (Saccharomyces cerevisiae) y la levadura lager (Saccharomyces pastorianus)?',
    question_en: 'What fundamental biological difference exists between ale yeast (Saccharomyces cerevisiae) and lager yeast (Saccharomyces pastorianus)?',
    options_es: [
      'S. cerevisiae fermenta a 18-22°C y no fermenta melibiosa; S. pastorianus fermenta a 8-12°C y metaboliza melibiosa y rafinosa',
      'S. pastorianus produce bacterias lácticas de forma natural mientras que S. cerevisiae sintetiza ácido acético volátil',
      'S. cerevisiae fermenta exclusivamente almidones de trigo mientras que S. pastorianus solo metaboliza cebada cervecera',
      'Ambas levaduras son clones genéticamente idénticos diferenciándose solo por la presión hidrostática del tanque fermentador'
    ],
    options_en: [
      'S. cerevisiae ferments at 18-22°C and cannot ferment melibiose; S. pastorianus ferments at 8-12°C and utilizes melibiose',
      'S. pastorianus naturally secretes lactic acid bacteria while S. cerevisiae synthesizes volatile acetic acid compounds',
      'S. cerevisiae metabolizes exclusively raw wheat starches while S. pastorianus can only ferment malted two-row barley',
      'Both yeast strains are genetically identical clones differing solely by the hydrostatic head pressure of the tank'
    ],
    correctIndex: 0,
    explanation_es: 'Saccharomyces pastorianus es un híbrido entre S. cerevisiae y S. eubayanus adaptado a fermentar limpiamente en frío y metabolizar azúcares complejos como la melibiosa.',
    explanation_en: 'Saccharomyces pastorianus is an interspecies hybrid (S. cerevisiae x S. eubayanus) evolved for clean cold fermentation and capable of utilizing melibiose.',
    judgeTip_es: 'Tip de Examen BJCP: Las levaduras lager fermentadas a temperaturas ale generan ésteres y alcoholes superiores inapropiados.',
    judgeTip_en: 'BJCP Exam Tip: Lager yeast fermented warm produces inappropriate esters and fusel alcohols.'
  },
  {
    id: 'curated-science-03',
    category: 'processes',
    difficulty: 'hard',
    question_es: '¿Qué función cumple la adición de sales de Calcio (Gypsum / Cloruro de Calcio) en el agua de maceración respecto al pH y la clarificación?',
    question_en: 'What role does Calcium salt addition (Gypsum / Calcium Chloride) play in mash water regarding pH and clarification?',
    options_es: [
      'El calcio reacciona con fosfatos de la malta bajando el pH a 5.2-5.6 y favorece la precipitación de proteínas y floculación',
      'El calcio incrementa el pH del macerado por encima de 7.0 para neutralizar los polifenoles amargos del lúpulo de amargor',
      'El calcio desnaturaliza las enzimas amilasas para garantizar que la cerveza conserve un cuerpo denso y dulce como almíbar',
      'El calcio aporta pigmentación oscura inmediata transformando el color del mosto de dorado pálido a marrón cobrizo'
    ],
    options_en: [
      'Calcium reacts with malt phosphates lowering pH to 5.2-5.6 and aids protein precipitation and yeast flocculation',
      'Calcium raises mashing pH values above 7.0 to neutralize harsh bitter polyphenols from early boil hop additions',
      'Calcium denatures amylase enzymes to ensure the finished beer retains heavy syrupy residual body and sweetness',
      'Calcium contributes instant dark pigmentation transforming wort color from pale golden to deep copper brown'
    ],
    correctIndex: 0,
    explanation_es: 'El catión Ca2+ precipita fosfatos de la malta liberando protones H+, lo que acidifica naturalmente el macerado hacia el rango 5.2 - 5.6 esencial para la actividad enzimática y la claridad.',
    explanation_en: 'Calcium ions react with malt phosphates releasing H+ ions, naturally lowering mash pH to the ideal 5.2 - 5.6 window for enzyme kinetics and hot break formation.',
    judgeTip_es: 'Tip de Examen BJCP: Un nivel mínimo de 50-100 ppm de calcio es fundamental para una maceración sana y cervezas brillantes.',
    judgeTip_en: 'BJCP Exam Tip: A minimum of 50-100 ppm Calcium is essential for healthy mashing and bright beer.'
  },
  {
    id: 'curated-science-04',
    category: 'processes',
    difficulty: 'medium',
    question_es: '¿Cuál es la reacción química responsable de la isomerización de los alfa-ácidos del lúpulo en iso-alfa-ácidos amargos solubles?',
    question_en: 'What chemical reaction is responsible for transforming hop alpha acids into soluble bitter iso-alpha acids?',
    options_es: [
      'Hervido térmico prolongado del mosto que reorganiza molecularmente la humulona en cis- y trans-isohumulonas solubles',
      'Fermentación anaeróbica en frío donde la levadura lager convierte la lupulona en alcoholes aromáticos amargos',
      'Oxidación enzimática de los beta-ácidos durante los primeros 3 días de contacto con lúpulo en dry hopping',
      'Maceración escalonada a 50°C donde las peptidasas degradan las resinas insolubles del lúpulo en aminoácidos'
    ],
    options_en: [
      'Extended thermal wort boil that molecularly rearranges humulone into soluble bitter cis- and trans-isohumulones',
      'Cold anaerobic fermentation where bottom-fermenting yeast metabolizes lupulone into bitter aromatic alcohols',
      'Enzymatic oxidation of hop beta acids during the initial 3 days of cold-side contact during cellar dry hopping',
      'Step mashing rests at 50°C where peptidase enzymes break down insoluble hop resins into assimilable amino acids'
    ],
    correctIndex: 0,
    explanation_es: 'Los alfa-ácidos (humulonas) son insolubles en agua fría. Requieren ebullición vigorosa en el hervidor para isomerizarse térmicamente en isohumulonas solubles que aportan el amargor medido en IBUs.',
    explanation_en: 'Alpha acids (humulones) are insoluble in cold water. They require vigorous kettle boiling to thermally isomerize into soluble isohumulones measured as IBUs.',
    judgeTip_es: 'Tip de Examen BJCP: La tasa de utilización del lúpulo disminuye en mostos de alta densidad inicial (OG alta).',
    judgeTip_en: 'BJCP Exam Tip: Hop utilization rate decreases in high gravity (high OG) worts.'
  }
];
