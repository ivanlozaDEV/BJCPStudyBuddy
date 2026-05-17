import json

with open("src/data/bjcp2021_bilingual.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"Loaded {len(data)} styles from JSON database.")

empty_es = []
empty_en = []

for style in data:
    # Check if critical fields are blank
    if not style["overallImpression_es"].strip() or not style["aroma_es"].strip():
        empty_es.append(style["id"] + " (" + style["name_es"] + ")")
    if not style["overallImpression_en"].strip() or not style["aroma_en"].strip():
        empty_en.append(style["id"] + " (" + style["name_en"] + ")")

print(f"\nStyles with empty descriptions in SPANISH ({len(empty_es)}):")
for s in empty_es:
    print(f" - {s}")

print(f"\nStyles with empty descriptions in ENGLISH ({len(empty_en)}):")
for s in empty_en:
    print(f" - {s}")
