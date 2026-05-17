from extract_docx import extract_docx_text

es_text = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")
en_text = extract_docx_text("2021_Guidelines_Beer_1.25.docx")

def check_historical(paragraphs, doc_name):
    print(f"\n--- Checking Historical Beers in {doc_name} ---")
    found_headers = []
    for idx, p in enumerate(paragraphs):
        p_clean = p.strip()
        if p_clean.startswith("Historical Beer:") or p_clean.startswith("Historical Beer (") or p_clean.startswith("Cerveza Histórica:") or p_clean.startswith("Cerveza Historica:"):
            print(f"Line {idx}: {p_clean}")
            found_headers.append(p_clean)
    return found_headers

check_historical(es_text, "SPANISH")
check_historical(en_text, "ENGLISH")
