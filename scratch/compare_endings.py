from extract_docx import extract_docx_text

es_text = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")
en_text = extract_docx_text("2021_Guidelines_Beer_1.25.docx")

print(f"Spanish Guide total paragraphs: {len(es_text)}")
print(f"English Guide total paragraphs: {len(en_text)}")

print("\n--- Last 25 Paragraphs of SPANISH Guide ---")
for idx in range(len(es_text) - 25, len(es_text)):
    print(f"ES Line {idx}: {es_text[idx][:120]}")

print("\n--- Last 25 Paragraphs of ENGLISH Guide ---")
for idx in range(len(en_text) - 25, len(en_text)):
    print(f"EN Line {idx}: {en_text[idx][:120]}")
