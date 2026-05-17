from extract_docx import extract_docx_text

es_text = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")
en_text = extract_docx_text("2021_Guidelines_Beer_1.25.docx")

def check_style_id(style_id):
    print(f"\n--- Checking Style ID: {style_id} ---")
    for idx, p in enumerate(es_text):
        if style_id in p[:30]:
            print(f"ES Line {idx}: {p[:120]}")
    for idx, p in enumerate(en_text):
        if style_id in p[:30]:
            print(f"EN Line {idx}: {p[:120]}")

check_style_id("21C")
