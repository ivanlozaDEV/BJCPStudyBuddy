from extract_docx import extract_docx_text
import re

es_text = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")
en_text = extract_docx_text("2021_Guidelines_Beer_1.25.docx")

def get_detailed_styles(paragraphs, is_spanish):
    styles = {}
    current_style_id = None
    current_style_name = ""
    
    # Prefix to check for detailed styles
    impression_prefix = "Impresión general:" if is_spanish else "Overall Impression:"
    
    for idx, p in enumerate(paragraphs):
        p_clean = p.strip()
        if idx < 150:
            continue
            
        # Match standard style heading pattern, e.g. "1A. American Light Lager" or specialty names
        header_match = re.match(r'^([a-zA-Z0-9\-\.]+)\.\s+(.*)$', p_clean)
        
        # We also check for sub-styles like "Specialty IPA: Belgian IPA" or "Historical Beer: Kellerbier"
        specialty_match = None
        for prefix in ["Specialty IPA:", "Historical Beer:"]:
            if p_clean.startswith(prefix):
                name = p_clean[len(prefix):].strip()
                # Remove trailing page numbers
                name_clean = re.sub(r'\d+$', '', name).strip()
                specialty_match = (prefix.split()[0][:4] + "-" + name_clean[:10].replace(" ", ""), p_clean)
                break
                
        if header_match and '...' not in p_clean:
            current_style_id = header_match.group(1)
            current_style_name = re.sub(r'\d+$', '', header_match.group(2)).strip()
        elif specialty_match:
            current_style_id = specialty_match[0]
            current_style_name = specialty_match[1]
            
        # If we see the Overall Impression paragraph, we officially count this style as active and fully described!
        if current_style_id and p_clean.startswith(impression_prefix):
            styles[current_style_id] = current_style_name
            # Reset so we don't accidentally match sub-paragraphs
            current_style_id = None
            
    return styles

es_detailed = get_detailed_styles(es_text, is_spanish=True)
en_detailed = get_detailed_styles(en_text, is_spanish=False)

print(f"Total fully described styles in Spanish: {len(es_detailed)}")
print(f"Total fully described styles in English: {len(en_detailed)}")

en_only = sorted(list(en_detailed.keys() - es_detailed.keys()))
es_only = sorted(list(es_detailed.keys() - en_detailed.keys()))

print(f"\nStyles in English but missing in Spanish ({len(en_only)}):")
for i in en_only:
    print(f" - {i}: {en_detailed[i]}")

print(f"\nStyles in Spanish but missing in English ({len(es_only)}):")
for i in es_only:
    print(f" - {i}: {es_detailed[i]}")
