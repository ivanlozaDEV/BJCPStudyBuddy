from extract_docx import extract_docx_text

es_text = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")
en_text = extract_docx_text("2021_Guidelines_Beer_1.25.docx")

def find_ipa_types(paragraphs, doc_name):
    print(f"\n--- Specialty IPAs in {doc_name} ---")
    for idx, p in enumerate(paragraphs):
        p_clean = p.strip()
        if any(term in p_clean for term in ["Belgian IPA", "IPA Belga", "Black IPA", "IPA Negra", "White IPA", "IPA Blanca", "Red IPA", "IPA Roja"]):
            print(f"Line {idx}: {p_clean[:120]}")

find_ipa_types(es_text, "SPANISH")
find_ipa_types(en_text, "ENGLISH")
