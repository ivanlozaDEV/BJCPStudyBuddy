from extract_docx import extract_docx_text
import re

es_text = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")
en_text = extract_docx_text("2021_Guidelines_Beer_1.25.docx")

def find_categories(paragraphs, doc_name):
    print(f"\n--- Category Headers in {doc_name} ---")
    cat_headers = []
    for idx, p in enumerate(paragraphs):
        p_clean = p.strip()
        # Look for headers that are uppercase or starting with digit, e.g., "1. Standard American Beer"
        # or cider/mead headers like "C1. New World Cider" or "M1. Traditional Mead"
        if idx > 150 and '...' not in p_clean:
            m = re.match(r'^([A-Z0-9]+)\.\s+([A-Za-z\s/]+)$', p_clean)
            if m:
                cat_id = m.group(1)
                name = m.group(2)
                if len(cat_id) <= 4:
                    cat_headers.append((idx, cat_id, name))
                    print(f"Line {idx}: ID {cat_id} -> {name}")
    return cat_headers

es_cats = find_categories(es_text, "SPANISH")
en_cats = find_categories(en_text, "ENGLISH")

es_keys = set([c[1] for c in es_cats])
en_keys = set([c[1] for c in en_cats])

print(f"\nCategories in English but not in Spanish: {en_keys - es_keys}")
print(f"Categories in Spanish but not in English: {es_keys - en_keys}")
