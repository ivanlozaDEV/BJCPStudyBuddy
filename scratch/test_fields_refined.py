from extract_docx import extract_docx_text
import re
import json

es_text = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")
en_text = extract_docx_text("2021_Guidelines_Beer_1.25.docx")

def preprocess_paragraphs(paragraphs, is_spanish):
    processed = []
    imp_keywords = ["Impresión general:", "Impresion general:", "Overall Impression:", "Overall impression:"]
    
    # Sentence keywords to avoid false splits in descriptions
    sentence_words = ["las", "los", "un", "una", "de", "pueden", "intended", "for", "variations", "variantes", "base", "style", "este", "esta"]
    
    for idx, p in enumerate(paragraphs):
        p_clean = p.strip()
        if not p_clean:
            continue
            
        # Rule 1: Split if a style code like "17B. " or "25C. " is appended inside the paragraph
        tag_header_match = re.search(r'\b(\d+[A-Z]|X\d+)\.\s+([A-Z].*)$', p_clean)
        if tag_header_match and idx > 250:
            start_pos = tag_header_match.start()
            if start_pos > 5:
                # Check if it looks like a sentence rather than a style name
                style_name = tag_header_match.group(2)
                words = [w.lower() for w in style_name.split()[:3]]
                is_sentence = any(w in sentence_words for w in words)
                
                if not is_sentence:
                    part1 = p_clean[:start_pos].strip()
                    part2 = p_clean[start_pos:].strip()
                    print(f"[SPLIT Rule 1] Split line {idx} into:\n  -> {part1}\n  -> {part2}")
                    p_clean = part2
                    processed.append(part1)
                
        # Rule 2: Split if ANY style header (standard or specialty) has Impression in the same paragraph
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
                    print(f"[SPLIT Rule 2] Split line {idx} into:\n  -> {part1}\n  -> {part2}")
                    processed.append(part1)
                    p_clean = part2
                    break
                    
        processed.append(p_clean)
        
    return processed

es_processed = preprocess_paragraphs(es_text, is_spanish=True)
en_processed = preprocess_paragraphs(en_text, is_spanish=False)

def extract_styles_refined(paragraphs, is_spanish):
    styles = {}
    current_style = None
    appendices_started = False
    
    for idx, p_clean in enumerate(paragraphs):
        if idx > 250:
            if "Apéndice A:" in p_clean or "Appendix A:" in p_clean or "APÉNDICE A:" in p_clean or "APPENDIX A:" in p_clean:
                appendices_started = True
            
        if appendices_started:
            continue
            
        if idx < 250:
            continue
            
        style_header_match = re.match(r'^(\d+[A-Z\d]*|X\d+)\.\s+(.*)$', p_clean)
        
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

es_styles = extract_styles_refined(es_processed, is_spanish=True)
en_styles = extract_styles_refined(en_processed, is_spanish=False)

def parse_style_fields(style_data, is_spanish):
    parsed = {
        "overallImpression": "", "aroma": "", "appearance": "", "flavor": "",
        "mouthfeel": "", "comments": "", "history": "", "comparison": "",
        "ingredients": "", "commercialExamples": [], "tags": [], "raw_stats": []
    }
    
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
            if current_field in ["commercialExamples", "tags"]:
                parsed[current_field].extend([x.strip() for x in p.split(",") if x.strip()])
            elif current_field == "raw_stats":
                parsed[current_field].append(p.strip())
            else:
                parsed[current_field] = (parsed[current_field] + " " + p.strip()).strip()
                
    return parsed

print("--- Testing Field Parsing ---")
empty_es_count = 0
empty_en_count = 0

for k in sorted(list(es_styles.keys())):
    es_f = parse_style_fields(es_styles[k], is_spanish=True)
    en_f = parse_style_fields(en_styles[k], is_spanish=False)
    
    if not es_f["overallImpression"].strip() or not es_f["aroma"].strip():
        empty_es_count += 1
        print(f" ES Blank: {k} ({es_styles[k]['name'][:40]}) - paragraphs count: {len(es_styles[k]['raw_paragraphs'])}")
        for idx, p in enumerate(es_styles[k]['raw_paragraphs'][:4]):
            print(f"   P {idx}: {repr(p[:100])}")
            
    if not en_f["overallImpression"].strip() or not en_f["aroma"].strip():
        empty_en_count += 1
        print(f" EN Blank: {k} ({en_styles[k]['name'][:40]})")

print(f"Empty ES Count: {empty_es_count}")
print(f"Empty EN Count: {empty_en_count}")
