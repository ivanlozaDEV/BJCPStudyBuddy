from extract_docx import extract_docx_text

es_paragraphs = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")

print("--- Occurrences of '1A.' in SPANISH Guide ---")
for idx, p in enumerate(es_paragraphs):
    if "1A." in p:
        print(f"Line {idx}: {repr(p.strip())}")
