from extract_docx import extract_docx_text

es_text = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")
en_text = extract_docx_text("2021_Guidelines_Beer_1.25.docx")

def check_local_mentions(term):
    print(f"\n--- Mentions of '{term}' ---")
    for idx, p in enumerate(es_text):
        if term.lower() in p.lower():
            print(f"ES Line {idx}: {p[:120]}")
    for idx, p in enumerate(en_text):
        if term.lower() in p.lower():
            print(f"EN Line {idx}: {p[:120]}")

check_local_mentions("Dorada Pampeana")
check_local_mentions("IPA Argenta")
check_local_mentions("Italian Grape Ale")
check_local_mentions("Catharina Sour")
check_local_mentions("New Zealand Pilsner")
