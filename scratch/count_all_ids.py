from extract_docx import extract_docx_text
import re

es_text = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")
en_text = extract_docx_text("2021_Guidelines_Beer_1.25.docx")

def find_every_potential_style_header(paragraphs):
    headers = []
    # Scan every paragraph after the introduction (line > 150)
    for idx, p in enumerate(paragraphs):
        p_clean = p.strip()
        if idx > 150:
            # We match style headers starting with numbers/letters + dot, e.g., "21A.", "21B.1", "PR1.", "X3."
            m = re.match(r'^([a-zA-Z0-9\-\.]+)\.\s+(.*)$', p_clean)
            if m:
                style_id = m.group(1)
                name = m.group(2)
                # Keep it if it starts with a number or standard letter prefixes (exclude TOC elements containing '...')
                if (re.match(r'^\d', style_id) or re.match(r'^[A-Z]+\d', style_id)) and len(style_id) <= 8 and '...' not in p_clean:
                    # Strip trailing numbers (page numbers) if any
                    name_clean = re.sub(r'\d+$', '', name).strip()
                    headers.append((idx, style_id, name_clean))
    return headers

es_headers = find_every_potential_style_header(es_text)
en_headers = find_every_potential_style_header(en_text)

print(f"Total potential style headers in Spanish Guide: {len(es_headers)}")
print(f"Total potential style headers in English Guide: {len(en_headers)}")

# Compare by ID
es_ids = {h[1]: h[2] for h in es_headers}
en_ids = {h[1]: h[2] for h in en_headers}

en_only = sorted(list(en_ids.keys() - es_ids.keys()))
es_only = sorted(list(es_ids.keys() - en_ids.keys()))

print(f"\nStyles in English but missing in Spanish ({len(en_only)}):")
for i in en_only:
    print(f" - {i}: {en_ids[i]}")

print(f"\nStyles in Spanish but missing in English ({len(es_only)}):")
for i in es_only:
    print(f" - {i}: {es_ids[i]}")
