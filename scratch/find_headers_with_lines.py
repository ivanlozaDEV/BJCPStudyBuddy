from extract_docx import extract_docx_text
import re

es_paragraphs = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")

def find_headers(paragraphs):
    print("--- Matches for Style Header in SPANISH Guide ---")
    count = 0
    for idx, p in enumerate(paragraphs):
        p_clean = p.strip()
        m = re.match(r'^(\d+[A-Z])\.\s+(.*)$', p_clean)
        if m:
            count += 1
            if count <= 40:
                print(f"Line {idx}: ID {m.group(1)} -> {repr(p_clean[:80])}")
    print(f"Total matches: {count}")

find_headers(es_paragraphs)
