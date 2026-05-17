from extract_docx import extract_docx_text
import re

es_text = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")
en_text = extract_docx_text("2021_Guidelines_Beer_1.25.docx")

def search_prefix(paragraphs, prefix, doc_name):
    print(f"\n--- Searching for '{prefix}' in {doc_name} ---")
    count = 0
    for idx, p in enumerate(paragraphs):
        p_clean = p.strip()
        if prefix in p_clean:
            count += 1
            if count <= 15:
                print(f"Line {idx}: {p_clean[:120]}...")
    print(f"Total lines containing '{prefix}': {count}")

search_prefix(es_text, "21B", "SPANISH")
search_prefix(en_text, "21B", "ENGLISH")
