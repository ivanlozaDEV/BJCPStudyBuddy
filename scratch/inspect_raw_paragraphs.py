from extract_docx import extract_docx_text
import re

es_paragraphs = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")

def group_styles(paragraphs):
    styles = {}
    current_style = None
    
    for idx, p in enumerate(paragraphs):
        p_clean = p.strip()
        style_header_match = re.match(r'^(\d+[A-Z])\.\s+(.*)$', p_clean)
        if style_header_match and idx > 150:
            style_id = style_header_match.group(1)
            current_style = {
                "id": style_id,
                "name": style_header_match.group(2),
                "raw_paragraphs": []
            }
            styles[style_id] = current_style
        elif current_style:
            current_style["raw_paragraphs"].append(p_clean)
    return styles

es_grouped = group_styles(es_paragraphs)

print("--- Raw Paragraphs for Style 1A in SPANISH ---")
if "1A" in es_grouped:
    for idx, p in enumerate(es_grouped["1A"]["raw_paragraphs"][:15]):
        print(f"P {idx}: {repr(p)}")
else:
    print("1A not grouped!")
