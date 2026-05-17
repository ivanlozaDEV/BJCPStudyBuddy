from extract_docx import extract_docx_text
import re

es_text = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")

def check_style_paragraphs(style_id):
    print(f"\n--- Checking Paragraphs for Style ID: {style_id} ---")
    start_idx = None
    for idx, p in enumerate(es_text):
        if idx > 150 and p.strip().startswith(style_id + "."):
            start_idx = idx
            print(f"Found Style Header at Line {idx}: {p.strip()}")
            break
            
    if start_idx is not None:
        for i in range(start_idx + 1, start_idx + 6):
            if i < len(es_text):
                print(f" Line {i}: {es_text[i]}")

check_style_paragraphs("3B")
check_style_paragraphs("17B")
check_style_paragraphs("25C")
check_style_paragraphs("34C")
