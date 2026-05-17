import re
from extract_docx import extract_docx_text

es_paragraphs = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")
en_paragraphs = extract_docx_text("2021_Guidelines_Beer_1.25.docx")

def find_all_style_headers(paragraphs):
    headers = []
    # Actual style headings start after a threshold (e.g. paragraph idx > 150)
    for idx, p in enumerate(paragraphs):
        p_clean = p.strip()
        if idx > 150:
            # We match standard style headers: "1A." or "PR1." or specialty categories like "X1." or similar
            # Let's check any pattern like digits + letters + dot
            m = re.match(r'^([a-zA-Z0-9]+)\.\s+(.*)$', p_clean)
            if m:
                style_id = m.group(1)
                style_name = m.group(2)
                # Filter out obvious non-style headings (like page numbers or section titles)
                # Typical style IDs are like "1A", "21A", "27A", "PR1", "X4", etc.
                if re.match(r'^\d+[A-Z]$', style_id) or re.match(r'^[A-Z]+\d+$', style_id):
                    headers.append((idx, style_id, style_name))
    return headers

es_headers = find_all_style_headers(es_paragraphs)
en_headers = find_all_style_headers(en_paragraphs)

es_ids = set([h[1] for h in es_headers])
en_ids = set([h[1] for h in en_headers])

print(f"Total ES style headers found: {len(es_ids)}")
print(f"Total EN style headers found: {len(en_ids)}")

print("\n--- Style IDs in EN but NOT in ES ---")
diff_en = sorted(list(en_ids - es_ids))
print(f"Count: {len(diff_en)}")
for style_id in diff_en:
    matching_header = [h for h in en_headers if h[1] == style_id][0]
    print(f"ID: {style_id} -> {matching_header[2]}")

print("\n--- Style IDs in ES but NOT in EN ---")
diff_es = sorted(list(es_ids - en_ids))
print(f"Count: {len(diff_es)}")
for style_id in diff_es:
    matching_header = [h for h in es_headers if h[1] == style_id][0]
    print(f"ID: {style_id} -> {matching_header[2]}")
