from extract_docx import extract_docx_text

es_text = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")
en_text = extract_docx_text("2021_Guidelines_Beer_1.25.docx")

def check_all_ipas(paragraphs, doc_name):
    print(f"\n--- Checking IPAs in {doc_name} ---")
    found_headers = []
    for idx, p in enumerate(paragraphs):
        p_clean = p.strip()
        # Look for lines starting with "Specialty IPA:" or lines containing Hoppy/IPA
        if p_clean.startswith("Specialty IPA:") or p_clean.startswith("Specialty IPA ("):
            print(f"Line {idx}: {p_clean}")
            found_headers.append(p_clean)
    return found_headers

check_all_ipas(es_text, "SPANISH")
check_all_ipas(en_text, "ENGLISH")
