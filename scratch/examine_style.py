import re
from extract_docx import extract_docx_text

es_text = extract_docx_text("2021_Guidelines_Beer_ES_1.0.docx")

# Let's search for "1A. American Light Lager" to find where the actual section starts
print("--- Searching for actual '1A.' section ---")
for idx, p in enumerate(es_text):
    if "1A." in p or "American Light Lager" in p:
        print(f"Line {idx}: {p[:100]}...")

# Let's print out 50 paragraphs starting from the first actual "1A. American Light Lager" section.
# Looking at the previous run, the Table of Contents was at line 39. So the actual section will be much later.
# Let's search for a line that starts exactly with "1A." but is NOT in the Table of Contents (e.g. line > 100).
target_idx = None
for idx, p in enumerate(es_text):
    if idx > 150 and p.strip().startswith("1A."):
        target_idx = idx
        print(f"\nFound section start at Line {idx}: {p}")
        break

if target_idx is not None:
    print("\n--- Printing 40 paragraphs from the start of the section ---")
    for i in range(target_idx, target_idx + 45):
        if i < len(es_text):
            print(f"Line {i}: {es_text[i]}")
