export interface OffFlavor {
  id: string;
  name_es: string;
  name_en: string;
  chemical: string;
  sensation_es: string;
  sensation_en: string;
  threshold: string;
  description_es: string;
  description_en: string;
  origin_es: string;
  origin_en: string;
  prevention_es: string;
  prevention_en: string;
}

export const OFF_FLAVORS_DATA: OffFlavor[] = [
  {
    id: "acetaldehyde",
    name_es: "Acetaldehído",
    name_en: "Acetaldehyde",
    chemical: "Ethanal",
    sensation_es: "Manzanas verdes, sidra, hojas verdes cortadas, pintura de látex.",
    sensation_en: "Green apples, cider, fresh-cut grass, latex paint.",
    threshold: "10 - 20 mg/L",
    description_es: "Un compuesto orgánico carbonílico intermedio en la fermentación alcohólica. Es producido por la levadura al convertir la glucosa en etanol, y también por la oxidación del etanol.",
    description_en: "An organic carbonyl compound formed as an intermediate during alcohol fermentation. Produced by yeast converting glucose to ethanol, and also by ethanol oxidation.",
    origin_es: "Normalmente aparece cuando la cerveza se retira demasiado rápido del contacto con la levadura antes de terminar la maduración, o por aireación/oxidación en etapas frías.",
    origin_en: "Typically caused by removing beer from yeast contact too early before maturation completes, or due to aeration/oxidation during cold stages.",
    prevention_es: "Permitir que la levadura repose ('descanso de diacetilo/acetaldehído'), asegurar una fermentación vigorosa y saludable, y evitar la introducción de oxígeno post-fermentación.",
    prevention_en: "Allow yeast to sit longer on the sediment (diacetyl/acetaldehyde rest), ensure vigorous and healthy yeast pitches, and strictly avoid introducing oxygen post-fermentation."
  },
  {
    id: "diacetyl",
    name_es: "Diacetilo",
    name_en: "Diacetyl",
    chemical: "2,3-butanedione",
    sensation_es: "Mantequilla, palomitas de maíz con mantequilla, toffee, textura aceitosa.",
    sensation_en: "Butter, buttered popcorn, butterscotch, slick/oily mouthfeel.",
    threshold: "0.1 - 0.2 mg/L",
    description_es: "Una dicetona vecinal producida por la levadura durante la fermentación como subproducto de la síntesis de valina, que luego es reabsorbida y reducida por la levadura saludable.",
    description_en: "A vicinal diketone produced by yeast during fermentation as a byproduct of valine synthesis, which is later reabsorbed and reduced by healthy yeast.",
    origin_es: "Fermentación incompleta, levadura poco saludable, bajas temperaturas al final de la fermentación, o contaminación bacteriana por bacterias del ácido láctico (Pediococcus/Lactobacillus).",
    origin_en: "Incomplete fermentation, unhealthy or underpitched yeast, low temperatures at the end of fermentation, or bacterial contamination by lactic acid bacteria (Pediococcus/Lactobacillus).",
    prevention_es: "Aumentar la temperatura 2-3°C al final de la fermentación para un descanso de diacetilo, usar levadura sana y en cantidad adecuada, y mantener una higiene rigurosa.",
    prevention_en: "Raise fermentation temperature by 2-3°C at the end of fermentation for a diacetyl rest, use healthy and adequate yeast pitches, and practice rigorous sanitation."
  },
  {
    id: "dms",
    name_es: "DMS (Dimetil Sulfuro)",
    name_en: "DMS (Dimethyl Sulfide)",
    chemical: "Dimethyl sulfide",
    sensation_es: "Maíz dulce cocido, conserva de maíz, repollo, salsa de tomate.",
    sensation_en: "Sweet cooked corn, canned corn, cooked cabbage, tomato juice.",
    threshold: "0.03 - 0.05 mg/L",
    description_es: "Un compuesto de azufre orgánico volátil derivado del aminoácido S-metilmetionina (SMM), que se produce en el malteado de cebada (especialmente en maltas Pilsner claras).",
    description_en: "A volatile organic sulfur compound derived from the amino acid S-methylmethionine (SMM), produced during barley malting (especially in light Pilsner malts).",
    origin_es: "Hervido débil o corto del mosto, enfriamiento lento del mosto caliente (donde el SMM continúa convirtiéndose en DMS sin evaporarse), o infección bacteriana.",
    origin_en: "Weak or short boil of the wort, slow cooling of hot wort (allowing SMM to continue converting to DMS without evaporation), or bacterial infection.",
    prevention_es: "Hervir vigorosamente el mosto sin tapa durante al menos 60-90 minutos, enfriar el mosto lo más rápido posible, y mantener la asepsia en el fermentador.",
    prevention_en: "Boil the wort vigorously and uncovered for at least 60-90 minutes, cool the wort as rapidly as possible, and ensure sanitization in the fermenter."
  },
  {
    id: "lightstruck",
    name_es: "Luz / Azorrillado",
    name_en: "Lightstruck / Skunky",
    chemical: "3-methyl-2-butene-1-thiol (MBT)",
    sensation_es: "Almizcle de zorrillo, azufrado, caucho quemado, similar al lúpulo rancio.",
    sensation_en: "Skunky, mercaptan-like, burnt rubber, similar to stale hops.",
    threshold: "0.05 - 4.0 µg/L",
    description_es: "Un tiol extremadamente potente formado cuando las isohumulonas (ácidos alfa isomerizados del lúpulo) reaccionan con la luz ultravioleta o azul en presencia de riboflavina.",
    description_en: "An extremely potent thiol formed when isohumulones (isomerized alpha acids from hops) react with ultraviolet or blue light in the presence of riboflavin.",
    origin_es: "Exposición directa de la cerveza a la luz solar o luces fluorescentes en botellas transparentes o verdes, o vasos servidos expuestos al sol.",
    origin_en: "Direct exposure of beer to sunlight or fluorescent lights in clear or green glass bottles, or pint glasses served in direct sun.",
    prevention_es: "Utilizar botellas de vidrio de color marrón oscuro, latas de aluminio, barriles de acero, o mantener el almacenamiento de las botellas en absoluta oscuridad.",
    prevention_en: "Use dark brown glass bottles, aluminum cans, or steel kegs, and store packaged bottles in absolute darkness."
  },
  {
    id: "oxidation",
    name_es: "Oxidación / Cartón",
    name_en: "Oxidation / Cardboard",
    chemical: "trans-2-nonenal",
    sensation_es: "Cartón mojado, papel viejo, jerez, madera seca, pérdida de frescura.",
    sensation_en: "Wet cardboard, old paper, sherry-like, stale pineapple, loss of hop aroma.",
    threshold: "0.05 - 0.2 µg/L",
    description_es: "Un aldehído insaturado que se produce por la degradación oxidativa de los ácidos grasos de la malta y por reacciones de Maillard y melanoidinas a lo largo del tiempo.",
    description_en: "An unsaturated aldehyde produced by the oxidative degradation of malt fatty acids, Maillard reactions, and melanoidins over time.",
    origin_es: "Introducción de aire (oxígeno) caliente o frío en el mosto o cerveza terminada durante trasvases, embotellado, o por almacenamiento prolongado a altas temperaturas.",
    origin_en: "Introduction of air (oxygen) to hot or cold wort/beer during transfers, bottling, or due to prolonged warm storage conditions.",
    prevention_es: "Evitar salpicaduras post-hervido, purgar con CO2 todos los envases de transferencia, embotellar con mínimos espacios de aire, y almacenar la cerveza en frío.",
    prevention_en: "Avoid splashing post-boil, purge all transfer vessels and packages with CO2, minimize head space oxygen during bottling, and store beer cold."
  },
  {
    id: "phenolic",
    name_es: "Fenólico / Medicinal / Clavo de olor",
    name_en: "Phenolic / Medicine / Clove",
    chemical: "4-vinyl guaiacol (4-VG) / Chlorophenols",
    sensation_es: "Clavo de olor, tirita plástica (Band-Aid), humo, desinfectante, plástico quemado.",
    sensation_en: "Clove-like, Band-Aid, smoky, medicinal, antiseptic, burnt plastic.",
    threshold: "0.05 - 0.2 mg/L",
    description_es: "Compuestos aromáticos derivados de fenoles volátiles. El 4-VG es normal en cervezas de trigo alemanas y belgas, pero los clorofenoles son siempre defectos agresivos.",
    description_en: "Aromatic compounds derived from volatile phenols. 4-VG is style-appropriate in German Weizen and Belgian ales, but chlorophenols are always severe flaws.",
    origin_es: "Uso de agua clorada para el lavado o elaboración, enjuague deficiente de sanitizantes clorados, o infección por levaduras salvajes (POF+).",
    origin_en: "Use of chlorinated tap water for brewing/washing, poor rinsing of chlorine-based sanitizers, or wild yeast infection (POF+).",
    prevention_es: "Filtrar el agua de red con carbón activo para remover cloro/cloraminas, evitar sanitizantes con cloro, y asegurar una levadura de cultivo pura libre de levaduras salvajes.",
    prevention_en: "Filter brewing water through active carbon to remove chlorine/chloramines, avoid chlorine sanitizers, and ensure pure yeast cultures free from wild contaminants."
  },
  {
    id: "solvent",
    name_es: "Solvente / Acetato de Etilo",
    name_en: "Solvent / Ethyl Acetate",
    chemical: "Ethyl acetate / Fusel alcohols",
    sensation_es: "Disolvente de pintura, quitaesmalte (acetona), picor caliente en la garganta.",
    sensation_en: "Paint thinner, nail polish remover (acetone), hot/burning throat burn.",
    threshold: "20 - 30 mg/L",
    description_es: "Un éster producido por la esterificación de ácidos orgánicos y alcoholes a temperaturas elevadas de fermentación, a menudo acompañado de alcoholes superiores (fusel).",
    description_en: "An ester produced by the esterification of organic acids and alcohols at elevated fermentation temperatures, often accompanied by higher (fusel) alcohols.",
    origin_es: "Temperaturas de fermentación excesivamente altas (fuera del rango de la levadura), falta de nutrientes para la levadura, o subinoculación severa.",
    origin_en: "Excessively high fermentation temperatures (above yeast tolerance), lack of yeast nutrients, or severe underpitching.",
    prevention_es: "Controlar estrictamente la temperatura de fermentación en el rango óptimo del estilo, oxigenar adecuadamente el mosto inicial y alimentar la levadura.",
    prevention_en: "Strictly control fermentation temperatures within the yeast strain's optimal range, adequately oxygenate initial wort, and pitch sufficient healthy yeast."
  },
  {
    id: "metallic",
    name_es: "Metálico",
    name_en: "Metallic",
    chemical: "Ferrous sulfate / 1-octen-3-one",
    sensation_es: "Moneda de cobre, sangre, hierro, sabor a chapa o lata, sequedad metálica.",
    sensation_en: "Copper coin, blood, iron, tinny flavor, metallic dryness.",
    threshold: "1.0 - 1.5 mg/L",
    description_es: "Una sensación química metálica en la boca debida a la presencia de iones metálicos solubles disueltos en el mosto o cerveza, u oxidación de lípidos.",
    description_en: "A chemical metallic mouthfeel caused by soluble metal ions dissolved in the wort or beer, or lipid oxidation.",
    origin_es: "Contacto del mosto ácido caliente con metales reactivos (hierro, cobre no pasivado, acero con soldaduras deficientes), o agua con alta concentración de hierro.",
    origin_en: "Contact of hot, acidic wort with reactive metals (iron, unpassivated copper, steel with poor welds), or water with high iron content.",
    prevention_es: "Utilizar únicamente equipos de grado alimenticio de acero inoxidable de alta calidad, pasivar el acero inoxidable, y filtrar el hierro del agua.",
    prevention_en: "Use only food-grade high-quality stainless steel brewing equipment, passivate stainless vessels, and filter iron from the brewing water supply."
  },
  {
    id: "sour",
    name_es: "Agrio / Ácido",
    name_en: "Sour / Acidic",
    chemical: "Lactic acid / Acetic acid",
    sensation_es: "Ácido limpio (yogur, limón) o agrio volátil (vinagre, sidra agria), ardor salival.",
    sensation_en: "Clean sourness (yogurt, lemon) or volatile sourness (vinegar, sour cider), salivary watering.",
    threshold: "10 - 20 mg/L",
    description_es: "Una acidez orgánica pronunciada que reduce el pH de la cerveza. Es deseable en estilos agrios históricos (Berliner Weisse, Lambics) pero un defecto grave en otros.",
    description_en: "A pronounced organic acidity lowering the beer's pH. Desirable in historical sour styles (Berliner Weisse, Lambic) but a severe defect in clean beers.",
    origin_es: "Infección bacteriana por bacterias productoras de ácido láctico (Lactobacillus, Pediococcus) o ácido acético (Acetobacter), o fermentación con Brettanomyces con oxígeno.",
    origin_en: "Bacterial infection by lactic acid-producing bacteria (Lactobacillus, Pediococcus) or acetic acid bacteria (Acetobacter), or Brettanomyces fermentation exposed to oxygen.",
    prevention_es: "Mantener una higiene impecable en mangueras, válvulas y fermentadores, purgar con CO2 para evitar Acetobacter, y enfriar rápidamente el mosto.",
    prevention_en: "Maintain impeccable sanitation on hoses, valves, and fermenters, purge with CO2 to avoid Acetobacter (aerobic), and cool wort quickly to pitch clean yeast."
  },
  {
    id: "yeasty",
    name_es: "Levadura / Autólisis",
    name_en: "Yeasty / Autolysis",
    chemical: "Yeast autolysate",
    sensation_es: "Pan crudo, levadura de panadero, caldo de carne, salsa de soja, neumático viejo.",
    sensation_en: "Raw dough, baker's yeast, meaty broth, soy sauce, old tires.",
    threshold: "Varies by strain",
    description_es: "Sensación polvorienta provocada por levadura en suspensión, o sabor cárnico profundo por autólisis (cuando las células de levadura mueren y se rompen).",
    description_en: "Powdery mouthfeel from suspended yeast, or a deep savory/meaty flavor from autolysis (when old yeast cells die and rupture their walls).",
    origin_es: "Servir cerveza turbia con sedimento pesado de levadura, o dejar la cerveza terminada en contacto con el sedimento durante meses a temperaturas cálidas.",
    origin_en: "Serving turbid beer with heavy yeast sediment, or leaving finished beer in contact with the yeast cake for months under warm conditions.",
    prevention_es: "Favorecer la floculación de la levadura mediante frío (cold crash), trasvasar la cerveza limpia fuera de la torta de levadura, y evitar almacenamientos prolongados.",
    prevention_en: "Foster yeast flocculation using cold crashing, rack clean beer off the yeast cake once fermentation finishes, and avoid prolonged warm bulk storage."
  }
];

export function getOffFlavors(lang: 'es' | 'en'): {
  id: string;
  name: string;
  chemical: string;
  sensation: string;
  threshold: string;
  description: string;
  origin: string;
  prevention: string;
}[] {
  return OFF_FLAVORS_DATA.map(o => ({
    id: o.id,
    name: lang === 'es' ? o.name_es : o.name_en,
    chemical: o.chemical,
    sensation: lang === 'es' ? o.sensation_es : o.sensation_en,
    threshold: o.threshold,
    description: lang === 'es' ? o.description_es : o.description_en,
    origin: lang === 'es' ? o.origin_es : o.origin_en,
    prevention: lang === 'es' ? o.prevention_es : o.prevention_en
  }));
}
