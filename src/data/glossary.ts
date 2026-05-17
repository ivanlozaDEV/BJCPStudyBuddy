export interface GlossaryTerm {
  id: string;
  name_es: string;
  name_en: string;
  definition_es: string;
  definition_en: string;
  patterns_es: string[];
  patterns_en: string[];
}

export interface TagDefinition {
  tag: string;
  tag_es?: string;
  name_es: string;
  name_en: string;
  description_es: string;
  description_en: string;
}

export const GLOSSARY_DATA: GlossaryTerm[] = [
  // --- Core Technical Study Terms ---
  {
    id: "attenuation",
    name_es: "Atenuación",
    name_en: "Attenuation",
    definition_es: "El porcentaje de azúcares en el mosto que la levadura ha convertido en alcohol y dióxido de carbono durante la fermentación. Una atenuación alta resulta en una cerveza con final seco, mientras que una atenuación baja deja más azúcares residuales, dulzor y cuerpo.",
    definition_en: "The percentage of sugars in the wort that the yeast has converted into alcohol and carbon dioxide during fermentation. High attenuation results in a dry beer, while low attenuation leaves more residual sugars, sweetness, and body.",
    patterns_es: ["atenuaci[oó]n", "atenuaciones", "atenuado"],
    patterns_en: ["attenuation", "attenuations", "attenuated"]
  },
  {
    id: "body",
    name_es: "Cuerpo",
    name_en: "Body",
    definition_es: "La sensación táctil de peso, viscosidad y plenitud en la boca al degustar una cerveza. Varía desde ligero o acuoso hasta pleno, denso y cremoso, influenciado por las proteínas de la malta y azúcares no fermentables.",
    definition_en: "The tactile sensation of weight, viscosity, and fullness in the mouth when tasting a beer. It ranges from light or watery to full, dense, and creamy, influenced by malt proteins and non-fermentable sugars.",
    patterns_es: ["cuerpo", "cuerpos"],
    patterns_en: ["body", "bodies", "bodied"]
  },
  {
    id: "esters",
    name_es: "Ésteres",
    name_en: "Esters",
    definition_es: "Compuestos aromáticos volátiles producidos por la levadura durante la fermentación que aportan notas frutales. Los más comunes recuerdan a plátano (acetato de isoamilo), pera, manzana, solvente o fresa, siendo cruciales en cervezas belgas y alemanas de trigo.",
    definition_en: "Volatile aromatic compounds produced by yeast during fermentation that contribute fruity notes. The most common resemble banana (isoamyl acetate), pear, apple, solvent, or strawberry, being crucial in Belgian and German wheat beers.",
    patterns_es: ["[eé]steres", "[eé]ster"],
    patterns_en: ["esters", "ester"]
  },
  {
    id: "phenols",
    name_es: "Fenoles",
    name_en: "Phenols",
    definition_es: "Compuestos químicos aromáticos producidos por levaduras salvajes o cepas especializadas (como las de trigo alemanas o belgas). Aportan notas especiadas a clavo de olor, pimienta, o en exceso, cualidades medicinales, a plástico, curita o ahumado.",
    definition_en: "Aromatic chemical compounds produced by wild yeast or specialized yeast strains (such as German wheat or Belgian styles). They contribute spicy notes of clove, pepper, or in excess, medicinal, plastic, band-aid, or smoky qualities.",
    patterns_es: ["fenoles", "fenol", "fen[oó]lic[oa]s?"],
    patterns_en: ["phenols", "phenol", "phenolic"]
  },
  {
    id: "diacetyl",
    name_es: "Diacetilo",
    name_en: "Diacetyl",
    definition_es: "Un compuesto de subproducto de la fermentación que aporta un aroma y sabor a mantequilla, palomitas de maíz con mantequilla o toffee (butterscotch), acompañado a menudo por una sensación física aceitosa en la lengua. Defecto grave en la mayoría de lagers.",
    definition_en: "A fermentation by-product compound that contributes a buttery, buttered popcorn, or butterscotch aroma and flavor, often accompanied by an oily physical slickness on the tongue. A major flaw in most lagers.",
    patterns_es: ["diacetilo"],
    patterns_en: ["diacetyl"]
  },
  {
    id: "wort",
    name_es: "Mosto",
    name_en: "Wort",
    definition_es: "El líquido dulce y rico en azúcares obtenido tras el macerado de la malta de cereal, antes de ser hervido con lúpulo y fermentado por la levadura para convertirse en cerveza.",
    definition_en: "The sweet, sugar-rich liquid obtained after mashing the cereal malt, before being boiled with hops and fermented by yeast to become beer.",
    patterns_es: ["mosto", "mostos"],
    patterns_en: ["wort", "worts"]
  },
  {
    id: "mashing",
    name_es: "Macerado (Maceración)",
    name_en: "Mashing",
    definition_es: "El proceso de mezclar la malta molida con agua caliente para activar las enzimas de la malta, convirtiendo los almidones complejos en azúcares fermentables sencillos.",
    definition_en: "The process of mixing milled malt with hot water to activate malt enzymes, converting complex starches into simple fermentables sugars.",
    patterns_es: ["macerado", "maceraci[oó]n", "macerados"],
    patterns_en: ["mashing", "mash"]
  },
  {
    id: "flocculation",
    name_es: "Floculación",
    name_en: "Flocculation",
    definition_es: "La capacidad de la levadura para agruparse en grumos al final de la fermentación y sedimentar al fondo del fermentador, dejando la cerveza más brillante y clara.",
    definition_en: "The ability of yeast to clump together at the end of fermentation and settle to the bottom of the fermenter, leaving the beer brighter and clearer.",
    patterns_es: ["floculaci[oó]n", "floculan"],
    patterns_en: ["flocculation", "flocculate", "flocculating"]
  },
  {
    id: "gravity_og",
    name_es: "Densidad Original (OG)",
    name_en: "Original Gravity (OG)",
    definition_es: "La medida de la densidad del mosto antes de la fermentación, que indica la concentración de azúcares y determina el potencial alcohólico final de la cerveza.",
    definition_en: "The measure of wort density before fermentation, indicating sugar concentration and determining the final alcoholic potential of the beer.",
    patterns_es: ["\\bog\\b", "densidad original"],
    patterns_en: ["\\bog\\b", "original gravity"]
  },
  {
    id: "gravity_fg",
    name_es: "Densidad Final (FG)",
    name_en: "Final Gravity (FG)",
    definition_es: "La medida de la densidad de la cerveza una vez finalizada la fermentación, reflejando los azúcares residuales no fermentados por la levadura.",
    definition_en: "The measure of beer density once fermentation is complete, reflecting the residual sugars left unfermented by the yeast.",
    patterns_es: ["\\bfg\\b", "densidad final"],
    patterns_en: ["\\bfg\\b", "final gravity"]
  },
  {
    id: "ibu",
    name_es: "IBU",
    name_en: "IBU",
    definition_es: "Unidades Internacionales de Amargor (International Bitterness Units), una escala científica que mide los compuestos amargos isomilados procedentes del lúpulo en la cerveza.",
    definition_en: "International Bitterness Units, a scientific scale that measures isomerized bitter compounds from hops in beer.",
    patterns_es: ["\\bibu\\b", "\\bibus\\b"],
    patterns_en: ["\\bibu\\b", "\\bibus\\b"]
  },
  {
    id: "srm",
    name_es: "SRM",
    name_en: "SRM",
    definition_es: "Método de Referencia Estándar (Standard Reference Method), la escala utilizada en Norteamérica para cuantificar el color de la cerveza, donde valores bajos indican colores pajizos y valores altos indican negro opaco.",
    definition_en: "Standard Reference Method, the scale used in North America to quantify beer color, where low values indicate straw colors and high values indicate opaque black.",
    patterns_es: ["\\bsrm\\b"],
    patterns_en: ["\\bsrm\\b"]
  },
  {
    id: "chill_haze",
    name_es: "Turbidez en Frío",
    name_en: "Chill Haze",
    definition_es: "Una turbidez temporal que se forma cuando la cerveza se enfría a bajas temperaturas, causada por la precipitación de compuestos de proteínas y polifenoles. Desaparece cuando la cerveza se calienta ligeramente.",
    definition_en: "A temporary haze that forms when beer is chilled to low temperatures, caused by the precipitation of protein and polyphenol compounds. It disappears when the beer warms up slightly.",
    patterns_es: ["turbidez en fr[ií]o"],
    patterns_en: ["chill haze"]
  },
  {
    id: "carbonation",
    name_es: "Carbonatación",
    name_en: "Carbonation",
    definition_es: "La cantidad de dióxido de carbono (CO2) disuelto en la cerveza, que aporta burbujas, efervescencia y volumen a la espuma, influyendo notablemente en la sensación en boca.",
    definition_en: "The amount of carbon dioxide (CO2) dissolved in beer, contributing bubbles, effervescence, and foam head volume, significantly influencing mouthfeel.",
    patterns_es: ["carbonataci[oó]n", "carbonataciones", "carbonatada"],
    patterns_en: ["carbonation", "carbonated"]
  },
  {
    id: "conditioning",
    name_es: "Acondicionamiento (Maduración)",
    name_en: "Conditioning",
    definition_es: "Periodo posterior a la fermentación principal donde la cerveza madura para suavizar sabores, clarificarse y carbonatarse, ya sea en tanques, botellas o barriles.",
    definition_en: "Post-primary fermentation period where beer matures to smooth out flavors, clarify, and carbonate, whether in tanks, bottles, or kegs.",
    patterns_es: ["acondicionamiento", "maduraci[oó]n"],
    patterns_en: ["conditioning", "condition", "conditioned"]
  },
  {
    id: "mouthfeel",
    name_es: "Sensación en Boca",
    name_en: "Mouthfeel",
    definition_es: "El conjunto de sensaciones físicas no táctiles percibidas en la cavidad bucal al degustar una cerveza, incluyendo cuerpo, carbonatación, calidez alcohólica, astringencia y cremosidad.",
    definition_en: "The collection of physical non-tactile sensations perceived in the oral cavity when tasting a beer, including body, carbonation, alcoholic warmth, astringency, and creaminess.",
    patterns_es: ["sensaci[oó]n en boca", "sensaciones en boca"],
    patterns_en: ["mouthfeel", "mouthfeels"]
  },

  // --- Official Hop Terms ---
  {
    id: "american_hops",
    name_es: "Lúpulos Estadounidenses",
    name_en: "American Hops",
    definition_es: "Lúpulos de Estados Unidos de la era de la cerveza artesanal, que por lo general tienen un carácter cítrico, resinoso, a plantas de hoja perenne o similares. Los lúpulos más modernos pueden añadir un rango más amplio de características, tales como las frutas de carozo, bayas, fruta tropical y melón.",
    definition_en: "American brewing hops from the craft beer era, typically having citrusy, resiny, evergreen, or similar characteristics. More modern hops can add a wider range of characteristics, such as stone fruit, berry, tropical fruit, and melon.",
    patterns_es: ["l[uú]pulos estadounidenses", "l[uú]pulo estadounidense", "l[uú]pulo americano", "l[uú]pulos americanos"],
    patterns_en: ["american hops", "american hop"]
  },
  {
    id: "continental_hops",
    name_es: "Lúpulos del Viejo Mundo (Europa Continental)",
    name_en: "Continental Hops / Old World Hops",
    definition_es: "Lúpulos tradicionales europeos para la elaboración de cerveza, incluyendo lúpulos autóctonos alemanes y checos, lúpulos británicos y otras variedades de Europa continental. Normalmente son descritos como florales, especiados, herbáceos o terrosos. Generalmente son menos intensos que muchos lúpulos del Nuevo Mundo.",
    definition_en: "Traditional European brewing hops, including German and Czech landrace hops, British brewing hops, and those other varieties from continental Europe. Typically described as floral, spicy, herbal, or earthy. Generally less intense than many New World hops.",
    patterns_es: ["l[uú]pulos de europa continental", "l[uú]pulos del viejo mundo", "l[uú]pulo del viejo mundo", "l[uú]pulo de europa continental"],
    patterns_en: ["continental hops", "continental hop", "old world hops", "old world hop"]
  },
  {
    id: "dry_hopped",
    name_es: "Dry Hopped (Lupulado en Seco)",
    name_en: "Dry-Hopped",
    definition_es: "Una adición posterior a la ebullición de productos sin cocción derivados del lúpulo, que aportan a la cerveza un aroma a lúpulo fresco e intenso. Una cerveza con dry hopping a menudo es más robusta, potente y centrada en el lúpulo, que la misma cerveza sin esta adición. Puede cambiar el balance de la cerveza para hacerla más lupulada sin añadir amargor. No debería tener un carácter a pasto/césped, vegetales, oxidación, queso ni añejo. Debe ser fresco e intenso, no cocido.",
    definition_en: "A post-boil addition of uncooked hop products that gives the beer a fresh, bright hop aroma. A dry-hopped beer is often more robust, vivid, and focused than the same beer without dry hops. It can shift the balance of the beer to be more hop-focused without adding bitterness. Should not be grassy, vegetal, oxidized, cheesy, or old in character. Bright and fresh, not cooked.",
    patterns_es: ["dry hopped", "dry-hopped", "dry hopping", "lupulado en seco", "lupulado en fr[ií]o"],
    patterns_en: ["dry-hopped", "dry hopped", "dry-hopping", "dry hopping"]
  },
  {
    id: "juicy",
    name_es: "Jugoso",
    name_en: "Juicy",
    definition_es: "Un término de moda utilizado para describir lúpulos que tienen una cualidad similar al jugo fresco de frutas, especialmente de frutas tropicales. Tiene otros significados como “hacer agua la boca” o “húmedo”, que no se aplican a la elaboración de cerveza.",
    definition_en: "A trendy modern term used to describe hops that have a quality like fresh fruit juices, especially tropical fruits. Has other meanings, such as “mouth-watering” or “wet” that don’t apply in brewing.",
    patterns_es: ["jugoso", "jugosos"],
    patterns_en: ["juicy"]
  },
  {
    id: "new_world_hops",
    name_es: "Lúpulos del Nuevo Mundo",
    name_en: "New World Hops",
    definition_es: "Lúpulos estadounidenses, junto con aquellos de Australia y Nueva Zelanda, y de otros lugares distintos al Viejo Mundo. Pueden tener todos los atributos de los lúpulos clásicos estadounidenses, además de fruta tropical, fruta de carozo, uva blanca y otros aromas interesantes.",
    definition_en: "American hops, along with those from Australia and New Zealand, and other non-Old World locations. Can have all the attributes of classic American hops, as well as tropical fruit, stone fruit, white grape, and other interesting aromatics.",
    patterns_es: ["l[uú]pulos del nuevo mundo", "l[uú]pulo del nuevo mundo"],
    patterns_en: ["new world hops", "new world hop"]
  },
  {
    id: "traditional_german_czech_hops",
    name_es: "Lúpulos Tradicionales Alemanes o Checos",
    name_en: "Traditional German or Czech Hops",
    definition_es: "También llamados lúpulos nobles o autóctonos, por mucho tiempo se ha considerado que tienen un carácter más refinado y delicado para las lagers tradicionales europeas. A menudo tienen un carácter ligero y delicado con notas florales, especiadas o herbáceas. Tradicional quiere decir que estas son variedades de lúpulo clásicas, no modernas ni agresivas.",
    definition_en: "Also called noble or landrace hops, long considered having the finest, most refined character for traditional European lagers. Often having a subtle, lightly floral, spicy, or herbal character. Traditional implies that these are classic types, not modern, aggressive hops.",
    patterns_es: ["l[uú]pulos tradicionales alemanes o checos", "l[uú]pulos nobles"],
    patterns_en: ["traditional german or czech hops", "noble hops", "noble hop"]
  },

  // --- Official Malt or Mashing Terms ---
  {
    id: "biscuity",
    name_es: "A Galleta (Biscuity)",
    name_en: "Biscuity",
    definition_es: "Sabor a grano seco y tostado, a harina o a masa, que recuerda a las galletas digestivas inglesas (galletas semidulces, a base de harina integral y con bicarbonato de sodio). En la elaboración de cerveza, es un sabor comúnmente asociado a la malta Biscuit y a algunas maltas tradicionales inglesas.",
    definition_en: "Dry, toasted grain, flour, or dough flavor reminiscent of English digestive biscuits or cookies; in brewing, a flavor commonly associated with Biscuit malt and some traditional English malts.",
    patterns_es: ["a galleta", "biscuity"],
    patterns_en: ["biscuity", "biscuit character"]
  },
  {
    id: "maillard_products",
    name_es: "Productos de Maillard",
    name_en: "Maillard Products",
    definition_es: "Una categoría de compuestos producidos por interacciones complejas entre azúcares y aminoácidos a alta temperatura, lo que da como resultado colores marrones junto a compuestos ricos y maltosos, incluso algunas veces compuestos con un sabor similar a la carne a la parrilla. En versiones previas de la Guía se conocían como melanoidinas, que son un subconjunto de productos de Maillard responsables de los colores rojo marrones (y, según Kunze, son de “aroma intenso”). En cierta literatura cervecera, melanoidinas y productos de Maillard se usan indistintamente. Las descripciones químicas y de sabor de los productos de Maillard aún no son comprendidas por completo, por lo que quienes elaboran y juzgan cerveza deberían evitar tener discusiones demasiado minuciosas sobre estos puntos. El mensaje principal es que nos referimos a los sabores maltosos intensos, y necesitamos una suerte de terminología práctica para hablar de ellos. Maillard es pronunciado aproximadamente como “mai-YAR”.",
    definition_en: "A class of compounds produced from complex interactions between sugars and amino acids at high temperatures, resulting in brown colors and rich, malty, sometimes even somewhat meaty compounds. In previous versions of the guidelines, known as melanoidins, which are a subset of Maillard products responsible for red-brown colors (and, according to Kunze, are “aroma-intensive”). In some brewing literature, melanoidin and Maillard product are used interchangeably. The chemistry and flavor characterization of Maillard products are not well understood, so brewers and judges should avoid excessively pedantic discussions around these points. The takeaway is that we mean the richly malty flavors, and need some kind of convenient shorthand to discuss them. Maillard is pronounced, roughly, as “my-YARD.”",
    patterns_es: ["productos de maillard", "maillard"],
    patterns_en: ["maillard products", "maillard reaction", "maillard"]
  },
  {
    id: "munich_malt",
    name_es: "Malta Múnich",
    name_en: "Munich Malt",
    definition_es: "Puede aportar un carácter maltoso rico y a pan, que acentúa la base de malta de una cerveza, sin añadir dulzor residual. Sin embargo, algunas personas pueden confundir maltosidad con dulzor. Las maltas Múnich más oscuras pueden añadir un carácter profundo a malta tostada, similar a la corteza de pan tostada.",
    definition_en: "Can provide a bready, richly malty quality that enhances the malt backbone of a beer without adding residual sweetness, although some can confuse maltiness with sweetness. Darker Munich malts can add a deeply toasted malt quality similar to toasted bread crusts.",
    patterns_es: ["malta m[uú]nich"],
    patterns_en: ["munich malt"]
  },
  {
    id: "pilsner_malt",
    name_es: "Malta Pilsner o Malta Pils",
    name_en: "Pilsner or Pils Malt",
    definition_es: "La malta Pilsner de Europa continental es bastante particular. Tiene un carácter ligeramente dulce y levemente granoso, con una cualidad suave, ligeramente tostada y similar a la miel. Al tener mayor cantidad de precursores de DMS que otras maltas, su uso puede acarrear ocasionalmente un bajo sabor a DMS o a maíz.",
    definition_en: "Continental Pilsner malt is quite distinctive, and has a slightly sweet, lightly grainy character with a soft, slightly toasty, honey-like quality. Higher in DMS precursors than other malts, its use can sometimes result in a low corny DMS flavor.",
    patterns_es: ["malta pilsner", "malta pils"],
    patterns_en: ["pilsner malt", "pils malt"]
  },
  {
    id: "vienna_malt",
    name_es: "Malta Viena",
    name_en: "Vienna Malt",
    definition_es: "Puede aportar una presencia a malta con notas tostadas y a pan, pero no espere que las notas tostadas sean extremas; estas son más parecidas a la corteza de un pan recién horneado que a la de un pan tostado.",
    definition_en: "Can provide a bready-toasty malt presence, but don’t expect the toasted notes to be extreme – they’re more like the crust of freshly baked bread than toasted bread.",
    patterns_es: ["malta viena"],
    patterns_en: ["vienna malt"]
  },

  // --- Official Yeast or Fermentation Terms ---
  {
    id: "bubblegum",
    name_es: "Goma de Mascar (Bubblegum)",
    name_en: "Bubblegum",
    definition_es: "Se refiere al perfil de sabor de la goma de mascar de color rosado Bazooka original; un sabor frutal mixto dulce, donde predominan sabores a banana/plátano y frutilla/fresa, junto con ponche (en Estados Unidos, el término fruit punch se utiliza para bebidas que contienen principalmente saborizantes artificiales a frutas).",
    definition_en: "Refers to the flavor profile of Bazooka Bubble Gum original flavor, a pink chewing gum; a sweet mixed fruit flavor dominated by banana and strawberry with fruit punch flavors.",
    patterns_es: ["goma de mascar", "bubblegum"],
    patterns_en: ["bubblegum"]
  },
  {
    id: "clean_fermentation_profile",
    name_es: "Perfil de Fermentación Limpio",
    name_en: "Clean Fermentation Profile",
    definition_es: "La característica de tener subproductos de fermentación derivados de la levadura de nulos a muy bajos en la cerveza terminada. Comúnmente significa que no hay ésteres, diacetilo, acetaldehído ni componentes similares, a menos que se mencione alguno de forma específica. Es una forma abreviada de decir que la larga lista de posibles subproductos de fermentación no está presente en cantidades significativas o apreciables (no obstante, rastros apenas identificables en el umbral de percepción son comúnmente aceptables).",
    definition_en: "The quality of having very low to no yeast-derived fermentation byproducts in the finished beer, typically implying that there are no esters, diacetyl, acetaldehyde, or similar components, except if specifically mentioned. A shorthand for saying that the long list of possible fermentation byproducts is not present in significant or appreciable quantities (barely perceived trace quantities at the threshold of perception are typically acceptable, nonetheless).",
    patterns_es: ["perfil de fermentaci[oó]n limpio", "fermentaci[oó]n limpia", "perfil limpio"],
    patterns_en: ["clean fermentation profile", "clean fermentation", "clean profile"]
  },
  {
    id: "kveik",
    name_es: "Kveik",
    name_en: "Kveik",
    definition_es: "Tradicionalmente, es una mezcla variada de levaduras utilizada para elaborar ales de granja (estilos farmhouse) en Noruega. A menudo disponible hoy en día como cepas únicas. No es un estilo de cerveza.",
    definition_en: "Traditionally, a mixed blend of yeast in Norway used to produce farmhouse style ales, often available as single strains today. Not a beer style.",
    patterns_es: ["kveik"],
    patterns_en: ["kveik"]
  },
  {
    id: "pome_fruit",
    name_es: "Fruta Pomácea",
    name_en: "Pome Fruit",
    definition_es: "Manzana, pera, membrillo. La clasificación botánica contiene otras frutas, pero nos referimos a las más comunes.",
    definition_en: "Apple, pear, quince. The botanical classification contains other fruit, but these are the common ones we mean.",
    patterns_es: ["fruta pom[aá]cea", "frutas pom[aá]ceas"],
    patterns_en: ["pome fruit", "pome fruits"]
  },
  {
    id: "stone_fruit",
    name_es: "Fruta de Carozo",
    name_en: "Stone Fruit",
    definition_es: "Fruta carnosa con una única semilla (carozo o hueso), tales como la cereza, ciruela, durazno/melocotón, damasco/albaricoque, mango, etc.",
    definition_en: "Fleshy fruit with a single pit (or stone), such as cherry, plum, peach, apricot, mango, etc.",
    patterns_es: ["fruta de carozo", "frutas de carozo"],
    patterns_en: ["stone fruit", "stone fruits"]
  },

  // --- Official Mixed Fermentation Terms ---
  {
    id: "acetic_character",
    name_es: "Carácter Acético",
    name_en: "Acetic Character",
    definition_es: "Se refiere a una acidez que no es limpia; más bien es punzante y similar al vinagre.",
    definition_en: "Vinegar-like, sharp, not a clean sourness.",
    patterns_es: ["car[aá]cter ac[eé]tico", "ac[eé]tico"],
    patterns_en: ["acetic character", "acetic"]
  },
  {
    id: "brett",
    name_es: "Brett (Brettanomyces)",
    name_en: "Brett",
    definition_es: "Abreviatura para Brettanomyces, un género de levadura atenuante que es utilizado a menudo para producir sabores afrutados (fruta pomácea, fruta tropical, fruta de carozo), florales y funky (cuero, sudor, establo, manta de caballo, funk, etc.) complejos en bebidas fermentadas. Estos perfiles derivan de fenoles o ácidos grasos producidos durante la fermentación. Su significado literal es “hongo británico” y está asociado a características que se producen durante el envejecimiento en barrica. Las especies más comunes utilizadas en la elaboración de cerveza incluyen B. bruxellensis y B. anomalous, aunque algunas veces se les conoce con otros nombres; existen diversas cepas con diferentes perfiles (así como ocurre en las S. cerevisiae). Aunque normalmente es utilizada para fermentación secundaria, existen unas cuantas cepas de Brett que son capaces de atenuar el mosto por completo, y pueden ser usadas para realizar la fermentación primaria.",
    definition_en: "Shorthand term for Brettanomyces, an attenuative genus of yeast that often is used to produce fruity (pome fruit, tropical fruit, stone fruit), floral, and often funky complex flavors (leather, sweat, barnyard, horse blanket, funk, etc.) in fermented beverages. Derived from phenols or fatty acids produced during fermentation. Literally means “British fungus” and is associated with qualities produced during barrel aging. Common species used in brewing include B. bruxellensis and B. anomalous, although they are sometimes known by other names; several strains exist with very different profiles (as with S. cerevisiae). Typically used as secondary fermentation strain, although a few strains exist that can fully attenuate wort enough to be used for primary fermentation.",
    patterns_es: ["\\bbrett\\b", "\\bbrettanomyces\\b"],
    patterns_en: ["\\bbrett\\b", "\\bbrettanomyces\\b"]
  },
  {
    id: "clean_sourness",
    name_es: "Acidez Limpia",
    name_en: "Clean Sourness",
    definition_es: "Es un descriptor para el carácter de la acidez, que quiere decir que esta no tiene acentos exagerados, a vinagre o a funk complejo; a menudo utilizado para describir una acidez láctica punzante y de buena calidad.",
    definition_en: "A quality descriptor for sourness to imply that the sourness has no vinegar, complex funk, or excessive overtones; often used to describe a good-quality, sharp lactic sourness.",
    patterns_es: ["acidez limpia"],
    patterns_en: ["clean sourness"]
  },
  {
    id: "ethyl_acetate",
    name_es: "Acetato de Etilo",
    name_en: "Ethyl Acetate",
    definition_es: "Es un éster derivado de la levadura, formado a partir del ácido acético y el etanol, que se produce en distintos niveles dependiendo de la cepa de levadura y el estrés de la misma. A niveles bajos es afrutado, como a peras, piñas o bayas, pero a niveles altos es un defecto inaceptable y tiene el aroma del solvente o quita esmalte de uñas. Altos niveles de oxígeno y levadura salvaje pueden crear cantidades excesivas.",
    definition_en: "A yeast-derived ester formed from acetic acid and ethanol and produced at various levels depending on yeast strain and stress. Low levels are fruity like pears, pineapples, or berries but high levels are objectionable faults and have the aroma of solvent or nail polish remover. High levels of oxygen and wild yeast can create excessive amounts.",
    patterns_es: ["acetato de etilo"],
    patterns_en: ["ethyl acetate"]
  },
  {
    id: "indole",
    name_es: "Indol",
    name_en: "Indole",
    definition_es: "Creado por la contaminación de bacterias coliformes durante la fermentación. A menudo se asocia a la producción simultánea de DMS. Generalmente es encontrado en cervezas que tienen una fase de lagencia muy prolongada, o en cervezas de fermentación espontánea. Huele a heces, granja sucia o pocilga. A niveles bajos, puede oler a jazmines o flores. Siempre es un defecto.",
    definition_en: "Formed by ‘coliform’ bacteria contamination during fermentation. It is often associated with simultaneous production of DMS. Most often found in beers that have a very long lag time or in spontaneous-fermented beer. Smells of feces, dirty farm, or pig farms. At lower levels, can be jasmine or floral. Always a fault.",
    patterns_es: ["indol", "indole"],
    patterns_en: ["indole", "indoles"]
  },
  {
    id: "lab",
    name_es: "BAL (Bacterias Ácido Lácticas)",
    name_en: "LAB (Lactic Acid Bacteria)",
    definition_es: "Abreviatura para bacterias ácido lácticas, incluyendo Lactobacillus, Pediococcus, y otras de la familia Lactobacillaceae. Es un término amplio para identificar el origen de una acidez láctica.",
    definition_en: "Shorthand for Lactic Acid Bacteria, including Lactobacillus, Pediococcus, and others in the family Lactobacillaceae. A broader term for identifying the source of a lactic sourness.",
    patterns_es: ["\\bbal\\b", "bacterias [aá]cido l[aá]cticas"],
    patterns_en: ["\\blab\\b", "lactic acid bacteria"]
  },
  {
    id: "lacto",
    name_es: "Lacto (Lactobacillus)",
    name_en: "Lacto",
    definition_es: "Abreviatura de Lactobacillus.",
    definition_en: "Shorthand term for Lactobacillus.",
    patterns_es: ["\\blacto\\b", "\\blactobacillus\\b"],
    patterns_en: ["\\blacto\\b", "\\blactobacillus\\b"]
  },
  {
    id: "pedio",
    name_es: "Pedio (Pediococcus)",
    name_en: "Pedio",
    definition_es: "Abreviatura de Pediococcus.",
    definition_en: "Shorthand term for Pediococcus.",
    patterns_es: ["\\bpedio\\b", "\\bpediococcus\\b"],
    patterns_en: ["\\bpedio\\b", "\\bpediococcus\\b"]
  },
  {
    id: "sacch",
    name_es: "Sacch (Saccharomyces)",
    name_en: "Sacch",
    definition_es: "Abreviatura de Saccharomyces.",
    definition_en: "Shorthand term for Saccharomyces.",
    patterns_es: ["\\bsacch\\b", "\\bsaccharomyces\\b"],
    patterns_en: ["\\bsacch\\b", "\\bsaccharomyces\\b"]
  },
  {
    id: "ropiness",
    name_es: "Viscosidad (Ropiness)",
    name_en: "Ropiness",
    definition_es: "Describe una sensación en boca en la que la cerveza desarrolla un incremento en la viscosidad, y al servirla es espesa, similar a un sirope. La causa más habitual suelen ser diversas bacterias, siendo el género Pedio la más común, y ocurre por un incremento en la producción de polisacáridos. Es una etapa común en la fermentación con cultivos mixtos; la presencia de Brett reducirá esta viscosidad con el paso del tiempo.",
    definition_en: "Describes a mouthfeel where the beer develops an increase in viscosity and pours thick and syrupy. Various bacteria are the usual cause, Pedio being most common, and happens from an increase in production of polysaccharides. A common stage in mixed-culture fermentation; the presence of Brett will reduce this viscosity over time.",
    patterns_es: ["viscosidad", "ropiness", "viscoso"],
    patterns_en: ["ropiness", "ropy", "viscous"]
  },
  {
    id: "thp",
    name_es: "THP (Tetrahidropiridina)",
    name_en: "THP",
    definition_es: "Abreviatura de tetrahidropiridina. Normalmente producida por el Lacto o el Brett. A niveles bajos, confiere un carácter granoso, similar a los cereales de desayuno de avena tostada (piense en el cereal “Cheerios” de Estados Unidos). A niveles altos, puede ser percibida como a jaula de roedores, ratones u orina (similar al defecto en la sidra y el vino). La THP aumenta con la exposición al oxígeno, pero el Brett activo la reducirá con el paso del tiempo. Siempre es un defecto.",
    definition_en: "Shorthand for tetrahydropyridine. Usually produced by Lacto or Brett. At low levels, lends grainy, toasted oat cereal-like character (think ‘Cheerios’ cereal in the US). At high levels, can be perceived as mouse cage, mousy, or urine-like (similar to the fault in cider and wine). THP increases with oxygen exposure but active Brett will reduce it over time. Always a fault.",
    patterns_es: ["\\bthp\\b", "tetrahidropiridina"],
    patterns_en: ["\\bthp\\b", "tetrahydropyridine"]
  },

  // --- Official Quality or Off-Flavor Terms ---
  {
    id: "adjunct_quality",
    name_es: "Carácter de Adjunto",
    name_en: "Adjunct Quality",
    definition_es: "Una característica del aroma, sabor y sensación en boca de la cerveza, que refleja el uso de altos porcentajes de ingredientes fermentables no malteados. Puede presentarse como un carácter a maíz, un cuerpo más ligero que en un producto “todo malta”, o una cerveza generalmente con un gusto más aguado. No implica necesariamente el uso de ningún adjunto en específico.",
    definition_en: "A characteristic of beer aroma, flavor, and mouthfeel that reflects the use of higher percentages of non-malt fermentables. Can present as a corny character, a lighter body than an all-malt product, or a generally thinner-tasting beer. Does not necessarily imply the use of any specific adjunct.",
    patterns_es: ["car[aá]cter de adjunto", "uso de adjuntos", "adjunto"],
    patterns_en: ["adjunct quality", "adjunct character", "adjuncts"]
  },
  {
    id: "balanced",
    name_es: "Balanceado",
    name_en: "Balanced",
    definition_es: "En relación a un estilo, balanceado se refiere a una combinación de elementos placentera, armoniosa, agradable y complementaria, no necesariamente a una misma cantidad de cada elemento. No se refiere a una cantidad absoluta, sino a una medida de la apropiada coordinación de los componentes del sabor.",
    definition_en: "Relative to a style, balanced implies a pleasant, harmonious, agreeable, complementary mix of elements, not an equal amount of each component. Does not imply any absolute quantity, more of a measure of appropriate coordination of flavor constituents.",
    patterns_es: ["\\bbalanceado\\b", "\\bbalanceados\\b", "\\bbalanceada\\b"],
    patterns_en: ["\\bbalanced\\b", "\\bbalance\\b"]
  },
  {
    id: "clean",
    name_es: "Limpio",
    name_en: "Clean",
    definition_es: "Es decir, que carece de aromas y sabores indeseados (off flavors); es un término positivo.",
    definition_en: "Lacking off flavors; a positive term.",
    patterns_es: ["\\blimpio\\b", "\\blimpias\\b", "\\blimpios\\b"],
    patterns_en: ["\\bclean\\b"]
  },
  {
    id: "crisp",
    name_es: "Crisp",
    name_en: "Crisp",
    definition_es: "Es un cambio rápido y abrupto en la sensación en boca de una cerveza, pasando de suave a punzante, que lleva a un final seco. Normalmente es un término positivo.",
    definition_en: "A rapid, abrupt change in the mouthfeel of beer from smoothness to sharpness, leading into a dry finish. Usually a positive term.",
    patterns_es: ["\\bcrisp\\b"],
    patterns_en: ["\\bcrip\\b", "\\bcrisp\\b"]
  },
  {
    id: "dms",
    name_es: "DMS",
    name_en: "DMS",
    definition_es: "Sulfuro de Dimetilo (del inglés Dimethyl Sulfide), que puede adoptar una amplia gama de características percibidas. La mayoría son inapropiadas en cualquier estilo de cerveza; sin embargo, una cualidad ligera a maíz cocido y en segundo plano puede ser percibida y es aceptable en cervezas con altos niveles de malta Pilsner. Cuando la Guía de Estilos indica que algún nivel de DMS es apropiado, es este sabor ligero a maíz cocido, no las características a otros vegetales cocidos ni otros sabores del DMS.",
    definition_en: "Dimethyl Sulfide, which can take on a wide range of perceptual characteristics. Most are inappropriate in any style of beer; however, a light, background cooked corn quality may be noted and is acceptable in beers with high levels of Pilsner malt. When the guidelines state that any levels of DMS are appropriate, it is this light cooked corn flavor, not other cooked vegetable characteristics or other DMS flavors.",
    patterns_es: ["\\bdms\\b", "sulfuro de dimetilo"],
    patterns_en: ["\\bdms\\b", "dimethyl sulfide"]
  },
  {
    id: "dry",
    name_es: "Seco",
    name_en: "Dry",
    definition_es: "Tiene el mismo uso que con el vino, significa que carece de dulzor percibido. Bien atenuado. Por supuesto que en este contexto no significa “lo opuesto a mojado”.",
    definition_en: "Same usage as with wine, meaning lacking perceived sweetness. Well-attenuated. Obviously does not mean “opposite of wet” in this context.",
    patterns_es: ["\\bseco\\b", "\\bseca\\b", "\\bsecos\\b"],
    patterns_en: ["\\bdry\\b", "\\bdryness\\b"]
  },
  {
    id: "elegant",
    name_es: "Elegante",
    name_en: "Elegant",
    definition_es: "Es un carácter suave, de buen gusto, refinado y placentero, que sugiere el trato cuidadoso de ingredientes de alta calidad; que carece de asperezas, sabores punzantes y sensaciones ofensivas para el paladar.",
    definition_en: "Smooth, tasteful, refined, pleasant character sensory suggestive of high-quality ingredients handled with care; lacking rough edges, sharp flavors, and palate-attacking sensations.",
    patterns_es: ["\\belegante\\b", "\\belegantes\\b"],
    patterns_en: ["\\belegant\\b", "\\belegance\\b"]
  },
  {
    id: "harsh",
    name_es: "Áspero",
    name_en: "Harsh",
    definition_es: "Cuando se aplica a la cerveza, se refiere a una textura, sabor o retrogusto poco placentero, punzante, intenso o desagradable. Algunos sinónimos en este contexto son rasposo, tosco, abrasivo, no fino, sucio, menos refinado y menos puro. Es una definición de cualidad que indica lo opuesto a suave, limpio y placentero. Puede insinuar astringencia, pero también se puede aplicar al amargor, al alcohol y a otras sensaciones. Es un término negativo.",
    definition_en: "When applied to beer, an unpleasant, sharp, intense, or disagreeable texture, flavor, or aftertaste. Some synonyms in this context are rough, coarse, abrasive, not fine, dirtier, less refined, and less pure. A quality term indicating the opposite of smooth, clean, and pleasant. Can imply astringency, but also can apply to bitterness, alcohol, and other sensations. Negative.",
    patterns_es: ["\\b[aá]spero\\b", "\\b[aá]spera\\b", "\\baspereza\\b"],
    patterns_en: ["\\bharsh\\b", "\\bharshness\\b"]
  },
  {
    id: "funky",
    name_es: "Funky",
    name_en: "Funky",
    definition_es: "Es un término tanto positivo como negativo, dependiendo del contexto. Si es esperado o deseable, a menudo puede adoptar un carácter a granja, heno mojado, ligeramente terroso, manta de caballo o establo. Si es demasiado intenso, inesperado o indeseado, puede tomar un carácter a forraje, heces, pañal de bebé o caballeriza.",
    definition_en: "A positive or negative term, depending on the context. If expected or desirable, can often take on a barnyard, wet hay, slightly earthy, horse blanket, or farmyard character. If too intense, unexpected, or undesirable, can take the form of silage, fecal, baby diaper, or horse stall qualities.",
    patterns_es: ["\\bfunky\\b", "car[aá]cter funky"],
    patterns_en: ["\\bfunky\\b", "funk"]
  },
  {
    id: "rustic",
    name_es: "Rústico",
    name_en: "Rustic",
    definition_es: "Es un carácter tosco, sustancioso y robusto que recuerda ingredientes tradicionales antiguos; quizá una experiencia sensorial general menos refinada.",
    definition_en: "Coarse, hearty, robust character reminiscent of older, traditional ingredients; perhaps less refined as a general sensory experience.",
    patterns_es: ["\\br[uú]stico\\b", "\\br[uú]stica\\b"],
    patterns_en: ["\\brustic\\b"]
  },

  // --- Official Appearance Terms ---
  {
    id: "belgian_lace",
    name_es: "Encaje Belga (Lacing)",
    name_en: "Belgian Lace / Lacing",
    definition_es: "Es un patrón tipo celosía característico y persistente, formado por la espuma remanente en el interior del vaso a medida que se consume una cerveza. Su apariencia evoca a los finos encajes de Bélgica, donde se considera como un indicador deseable de la calidad de la cerveza.",
    definition_en: "A characteristic and persistent latticework pattern of foam left on the inside of the glass as a beer is consumed. The look is reminiscent of fine lacework from Belgium, where it is considered a desirable indicator of beer quality.",
    patterns_es: ["encaje belga", "encaje de belga", "lacing"],
    patterns_en: ["belgian lace", "lacing"]
  },
  {
    id: "legs",
    name_es: "Piernas (Legs)",
    name_en: "Legs",
    definition_es: "Es un patrón que una bebida deja en el interior de un vaso luego de que una porción ha sido consumida. El término se refiere a las pequeñas gotas que caen lentamente formando una hilera continua, a partir de los residuos de la bebida en la pared del vaso. No es una señal de calidad, pero puede indicar un contenido más alto de alcohol, azúcar o glicerol.",
    definition_en: "A pattern that a beverage leaves on the inside of a glass after a portion has been consumed. The term refers to the droplets that slowly fall in streams from beverage residue on the side of the glass. Not an indication of quality, but can indicate a higher alcohol, sugar, or glycerol content.",
    patterns_es: ["piernas", "l[ií]grimas de cerveza"],
    patterns_en: ["\\blegs\\b"]
  }
];

export const TAG_DEFINITIONS_DATA: TagDefinition[] = [
  // --- 1. Alcohol Strength / Intensidad de Alcohol ---
  {
    tag: "session-strength",
    tag_es: "intensidad-baja",
    name_es: "Intensidad Baja (<4% ABV)",
    name_en: "Session Strength (<4% ABV)",
    description_es: "Cervezas de baja graduación alcohólica (<4% ABV) diseñadas para ser sumamente bebibles en cantidades moderadas sin saturar.",
    description_en: "Low-alcohol beers (<4% ABV) designed to be highly drinkable in moderate quantities without overwhelming."
  },
  {
    tag: "standard-strength",
    tag_es: "intensidad-estándar",
    name_es: "Intensidad Estándar (4-6% ABV)",
    name_en: "Standard Strength (4-6% ABV)",
    description_es: "El rango más común de graduación alcohólica para la gran mayoría de estilos comerciales a nivel mundial (4-6% ABV).",
    description_en: "The most common alcohol strength range for the vast majority of commercial beer styles worldwide (4-6% ABV)."
  },
  {
    tag: "high-strength",
    tag_es: "intensidad-alta",
    name_es: "Intensidad Alta (6-9% ABV)",
    name_en: "High Strength (6-9% ABV)",
    description_es: "Cervezas con un contenido de alcohol elevado (6-9% ABV), aportando notable cuerpo, calidez y complejidad.",
    description_en: "Beers with an elevated alcohol content (6-9% ABV), contributing noticeable body, warmth, and complexity."
  },
  {
    tag: "very-high-strength",
    tag_es: "intensidad-muy-alta",
    name_es: "Intensidad Muy Alta (>9% ABV)",
    name_en: "Very High Strength (>9% ABV)",
    description_es: "Cervezas extremadamente fuertes, robustas y de guarda con graduaciones superiores al 9% ABV (ej: Barleywines, Imperial Stouts).",
    description_en: "Extremely strong, robust cellaring beers with alcohol content exceeding 9% ABV (e.g. Barleywines, Imperial Stouts)."
  },

  // --- 2. Color ---
  {
    tag: "pale-color",
    tag_es: "color-pálido",
    name_es: "Color Pálido (Pajizo a Dorado)",
    name_en: "Pale Color (Straw to Gold)",
    description_es: "Color de pajizo a dorado, característico de estilos ligeros, refrescantes y de gran claridad visual.",
    description_en: "Straw to gold color, characteristic of light, refreshing styles with great visual clarity."
  },
  {
    tag: "amber-color",
    tag_es: "color-ámbar",
    name_es: "Color Ámbar (Ámbar a Cobrizo Marrón)",
    name_en: "Amber Color (Amber to Copper Brown)",
    description_es: "Color de ámbar a cobrizo marrón, aportando generalmente notas caramelizadas, tostadas y maltosas más profundas.",
    description_en: "Amber to copper brown color, usually contributing caramelized, toasty, and deeper malty notes."
  },
  {
    tag: "dark-color",
    tag_es: "color-oscuro",
    name_es: "Color Oscuro (Marrón Oscuro a Negro)",
    name_en: "Dark Color (Dark Brown to Black)",
    description_es: "Color de marrón oscuro a negro opaco, caracterizado por notas tostadas, a chocolate, torrefacto y café.",
    description_en: "Dark brown to opaque black color, characterized by roasted, chocolatey, torrefied, and coffee-like notes."
  },

  // --- 3. Fermentation & Conditioning ---
  {
    tag: "top-fermented",
    tag_es: "fermentación-alta",
    name_es: "Fermentación Alta (Ale)",
    name_en: "Top-fermented (Ale)",
    description_es: "Cervezas elaboradas con levadura Ale (Saccharomyces cerevisiae) que fermenta a temperaturas cálidas, produciendo ésteres frutales y fenoles complejos.",
    description_en: "Beers brewed with Ale yeast (Saccharomyces cerevisiae) that ferments at warmer temperatures, producing fruity esters and complex phenols."
  },
  {
    tag: "bottom-fermented",
    tag_es: "fermentación-baja",
    name_es: "Fermentación Baja (Lager)",
    name_en: "Bottom-fermented (Lager)",
    description_es: "Cervezas elaboradas con levadura Lager (Saccharomyces pastorianus) que fermenta a temperaturas frías, logrando perfiles sumamente limpios y precisos.",
    description_en: "Beers brewed with Lager yeast (Saccharomyces pastorianus) that ferments at cold temperatures, achieving highly clean and precise profiles."
  },
  {
    tag: "any-fermentation",
    tag_es: "cualquier-fermentación",
    name_es: "Cualquier Fermentación",
    name_en: "Any Fermentation",
    description_es: "Estilos híbridos donde es perfectamente válido utilizar tanto levadura ale como lager en su proceso de elaboración.",
    description_en: "Hybrid styles where it is perfectly valid to use either ale or lager yeast in their brewing process."
  },
  {
    tag: "wild-fermented",
    tag_es: "fermentación-salvaje",
    name_es: "Fermentación Salvaje o Mixta",
    name_en: "Wild Fermented",
    description_es: "Cervezas fermentadas con levadura no Saccharomyces o bacterias (Brett, Lactobacillus, Pediococcus) para dar acidez y perfiles rústicos.",
    description_en: "Beers fermented with non-Saccharomyces yeast or bacteria (Brett, Lactobacillus, Pediococcus) to yield acidity and rustic profiles."
  },
  {
    tag: "lagered",
    tag_es: "acondicionada-en-frío",
    name_es: "Acondicionada en Frío (Lagered)",
    name_en: "Lagered (Cold Conditioned)",
    description_es: "Cervezas que pasan por un periodo de maduración prolongado en frío extremo para clarificar, redondear y suavizar sus sabores.",
    description_en: "Beers that undergo an extended conditioning period at extremely cold temperatures to clarify, round out, and smooth their flavors."
  },
  {
    tag: "aged",
    tag_es: "envejecida",
    name_es: "Envejecida / Guarda Prolongada",
    name_en: "Aged",
    description_es: "Cervezas sometidas a un largo acondicionamiento o guarda (a menudo en barricas de madera) antes de salir al mercado para desarrollar complejidad.",
    description_en: "Beers subjected to an extended conditioning or cellaring (often in wooden barrels) before being released to develop complexity."
  },

  // --- 4. Region of Origin / Región de Origen ---
  {
    tag: "british-isles",
    tag_es: "islas-británicas",
    name_es: "Islas Británicas",
    name_en: "British Isles",
    description_es: "Región que abarca Inglaterra, Gales, Escocia e Irlanda, hogar de estilos clásicos y maltosos como Bitters, Stouts, Porters y Milds.",
    description_en: "Region covering England, Wales, Scotland, and Ireland, home to classic, malty styles like Bitters, Stouts, Porters, and Milds."
  },
  {
    tag: "western-europe",
    tag_es: "europa-occidental",
    name_es: "Europa Occidental",
    name_en: "Western Europe",
    description_es: "Región que incluye a Bélgica, Francia y Países Bajos, cuna de cervezas complejas, rústicas, frutales y de fermentación mixta (belgas).",
    description_en: "Region including Belgium, France, and the Netherlands, birthplace of complex, rustic, fruity, and mixed-fermentation beers (Belgian styles)."
  },
  {
    tag: "central-europe",
    tag_es: "europa-central",
    name_es: "Europa Central",
    name_en: "Central Europe",
    description_es: "Región que comprende Alemania, Austria, República Checa y Escandinavia, famosa por sus lagers de precisión, Pilsners y cervezas de trigo.",
    description_en: "Region comprising Germany, Austria, the Czech Republic, and Scandinavia, famous for its precision lagers, Pilsners, and wheat beers."
  },
  {
    tag: "eastern-europe",
    tag_es: "europa-oriental",
    name_es: "Europa Oriental",
    name_en: "Eastern Europe",
    description_es: "Región que abarca Polonia, Estados Bálticos y Rusia, conocida por cervezas oscuras y robustas de climas fríos como la Baltic Porter.",
    description_en: "Region covering Poland, the Baltic States, and Russia, known for dark and robust cold-weather beers like Baltic Porter."
  },
  {
    tag: "north-america",
    tag_es: "norte-américa",
    name_es: "Norteamérica",
    name_en: "North America",
    description_es: "Región que incluye a Estados Unidos, Canadá y México, impulsora de la revolución artesanal moderna y el uso audaz de lúpulos cítricos.",
    description_en: "Region including the United States, Canada, and Mexico, driving the modern craft revolution and the bold use of citrusy hops."
  },
  {
    tag: "south-america",
    tag_es: "sud-américa",
    name_es: "Sudamérica",
    name_en: "South America",
    description_es: "Región que abarca Argentina y Brasil, caracterizada por la adaptación de estilos tradicionales con adiciones creativas de frutas locales.",
    description_en: "Region covering Argentina and Brazil, characterized by the adaptation of traditional styles with creative additions of local fruits."
  },
  {
    tag: "pacific",
    tag_es: "pacífico",
    name_es: "Pacífico",
    name_en: "Pacific",
    description_es: "Región que comprende Australia y Nueva Zelanda, famosa por el uso de variedades exclusivas de lúpulos con perfiles sumamente tropicales.",
    description_en: "Region comprising Australia and New Zealand, famous for the use of exclusive hop varieties with highly tropical profiles."
  },

  // --- 5. Era ---
  {
    tag: "craft-style",
    tag_es: "estilo-artesanal",
    name_es: "Estilo Artesanal Moderno",
    name_en: "Modern Craft Style",
    description_es: "Estilos desarrollados o reinventados durante la era moderna de la cerveza artesanal (a partir de la década de 1970).",
    description_en: "Styles developed or reinvented during the modern craft beer era (starting from the 1970s)."
  },
  {
    tag: "traditional-style",
    tag_es: "estilo-tradicional",
    name_es: "Estilo Tradicional",
    name_en: "Traditional Style",
    description_es: "Estilos históricos clásicos desarrollados y consolidados antes de la era moderna de la cerveza artesanal.",
    description_en: "Classic historical styles developed and consolidated before the modern craft beer era."
  },
  {
    tag: "historical-style",
    tag_es: "estilo-histórico",
    name_es: "Estilo Histórico",
    name_en: "Historical Style",
    description_es: "Estilos que ya no se elaboran de forma comercial masiva, o cuya producción es extremadamente limitada a recreaciones nostálgicas.",
    description_en: "Styles that are no longer brewed on a mass commercial scale, or whose production is extremely limited to nostalgic recreations."
  },

  // --- 6. Style Families ---
  {
    tag: "ipa-family",
    tag_es: "familia-ipa",
    name_es: "Familia IPA",
    name_en: "IPA Family",
    description_es: "Estilos caracterizados por un amargor elevado, intenso aroma a lúpulo y una graduación alcohólica de estándar a alta.",
    description_en: "Styles characterized by elevated bitterness, intense hop aroma, and standard to high alcohol content."
  },
  {
    tag: "brown-ale-family",
    tag_es: "familia-ale-marrón",
    name_es: "Familia Ale Marrón",
    name_en: "Brown Ale Family",
    description_es: "Estilos de color marrón, con perfiles maltosos que recuerdan a nuez, caramelo suave y chocolate.",
    description_en: "Brown-colored styles with malty profiles reminiscent of nut, soft caramel, and chocolate."
  },
  {
    tag: "pale-ale-family",
    tag_es: "familia-ale-pálida",
    name_es: "Familia Ale Pálida",
    name_en: "Pale Ale Family",
    description_es: "Estilos pálidos de fermentación alta que ofrecen un balance armónico entre el amargor del lúpulo y el soporte maltoso.",
    description_en: "Pale top-fermented styles offering a harmonic balance between hop bitterness and malty support."
  },
  {
    tag: "pale-lager-family",
    tag_es: "familia-lager-pálida",
    name_es: "Familia Lager Pálida",
    name_en: "Pale Lager Family",
    description_es: "Estilos lager claros y dorados, sumamente refrescantes, atenuados y con un perfil de fermentación muy limpio.",
    description_en: "Clear, golden lager styles, highly refreshing, well-attenuated, with a very clean fermentation profile."
  },
  {
    tag: "pilsner-family",
    tag_es: "familia-pilsner",
    name_es: "Familia Pilsner",
    name_en: "Pilsner Family",
    description_es: "Estilos lager pálidos inspirados en el clásico de Bohemia, con un acentuado y elegante amargor y aroma de lúpulos tradicionales.",
    description_en: "Pale lager styles inspired by the Bohemian classic, with an accented and elegant bitterness and aroma of traditional hops."
  },
  {
    tag: "amber-ale-family",
    tag_es: "familia-ale-ámbar",
    name_es: "Familia Ale Ámbar",
    name_en: "Amber Ale Family",
    description_es: "Estilos de alta fermentación con colores ámbar y cobrizos, destacando perfiles maltosos acaramelados junto con lúpulos balanceados.",
    description_en: "Top-fermented styles with amber and copper colors, highlighting caramelized malty profiles alongside balanced hops."
  },
  {
    tag: "amber-lager-family",
    tag_es: "familia-lager-ámbar",
    name_es: "Familia Lager Ámbar",
    name_en: "Amber Lager Family",
    description_es: "Estilos lager de color ámbar, que combinan la suavidad y limpieza lager con notas de malta tostada y caramelo.",
    description_en: "Lager styles of amber color, combining lager smoothness and cleanliness with toasted malt and caramel notes."
  },
  {
    tag: "dark-lager-family",
    tag_es: "familia-lager-oscura",
    name_es: "Familia Lager Oscura",
    name_en: "Dark Lager Family",
    description_es: "Estilos lager oscuros que ofrecen perfiles de malta tostada (pan tostado, chocolate) pero con el final limpio y fluido de una lager.",
    description_en: "Dark lager styles offering toasted malt profiles (toast, chocolate) but with the clean and smooth finish of a lager."
  },
  {
    tag: "porter-family",
    tag_es: "familia-porter",
    name_es: "Familia Porter",
    name_en: "Porter Family",
    description_es: "Estilos oscuros e históricos de fermentación alta, caracterizados por notas de chocolate, caramelo y un tostado suave sin llegar a ser áspero.",
    description_en: "Dark, historic top-fermented styles characterized by chocolate, caramel, and a gentle roastiness without being harsh."
  },
  {
    tag: "stout-family",
    tag_es: "familia-stout",
    name_es: "Familia Stout",
    name_en: "Stout Family",
    description_es: "Estilos oscuros muy robustos que destacan por perfiles intensamente tostados reminiscentes de café torrefacto, cacao amargo y grano quemado.",
    description_en: "Very robust dark styles highlighting intensely roasted profiles reminiscent of coffee, dark cocoa, and burnt grain."
  },
  {
    tag: "bock-family",
    tag_es: "familia-bock",
    name_es: "Familia Bock",
    name_en: "Bock Family",
    description_es: "Estilos lager tradicionales alemanes de alta graduación, centrados en una maltosidad rica, bready, densa y sumamente reconfortante.",
    description_en: "Traditional German lager styles of high strength, focused on a rich, bready, dense, and highly comforting maltiness."
  },
  {
    tag: "strong-ale-family",
    tag_es: "familia-ale-fuerte",
    name_es: "Familia Ale Fuerte",
    name_en: "Strong Ale Family",
    description_es: "Estilos de alta fermentación con elevados niveles de alcohol, cuerpo denso y una enorme complejidad aromática y gustativa.",
    description_en: "Top-fermented styles with elevated alcohol levels, dense body, and massive aromatic and flavor complexity."
  },
  {
    tag: "wheat-beer-family",
    tag_es: "familia-cerveza-trigo",
    name_es: "Familia Cerveza de Trigo",
    name_en: "Wheat Beer Family",
    description_es: "Estilos elaborados con altos porcentajes de trigo maltoso, aportando una textura cremosa, gran turbidez y perfiles frutales de levadura.",
    description_en: "Styles brewed with high percentages of malted wheat, contributing a creamy texture, heavy haze, and fruity yeast profiles."
  },
  {
    tag: "specialty-beer",
    tag_es: "cerveza-especialidad",
    name_es: "Cerveza de Especialidad",
    name_en: "Specialty Beer",
    description_es: "Estilos abiertos a la creatividad del cervecero que incorporan ingredientes inusuales (frutas, especias, madera) o procesos híbridos complejos.",
    description_en: "Styles open to brewer creativity incorporating unusual ingredients (fruits, spices, wood) or complex hybrid processes."
  },

  // --- 7. Dominant Flavors / Sabores Dominantes ---
  {
    tag: "malty",
    tag_es: "maltosa",
    name_es: "Dominante en Malta (Maltosa)",
    name_en: "Malt-forward (Malty)",
    description_es: "Sabor dominantemente maltoso, aportando notas ricas a pan, bizcocho, caramelo, toffee o tostado.",
    description_en: "Dominantly malty flavor, contributing rich notes of bread, biscuit, caramel, toffee, or toast."
  },
  {
    tag: "bitter",
    tag_es: "amarga",
    name_es: "Dominante en Amargor (Amarga)",
    name_en: "Bitter-forward (Bitter)",
    description_es: "Sabor con un amargor de lúpulo acentuado y firme, que define la identidad principal de la cerveza y limpia el paladar.",
    description_en: "Flavor with an accented and firm hop bitterness, defining the beer's main identity and cleansing the palate."
  },
  {
    tag: "balanced",
    tag_es: "balanceada",
    name_es: "Perfil Balanceado",
    name_en: "Balanced Profile",
    description_es: "Estilos con una intensidad similar de soporte de malta y amargor de lúpulo, sin que ninguno sobresalga de manera agresiva.",
    description_en: "Styles with a similar intensity of malt support and hop bitterness, without either standing out aggressively."
  },
  {
    tag: "hoppy",
    tag_es: "lupulada",
    name_es: "Carácter de Lúpulo Elevado (Lupulada)",
    name_en: "Hop-forward (Hoppy)",
    description_es: "Sabor y aroma que destacan por el carácter aromático del lúpulo (floral, herbal, cítrico, resinoso o frutal).",
    description_en: "Flavor and aroma that stand out for the hop's aromatic character (floral, herbal, citrusy, resinous, or fruity)."
  },
  {
    tag: "roasty",
    tag_es: "rostizada",
    name_es: "Maltas Rostizadas",
    name_en: "Roasted Malts (Roasty)",
    description_es: "Sabores predominantes procedentes de granos o maltas muy tostados o quemados, aportando notas de café, cacao amargo o carbón.",
    description_en: "Predominant flavors coming from highly roasted or burnt grains or malts, contributing coffee, dark cocoa, or char notes."
  },
  {
    tag: "sweet",
    tag_es: "dulce",
    name_es: "Dulzor Residual",
    name_en: "Residual Sweetness (Sweet)",
    description_es: "Cervezas donde el dulzor residual o el carácter a azúcares de la malta resultan evidentes e intencionados en boca.",
    description_en: "Beers where residual sweetness or the sugar character of the malt is evident and intentional on the palate."
  },
  {
    tag: "smoke",
    tag_es: "ahumada",
    name_es: "Maltas Ahumadas",
    name_en: "Smoked Malts (Smoke)",
    description_es: "Sabores y aromas procedentes de maltas secadas sobre fuego de madera, aportando un carácter ahumado agradable y característico.",
    description_en: "Flavors and aromas coming from malts dried over wood fire, contributing a pleasant and characteristic smoky character."
  },
  {
    tag: "sour",
    tag_es: "ácida",
    name_es: "Acidez Intencionada",
    name_en: "Intentional Sourness (Sour)",
    description_es: "Carácter agrio o acidez intencionalmente elevada y refrescante, procedente de fermentaciones con bacterias productoras de ácido láctico.",
    description_en: "Sour character or intentionally elevated and refreshing acidity, coming from fermentation with lactic acid-producing bacteria."
  },
  {
    tag: "wood",
    tag_es: "madera",
    name_es: "Añejamiento en Madera",
    name_en: "Wood-aged",
    description_es: "Carácter derivado del contacto directo con madera o añejamiento en barricas, aportando notas a vainilla, taninos, roble o licores previos.",
    description_en: "Character derived from direct wood contact or barrel cellaring, contributing vanilla, tannins, oak, or previous spirit notes."
  },
  {
    tag: "fruit",
    tag_es: "fruta",
    name_es: "Sabor Frutal Evidente",
    name_en: "Fruit-infused",
    description_es: "Estilos donde el sabor o aroma derivado de la infusión o adición de frutas naturales resulta notable y bien coordinado.",
    description_en: "Styles where the flavor or aroma derived from the infusion or addition of natural fruits is notable and well coordinated."
  },
  {
    tag: "spice",
    tag_es: "especias",
    name_es: "Adición de Especias",
    name_en: "Spice-infused",
    description_es: "Cervezas que contienen aromas y sabores procedentes de especias, hierbas o flores añadidas durante la elaboración.",
    description_en: "Beers containing aromas and flavors coming from spices, herbs, or flowers added during the brewing process."
  }
];
