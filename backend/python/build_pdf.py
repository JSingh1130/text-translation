from fpdf import FPDF
import json
import sys
import os
from PIL import Image, ImageDraw, ImageFont

def pt_to_mm(pt):
    return pt * 0.352778

def get_font_paths(language):
    base = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "fonts"))

    if language == "hi":
        reg = os.path.join(base, "NotoSansDevanagari.ttf")
        bold = os.path.join(base, "NotoSansDevanagari-Bold.ttf")
        alias = "NotoHindi"
    elif language == "pa":
        reg = os.path.join(base, "NotoSansGurmukhi.ttf")
        bold = os.path.join(base, "NotoSansGurmukhi-Bold.ttf")
        alias = "NotoPunjabi"
    elif language == "gu":
        reg = os.path.join(base, "NotoSansGujarati.ttf")
        bold = os.path.join(base, "NotoSansGujarati-Bold.ttf")
        alias = "NotoGujarati"
    else:
        raise ValueError(f"Unsupported language: {language}")

    if not os.path.isfile(reg):
        raise FileNotFoundError(f"\u274c Regular font not found: {reg}")
    if not os.path.isfile(bold):
        print(f"\u26a0\ufe0f Bold font not found: {bold} — using regular only.")

    return reg, bold, alias

def render_heading_as_image(text, font_path, font_size):
    font = ImageFont.truetype(font_path, font_size)
    dummy_img = Image.new("RGB", (1, 1), "white")
    draw = ImageDraw.Draw(dummy_img)
    bbox = draw.textbbox((0, 0), text, font=font)
    width, height = bbox[2] - bbox[0], bbox[3] - bbox[1]

    img = Image.new("RGB", (width + 40, height + 20), "white")
    draw = ImageDraw.Draw(img)
    draw.text((20, 10), text, font=font, fill="black")
    return img

def build_pdf(json_file, output_pdf, language):
    json_file = os.path.abspath(json_file)
    output_pdf = os.path.abspath(output_pdf)
    os.makedirs(os.path.dirname(output_pdf), exist_ok=True)
    os.makedirs("images", exist_ok=True)

    with open(json_file, "r", encoding="utf-8") as f:
        content = json.load(f)

    pdf = FPDF(format='A4')
    pdf.set_auto_page_break(auto=True, margin=15)

    regular_path, bold_path, font_alias = get_font_paths(language)
    pdf.add_font(font_alias, "", regular_path, uni=True)
    if os.path.exists(bold_path):
        pdf.add_font(font_alias, "B", bold_path, uni=True)

    max_width = pdf.w - 2 * pdf.l_margin
    min_font_size = 14

    for page_num, page_blocks in enumerate(content):
        pdf.add_page()
        for block in page_blocks:
            if block["type"] == "image":
                x = pt_to_mm(float(block["x"]))
                y = pt_to_mm(float(block["y"]))
                w = pt_to_mm(float(block["width"]))
                h = pt_to_mm(float(block["height"]))
                img_path = block["path"]
                if os.path.exists(img_path):
                    pdf.image(img_path, x=x, y=y, w=w, h=h)
                continue

            text = block.get("text", "").strip()
            if not text:
                continue

            x = pt_to_mm(float(block.get("x", 10)))
            y = pt_to_mm(float(block.get("y", 10)))
            font_size = float(block.get("size", 14))
            is_heading = block.get("is_heading", False)
            is_bold = "bold" in block.get("font", "").lower()
            font_style = "B" if is_bold and os.path.exists(bold_path) else ""

            pdf.set_font(font_alias, font_style, size=font_size)
            color = block.get("color", [0, 0, 0])
            pdf.set_text_color(*color)

            if is_heading and language in ["hi", "pa", "gu"]:
                heading_img = render_heading_as_image(text, regular_path, font_size=int(font_size))
                heading_path = f"images/heading_{language}_page{page_num}_{int(x)}_{int(y)}.png"
                heading_img.save(heading_path)

                img_width_mm = pt_to_mm(heading_img.width * 0.75)
                center_x = (pdf.w - img_width_mm) / 2
                pdf.image(heading_path, x=center_x, y=y, w=img_width_mm)
                continue

            if is_heading:
                while pdf.get_string_width(text) > max_width and font_size > min_font_size:
                    font_size -= 0.5
                    pdf.set_font(font_alias, font_style, size=font_size)

                text_width = pdf.get_string_width(text)
                center_x = (pdf.w - text_width) / 2
                pdf.set_xy(center_x, y)
                pdf.cell(w=text_width, h=pt_to_mm(font_size * 1.3), txt=text, align='C')
                pdf.ln(pt_to_mm(font_size * 0.6))
            else:
                while pdf.get_string_width(text) > max_width and font_size > min_font_size:
                    font_size -= 0.5
                    pdf.set_font(font_alias, font_style, size=font_size)
                pdf.text(x, y + font_size * 0.35, text)

    pdf.output(output_pdf)

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: build_pdf.py input.json output.pdf language_code")
    else:
        build_pdf(sys.argv[1], sys.argv[2], sys.argv[3])
