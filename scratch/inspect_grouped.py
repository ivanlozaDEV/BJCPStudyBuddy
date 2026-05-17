from extract_docx import extract_docx_text
import re

es_text = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")
en_text = extract_docx_text("2021_Guidelines_Beer_1.25.docx")

def find_styles_flexible(paragraphs):
    styles = {}
    current_id = None
    current_name = ""
    
    for idx, p in enumerate(paragraphs):
        p_clean = p.strip()
        if idx < 150:
            continue
            
        # Match standard style ID like "1A. American Light Lager" or specialty types
        # Standard: 1A, 21A, 27A
        m = re.match(r'^(\d+[A-Z])\.\s+(.*)$', p_clean)
        if m:
            style_id = m.group(1)
            name = re.sub(r'\d+$', '', m.group(2)).strip()
            if '...' not in p_clean:
                styles[style_id] = name
                continue
                
        # Also check for Specialty IPA subheadings like "Specialty IPA: Belgian IPA"
        # and Historical Beer subheadings like "Historical Beer: Pre-Pro Lager"
        # These are sometimes written as separate sub-styles!
        # Let's see if they start with these prefixes:
        for prefix in ["Specialty IPA:", "Historical Beer:"]:
            if p_clean.startswith(prefix):
                name = p_clean[len(prefix):].strip()
                name = re.sub(r'\d+$', '', name).strip()
                # Create a pseudo-ID like "21B-Belgian" or "27-PrePro"
                pseudo_id = prefix.split()[0][:4] + "-" + name[:8].replace(" ", "")
                styles[pseudo_id] = p_clean
                
    return styles

es_styles = find_styles_flexible(es_text)
en_styles = find_styles_flexible(en_text)

print(f"Flexible ES parsed styles: {len(es_styles)}")
print(f"Flexible EN parsed styles: {len(en_styles)}")

en_only = sorted(list(en_styles.keys() - es_styles.keys()))
es_only = sorted(list(es_styles.keys() - en_styles.keys()))

print(f"\nStyles in English but not in Spanish ({len(en_only)}):")
for i in en_only:
    print(f" - {i}: {en_styles[i]}")

print(f"\nStyles in Spanish but not in English ({len(es_only)}):")
for i in es_only:
    print(f" - {i}: {es_styles[i]}")
