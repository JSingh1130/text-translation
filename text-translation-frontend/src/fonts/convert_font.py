import base64

font_path = "NotoSansDevanagari-VariableFont_wdth,wght.ttf"
output_js = "NotoSansDevanagari-normal.js"

with open(font_path, "rb") as f:
    b64data = base64.b64encode(f.read()).decode("utf-8")

with open(output_js, "w", encoding="utf-8") as f:
    f.write(f'const notoFont = "{b64data}";\nexport default notoFont;\n')

print(f"✅ Converted and saved to {output_js}")
