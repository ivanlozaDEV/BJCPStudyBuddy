export interface OffFlavor {
  id: string;
  name_es: string;
  name_en: string;
  sensation_es: string;
  sensation_en: string;
  causes_es: string;
  causes_en: string;
  prevention_es: string;
  prevention_en: string;
  patterns_es?: string[];
  patterns_en?: string[];
}

export const OFF_FLAVORS_DATA: OffFlavor[] = [
  {
    id: "acetaldehyde",
    name_es: "Acetaldehído",
    name_en: "Acetaldehyde",
    sensation_es: "Manzanas verdes, manzanas podridas, calabaza recién cortada.",
    sensation_en: "Green apples, rotten-apples, freshly cut pumpkin.",
    causes_es: "El acetaldehído es un compuesto químico natural producido por la levadura durante la fermentación. Normalmente se convierte en etanol (alcohol), aunque este proceso puede tardar más en cervezas con alto contenido de alcohol o cuando no se inocula suficiente levadura. Algunas bacterias también pueden causar sabores a manzana verde.",
    causes_en: "Acetaldehyde is a naturally occurring chemical produced by yeast during fermentation. It is usually converted into Ethanol alcohol, although this process may take longer in beers with high alcohol content or when not enough yeast is pitched. Some bacteria can cause green apple flavors as well.",
    prevention_es: "Deja que la cerveza madure y se acondicione durante un par de meses. Esto le dará tiempo a la levadura para convertir el acetaldehído en etanol. Utiliza siempre levadura de alta calidad y asegúrate de inocular la cantidad correcta para la densidad del mosto, o haz un arrancador (yeast starter).",
    prevention_en: "Let the beer age and condition over a couple months time. This will give the yeast time to convert the Acetaldehyde into Ethanol. Always use high quality yeast and make sure you are pitching the correct amount for the gravity of the wort or make a yeast starter.",
    patterns_es: ["acetaldeh[ií]do", "acetaldeh[ií]dos"],
    patterns_en: ["acetaldehyde", "acetaldehydes"]
  },
  {
    id: "alcoholic",
    name_es: "Alcohólico",
    name_en: "Alcoholic",
    sensation_es: "Sabor a alcohol abrumador, amargo, acetona, disolvente de pintura, picante, punzante, sensación de calor indeseable en la garganta.",
    sensation_en: "Overpowering alcohol flavor, bitter, acetone, paint thinner, spicy, sharp, undesirable \"hot\" sensation in the throat.",
    causes_es: "Los alcoholes fusel como el propanol, butanol, isobutanol y alcohol isoamílico, así como los alcoholes fenólicos como el tirosol, suelen ser responsables de los sabores alcohólicos desagradables. Cantidades limitadas de estos alcoholes pueden ser deseables en cervezas de alta graduación como Barley Wines o Strong Ales, y son mucho más notorias en estilos más ligeros. La fuente más común de estos alcoholes es la fermentación a una temperatura demasiado alta; sin embargo, dejar la cerveza sobre el sedimento (trub) durante demasiado tiempo o la oxidación también pueden causarlo.",
    causes_en: "Fusel alcohols such as propanol, butanol, isobutanol, and isoamyl alcohol as well as phenolic alcohols such as tyrosol are usually responsible for unpleasant alcohol flavors. Limited amounts of these alcohols can be desirable in high alcohol beers such as barley wines or strong ales and are much more noticeable in lighter style beers. The most common source for such alcohols is fermenting at too high of a temperature, however, keeping beer on the trub for too long or oxidation can cause this as well.",
    prevention_es: "Evita fermentar a temperaturas que superen los 26°C (80°F). Si la cerveza va a permanecer en el fermentador durante más de un par de semanas, es buena idea eliminar la mayor cantidad de sedimento del mosto antes de transferirlo al fermentador. También se puede utilizar un fermentador secundario para ayudar a reducir el tiempo de contacto de la cerveza con el sedimento.",
    prevention_en: "Avoid fermenting at temperatures exceeding 80ºF. If the beer is going to be sitting in the fermenter for longer than a couple weeks, it is a good idea to remove as much sediment from the wort as possible before transferring it to the fermenter. A secondary fermenter can also be used to help reduce the amount of contact time the beer has with the trub.",
    patterns_es: ["alcoh[oó]lic[oa]s?", "fusel"],
    patterns_en: ["alcoholic", "fusel"]
  },
  {
    id: "astringent",
    name_es: "Astringente",
    name_en: "Astringent",
    sensation_es: "Agrio, avinagrado, tanino, sensación secante y áspera en la boca, puede sentirse polvoriento o metálico en la boca, como chupar la piel de una uva o una bolsita de té usada.",
    sensation_en: "Tart, vinegary, tannin, drying, puckering sensation, may feel powdery or metallic in the mouth, like sucking on a grape skin or a tea bag.",
    causes_es: "La astringencia puede ser causada por muchos factores diferentes. Los polifenoles o taninos son la causa número uno de estos sabores. Taninos se encuentran en las cáscaras del grano, así como en la piel de las frutas. Macerar el grano por demasiado tiempo o usar grano que ha sido excesivamente molido o triturado puede liberar taninos. Durante el macerado, si el pH supera el rango de 5.2–5.6, se pueden producir sabores astringentes. El exceso de lúpulo también puede contribuir a generar cualidades astringentes.",
    causes_en: "Astringency can be caused by many different factors. Polyphenols or tannins are the number one cause of such flavors. Tannins are found in the skins or husks of the grain as well as in the skin of fruit. Steeping grain for too long or grain that has been excessively milled or crushed can release tannins. When mashing, if the pH exceeds 5.2–5.6, astringent flavors can be produced. Over-hopping can also lend a hand in creating astringent qualities.",
    prevention_es: "Evita el grano que haya sido 'sobre-molido'. El grano debe estar quebrado pero no triturado ni desmenuzado. Al lavar el grano (sparging), presta mucha atención a la temperatura y a la cantidad de agua utilizada. Al remojar granos especiales, asegúrate de retirarlos antes de que el agua empiece a hervir. Las frutas nunca deben hervirse en el mosto; en su lugar, se pueden añadir al fermentador o a agua caliente pero no hirviendo durante 15–30 minutos. Asegúrate de que la cantidad y variedades de lúpulo utilizadas sean las correctas para el estilo de cerveza.",
    prevention_en: "Avoid grain that has been “over-milled”. Grain should be cracked open but not crushed or shredded. When sparging, pay close attention to the temperature and the amount of the water used. When steeping grains, be sure to take them out before the water gets to a boil. Fruits should never be boiled in the wort; instead, they can be added to the fermenter or to water that is hot but not boiling for 15–30 minutes. Make sure that the amount and varieties of hops used are the correct types for the style of beer.",
    patterns_es: ["astringente", "astringentes", "astringencia"],
    patterns_en: ["astringent", "astringents", "astringency"]
  },
  {
    id: "chlorophenol",
    name_es: "Clorofenol",
    name_en: "Chlorophenol",
    sensation_es: "Plástico, vinilo, yodo.",
    sensation_en: "Plastic, Vinyl, Iodine.",
    causes_es: "El uso de agua de grifo clorada para elaborar cerveza o enjuagar el equipo es la causa más común de sabores plásticos o medicinales. Los sabores medicinales también pueden ser el resultado del uso de limpiadores o sanitizantes a base de cloro o yodo. Algunas levaduras salvajes también pueden contribuir a un sabor medicinal similar.",
    causes_en: "Using chlorinated tap water to brew or rinse equipment is the most common cause for plastic-like or medicinal flavors. Medicinal flavors can also be the result of using cleanser or sanitizer that is chlorine or iodine based. Some wild yeast will contribute to a similar medicinal taste.",
    prevention_es: "No utilices agua clorada para elaborar cerveza ni para enjuagar equipos que vayan a estar en contacto con ella. Si debes usar agua clorada, utiliza un filtro de carbón activo que elimine el cloro o hierve el agua durante 15 minutos y enfríala a temperatura ambiente para evaporar el cloro. Utiliza siempre la cantidad y concentración recomendadas de sanitizantes. La mayoría de los sanitizantes no causarán sabores extraños si se usan correctamente. Si usas lejía/cloro, usa media onza por galón de agua, deja remojar el equipo durante 10 minutos y enjuaga siempre con agua sanitizada (previamente hervida).",
    prevention_en: "Don’t use chlorinated water to brew or to rinse equipment that will come into contact with the beer. If chlorinated water must be used, use a water filter that removes chlorine or boil the water for 15 minutes and then cool to room temperature to force out any chlorine that may be present. Always use the recommended amount and concentrations of sanitizers. Most sanitizers will not cause any off flavors when used properly. When using bleach, use one-half ounce per gallon of water, let equipment soak for 10 minutes and always rinse with sanitized (pre-boiled) water.",
    patterns_es: ["clorofenol", "clorofenoles", "clorofen[oó]lic[oa]s?"],
    patterns_en: ["chlorophenol", "chlorophenols", "chlorophenolic"]
  },
  {
    id: "cidery",
    name_es: "Sidroso",
    name_en: "Cidery",
    sensation_es: "Sidra de manzana, vino, acetaldehído (manzanas).",
    sensation_en: "Apple Cider, Wine, Acetaldehyde (apples).",
    causes_es: "El uso de demasiado azúcar de maíz o de caña es la causa más común de sabores a vino o a sidra. Generalmente, 1 libra de azúcar por lote de 5 galones se considera el límite antes de que comiencen a desarrollarse sabores sidrosos. El acetaldehído también puede aportar una cualidad similar a la sidra.",
    causes_en: "Using too much corn or cane sugar is the most common cause for wine or cidery flavors. Generally, 1 lb of sugar per 5 gallon batch is considered the limit before cidery flavors start developing. Acetaldehyde can also give off a cider-like quality.",
    prevention_es: "Intenta reducir la cantidad de azúcar de maíz o caña utilizada. Usar una fuente alternativa de azúcar fermentable puede ayudar a reducir los sabores sidrosos o a vino. El extracto de malta seco o líquido no aportará sabores a sidra. La miel es otra buena opción de sustitución, ya que es casi completamente fermentable, aunque dejará un aroma y sabor a miel de leve a fuerte según la cantidad que utilices. Si la causa es la levadura en lugar del azúcar de caña o maíz, la maduración en frío (lagering) puede ayudar a que los sabores sidrosos desaparezcan con el tiempo.",
    prevention_en: "Try cutting down on the amount of corn or cane sugar being used. Using an alternate source of fermentable sugar can help to reduce cidery or winey flavors. Dried or Liquid malt extract will not give off any cider flavors. Honey is another good substitution as it is almost fully fermentable but it will leave a slight to strong honey aroma and taste depending on how much is used. If the cause is the yeast rather than cane or corn sugar, lagering may help cidery flavors to dissipate over time.",
    patterns_es: ["sidros[oa]s?", "sidra"],
    patterns_en: ["cidery", "cider"]
  },
  {
    id: "diacetyl",
    name_es: "Diacetilo",
    name_en: "Diacetyl",
    sensation_es: "Mantequilla, mantequilla rancia, toffee/butterscotch, sensación aceitosa o resbaladiza en la boca y la lengua.",
    sensation_en: "Butter, Rancid Butter, Butterscotch, Slickness in the mouth and tongue.",
    causes_es: "El diacetilo es producido naturalmente por toda levadura durante la fermentación y luego es 'reabsorbido' por las mismas células. Un aumento de diacetilo o un diacetilo que no es reabsorbido puede ser el resultado de levadura de alta floculación, levadura débil o mutada, sobre o bajo nivel de oxigenación, temperaturas de fermentación bajas y hervidos débiles o cortos. Generalmente se considera un defecto cuando se detecta en lagers. Algunos cerveceros y consumidores por igual desean pequeñas cantidades en ales.",
    causes_en: "Diacetyl is naturally produced by all yeast during fermentation and is then “reabsorbed” by yeast cells. Increased diacetyl or diacetyl that is not reabsorbed may be a result of high flocculating yeast, weak or mutated yeast, over or under oxygenating, low fermentation temperatures and weak or short boils. It is generally regarded as a flaw when detected in lagers. Some brewers, and drinkers alike, desire small amounts in ales.",
    prevention_es: "Tomar las siguientes medidas ayudará a la levadura a reabsorber adecuadamente el diacetilo en el mosto: La levadura altamente floculante puede caer al fondo antes de absorber el diacetilo; usar levadura de floculación media le dará una mejor oportunidad de absorberlo. Usa siempre levadura de alta calidad y evita cepas débiles o posiblemente mutadas. Permite que la levadura inicie un crecimiento saludable usando un arrancador (yeast starter). Suministra suficiente oxígeno al inicio, pero evita sobreoxigenar especialmente tras inocular la levadura. Permite suficiente tiempo para que la levadura fermente por completo a temperaturas adecuadas.",
    prevention_en: "Taking the following steps will help yeast to properly reabsorb diacetyl in wort: Yeast that is highly flocculant may fall out of suspension before it gets a chance to absorb the diacetyl, using medium flocculation yeast should give the yeast a good chance to absorb diacetyl. Always use high quality yeast and avoid weak or possibly mutated strands that may be incapable of handling diacetyl properly. Allow yeast to begin initial growth with the use of a yeast starter. Supply sufficient oxygen for yeast growth, but avoid over oxygenating especially after pitching yeast. Allow enough time for yeast to fully ferment at appropriate temperatures.",
    patterns_es: ["diacetilo", "diacetilos"],
    patterns_en: ["diacetyl"]
  },
  {
    id: "dms",
    name_es: "DMS (Dimetil Sulfuro)",
    name_en: "Dimethyl Sulfide (DMS)",
    sensation_es: "Verduras cocidas, especialmente maíz dulce en crema, repollo, tomate, o sabores tipo marisco/ostra.",
    sensation_en: "Cooked vegetables, especially creamed corn, cabbage, tomato, shellfish/oyster-like flavors.",
    causes_es: "La S-metilmetionina (SMM) se crea durante el malteado del grano y luego se convierte en DMS al calentarse. Los granos base más oscuros tienen menos DMS ya que el proceso de horneado convierte la SMM en DMS y la elimina antes de entrar al mosto. Esto hace que el DMS sea naturalmente más frecuente en pale ales y lagers claras.",
    causes_en: "S-methyl methionine (SMM) is created during the malting process of grain and is later converted to DMS when heated. Darker base grains have less DMS as the kilning process converts SMM to DMS and drives it off before going into the wort. This makes DMS naturally more prevalent in pale ales and lagers.",
    prevention_es: "Al hervir el mosto, el DMS se elimina a través de la evaporación. Es muy importante mantener siempre un hervor vigoroso y continuo durante al menos una hora. Algunos cerveceros hierven durante 90 minutos para asegurarse de eliminar la mayor cantidad de DMS posible. Evita que la condensación de la tapa gotee de vuelta al mosto y nunca cubras la olla por completo durante el hervor. Los tiempos de enfriamiento prolongados también pueden generar exceso de DMS. Enfría el mosto a la temperatura de inoculación lo más rápido posible con un enfriador de mosto o baño de hielo. Finalmente, una fermentación fuerte con mucha producción de CO2 ayuda a limpiar el DMS ya que las burbujas lo arrastran, por lo que inocular levadura de alta calidad es fundamental.",
    prevention_en: "When boiling wort, DMS is driven off through evaporation. It is very important to always maintain a strong rolling boil for at least one hour. Some brewers boil for 90 minutes to ensure that as much DMS is driven off as possible. Avoid letting condensation drip back into the wort and never cover your kettle completely during the boil. Long cooling times can also lead to excess amounts of DMS. Cool your wort to pitching temperature as quickly as possible with a wort chiller or ice bath. Finally, a strong fermentation with lots of Co2 production helps to clean up DMS since the bubbles carry DMS away, so pitching high quality yeast is a must.",
    patterns_es: ["\\bdms\\b", "sulfuro de dimetilo"],
    patterns_en: ["\\bdms\\b", "dimethyl sulfide"]
  },
  {
    id: "estery",
    name_es: "Afrutado / Ésteres",
    name_en: "Estery/Fruity",
    sensation_es: "Fruta, especialmente plátano (banana), y en menor medida, pera, fresa, frambuesa, pomelo.",
    sensation_en: "Fruit, especially banana, to a lesser extent, pear, strawberry, raspberry, grapefruit.",
    causes_es: "Los ésteres son un subproducto natural de la fermentación. Ciertas ales deben tener estos sabores frutales, como las cervezas belgas y las Hefeweizens (cervezas de trigo alemanas), y ciertos tipos de levadura producen más ésteres que otros. Los sabores frutales muy fuertes o inapropiados para el estilo son a veces el resultado de inocular poca levadura (underpitching) o de temperaturas de fermentación elevadas. Como regla general, a mayor temperatura de fermentación, más ésteres producirá la levadura. Además de las altas temperaturas, los niveles bajos de oxígeno también pueden incrementar la producción de ésteres.",
    causes_en: "Esters are a naturally occurring byproduct of fermentation. Certain ales are supposed to have these fruity flavors, such as Belgian ales and Hefeweizens (German Wheat beer) and certain types of yeast produce more esters than others. Strong fruity flavors or fruity flavors that are inappropriate for the style of beer are sometimes a result of under pitching or high fermentation temperatures. As a general rule, the higher the fermentation temperature, the more esters the yeast will produce. In addition to high fermentation temperatures, low oxygen levels can also help increase the production of esters.",
    prevention_es: "Inocula siempre suficiente levadura para la densidad de tu cerveza y oxigena bien. Mantén las temperaturas de fermentación por debajo de los 24°C (75°F) cuando sea posible. Se ha demostrado que fermentar a más de 24°C incrementa drásticamente los ésteres. Fermentar entre 15°C–18°C (60°F–65°F) reducirá considerablemente la producción de ésteres, aunque la fermentación será más lenta. Por último, utiliza siempre la levadura adecuada para el estilo de cerveza. Las cepas para trigo alemán o belgas producen ésteres frutales a propósito; si quieres evitar el sabor a plátano, evita estas cepas.",
    prevention_en: "Always pitch enough yeast for the gravity of your beer and oxygenate well. Keep fermentation temperatures under 75ºF when possible. Fermenting over 75ºF has been shown to drastically increase esters. Fermenting between 60ºF–65ºF will reduce ester production considerably, however, be prepared for a slower fermentation. Lastly, always use the correct yeast for the style of beer being brewed. Yeast strains made for Belgian or German wheat beers are made to produce fruity characteristics, so if you are trying to avoid beers that taste like bananas, avoid using these strains.",
    patterns_es: ["afrutad[oa]s?", "ésteres?", "esteres?", "estery"],
    patterns_en: ["estery", "fruity", "esters?"]
  },
  {
    id: "grassy",
    name_es: "Herbáceo",
    name_en: "Grassy",
    sensation_es: "Pasto recién cortado, humedad.",
    sensation_en: "Freshly cut grass, musty.",
    causes_es: "Los aromas y sabores húmedos o a pasto suelen ser el resultado de granos o extractos que desarrollaron moho o bacterias antes de ser utilizados. A veces se forman aldehídos en la malta vieja, lo que puede provocar un sabor a hierba. Los lúpulos, si no se procesan correctamente antes del empaque o almacenamiento, también pueden desarrollar sabores extraños similares.",
    causes_en: "Musty, grassy aromas and flavors are usually the result of grains or extract that have developed mold or bacteria prior to being used. Aldehydes can occasionally form on old malt, which can lead to a grassy flavor. Hops, if not processed correctly prior to packaging/storing, can also develop similar off flavors.",
    prevention_es: "Almacena siempre los granos o extractos en un lugar fresco, seco y oscuro. Revisa los ingredientes en busca de decoloración, olores o sabores extraños antes de elaborar. Moler el grano justo antes de elaborar ayudará a mantenerlo fresco. El grano ya molido debe usarse dentro de las 2-4 semanas posteriores a la molienda. Usa siempre lúpulos de alta calidad. Si usas lúpulos caseros, asegúrate de curarlos correctamente antes de almacenarlos a largo plazo. Como regla general, si los ingredientes se ven, huelen y saben bien, son aptos para usar.",
    prevention_en: "Always store grains or extract in a cool, dry, dark place. Check ingredients for discoloration, off smells or tastes, prior to brewing. Milling grain just prior to brewing will help to keep it fresh. Pre-milled grain should be used in 2–4 weeks from the time it is milled. Always use high quality hops. If using homegrown hops, make sure to properly cure them before long-term storage. As a general rule, if ingredients look, smell and/or taste good, they should be fine to use.",
    patterns_es: ["herb[aá]ce[oa]s?", "pasto"],
    patterns_en: ["grassy", "grass"]
  },
  {
    id: "grainy",
    name_es: "Granoso / Cascarilla",
    name_en: "Husky/Grainy",
    sensation_es: "Grano crudo, seco, sabores comparables a la astringencia por taninos o la oxidación.",
    sensation_en: "Raw grain, dry, flavors comparable to astringency from tannins and/or oxidization.",
    causes_es: "El grano sobre-molido puede causar sabores extraños a cascarilla y grano crudo. Las maltas muy tostadas también pueden contribuir a cualidades ásperas o granosas. Estos sabores son más comunes en elaboraciones todo grano debido a la cantidad de grano utilizada y a la necesidad de macerar y lavar (sparging).",
    causes_en: "Over milled grain can cause husky, grainy off flavors. Highly toasted malts can also contribute to husky, grainy qualities. These flavors are most common in all-grain brews due to the amount of grain being used and the need to mash and sparge.",
    prevention_es: "Seguir las mismas precauciones para evitar la astringencia ayudará a eliminar los sabores granosos o a cascarilla. Evita el grano desmenuzado o triturado. Al usar granos tostados caseros, déjalos reposar de 1 a 2 semanas después de tostarlos para permitir que se disipen los aromas y sabores ásperos. El acondicionamiento en frío (cold conditioning/lagering) de una cerveza granosa ayudará a que estos sabores caigan y precipiten fuera de la suspensión.",
    prevention_en: "Following the same precautions to avoid astringency should help with any grainy or husky flavors. Avoid grain that has been shredded or crushed. When using homemade toasted grains, allow them to age for 1–2 weeks after milling to allow harsh aromas and flavors to dissipate. Cold conditioning a husky or grainy tasting beer will usually help the off flavors to fall out of suspension.",
    patterns_es: ["granos[oa]s?", "cascarilla", "grainy"],
    patterns_en: ["grainy", "husky", "grain-like"]
  },
  {
    id: "medicinal",
    name_es: "Medicinal",
    name_en: "Medicinal",
    sensation_es: "Jarabe para la tos, enjuague bucal, tirita (Band-Aid), humo, clavo de olor (especiado).",
    sensation_en: "Cough syrup, mouthwash, Band-Aid™, smoke, clove-like (spicy).",
    causes_es: "Una variedad de diferentes fenoles son casi siempre la causa de los sabores medicinales en la cerveza. Los fenoles pueden causar sabores a solvente, astringentes, plásticos y medicinales. Los fenoles con sabor medicinal se extraen usualmente durante el macerado o el lavado debido a niveles incorrectos de pH, cantidades de agua y temperaturas. El uso inadecuado de sanitizantes a base de cloro o yodo puede generar clorofenoles. La levadura también produce fenoles, y una característica similar al clavo de olor es deliberada en algunas ales, especialmente Hefeweizen y otras cervezas de trigo.",
    causes_en: "A variety of different phenols are almost always the cause for medicinal flavors in beer. Phenols can cause solvent, astringent, plastic and medicinal flavors. Medicinal-tasting phenols are usually brought out during mashing and/or sparging and are caused by incorrect pH levels, water amounts and temperatures. Using chlorine or iodine-based sanitizers improperly can bring out Chlorophenols. Yeast also produces phenols, and a clove-like characteristic is deliberate in some ale, especially Hefeweizen and other wheat beers.",
    prevention_es: "Sigue las técnicas adecuadas de macerado y lavado, y sigue siempre las instrucciones específicas de los diferentes sanitizantes. Tomar las mismas precauciones para evitar clorofenoles y astringencia ayudará a eliminar las posibilidades de sabores medicinales. Usa siempre la levadura adecuada para el estilo de cerveza elaborado.",
    prevention_en: "Follow proper mashing and sparging techniques and always follow the specific directions for different sanitizers. Taking the same precautions to avoid Chlorophenols and astringency should help to wipe out the chances of medicinal flavors. Always use the proper yeast for the style of beer being brewed.",
    patterns_es: ["medicinal", "medicinales"],
    patterns_en: ["medicinal"]
  },
  {
    id: "metallic",
    name_es: "Metálico",
    name_en: "Metallic",
    sensation_es: "Metal, principalmente hierro, también descrito como sabor a monedas o sangre. Se siente en la parte delantera de la boca y en la parte posterior de la garganta.",
    sensation_en: "Metal, mainly iron, also described as tasting like pennies or blood, Felt on the front of the mouth and back of the throat.",
    causes_es: "El mosto hervido en metales no pasivados ni procesados, principalmente hierro, pero también aluminio y acero (excluyendo el acero inoxidable), suele ser la fuente de los sabores metálicos. Los sabores metálicos también pueden extraerse de equipos de metal, chapas de botellas y/o barriles. Usar agua con altos niveles de hierro aportará sabores ferrosos. Los granos almacenados incorrectamente también pueden causar sabores metálicos.",
    causes_en: "Wort being boiled in unprocessed metals, mainly iron, but also aluminum, and steel (excluding stainless) is usually the source of metallic flavors. Metallic flavors can also be extracted from metal brewing equipment, bottle caps and/or kegs. Using water that has high levels of iron will impart iron flavors. Improperly stored grains can also cause metallic off flavors.",
    prevention_es: "Usa ollas y equipos de acero inoxidable (conexiones, cucharas, etc.) cuando sea posible. Evita usar hierro para cualquier cosa que esté en contacto con la cerveza o el mosto. Si usas una olla de acero esmaltado con cerámica, revisa siempre si tiene grietas o rayaduras antes de usarla. El acero inoxidable no aportará sabores metálicos. Las ollas de aluminio generalmente solo causarán sabores metálicos al usar agua alcalina con un pH superior a 9. Si usas aluminio, puedes 'hornear' la olla a 120°C (250°F) durante 6 horas para aumentar los óxidos protectores. Usa siempre grano fresco y bien almacenado. Evita usar agua con hierro, como agua de pozo sin filtrar.",
    prevention_en: "Use stainless steel pots and brewing equipment (fittings, spoons, etc.) when possible. Avoid using iron for anything that will be coming in contact with beer/wort. If using a ceramic coated steel pot, always check for cracks or scratches before using. Stainless steel will not give off any metallic flavors. Aluminum pots will generally only cause metallic flavors when using alkaline water with a pH over 9. If using an aluminum pot, you can “bake” the pot in an oven at 250ºF for 6 hours to increase the protective oxides. Always use fresh, properly stored grain. Avoid using water with iron in it, such as unfiltered well water.",
    patterns_es: ["met[aá]lic[oa]s?"],
    patterns_en: ["metallic"]
  },
  {
    id: "moldy",
    name_es: "Amohecido / Humedad",
    name_en: "Moldy",
    sensation_es: "Moho, humedad, olor a moho en el pan.",
    sensation_en: "Mold, mildew, musty, like mold on bread.",
    causes_es: "El moho puede crecer en la cerveza y el mosto y casi siempre es el resultado de almacenar la cerveza en fermentación en un área húmeda o mal ventilada. El uso de extracto o grano que ha desarrollado moho también puede aportar sabores a moho y humedad.",
    causes_en: "Mold can grow in beer and wort and is almost always the result of storing fermenting beer in a damp, dank area. Using extract or grain that has developed mold can impart moldy, mildewy flavors as well.",
    prevention_es: "Almacena siempre el fermentador en un lugar seco y oscuro. Evita guardar tu fermentador en entornos húmedos o mal ventilados. Revisa todos los ingredientes en busca de olores, sabores o decoloraciones extrañas antes de elaborar. Desecha cualquier grano mohoso. Si encuentras moho en el extracto de malta, se recomienda desecharlo. El extracto mohoso se puede usar si se raspa el moho, pero prepárate para sabores extraños en el producto final. Si se encuentra moho en el fermentador o en la cerveza, es posible salvar el lote raspando la mayor cantidad de moho posible, aunque usualmente para cuando el moho es visible ya ha infectado todo el fermentador.",
    prevention_en: "Always store your fermenter in a dry, dark place. Avoid storing your fermenter in damp, dank or humid surroundings. Check all ingredients for off smells, flavors and/or discoloration prior to brewing with them. Discard any moldy grain. If mold is found in malt extract, it is recommended that it be thrown out. Moldy extract can still be used if the mold is scraped off but be prepared for off flavors in the final product. If mold is found in the fermenter or beer, it is possible to save the batch by scraping off as much mold as possible. However, by the time mold is seen, it has usually infected the entire fermenter.",
    patterns_es: ["amohecid[oa]s?", "moho", "mohos", "humedad"],
    patterns_en: ["moldy", "mold", "mouldy", "mould", "musty"]
  },
  {
    id: "oxidation",
    name_es: "Oxidación",
    name_en: "Oxidation",
    sensation_es: "Rancio o viejo, cartón mojado, jerez, papel, piña vieja, verduras en descomposición, mayor amargor, aspereza.",
    sensation_en: "Stale or old, wet cardboard, sherry, papery, pineapple, decaying vegetables, Increased bitterness, harshness.",
    causes_es: "La oxidación ocurre cuando el oxígeno reacciona negativamente con las moléculas en el mosto o la cerveza. Un nivel excesivo de oxígeno introducido, especialmente mientras el mosto está caliente o después de completar la fermentación, puede crear sabores a cartón o jerez. Demasiado espacio libre en las botellas también puede provocar oxidación. Por otro lado, la aireación del mosto antes de inocular la levadura es necesaria para un crecimiento saludable y una buena fermentación.",
    causes_en: "Oxidation occurs when oxygen negatively reacts with the molecules in the wort or beer. An excessive level of oxygen being introduced to the beer, especially while wort is still warm or after fermentation is complete, can create cardboard of sherry-like flavors. Too much headspace in bottles can lead to oxidation as well. On the other hand, aeration of wort before pitching yeast is necessary for yeast and good fermentation.",
    prevention_es: "La oxidación es casi siempre el resultado de salpicaduras innecesarias de cerveza ya fermentada. Al transferir cerveza de un recipiente a otro, evita salpicaduras transfiriéndola con una manguera en lugar de verterla directamente. Mantén el extremo de la manguera debajo de la línea del líquido y evita las burbujas de aire en la manguera. Además, reduce al mínimo la exposición del mosto al aire exterior. La aireación en el lado caliente ocurre cuando el mosto se oxida mientras está caliente; el líquido caliente es más propenso a absorber oxígeno, por lo que se recomienda evitar salpicaduras si está a más de 26°C (80°F). Enfría el mosto lo más rápido posible y no lo airees hasta que esté por debajo de 26°C. Al embotellar, deja solo 1.2 cm (1/2\") de espacio de cabeza. Purga los barriles con CO2 para eliminar el oxígeno.",
    prevention_en: "Oxidation is almost always a result of unnecessary splashing of fermented beer. When transferring beer from one vessel to the next, prevent splashing by transferring beer with tubing rather than pouring straight in. Keep the end of the transfer tubing beneath the liquid line and avoid getting air pockets in the transfer tubing. Also, keep exposure of wort to outside air at a minimum. Hot side aeration refers to wort becoming oxidized while it is hot. Warm liquid is more inclined to absorb oxygen and therefore, it is recommended that when wort is over 80ºF, splashing be avoided. During and directly after the boil splashing is not much of a concern, as oxygen can’t really dissolve into liquid that hot. Cool wort as quickly as possible and do not aerate wort until it is under 80ºF. When bottling, only leave about ½” of headspace. The use of “oxygen absorbing” bottle caps may help keep oxygen out of the bottle. When kegging, purge kegs with Co2 to flush oxygen out of the headspace.",
    patterns_es: ["oxidaci[oó]n", "oxidado", "oxidada", "oxificados", "oxidadas", "rancio", "rancia"],
    patterns_en: ["oxidation", "oxidized", "stale"]
  },
  {
    id: "salty",
    name_es: "Salado",
    name_en: "Salty",
    sensation_es: "Sal, detectada en los laterales frontales de la lengua.",
    sensation_en: "Salt, detected on the front sides of the tongue.",
    causes_es: "Agregar demasiado yeso o sales de Epsom puede crear una cerveza excesivamente salada.",
    causes_en: "Adding too much gypsum or Epsom salt can create an overly salty beer.",
    prevention_es: "Nunca agregues sales de elaboración al agua a menos que conozcas el contenido original de sal del agua, cómo afectarán las sales al perfil y exactamente cuánto usar. Ciertas cervezas son conocidas por su naturaleza ligeramente salada, como las cervezas de Burton-on-Trent o estilos tradicionales como Gose.",
    prevention_en: "Never add brewing salts to your water unless you know the original salt content of the water, how the salts will effect the water you are using and how much to use. Certain beers are known for their slightly salty nature such as beer from Burton-on-Trent.",
    patterns_es: ["salad[oa]s?", "sal"],
    patterns_en: ["salty", "salt"]
  },
  {
    id: "skunky",
    name_es: "Luz / Azorrillado",
    name_en: "Skunky",
    sensation_es: "Aroma a zorrillo, humedad, puede ser similar al caucho quemado o almizcle.",
    sensation_en: "Aroma of skunk, musty, can be similar to burned rubber or cat musk.",
    causes_es: "Cuando los lúpulos se exponen a los rayos UV de la luz solar o luces fluorescentes, los ácidos alfa se descomponen y reaccionan con el sulfuro de hidrógeno que produce la levadura. Esta reacción crea mercaptano. El mercaptano es el mismo compuesto químico que los zorrillos secretan al rociar, razón por la cual el olor de la cerveza expuesta a la luz (light struck) es tan similar al de un zorrillo.",
    causes_en: "When hops are exposed to UV rays from sunlight or florescent lights, the alpha acids breakdown and react with the hydrogen sulfide that the yeast make. This reaction creates mercaptan. Mercaptan is the same chemical skunks secrete when they spray which is why the smell of “light struck” beer is so similar to that of a skunk.",
    prevention_es: "Al fermentar cerveza en recipientes transparentes, manténlos alejados de la luz solar directa o lámparas fluorescentes. Una bolsa de papel o una toalla envuelta alrededor del fermentador ayudará a bloquear la luz. Todos los envases transparentes permiten el paso de la luz UV; las botellas de color marrón filtran la mayoría de los rayos UV y ayudan a mantener la cerveza libre de este defecto por más tiempo. Evita botellas verdes o transparentes ya que dejan pasar casi toda la luz UV. Las cervezas claras y muy lupuladas son más propensas a azorrillarse. Las cervezas oscuras son menos susceptibles.",
    prevention_en: "When fermenting beer in a clear container, always keep it out of any direct sunlight or florescent lamps. A simple paper bag or towel wrapped around the carboy will help to keep light out. All clear containers will let UV light in, however, brown bottles will filter a majority of UV rays and help to keep your beer “skunkless” for longer. Avoid green or clear bottles as these let almost all UV light in. Light-colored beers and beers with a lot of hops are more prone to becoming skunky. Dark beers and beers that utilize isomerized hop extracts are less susceptible to becoming light struck.",
    patterns_es: ["azorrillad[oa]s?", "olor a luz", "golpe de luz", "azorrillada"],
    patterns_en: ["skunky", "skunk", "light-struck", "light struck"]
  },
  {
    id: "soapy",
    name_es: "Jabonoso",
    name_en: "Soapy",
    sensation_es: "Jabón, detergente, sensación aceitosa o grasosa.",
    sensation_en: "Soap, detergent, oily, fatty.",
    causes_es: "Dejar la cerveza en el fermentador primario por mucho tiempo tras finalizar la fermentación puede causar sabores jabonosos. Después de un tiempo, los ácidos grasos en el sedimento comienzan a descomponerse y básicamente se crea jabón.",
    causes_en: "Keeping beer in the primary fermenter for a long time after fermentation is complete can cause soapy flavors. After a while, the fatty acids in the trub start to break down and soap is essentially created.",
    prevention_es: "Transfiere la cerveza a un fermentador secundario si planeas madurarla en el fermentador durante un periodo largo de tiempo. Las cervezas muy claras y lagers son más susceptibles de absorber y exhibir sabores extraños que las ales y cervezas oscuras.",
    prevention_en: "Transfer beer into a secondary if you plan on aging it in the fermenter for a long period of time. Very light beers and lagers are more susceptible to absorbing and exhibiting off flavors than ales and darker beers.",
    patterns_es: ["jabonos[oa]s?"],
    patterns_en: ["soapy", "soap"]
  },
  {
    id: "solvent",
    name_es: "Solvente",
    name_en: "Solvent-Like",
    sensation_es: "Disolvente de pintura, quitaesmalte (acetona), áspero, punzante; en casos extremos puede causar sensación de ardor en la lengua y garganta, comparable a sabores alcohólicos fuertes o ésteres agresivos.",
    sensation_en: "Paint thinner, nail polish remover (acetone), harsh, sharp, in extreme cases can cause a burning sensation of tongue and throat, comparable to harsh alcohol or estery flavors.",
    causes_es: "Los sabores y aromas a solvente se deben usualmente a una combinación de una temperatura de fermentación muy alta y a la oxidación de la cerveza. Sabores similares también pueden resultar del uso de plásticos que no sean de grado alimenticio.",
    causes_en: "Solvent-like flavors and aromas are usually due to a combination of very high fermentation temperature and oxidation of the beer. Similar flavors can also result from using plastic that isn’t food grade.",
    prevention_es: "Evita fermentar a temperaturas superiores al rango sugerido para la levadura utilizada. Evita la oxidación de la cerveza. Nunca antes uses equipos de plástico o vinilo que no estén marcados como grado alimenticio. Algunos plásticos de grado alimenticio liberan toxinas tras alcanzar cierta temperatura. Si las piezas plásticas estarán expuestas a líquidos calientes, verifica el rango de temperatura calificado.",
    prevention_en: "Avoid fermenting at temperatures higher than the suggested range for the yeast being used. Avoid oxidation of beer. Never use plastic or vinyl equipment that is not marked as food grade. Some food grade plastics leach toxins after reaching a certain temperature. If plastic parts will be exposed to hot liquids or high temperatures, check the temperature rating with the supplier or manufacturer.",
    patterns_es: ["solventes?", "a solvente"],
    patterns_en: ["solvent", "solvent-like"]
  },
  {
    id: "sulfur",
    name_es: "Sulfuroso",
    name_en: "Sulfur/Hydrogen Sulfide",
    sensation_es: "Azufre, fósforo quemado, huevo podrido, aguas residuales.",
    sensation_en: "Sulfur, burning match, rotten egg, raw sewage.",
    causes_es: "El sulfuro de hidrógeno, químico responsable de dar al azufre su olor desagradable, es producido naturalmente por toda levadura durante la fermentación. Muchas levaduras lager pueden crear aromas a azufre abrumadores. Las cepas ale generalmente producen cantidades tan pequeñas que el olor es imperceptible.",
    causes_en: "Hydrogen sulfide, which is the chemical responsible for giving sulfur its unpleasant smell, is naturally produced by all yeast during fermentation. Many lager yeasts can create overwhelming sulfur-like aromas. Ale strains generally make such small amounts that the odor is unnoticeable.",
    prevention_es: "Durante la fermentación, la producción de sulfuro de hidrógeno es inevitable. El CO2 arrastrará la mayor parte de este compuesto. El acondicionamiento o maduración en frío (lagering) tras finalizar la fermentación primaria debería hacer que los olores o sabores a azufre restantes desaparezcan con el tiempo.",
    prevention_en: "During fermentation, the production of hydrogen sulfide is inevitable. Co2 will carry most of the hydrogen sulfide away. Conditioning or lagering after primary fermentation is complete should make any left over sulfur smells or tastes fade over time.",
    patterns_es: ["sulfuros[oa]s?", "azufre", "sulfuro de hidr[oó]geno"],
    patterns_en: ["sulfur", "sulfury", "hydrogen sulfide"]
  },
  {
    id: "sour",
    name_es: "Ácido / Agrio",
    name_en: "Sour/Acidic",
    sensation_es: "Avinagrado, acre, se siente en los laterales de la lengua hacia la parte posterior de la boca.",
    sensation_en: "Vinegary, acrid, felt on the sides of the tongue towards back of the mouth.",
    causes_es: "Los sabores extremadamente agrios o avinagrados son casi siempre el resultado de una infección bacteriana o por levaduras salvajes. Las cervezas de estilo Lambic son cervezas expuestas deliberadamente a tipos específicos de levaduras y bacterias salvajes para crear los inconfundibles sabores sidrosos y agrios por los que son conocidas.",
    causes_en: "Extremely sour or vinegary flavors are almost always the result of a bacterial or wild yeast infection. Lambic style beers are beers that have been purposely exposed to specific types of wild yeast and bacteria to create the unmistakable cidery and sour flavors they are known for.",
    prevention_es: "Las bacterias y levaduras salvajes están en el aire a nuestro alrededor todo el tiempo. Conocidas como 'bichos' en el mundo de la elaboración, estas bacterias y levaduras solo caen hacia abajo; no treparán hacia arriba ni entrarán solas. Asegúrate de sanitizar a fondo todo lo que entre en contacto con la cerveza post-hervido. Cubre la olla al enfriar el mosto. El mosto o cerveza por debajo de 82°C (180°F) es un caldo de cultivo ideal para contaminantes. La suciedad no se puede sanitizar, así que limpia el equipo antes de sanitizarlo si está visiblemente suio. Si usas un fermentador de plástico, revísalo en busca de rayaduras donde puedan esconderse las bacterias. Abre el fermentador solo cuando sea necesario. Usa levadura de alta calidad o haz un arrancador. Mientras más rápido empiece a fermentar la levadura, más probable es que supere y desplace a los contaminantes. ¡La sanitización adecuada es la clave para hacer buena cerveza!",
    prevention_en: "Bacteria and wild yeast are in the air, all around us, all of the time. Commonly referred to as “nasties” in the brewing world, these bacteria and yeast only fall downward – they will not crawl up an in. Make sure to thoroughly sanitize everything and anything that will be coming into contact with beer post boil. Cover your kettle when cooling your wort. Wort or beer that is under 180ºF is prime breading ground for bacteria and wild yeast. Dirt cannot be sanitized so clean equipment prior to sanitizing if it is visibly dirty. If using a plastic fermenter check it for any scratches, as these are a great place for bacteria to hide. Only open the fermenter when necessary. Use high quality yeast and/or make a yeast starter. The faster the yeast starts to ferment, the more likely they will over power or push out any nasties. Proper sanitation is one of the most important things when it comes to making great home brew!",
    patterns_es: ["[aá]cid[oa]s?", "agri[oa]s?", "acidez"],
    patterns_en: ["sour", "acidic", "acidity"]
  },
  {
    id: "sweet",
    name_es: "Dulce",
    name_en: "Sweet",
    sensation_es: "Excesivamente dulce o azucarado, mosto dulce, empalagoso.",
    sensation_en: "Overly sweet or sugary, sweet wort, cloyingly sweet.",
    causes_es: "Se desea cierto grado de dulzura en la mayoría de las cervezas, pero una cerveza que sabe a mosto sin fermentar es probablemente el resultado de que la levadura dejó de trabajar prematuramente. La fermentación detenida (stuck fermentation) ocurre cuando la levadura fermenta durante varios días y de repente se detiene. El resultado es una densidad mucho más alta que la densidad final correcta para el mosto. Usar una levadura que no tiene alta tolerancia al alcohol en una cerveza de alta densidad puede dejar demasiada dulzura residual. Una caída repentina de temperatura puede hacer que la levadura entre en estado de inactividad. Además, una cerveza que carece de la cantidad adecuada de amargor de lúpulo puede provocar una dulzura desequilibrada (empalagosa). Usar demasiado saborizante de frutas u otros adjuntos también puede causar una cerveza enfermizamente dulce.",
    causes_en: "Some degree of sweetness is desired in most beers, but a beer that tastes like unfermented wort is most likely the result of the yeast quitting prematurely. Stuck fermentation is when the yeast ferments for several days and then suddenly stops. The result is a gravity that is much higher than the correct final gravity for the wort. Using yeast that doesn’t have a high tolerance for alcohol in a high gravity beer can leave too much residual sweetness. A sudden drop in temperature can cause yeast to go dormant and stop fermenting. Also, beer that is lacking the right amount of hop bitterness can cause an unbalanced sweetness. Unbalanced sweetness is often described as “cloyingly sweet”. Using too much fruit flavoring or other adjuncts can cause a sickly-sweet beer as well.",
    prevention_es: "Usa siempre levadura de alta calidad e inocula la cantidad correcta para la densidad del mosto o haz un arrancador. Usa la cepa adecuada para el estilo. Las levaduras muy floculantes a veces caen al fondo antes de que termine la fermentación; inocular suficiente cantidad suele prevenir esto. Si buscas una cerveza seca y menos dulce, usa levaduras con alto porcentaje de atenuación. Si haces cervezas con alta graduación de alcohol, es muy importante usar nutrientes de levadura. Monitorea las temperaturas y evita fermentar por debajo del rango sugerido. Es posible reactivar la levadura inactiva agitando suavemente el fermentador e incrementando la temperatura de forma gradual. De lo contrario, inocular más levadura es otra opción. Al formular recetas, ten en cuenta que el equilibrio de sabores es lo que hace disfrutable a una cerveza. Si usas extractos de fruta, empieza con poco y agrega más al gusto.",
    prevention_en: "Always use high quality yeast and make sure you are pitching the correct amount for the gravity of the wort or make a yeast starter. Use the proper strain of yeast for the style of beer being made. Highly flocculant yeast can sometimes fall out of suspension before fermentation is over, however pitching enough yeast will usually prevent this. If you are aiming for a dry, less sweet beer, use yeast with a high attenuation percentage. If making a beer with very high alcohol content, it is very important to use yeast nutrients. Monitor fermentation temperatures and avoid fermenting lower than the suggested temperature range. It is possible to revive dormant yeast by gently swirling the fermenter and gradually raising the temperature. Otherwise, pitching more yeast is another option. When formulating recipes, keep in mind that you can highlight a sweet or bitter taste, but the balance of flavors is what makes a beer enjoyable. If using fruit extracts or flavoring, start with a little and add more to taste.",
    patterns_es: ["dulce", "dulces", "dulzor"],
    patterns_en: ["sweet", "sweetness"]
  },
  {
    id: "yeasty",
    name_es: "Levadura",
    name_en: "Yeasty",
    sensation_es: "Levadura, a pan crudo, puede ser áspero o ligeramente azufrado.",
    sensation_en: "Yeast, bready, can be harsh or slightly sulfur-like.",
    causes_es: "Levadura poco saludable o mutada puede liberar sabores 'a levadura' en la cerveza. Si la cerveza se deja reposar sobre levadura muerta por largo tiempo, esta comienza a digerirse a sí misma (autólisis) y se liberan sabores ásperos o azufrados. La cerveza joven puede saber a levadura si esta no ha tenido oportunidad de flocular por completo. Los sabores a levadura también pueden ser resultado de verter la levadura del fondo al servir desde una botella.",
    causes_en: "Unhealthy or mutated yeast can release “yeasty” flavors into beer. If beer is left sitting on dead yeast for a long period of time, dead yeast starts to essentially “eat” itself (autolysis) and harsh or sulfury flavors are released. Young beer can taste yeasty if the yeast has not had a chance to flocculate completely. Yeasty flavors can also be a result of pouring yeast when serving from a bottle.",
    prevention_es: "Si una cerveza como una lager se va a mantener en el fermentador por mucho tiempo, se recomienda transferirla a un fermentador secundario. Deja la mayor parte del sedimento en el fermentador primario al hacer trasvases. Cierto sedimento es inevitable al carbonatar en botella; si hay sedimento, deja el último centímetro de cerveza en la botella al servirla.",
    prevention_en: "If a beer such as a lager is going to be kept in a fermenter for a long period of time, using a secondary vessel is recommended. Always leave a majority of the trub in the primary fermenter when racking to a secondary fermenter, bottling bucket or keg. Some yeast sediment is unavoidable when carbonating in the bottle. If yeast sediment is present leave the last inch or so of beer in the bottle when pouring.",
    patterns_es: ["levadura", "levaduras", "a levadura"],
    patterns_en: ["yeasty", "yeast"]
  }
];

export function getOffFlavors(lang: 'es' | 'en'): {
  id: string;
  name: string;
  sensation: string;
  causes: string;
  prevention: string;
}[] {
  return OFF_FLAVORS_DATA.map(o => ({
    id: o.id,
    name: lang === 'es' ? o.name_es : o.name_en,
    sensation: lang === 'es' ? o.sensation_es : o.sensation_en,
    causes: lang === 'es' ? o.causes_es : o.causes_en,
    prevention: lang === 'es' ? o.prevention_es : o.prevention_en
  }));
}
