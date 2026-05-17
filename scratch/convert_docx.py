import zipfile
import xml.etree.ElementTree as ET
import os

def docx_to_txt(docx_path, txt_path):
    print(f"Extracting {docx_path} -> {txt_path}...")
    try:
        with zipfile.ZipFile(docx_path) as zf:
            xml_content = zf.read('word/document.xml')
            
        root = ET.fromstring(xml_content)
        
        # Docx XML namespaces
        namespaces = {
            'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
        }
        
        paragraphs = []
        for paragraph in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
            texts = [node.text for node in paragraph.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if node.text]
            if texts:
                paragraphs.append(''.join(texts))
        
        with open(txt_path, 'w', encoding='utf-8') as f:
            for p in paragraphs:
                f.write(p + '\n')
        print(f"Success! Extracted {len(paragraphs)} paragraphs.")
    except Exception as e:
        print(f"Error extracting {docx_path}: {e}")

if __name__ == "__main__":
    os.makedirs('scratch', exist_ok=True)
    docx_to_txt('2021_Guidelines_Beer_1.25.docx', 'scratch/guidelines_en.txt')
    docx_to_txt('2021_Guidelines_Beer_ES_1.0.docx', 'scratch/guidelines_es.txt')
