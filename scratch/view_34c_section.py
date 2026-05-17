from extract_docx import extract_docx_text

es_text = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")

print("--- Paragraphs 2675 to 2695 in SPANISH Guide ---")
for idx in range(2675, 2695):
    if idx < len(es_text):
        print(f"Line {idx}: {es_text[idx]}")
