import zipfile
import xml.etree.ElementTree as ET
import os
import json
import re

def extract_docx_text(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return []
    
    paragraphs = []
    with zipfile.ZipFile(filepath) as docx:
        xml_content = docx.read('word/document.xml')
        root = ET.fromstring(xml_content)
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        for p in root.findall('.//w:p', ns):
            p_text = ""
            for t in p.findall('.//w:t', ns):
                if t.text:
                    p_text += t.text
            if p_text.strip():
                paragraphs.append(p_text.strip())
                
    return paragraphs

paragraphs = extract_docx_text("off_flavor.docx")

OFF_FLAVOR_NAMES = [
    "Acetaldehyde", "Alcoholic", "Astringent", "Chlorophenol", "Cidery",
    "Diacetyl", "Dimethyl Sulfide (DMS)", "Estery/Fruity", "Grassy",
    "Husky/Grainy", "Medicinal", "Metallic", "Moldy", "Oxidation",
    "Salty", "Skunky", "Soapy", "Solvent-Like", "Sulfur/Hydrogen Sulfide",
    "Sour/Acidic", "Sweet", "Yeasty"
]

# Helper to normalize names
def get_matching_name(text):
    for name in OFF_FLAVOR_NAMES:
        if text.strip().lower() == name.lower():
            return name
    return None

off_flavors = []
current_flavor = None
current_field = None # 'sensation', 'causes', 'prevention'

for p in paragraphs:
    p = p.strip()
    if not p:
        continue
        
    # Check if this is a footer or cover page stuff
    if "MoreBeer" in p or "MoreManual" in p or "trademark" in p or "copy written" in p:
        continue
    if "“Off” Flavors In Beer" in p or "Their Causes" in p or "1–800–600–0033" in p:
        continue
    if p.startswith("A Note on Sanitation"):
        break

    # Check if this paragraph matches any of our 22 off flavor names
    matched_name = get_matching_name(p)
    if matched_name:
        if current_flavor:
            off_flavors.append(current_flavor)
        current_flavor = {
            "name_en": matched_name,
            "sensation_en": "",
            "causes_en": "",
            "prevention_en": ""
        }
        current_field = None
        continue

    if current_flavor is None:
        continue

    # Identify fields
    if p.startswith("Tastes/Smells Like:") or p.startswith("Tastes Like:"):
        current_field = "sensation_en"
        text = re.sub(r'^Tastes/Smells Like:\s*', '', p)
        text = re.sub(r'^Tastes Like:\s*', '', text)
        current_flavor[current_field] = text
    elif p.startswith("Possible Causes:"):
        current_field = "causes_en"
        text = re.sub(r'^Possible Causes:\s*', '', p)
        current_flavor[current_field] = text
    elif p.startswith("How to Avoid:"):
        current_field = "prevention_en"
        text = re.sub(r'^How to Avoid:\s*', '', p)
        current_flavor[current_field] = text
    else:
        # It's a continuation of the current active field
        if current_field:
            # Clean up line break hyphens (e.g. "fermen- ter" -> "fermenter", "sul- fur" -> "sulfur")
            current_val = current_flavor[current_field]
            if current_val.endswith("-"):
                current_flavor[current_field] = current_val[:-1] + p
            else:
                current_flavor[current_field] = current_val + " " + p
        else:
            # If no active field, let's treat it as Sensation
            current_flavor["sensation_en"] = p

# Append the last one
if current_flavor:
    off_flavors.append(current_flavor)

# Post-process to clean up soft-hyphens like "fermen- ter" -> "fermenter" or "bit- ter" -> "bitter" across all fields
def clean_hyphens(text):
    # Match words split with hyphen + space
    text = re.sub(r'(\w+)-\s+(\w+)', r'\1\2', text)
    # Match words split with hyphen only
    text = re.sub(r'(\w+)-\s*[\r\n]+\s*(\w+)', r'\1\2', text)
    return text

for o in off_flavors:
    o["sensation_en"] = clean_hyphens(o["sensation_en"])
    o["causes_en"] = clean_hyphens(o["causes_en"])
    o["prevention_en"] = clean_hyphens(o["prevention_en"])

print(f"Pristine parse successful! Total off-flavors: {len(off_flavors)}")
for idx, o in enumerate(off_flavors):
    print(f"{idx+1:02d}. {o['name_en']}")
    print(f"   Sens: {o['sensation_en'][:80]}...")
    print(f"   Causes: {o['causes_en'][:80]}...")
    print(f"   Prev: {o['prevention_en'][:80]}...")

# Save to JSON
with open("src/data/offflavors_parsed.json", "w", encoding="utf-8") as f:
    json.dump(off_flavors, f, indent=2, ensure_ascii=False)
