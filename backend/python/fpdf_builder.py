from fpdf import FPDF
import json
import os

pdf = FPDF()
pdf.add_page()
pdf.add_font("NotoHindi", "", "fonts/NotoSansDevanagari.ttf", uni=True)
pdf.set_font("NotoHindi", size=14)

with open("layout-translated.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for page_blocks in data:
    for block in page_blocks:
        text = block.get("text", "")
        x = block.get("x", 10)
        y = block.get("y", 10)
        pdf.set_xy(x, y)
        pdf.cell(200, 10, txt=text)

pdf.output("translated-final-fpdf.pdf")
print("✅ FPDF Hindi output written.")
