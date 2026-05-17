from extract_docx import extract_docx_text

es_text = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")

print("--- Paragraphs 1380 to 1398 in SPANISH Guide ---")
for idx in range(1380, 1398):
    if idx < len(es_text):
        print(f"Line {idx}: {es_text[idx]}")
