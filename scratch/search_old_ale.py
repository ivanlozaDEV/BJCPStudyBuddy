from extract_docx import extract_docx_text

es_text = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")
en_text = extract_docx_text("2021_Guidelines_Beer_1.25.docx")

def check_term(term):
    print(f"\n--- Searching for '{term}' ---")
    for idx, p in enumerate(es_text):
        if term.lower() in p.lower():
            print(f"ES Line {idx}: {p[:120]}")
    for idx, p in enumerate(en_text):
        if term.lower() in p.lower():
            print(f"EN Line {idx}: {p[:120]}")

check_term("17B")
check_term("Old Ale")
