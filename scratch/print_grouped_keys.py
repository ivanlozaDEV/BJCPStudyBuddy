from extract_docx import extract_docx_text
import re

def group_styles(paragraphs):
    styles = {}
    for idx, p in enumerate(paragraphs):
        p_clean = p.strip()
        style_header_match = re.match(r'^(\d+[A-Z])\.\s+(.*)$', p_clean)
        if style_header_match and idx > 150:
            style_id = style_header_match.group(1)
            styles[style_id] = p_clean
    return styles

es_paragraphs = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")
es_grouped = group_styles(es_paragraphs)

print(f"Total keys: {len(es_grouped)}")
print("All Keys:")
print(sorted(list(es_grouped.keys())))
