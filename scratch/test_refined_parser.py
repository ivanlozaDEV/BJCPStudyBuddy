from extract_docx import extract_docx_text
import re

es_text = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")
en_text = extract_docx_text("2021_Guidelines_Beer_1.25.docx")

def extract_styles_refined(paragraphs, is_spanish):
    styles = {}
    current_style = None
    appendices_started = False
    
    for idx, p in enumerate(paragraphs):
        p_clean = p.strip()
        if not p_clean:
            continue
            
        # Only check for appendices after the Table of Contents
        if idx > 250:
            if "Apéndice A:" in p_clean or "Appendix A:" in p_clean or "APÉNDICE A:" in p_clean or "APPENDIX A:" in p_clean:
                appendices_started = True
            
        if appendices_started:
            continue
            
        # Table of contents check (skip first 250 paragraphs)
        if idx < 250:
            continue
            
        # Match standard styles, e.g., "1A. American Light Lager" or local "X1. Dorada Pampeana"
        style_header_match = re.match(r'^([0-9a-zA-Z]+)\.\s+(.*)$', p_clean)
        
        # Match sub-styles like "Specialty IPA: Belgian IPA" or "Historical Beer: Kellerbier"
        specialty_match = None
        for prefix in ["Specialty IPA:", "Historical Beer:", "IPA Especialidad:"]:
            if p_clean.startswith(prefix):
                name = p_clean[len(prefix):].strip()
                name_clean = re.sub(r'\d+$', '', name).strip()
                # Create a pseudo-ID like "21B-BelgianIPA" or "27-Kellerbier"
                pseudo_id = "21B-" + name_clean.replace(" ", "") if "IPA" in prefix else "27-" + name_clean.replace(" ", "")
                specialty_match = (pseudo_id, p_clean)
                break
                
        if style_header_match and '...' not in p_clean:
            style_id = style_header_match.group(1)
            style_name = re.sub(r'\d+$', '', style_header_match.group(2)).strip()
            
            # Avoid matching category headers like "1." or "2."
            if len(style_id) >= 2 and not style_id.isdigit():
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

es_styles = extract_styles_refined(es_text, is_spanish=True)
en_styles = extract_styles_refined(en_text, is_spanish=False)

print(f"Refined ES styles found: {len(es_styles)}")
print(f"Refined EN styles found: {len(en_styles)}")

print("\nSample ES Style IDs:", sorted(list(es_styles.keys()))[:15])
print("Sample EN Style IDs:", sorted(list(en_styles.keys()))[:15])

# Print what styles are in English but not in Spanish or vice versa
es_keys = set(es_styles.keys())
en_keys = set(en_styles.keys())
print(f"\nKeys in EN but not in ES: {en_keys - es_keys}")
print(f"Keys in ES but not in EN: {es_keys - en_keys}")
