from extract_docx import extract_docx_text
import re

es_text = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")
en_text = extract_docx_text("2021_Guidelines_Beer_1.25.docx")

def preprocess_paragraphs(paragraphs, is_spanish):
    processed = []
    
    # Keywords for splitting Header and Impression
    imp_keywords = ["Impresión general:", "Impresion general:", "Overall Impression:", "Overall impression:"]
    
    for idx, p in enumerate(paragraphs):
        p_clean = p.strip()
        if not p_clean:
            continue
            
        # Rule 1: Split if a style code like "17B. " or "25C. " is appended inside the paragraph
        tag_header_match = re.search(r'\b(\d+[A-Z]|X\d+)\.\s+([A-Z].*)$', p_clean)
        if tag_header_match and idx > 250:
            start_pos = tag_header_match.start()
            if start_pos > 5:
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
        # Stop at appendices
        if idx > 250:
            if "Apéndice A:" in p_clean or "Appendix A:" in p_clean or "APÉNDICE A:" in p_clean or "APPENDIX A:" in p_clean:
                appendices_started = True
            
        if appendices_started:
            continue
            
        # Table of contents check (skip first 250 paragraphs)
        if idx < 250:
            continue
            
        # Match standard styles, e.g., "1A. American Light Lager" or local "X1. Dorada Pampeana"
        style_header_match = re.match(r'^(\d+[A-Z\d]*|X\d+)\.\s+(.*)$', p_clean)
        
        # Match sub-styles like "Specialty IPA: Belgian IPA" or "Historical Beer: Kellerbier"
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

print(f"\nFinal ES styles found: {len(es_styles)}")
print(f"Final EN styles found: {len(en_styles)}")

es_keys = set(es_styles.keys())
en_keys = set(en_styles.keys())
print(f"\nKeys in EN but not in ES ({len(en_keys - es_keys)}): {en_keys - es_keys}")
print(f"Keys in ES but not in EN ({len(es_keys - en_keys)}): {es_keys - en_keys}")
