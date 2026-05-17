export interface VitalStats {
  og: string; // Original Gravity range (e.g. "1.040 - 1.050")
  fg: string; // Final Gravity range (e.g. "1.008 - 1.012")
  abv: string; // Alcohol by Volume range (e.g. "4.2% - 5.3%")
  ibu: string; // Bitterness range (e.g. "8 - 12")
  srm: string; // Color range (e.g. "2 - 4")
}

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
  // Numerical values for sliders/filters
  abvMin: number;
  abvMax: number;
  ibuMin: number;
  ibuMax: number;
  srmMin: number;
  srmMax: number;
  commercialExamples: string[];
  tags: string[];
}

export interface BJCPCategory {
  id: string; // e.g. "21"
  name: string; // e.g. "IPA"
  styles: BeerStyle[];
}

export const BJCP_2021_DATA: BeerStyle[] = [
  {
    id: "1A",
    name: "American Light Lager",
    category: "1. Standard American Beer",
    overallImpression: "Muy ligera en cuerpo, altamente carbonatada y de sabor sumamente neutro. Diseñada para servirse extremadamente fría y ser altamente refrescante y saciadora de la sed.",
    aroma: "Aroma a malta muy bajo o ausente, aunque puede tener un ligero aroma a grano o maíz si está presente. El aroma a lúpulo es de ausente a muy bajo, con un carácter floral o especiado si es perceptible.",
    appearance: "Color pajizo muy pálido a amarillo claro. Cabeza de espuma blanca y poco persistente. Muy brillante y de claridad cristalina.",
    flavor: "Sabor a malta de muy bajo a ausente, con un dulzor de grano muy ligero. Sabor a lúpulo ausente a muy bajo. Amargor de lúpulo muy bajo. Balance sumamente seco y limpio.",
    mouthfeel: "Cuerpo muy ligero, a menudo acuoso. Carbonatación muy alta. Sensación limpia sin astringencia.",
    comments: "Diseñada para atraer al público más amplio posible. Sabores fuertes o pronunciados se consideran defectos.",
    history: "Coors lanzó al mercado una cerveza ligera con éxito comercial a finales de la década de 1940, pero Miller Lite creó la categoría moderna a mediados de la década de 1970.",
    comparison: "Una versión más ligera en cuerpo, alcohol y calorías que una American Lager estándar.",
    ingredients: "Malta de cebada de dos o seis hileras con hasta un 40% de arroz o maíz como adjuntos. Enzimas añadidas para reducir los carbohidratos no fermentables.",
    vitalStatistics: {
      og: "1.028 - 1.040",
      fg: "0.998 - 1.008",
      abv: "2.8% - 4.2%",
      ibu: "8 - 12",
      srm: "2 - 3"
    },
    abvMin: 2.8,
    abvMax: 4.2,
    ibuMin: 8,
    ibuMax: 12,
    srmMin: 2,
    srmMax: 3,
    commercialExamples: ["Bud Light", "Coors Light", "Miller Lite", "Michelob Ultra"],
    tags: ["lager", "pálida", "ligera", "refrescante", "adjuntos", "balanceada"]
  },
  {
    id: "3B",
    name: "Czech Premium Pale Lager",
    category: "3. Czech Lager",
    overallImpression: "Una lager de color dorado, rica en malta y con un carácter a lúpulo aromático muy prominente. Con un cuerpo medio-pleno y un amargor característico pero noble.",
    aroma: "Rico carácter a malta de pan o tostado. Aroma a lúpulo Saaz de medio a alto, con notas florales, especiadas o herbales. Perfil de fermentación muy limpio.",
    appearance: "Color dorado claro a dorado profundo. Claridad brillante y cristalina. Cabeza de espuma densa, cremosa, blanca y de larga duración.",
    flavor: "Rico sabor a malta maltosa y de pan, con un amargor de lúpulo firme pero redondo. El final es marcadamente lupulado con el sabor a lúpulo Saaz persistente.",
    mouthfeel: "Cuerpo medio. Carbonatación de media a baja. Muy suave y de textura sedosa.",
    comments: "Localmente en la República Checa se le conoce como \"Světlý Ležák\". Es el estilo que definió a las cervezas tipo Pilsner a nivel mundial.",
    history: "Creada por primera vez por el cervecero Josef Groll en la ciudad de Pilsen (Plzeň) en 1842, revolucionando la industria de la cerveza con el color dorado y la claridad.",
    comparison: "Tiene más cuerpo, riqueza maltosa y un carácter de lúpulo más redondo y pronunciado que una Pilsner Alemana.",
    ingredients: "Malta Pilsner checa de dos hileras, agua sumamente blanda de Pilsen, lúpulo Saaz tradicional, levadura lager de fermentación baja y decocción en el proceso de maceración.",
    vitalStatistics: {
      og: "1.044 - 1.060",
      fg: "1.013 - 1.017",
      abv: "4.2% - 5.8%",
      ibu: "30 - 45",
      srm: "3.5 - 6"
    },
    abvMin: 4.2,
    abvMax: 5.8,
    ibuMin: 30,
    ibuMax: 45,
    srmMin: 3.5,
    srmMax: 6,
    commercialExamples: ["Pilsner Urquell", "Budweiser Budvar", "Bernard Czech Lager"],
    tags: ["lager", "dorada", "lúpulo saaz", "amarga", "maltosa", "checa"]
  },
  {
    id: "10A",
    name: "German Weissbier",
    category: "10. German Wheat Beer",
    overallImpression: "Una cerveza de trigo alemana pálida y refrescante con una alta carbonatación, final seco, sensación en boca esponjosa y un perfil distintivo a banana y clavo de olor.",
    aroma: "Fenoles de clavo de olor y ésteres frutales de banana de moderados a fuertes. Aroma a trigo de bajo a moderado (a pan o masa). Sin aroma a lúpulo. Sin diacetilo.",
    appearance: "Color amarillo pálido a dorado profundo. Muy turbia debido a la levadura en suspensión (hefeweizen). Cabeza de espuma blanca, densa, muy alta y de larga duración.",
    flavor: "Sabor a banana y clavo de olor de moderados a fuertes. Sabor a trigo dulce, de pan o grano. Amargor de lúpulo extremadamente bajo, con balance maltoso pero final seco.",
    mouthfeel: "Cuerpo medio-ligero a medio. Sensación en boca muy esponjosa, cremosa y suave. Carbonatación de efervescente a muy alta.",
    comments: "También conocida como Hefeweizen o Weizenbier. Se sirve tradicionalmente agitando la botella al final para incorporar la levadura sedimentada.",
    history: "Baviera tiene una larga tradición de cervezas de trigo. Originalmente era un monopolio real de la casa noble de los Wittelsbach antes de expandirse al público.",
    comparison: "Más pálida, con más banana y clavo de olor, y mucho menos amargor que una Witbier belga o una American Wheat Beer.",
    ingredients: "Al menos un 50% de trigo malteado (a menudo del 60% al 70%), el resto es malta Pilsner. Levadura de trigo de fermentación alta específica que produce los ésteres y fenoles típicos.",
    vitalStatistics: {
      og: "1.044 - 1.052",
      fg: "1.010 - 1.014",
      abv: "4.3% - 5.6%",
      ibu: "8 - 15",
      srm: "2 - 6"
    },
    abvMin: 4.3,
    abvMax: 5.6,
    ibuMin: 8,
    ibuMax: 15,
    srmMin: 2,
    srmMax: 6,
    commercialExamples: ["Weihenstephaner Hefeweissbier", "Schneider Weisse Original", "Paulaner Hefe-Weißbier"],
    tags: ["ale", "trigo", "banana", "clavo", "turbia", "alemana", "esponjosa"]
  },
  {
    id: "15B",
    name: "Irish Stout",
    category: "15. Irish Beer",
    overallImpression: "Una cerveza negra muy oscura con un marcado sabor tostado similar al café y al cacao, con un amargor de lúpulo medio a alto y un final seco muy balanceado.",
    aroma: "Aroma a cebada tostada de moderado a alto, que suele recordar al café. Puede tener un ligero aroma a chocolate o cacao. Aroma a lúpulo ausente o de muy bajo a terroso.",
    appearance: "Color negro azabache a marrón muy oscuro. Claridad opaca. Cabeza de espuma de color canela (crema/beige) a marrón claro, muy densa y cremosa.",
    flavor: "Sabor moderado a fuerte a cebada tostada y café, con un carácter seco y tostado en el paladar. Amargor de lúpulo medio-alto que se funde con el carácter quemado para dar un balance seco.",
    mouthfeel: "Cuerpo medio-ligero a medio, con un carácter cremoso. Carbonatación de media-baja a media. Sensación en boca suave.",
    comments: "La versión comercial de barril suele servirse con nitrógeno para crear una cabeza de espuma densa y una textura aterciopelada extrema.",
    history: "El estilo evolucionó a partir de las porter de Londres a finales del siglo XVIII en Irlanda, popularizado masivamente por la cervecería Arthur Guinness en Dublín.",
    comparison: "Más seca, de cuerpo más ligero y con un carácter tostado a cebada (café) mucho más seco y nítido que una Sweet Stout u Oatmeal Stout.",
    ingredients: "Malta Pale Ale, cebada tostada sin maltear (que le da el color oscuro y el carácter seco de café), malta de cebada caramelizada y copos de cebada para mayor cuerpo.",
    vitalStatistics: {
      og: "1.036 - 1.044",
      fg: "1.007 - 1.011",
      abv: "4.0% - 4.5%",
      ibu: "25 - 45",
      srm: "25 - 40"
    },
    abvMin: 4.0,
    abvMax: 4.5,
    ibuMin: 25,
    ibuMax: 45,
    srmMin: 25,
    srmMax: 40,
    commercialExamples: ["Guinness Draught", "Murphy's Irish Stout", "O'Hara's Celtic Stout"],
    tags: ["ale", "negra", "tostada", "café", "cremosa", "irlandesa", "seca"]
  },
  {
    id: "21A",
    name: "American IPA",
    category: "21. IPA",
    overallImpression: "Una ale de color dorado a ámbar claro, decididamente amarga y aromática, exhibiendo notas intensas a lúpulos modernos americanos o del nuevo mundo (cítricos, resinosos, tropicales).",
    aroma: "Aroma a lúpulo intenso de medio-alto a muy alto, con descriptores como pomelo, pino, mango, maracuyá y frutas de carozo. Dulzor de malta limpio muy bajo de fondo.",
    appearance: "Color dorado a ámbar cobrizo claro. Claridad brillante, aunque las versiones sin filtrar o con Dry Hopping masivo pueden tener cierta turbidez. Cabeza de espuma persistente.",
    flavor: "Sabor a lúpulo de medio a muy alto, reflejando el carácter de frutas cítricas, resina y frutas tropicales. Amargor de lúpulo muy alto, con un final seco y retrogusto amargo.",
    mouthfeel: "Cuerpo medio-ligero a medio, con textura suave. Carbonatación de media a media-alta. Un ligero calor alcohólico es aceptable si es de alta graduación.",
    comments: "El estilo insignia de la revolución de la cerveza artesanal americana. Se presta para muchas variaciones regionales o adiciones de lúpulo (Dry Hopping).",
    history: "Inspirada en las IPAs tradicionales inglesas pero usando lúpulos de la costa oeste americana (como Cascade, Centennial, Chinook). Anchor Liberty Ale (1975) es considerada la pionera.",
    comparison: "Más fuerte, con más alcohol y significativamente más lupulada y amarga que una American Pale Ale estándar. Con menos caramelo y malta que una English IPA.",
    ingredients: "Malta pale de dos hileras de base, pequeñas cantidades de maltas caramelo o cristal. Variedad masiva de lúpulos americanos modernos (Citra, Mosaic, Simcoe, Cascade, Amarillo).",
    vitalStatistics: {
      og: "1.056 - 1.070",
      fg: "1.008 - 1.014",
      abv: "6.0% - 7.5%",
      ibu: "40 - 70",
      srm: "6 - 14"
    },
    abvMin: 6.0,
    abvMax: 7.5,
    ibuMin: 40,
    ibuMax: 70,
    srmMin: 6,
    srmMax: 14,
    commercialExamples: ["Bell's Two Hearted Ale", "Stone IPA", "Sierra Nevada Torpedo Extra IPA"],
    tags: ["ale", "dorada", "lúpulo americano", "cítrica", "amarga", "dry hopping"]
  },
  {
    id: "25B",
    name: "Saison",
    category: "25. Strong Belgian Ale",
    overallImpression: "Una ale de granja de color dorado a ámbar claro, sumamente atenuada (muy seca), con una alta carbonatación, notas frutales a cítricos, y un carácter rústico y especiado a pimienta.",
    aroma: "Perfil de levadura complejo con aromas frutales pronunciados (cítricos, manzana) y especiados (pimienta negra, clavo). Aroma a lúpulo de bajo a medio (especiado o floral).",
    appearance: "Color dorado pálido a ámbar anaranjado. Cabeza de espuma blanca, extremadamente alta y rocosa, muy persistente. Turbidez de baja a moderada.",
    flavor: "Sabor especiado de levadura a pimienta y ésteres frutales (naranja, limón). Amargor de lúpulo de medio a alto. El final es sumamente seco, crujiente e impecable.",
    mouthfeel: "Cuerpo ligero a medio-ligero. Carbonatación sumamente alta efervescente. Sensación efervescente y cosquilleante en la lengua debido a la carbonatación.",
    comments: "Tradicionalmente asociada a las granjas de Valonia (región francófona de Bélgica). Una de las cervezas más versátiles para maridar con alimentos.",
    history: "Originalmente una cerveza de estación elaborada en granjas durante los meses fríos para ser consumida por los trabajadores agrícolas (\"saisonniers\") durante la cosecha de verano.",
    comparison: "Más seca, con mayor carbonatación, mayor amargor de lúpulo y un carácter de levadura más rústico y picante que una Belgian Single o Blonde Ale.",
    ingredients: "Malta Pilsner y de trigo, lúpulos nobles europeos (Saaz, Styrian Goldings). Levaduras Saison belgas hiper-atenuantes y tolerantes a altas temperaturas de fermentación.",
    vitalStatistics: {
      og: "1.048 - 1.065",
      fg: "1.002 - 1.008",
      abv: "5.0% - 7.0%",
      ibu: "20 - 35",
      srm: "5 - 14"
    },
    abvMin: 5.0,
    abvMax: 7.0,
    ibuMin: 20,
    ibuMax: 35,
    srmMin: 5,
    srmMax: 14,
    commercialExamples: ["Saison Dupont Vieille Provision", "Boulevard Tank 7 Farmhouse Ale", "Ommegang Hennepin"],
    tags: ["ale", "rústica", "especiada", "pimienta", "seca", "belga", "granja"]
  }
];

// Helper Functions for BJCP Study Buddy App

export function getBeerStyleById(id: string): BeerStyle | undefined {
  return BJCP_2021_DATA.find(style => style.id.toLowerCase() === id.toLowerCase());
}

export function searchBeerStyles(query: string): BeerStyle[] {
  if (!query) return BJCP_2021_DATA;
  const lowerQuery = query.toLowerCase();
  return BJCP_2021_DATA.filter(style => 
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
}): BeerStyle[] {
  return BJCP_2021_DATA.filter(style => {
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

export function getAllCategories(): string[] {
  const categories = BJCP_2021_DATA.map(style => style.category);
  return Array.from(new Set(categories));
}
