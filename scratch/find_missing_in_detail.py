import re
from extract_docx import extract_docx_text

es_paragraphs = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")
en_paragraphs = extract_docx_text("2021_Guidelines_Beer_1.25.docx")

def get_actual_styles(paragraphs):
    styles = {}
    # actual styles start after paragraph 150
    for idx, p in enumerate(paragraphs):
        if idx > 150:
            # Match standard style IDs like "1A.", "21A.", "PR1.", "C1A.", etc.
            m = re.match(r'^([a-zA-Z0-9\-\.]+)\.\s+(.*)$', p.strip())
            if m:
                style_id = m.group(1)
                name = m.group(2)
                # Keep standard style formats (excluding TOC elements)
                if (re.match(r'^\d+[A-Z]$', style_id) or re.match(r'^[A-Z]+\d+[A-Z]?$', style_id)) and len(style_id) <= 6:
                    name_clean = re.sub(r'\d+$', '', name).strip()
                    # Ensure it is not a TOC line
                    if '...' not in p:
                        styles[style_id] = name_clean
    return styles

es_styles = get_actual_styles(es_paragraphs)
en_styles = get_actual_styles(en_paragraphs)

print(f"Parsed {len(es_styles)} actual styles in Spanish.")
print(f"Parsed {len(en_styles)} actual styles in English.")

en_only = sorted(list(en_styles.keys() - es_styles.keys()))
es_only = sorted(list(es_styles.keys() - en_styles.keys()))

print(f"\n--- Styles present in English but missing in Spanish ({len(en_only)}) ---")
for i in en_only:
    print(f" - {i}: {en_styles[i]}")

print(f"\n--- Styles present in Spanish but missing in English ({len(es_only)}) ---")
for i in es_only:
    print(f" - {i}: {es_styles[i]}")
