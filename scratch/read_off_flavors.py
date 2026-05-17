import zipfile
import xml.etree.ElementTree as ET
import os

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

off_flavor_path = "off_flavor.docx"
paragraphs = extract_docx_text(off_flavor_path)

# Write all paragraphs to a file for complete viewing
with open("scratch/off_flavors_raw.txt", "w", encoding="utf-8") as f:
    for i, p in enumerate(paragraphs):
        f.write(f"{i+1:03d}: {p}\n")

print(f"Extracted {len(paragraphs)} paragraphs to scratch/off_flavors_raw.txt")
