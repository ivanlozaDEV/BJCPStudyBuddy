import zipfile
import xml.etree.ElementTree as ET
import os

def extract_docx_text(filepath):
    """Extracts raw text paragraphs from a .docx file using standard library zip and xml tools."""
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return []
    
    paragraphs = []
    # A .docx is a zip file; the text content sits in word/document.xml
    with zipfile.ZipFile(filepath) as docx:
        xml_content = docx.read('word/document.xml')
        root = ET.fromstring(xml_content)
        
        # XML Namespace for WordprocessingML
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        # Find all paragraph tags <w:p>
        for p in root.findall('.//w:p', ns):
            p_text = ""
            # Inside a paragraph, text is grouped in runs <w:r> containing text <w:t>
            for t in p.findall('.//w:t', ns):
                if t.text:
                    p_text += t.text
            if p_text.strip():
                paragraphs.append(p_text.strip())
                
    return paragraphs

# Let's inspect both guides
es_path = "2021_Guidelines_Beer_ES_1.0.docx"
en_path = "2021_Guidelines_Beer_1.25.docx"

print("--- Spanish Guide (docx) Paragraphs Count ---")
es_text = extract_docx_text(es_path)
print(f"Total paragraphs extracted: {len(es_text)}")
if es_text:
    print("First 20 paragraphs:")
    for i, p in enumerate(es_text[:20]):
        print(f"{i+1}: {p[:120]}...")

print("\n--- English Guide (docx) Paragraphs Count ---")
en_text = extract_docx_text(en_path)
print(f"Total paragraphs extracted: {len(en_text)}")
if en_text:
    print("First 20 paragraphs:")
    for i, p in enumerate(en_text[:20]):
        print(f"{i+1}: {p[:120]}...")
