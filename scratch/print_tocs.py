from extract_docx import extract_docx_text
import re

es_text = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")
en_text = extract_docx_text("2021_Guidelines_Beer_1.25.docx")

def print_toc_items(paragraphs, doc_name):
    print(f"\n--- TABLE OF CONTENTS ITEMS FOR: {doc_name} ---")
    items = []
    # Table of contents is usually within the first 120 paragraphs
    for idx, p in enumerate(paragraphs[:120]):
        p_clean = p.strip()
        # Look for things like "1A.", "21A.", or "1." at the start of a paragraph
        if re.match(r'^[0-9a-zA-Z\.]+\s+.*$', p_clean):
            items.append((idx, p_clean))
            print(f"Line {idx}: {p_clean}")
    return items

es_toc = print_toc_items(es_text, "SPANISH")
en_toc = print_toc_items(en_text, "ENGLISH")
