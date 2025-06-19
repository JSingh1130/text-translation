import fitz  # PyMuPDF
import json
import sys
import os

def extract_layout(input_path, output_json):
    doc = fitz.open(input_path)
    result = []

    os.makedirs("images", exist_ok=True)

    for page_num, page in enumerate(doc):
        blocks = page.get_text("dict")["blocks"]
        page_items = []

        for b in blocks:
            if b['type'] == 0:  # Text block
                for line in b["lines"]:
                    for span in line["spans"]:
                        r = int(span["color"] >> 16 & 255)
                        g = int(span["color"] >> 8 & 255)
                        b_ = int(span["color"] & 255)

                        item = {
                            "type": "text",
                            "page": page_num,
                            "x": span["bbox"][0],
                            "y": span["bbox"][1],
                            "width": span["bbox"][2] - span["bbox"][0],
                            "height": span["bbox"][3] - span["bbox"][1],
                            "font": span["font"],
                            "size": span["size"],
                            "color": [r, g, b_],
                            "text": span["text"],
                            "is_heading": span["size"] >= 16
                        }
                        page_items.append(item)

            elif b['type'] == 1 and 'image' in b:
                try:
                    x0, y0, x1, y1 = b['bbox']
                    width = x1 - x0
                    height = y1 - y0

                    img_info = page.get_images(full=True)[0]
                    xref = img_info[0]
                    img = doc.extract_image(xref)
                    img_bytes = img['image']
                    ext = img['ext']
                    img_path = f"images/page{page_num}_img{x0:.0f}_{y0:.0f}.{ext}"

                    with open(img_path, "wb") as f_img:
                        f_img.write(img_bytes)

                    page_items.append({
                        "type": "image",
                        "page": page_num,
                        "x": x0,
                        "y": y0,
                        "width": width,
                        "height": height,
                        "path": img_path
                    })
                except Exception as e:
                    print(f"❌ Failed to extract image: {e}")

        result.append(page_items)

    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    input_pdf = sys.argv[1]
    output_json = sys.argv[2]
    extract_layout(input_pdf, output_json)
