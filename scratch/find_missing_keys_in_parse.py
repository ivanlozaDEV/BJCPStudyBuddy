from extract_docx import extract_docx_text
import re

def group_styles(paragraphs):
    styles = {}
    current_style = None
    
    for idx, p in enumerate(paragraphs):
        p_clean = p.strip()
        if not p_clean:
            continue
            
        style_header_match = re.match(r'^(\d+[A-Z])\.\s+(.*)$', p_clean)
        
        if style_header_match and idx > 150:
            style_id = style_header_match.group(1)
            style_name = style_header_match.group(2)
            style_name = re.sub(r'\d+$', '', style_name).strip()
            
            current_style = {
                "id": style_id,
                "name": style_name,
                "line": idx
            }
            styles[style_id] = current_style
            
    return styles

es_paragraphs = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")
en_paragraphs = extract_docx_text("2021_Guidelines_Beer_1.25.docx")

es_grouped = group_styles(es_paragraphs)
en_grouped = group_styles(en_paragraphs)

print(f"Grouped ES count: {len(es_grouped)}")
print(f"Grouped EN count: {len(en_grouped)}")

es_keys = set(es_grouped.keys())
en_keys = set(en_grouped.keys())

print(f"\nKeys in EN but not in ES: {en_keys - es_keys}")
print(f"Keys in ES but not in EN: {es_keys - en_keys}")

print("\n--- Details of EN keys NOT in ES ---")
for k in (en_keys - es_keys):
    print(f" {k}: {en_grouped[k]}")

print("\n--- Details of ES keys NOT in EN ---")
for k in (es_keys - en_keys):
    print(f" {k}: {es_grouped[k]}")
