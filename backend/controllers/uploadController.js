const pdfParse = require("pdf-parse");
const axios = require("axios");

exports.uploadAndTranslate = async (req, res) => {
  try {
    const file = req.file;
    const { sourceLang, targetLang } = req.body;

    console.log("✅ Uploaded file field:", file?.fieldname);
    console.log("🌐 Source Language:", sourceLang);
    console.log("🌐 Target Language:", targetLang);

    if (!file || !sourceLang || !targetLang) {
      return res.status(400).json({ message: "Missing file or languages." });
    }

    let extractedText = "";

    if (file.mimetype === "application/pdf") {
      const data = await pdfParse(file.buffer);
      extractedText = data.text;
    } else if (file.mimetype === "text/plain") {
      extractedText = file.buffer.toString("utf-8");
    } else {
      return res.status(400).json({ message: "Unsupported file type." });
    }

    console.log("📄 Extracted Text:", extractedText.slice(0, 300)); // Preview first 300 chars

    if (!extractedText.trim()) {
      return res.status(422).json({ message: "No text found in uploaded file." });
    }

    const response = await axios({
        method: 'POST',
        url: 'https://translateai.p.rapidapi.com/google/translate/json',
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY,
          'x-rapidapi-host': 'translateai.p.rapidapi.com',
          'Content-Type': 'application/json',
        },
        data: {
          origin_language: sourceLang,
          target_language: targetLang,
          json_content: {
            text: extractedText
          }
        }
      });
      

    console.log("✅ API Response:", response.data);

    const translatedText = response.data.translated_text || response.data.translated_json?.text;

    res.json({ translatedText });
  } catch (err) {
    console.error("❌ Upload Translation Error:", err.response?.data || err.message);
    res.status(500).json({
      message: "File translation failed",
      error: err.response?.data?.message || err.message,
    });
  }
};
