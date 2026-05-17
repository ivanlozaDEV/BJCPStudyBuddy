import re
from extract_docx import extract_docx_text

es_text = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")
en_text = extract_docx_text("2021_Guidelines_Beer_1.25.docx")

# Pattern for category (e.g. "1. Standard American Beer" or "21. IPA")
category_pat = re.compile(r'^\d+\.\s+[A-Za-z\s]+$')

# Pattern for style (e.g. "1A. American Light Lager" or "21A. American IPA")
style_pat = re.compile(r'^\d+[A-Z]\.\s+.*$')

print("--- Scanning Spanish BJCP Structure ---")
es_categories = []
es_styles = []

for idx, p in enumerate(es_text):
    # Match category (e.g. "1. Standard American Beer")
    # Let's relax re to match typical headers in docx
    cat_m = re.match(r'^(\d+)\.\s+(.*)$', p)
    if cat_m:
        cat_num = cat_m.group(1)
        cat_name = cat_m.group(2)
        # Avoid matching decimal sections like 1.1 or 21.2
        if not '.' in cat_num and len(cat_name) > 3 and not "Introducción" in cat_name:
            es_categories.append((idx, p))
            
    style_m = re.match(r'^(\d+[A-Z])\.\s+(.*)$', p)
    if style_m:
        es_styles.append((idx, p))

print(f"Found {len(es_categories)} potential Categories.")
print(f"Found {len(es_styles)} potential Styles.")

print("\nFirst 10 ES categories:")
for idx, p in es_categories[:10]:
    print(f"Line {idx}: {p}")

print("\nFirst 10 ES styles:")
for idx, p in es_styles[:10]:
    print(f"Line {idx}: {p}")

print("\n--- Scanning English BJCP Structure ---")
en_categories = []
en_styles = []

for idx, p in enumerate(en_text):
    cat_m = re.match(r'^(\d+)\.\s+(.*)$', p)
    if cat_m:
        cat_num = cat_m.group(1)
        cat_name = cat_m.group(2)
        if not '.' in cat_num and len(cat_name) > 3 and not "Introduction" in cat_name:
            en_categories.append((idx, p))
            
    style_m = re.match(r'^(\d+[A-Z])\.\s+(.*)$', p)
    if style_m:
        en_styles.append((idx, p))

print(f"Found {len(en_categories)} potential Categories.")
print(f"Found {len(en_styles)} potential Styles.")
