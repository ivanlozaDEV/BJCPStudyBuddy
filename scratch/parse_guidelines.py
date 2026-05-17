import re
import json
import os
from extract_docx import extract_docx_text

def clean_label(text):
    """Removes trailing colon and spaces from headings like 'Aroma:'"""
    text = text.strip()
    if text.endswith(':'):
        text = text[:-1]
    return text.strip()

def parse_vital_stats(stats_text_list):
    """Parses vital stats text lines into standard VitalStats ranges and min/max numbers."""
    stats = {
        "og": "N/A", "fg": "N/A", "abv": "N/A", "ibu": "N/A", "srm": "N/A",
        "abvMin": 0.0, "abvMax": 0.0,
        "ibuMin": 0.0, "ibuMax": 0.0,
        "srmMin": 0.0, "srmMax": 0.0
    }
    
    joined = " ".join(stats_text_list).replace("–", "-").replace("—", "-")
    
    # Extract OG (e.g. OG: 1.040 - 1.050)
    og_match = re.search(r'OG:\s*([0-9\.]+)\s*-\s*([0-9\.]+)', joined, re.IGNORECASE)
    if og_match:
        stats["og"] = f"{og_match.group(1)} - {og_match.group(2)}"
        
    # Extract FG (e.g. FG: 1.008 - 1.014)
    fg_match = re.search(r'FG:\s*([0-9\.]+)\s*-\s*([0-9\.]+)', joined, re.IGNORECASE)
    if fg_match:
        stats["fg"] = f"{fg_match.group(1)} - {fg_match.group(2)}"
        
    # Extract ABV (e.g. ABV: 4.2 - 5.3% or 4.2% - 5.3%)
    abv_match = re.search(r'ABV:\s*([0-9\.]+)\s*%?\s*-\s*([0-9\.]+)\s*%?', joined, re.IGNORECASE)
    if abv_match:
        stats["abv"] = f"{abv_match.group(1)}% - {abv_match.group(2)}%"
        stats["abvMin"] = float(abv_match.group(1))
        stats["abvMax"] = float(abv_match.group(2))
        
    # Extract IBU (e.g. IBU: 8 - 12)
    ibu_match = re.search(r'IBU:\s*([0-9\.]+)\s*-\s*([0-9\.]+)', joined, re.IGNORECASE)
    if ibu_match:
        stats["ibu"] = f"{ibu_match.group(1)} - {ibu_match.group(2)}"
        stats["ibuMin"] = float(ibu_match.group(1))
        stats["ibuMax"] = float(ibu_match.group(2))
        
    # Extract SRM (e.g. SRM: 2 - 3.5)
    srm_match = re.search(r'SRM:\s*([0-9\.]+)\s*-\s*([0-9\.]+)', joined, re.IGNORECASE)
    if srm_match:
        stats["srm"] = f"{srm_match.group(1)} - {srm_match.group(2)}"
        stats["srmMin"] = float(srm_match.group(1))
        stats["srmMax"] = float(srm_match.group(2))
        
    return stats

def preprocess_paragraphs(paragraphs, is_spanish):
    """Splits joined paragraphs caused by translation layout errors in Word XML."""
    processed = []
    imp_keywords = ["Impresión general:", "Impresion general:", "Overall Impression:", "Overall impression:"]
    sentence_words = ["las", "los", "un", "una", "de", "pueden", "intended", "for", "variations", "variantes", "base", "style", "este", "esta"]
    
    for idx, p in enumerate(paragraphs):
        p_clean = p.strip()
        if not p_clean:
            continue
            
        # Rule 1: Split merged trailing headers (e.g. tags merged with the next style header like 17B)
        tag_header_match = re.search(r'\b(\d+[A-Z]|X\d+)\.\s+([A-Z].*)$', p_clean)
        if tag_header_match and idx > 250:
            start_pos = tag_header_match.start()
            if start_pos > 5:
                style_name = tag_header_match.group(2)
                words = [w.lower() for w in style_name.split()[:3]]
                is_sentence = any(w in sentence_words for w in words)
                
                if not is_sentence:
                    part1 = p_clean[:start_pos].strip()
                    part2 = p_clean[start_pos:].strip()
                    print(f"[PREPROCESS] Split Rule 1 line {idx} into:\n  -> {part1}\n  -> {part2}")
                    p_clean = part2
                    processed.append(part1)
                    
        # Rule 2: Split merged style header + overall impression in the same paragraph (e.g. 3B, 25C, 27-Porter)
        is_header = (re.match(r'^(\d+[A-Z\d]*|X\d+)\.\s+(.*)$', p_clean) or 
                     p_clean.startswith("Specialty IPA:") or 
                     p_clean.startswith("Historical Beer:") or 
                     p_clean.startswith("IPA Especialidad:"))
                     
        if is_header and idx > 250:
            for kw in imp_keywords:
                if kw in p_clean:
                    pos = p_clean.find(kw)
                    part1 = p_clean[:pos].strip()
                    part2 = p_clean[pos:].strip()
                    print(f"[PREPROCESS] Split Rule 2 line {idx} into:\n  -> {part1}\n  -> {part2}")
                    processed.append(part1)
                    p_clean = part2
                    break
                    
        processed.append(p_clean)
        
    return processed

def group_styles(paragraphs):
    """Groups preprocessed paragraphs by BeerStyle, returning a dictionary keyed by ID."""
    styles = {}
    current_style = None
    appendices_started = False
    
    for idx, p_clean in enumerate(paragraphs):
        # Stop at appendices to avoid matching lists/alternative categories
        if idx > 250:
            if "Apéndice A:" in p_clean or "Appendix A:" in p_clean or "APÉNDICE A:" in p_clean or "APPENDIX A:" in p_clean:
                appendices_started = True
                
        if appendices_started:
            continue
            
        # Skip Table of Contents
        if idx < 250:
            continue
            
        # Match standard styles (1A. American Light Lager, X5. New Zealand Pilsner, etc.)
        style_header_match = re.match(r'^(\d+[A-Z\d]*|X\d+)\.\s+(.*)$', p_clean)
        
        # Match sub-styles (Specialty IPA: Black IPA, Historical Beer: Kellerbier, etc.)
        specialty_match = None
        for prefix in ["Specialty IPA:", "Historical Beer:", "IPA Especialidad:"]:
            if p_clean.startswith(prefix):
                name = p_clean[len(prefix):].strip()
                name_clean = re.sub(r'\d+$', '', name).strip()
                pseudo_id = "21B-" + name_clean.replace(" ", "") if "IPA" in prefix else "27-" + name_clean.replace(" ", "")
                specialty_match = (pseudo_id, p_clean)
                break
                
        if style_header_match and '...' not in p_clean:
            style_id = style_header_match.group(1)
            style_name = re.sub(r'\d+$', '', style_header_match.group(2)).strip()
            
            current_style = {
                "id": style_id,
                "name": style_name,
                "raw_paragraphs": []
            }
            styles[style_id] = current_style
        elif specialty_match:
            style_id, style_name = specialty_match
            current_style = {
                "id": style_id,
                "name": style_name,
                "raw_paragraphs": []
            }
            styles[style_id] = current_style
        elif current_style:
            current_style["raw_paragraphs"].append(p_clean)
            
    return styles

def parse_style_fields(style_data, is_spanish=True):
    """Parses grouped paragraphs of a style into structured object fields."""
    parsed = {
        "overallImpression": "",
        "aroma": "",
        "appearance": "",
        "flavor": "",
        "mouthfeel": "",
        "comments": "",
        "history": "",
        "comparison": "",
        "ingredients": "",
        "commercialExamples": [],
        "tags": [],
        "raw_stats": []
    }
    
    # Setup key prefixes to extract descriptions
    if is_spanish:
        prefixes = {
            "overallImpression": ["Impresión general:", "Impresion general:"],
            "aroma": ["Aroma:"],
            "appearance": ["Apariencia:"],
            "flavor": ["Sabor:"],
            "mouthfeel": ["Sensación en boca:", "Sensacion en boca:"],
            "comments": ["Comentarios:"],
            "history": ["Historia:"],
            "comparison": ["Comparación de estilos:", "Comparacion de estilos:"],
            "ingredients": ["Ingredientes característicos:", "Ingredientes caracteristicos:", "Ingredientes:"],
            "commercialExamples": ["Ejemplos comerciales:", "Ejemplos Comerciales:", "Ejemplos comerciales", "Ejemplos Comerciales"],
            "tags": ["Etiquetas:"],
            "raw_stats": ["Estadísticas vitales:", "Estadisticas vitales:"]
        }
    else:
        prefixes = {
            "overallImpression": ["Overall Impression:"],
            "aroma": ["Aroma:"],
            "appearance": ["Appearance:"],
            "flavor": ["Flavor:"],
            "mouthfeel": ["Mouthfeel:"],
            "comments": ["Comments:"],
            "history": ["History:"],
            "comparison": ["Style Comparison:", "Comparison:"],
            "ingredients": ["Characteristic Ingredients:", "Ingredients:"],
            "commercialExamples": ["Commercial Examples:"],
            "tags": ["Tags:"],
            "raw_stats": ["Vital Statistics:"]
        }
        
    current_field = None
    
    for p in style_data["raw_paragraphs"]:
        found_prefix = False
        for field, prefix_list in prefixes.items():
            for prefix in prefix_list:
                if p.startswith(prefix):
                    current_field = field
                    val = p[len(prefix):].strip()
                    if field in ["commercialExamples", "tags"]:
                        parsed[field] = [x.strip() for x in val.split(",") if x.strip()]
                    elif field == "raw_stats":
                        parsed[field] = [val]
                    else:
                        parsed[field] = val
                    found_prefix = True
                    break
            if found_prefix:
                break
                
        if not found_prefix and current_field:
            # Append trailing/wrapped lines to the active field
            if current_field in ["commercialExamples", "tags"]:
                parsed[current_field].extend([x.strip() for x in p.split(",") if x.strip()])
            elif current_field == "raw_stats":
                parsed[current_field].append(p.strip())
            else:
                parsed[current_field] = (parsed[current_field] + " " + p.strip()).strip()
                
    # Parse vital stats
    stats = parse_vital_stats(parsed["raw_stats"])
    parsed.update(stats)
    del parsed["raw_stats"]
    
    return parsed

# Process files
print("Loading documents...")
es_paragraphs_raw = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")
en_paragraphs_raw = extract_docx_text("2021_Guidelines_Beer_1.25.docx")

print("Pre-processing text paragraphs to split merged translation layout issues...")
es_paragraphs = preprocess_paragraphs(es_paragraphs_raw, is_spanish=True)
en_paragraphs = preprocess_paragraphs(en_paragraphs_raw, is_spanish=False)

print("Grouping styles by ID...")
es_grouped = group_styles(es_paragraphs)
en_grouped = group_styles(en_paragraphs)

print(f"Grouped {len(es_grouped)} styles in Spanish.")
print(f"Grouped {len(en_grouped)} styles in English.")

# Merge bilingually by style ID
bilingual_data = []
all_keys = sorted(list(set(es_grouped.keys()).intersection(set(en_grouped.keys()))))

print(f"Merging {len(all_keys)} matching bilingual styles...")

# We will also parse the Category headers dynamically
categories_map_es = {}
categories_map_en = {}

# Re-scan paragraphs to extract the category names matching style prefixes
for idx, p in enumerate(es_paragraphs):
    m = re.match(r'^(\d+)\.\s+(.*)$', p.strip())
    if m and idx > 150:
        cat_num = m.group(1)
        cat_name = re.sub(r'\d+$', '', m.group(2)).strip()
        if not '.' in cat_num and not "Introducción" in cat_name:
            categories_map_es[cat_num] = f"{cat_num}. {cat_name}"

for idx, p in enumerate(en_paragraphs):
    m = re.match(r'^(\d+)\.\s+(.*)$', p.strip())
    if m and idx > 150:
        cat_num = m.group(1)
        cat_name = re.sub(r'\d+$', '', m.group(2)).strip()
        if not '.' in cat_num and not "Introduction" in cat_name:
            categories_map_en[cat_num] = f"{cat_num}. {cat_name}"

print(f"Discovered {len(categories_map_es)} category names in Spanish.")
print(f"Discovered {len(categories_map_en)} category names in English.")

for style_id in all_keys:
    es_style = es_grouped[style_id]
    en_style = en_grouped[style_id]
    
    es_fields = parse_style_fields(es_style, is_spanish=True)
    en_fields = parse_style_fields(en_style, is_spanish=False)
    
    # Get Category IDs
    cat_id_match = re.match(r'^(\d+)', style_id)
    cat_id = cat_id_match.group(1) if cat_id_match else "0"
    
    cat_es = categories_map_es.get(cat_id, f"{cat_id}. Cerveza" if cat_id != "0" else "Estilos Especiales")
    cat_en = categories_map_en.get(cat_id, f"{cat_id}. Beer" if cat_id != "0" else "Specialty Styles")
    
    bilingual_style = {
        "id": style_id,
        "name_es": es_style["name"],
        "name_en": en_style["name"],
        "category_es": cat_es,
        "category_en": cat_en,
        "overallImpression_es": es_fields["overallImpression"],
        "overallImpression_en": en_fields["overallImpression"],
        "aroma_es": es_fields["aroma"],
        "aroma_en": en_fields["aroma"],
        "appearance_es": es_fields["appearance"],
        "appearance_en": en_fields["appearance"],
        "flavor_es": es_fields["flavor"],
        "flavor_en": en_fields["flavor"],
        "mouthfeel_es": es_fields["mouthfeel"],
        "mouthfeel_en": en_fields["mouthfeel"],
        "comments_es": es_fields["comments"],
        "comments_en": en_fields["comments"],
        "history_es": es_fields["history"],
        "history_en": en_fields["history"],
        "comparison_es": es_fields["comparison"],
        "comparison_en": en_fields["comparison"],
        "ingredients_es": es_fields["ingredients"],
        "ingredients_en": en_fields["ingredients"],
        
        "vitalStatistics": {
            "og": es_fields["og"] if es_fields["og"] != "N/A" else en_fields["og"],
            "fg": es_fields["fg"] if es_fields["fg"] != "N/A" else en_fields["fg"],
            "abv": es_fields["abv"] if es_fields["abv"] != "N/A" else en_fields["abv"],
            "ibu": es_fields["ibu"] if es_fields["ibu"] != "N/A" else en_fields["ibu"],
            "srm": es_fields["srm"] if es_fields["srm"] != "N/A" else en_fields["srm"]
        },
        "abvMin": es_fields["abvMin"] if es_fields["abvMin"] > 0 else en_fields["abvMin"],
        "abvMax": es_fields["abvMax"] if es_fields["abvMax"] > 0 else en_fields["abvMax"],
        "ibuMin": es_fields["ibuMin"] if es_fields["ibuMin"] > 0 else en_fields["ibuMin"],
        "ibuMax": es_fields["ibuMax"] if es_fields["ibuMax"] > 0 else en_fields["ibuMax"],
        "srmMin": es_fields["srmMin"] if es_fields["srmMin"] > 0 else en_fields["srmMin"],
        "srmMax": es_fields["srmMax"] if es_fields["srmMax"] > 0 else en_fields["srmMax"],
        
        # Commercial examples are usually shared but we merge them to get the richest lists
        "commercialExamples": sorted(list(set(es_fields["commercialExamples"] + en_fields["commercialExamples"]))),
        "tags_es": es_fields["tags"],
        "tags_en": en_fields["tags"]
    }
    
    bilingual_data.append(bilingual_style)

print(f"Successfully processed {len(bilingual_data)} bilingual beer styles!")

# Write out the JSON database
output_filepath = "src/data/bjcp2021_bilingual.json"
with open(output_filepath, "w", encoding="utf-8") as f:
    json.dump(bilingual_data, f, ensure_ascii=False, indent=2)

print(f"Saved database to {output_filepath}")
