from extract_docx import extract_docx_text
import re

es_text = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")

def find_actual_sections(style_id):
    print(f"\n--- Actual description paragraphs for: {style_id} ---")
    matches = []
    for idx, p in enumerate(es_text):
        if idx > 300 and style_id in p:
            # Let's print the line index and content
            print(f"Line {idx}: {p[:120]}...")
            matches.append(idx)
            if len(matches) >= 5:
                break
    if not matches:
        print("No matches found after line 300!")

find_actual_sections("17B")
find_actual_sections("34C")
