import json
import sys
import requests
import time

# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')


# Translation API setup
API_URL = "https://translateai.p.rapidapi.com/google/translate/json"
HEADERS = {
    "content-type": "application/json",
    "x-rapidapi-host": "translateai.p.rapidapi.com",
    "x-rapidapi-key": "6fe8b6f005msh2a8ab26e6a12f8fp18636ajsn6b031d19aff9"  # ⚠️ Replace for security
}

def translate_text(text, source_lang, target_lang):
    payload = {
        "origin_language": source_lang,
        "target_language": target_lang,
        "json_content": { "text": text }
    }

    response = requests.post(API_URL, headers=HEADERS, json=payload)
    
    if response.status_code == 429:
        print("⚠️ Rate limit hit. Retrying after 3 seconds...")
        time.sleep(3)
        response = requests.post(API_URL, headers=HEADERS, json=payload)

    response.raise_for_status()
    data = response.json()
    return data.get("translated_json", {}).get("text", "")

def translate_layout(input_json, output_json, source_lang, target_lang):
    with open(input_json, "r", encoding="utf-8") as f:
        layout = json.load(f)

    translated_layout = []

    for page in layout:
        new_page = []
        for block in page:
            # ✅ Skip non-text blocks (e.g., image blocks)
            if "text" not in block:
                new_page.append(block)
                continue

            original = block["text"]
            if not original.strip():
                new_page.append(block)
                continue

            # Translate the text
            try:
                translated = translate_text(original, source_lang, target_lang)
                print(f"🔤 {original} → {translated}")
                new_block = block.copy()
                new_block["text"] = translated
                new_page.append(new_block)
            except Exception as e:
                print(f"❌ Translation failed: {e}")
                new_page.append(block)  # Fallback to original
        translated_layout.append(new_page)

    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(translated_layout, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    input_json = sys.argv[1]
    output_json = sys.argv[2]
    source_lang = sys.argv[3]
    target_lang = sys.argv[4]

    translate_layout(input_json, output_json, source_lang, target_lang)
