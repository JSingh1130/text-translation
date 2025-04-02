const pdfParse = require("pdf-parse");
const axios = require("axios");
const Translation = require("../models/Translation");

// Original POST /api/translate
exports.translateText = async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;

    if (!text || !sourceLang || !targetLang) {
      return res.status(400).json({ message: "Missing required fields." });
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
        json_content: { text },
      }
    });

    const translatedText = response.data.translated_json.text;

    // Save to MongoDB
    await Translation.create({
      user: req.user.id,
      originalText: text,
      translatedText,
      sourceLang,
      targetLang,
    });

    res.json({ translatedText });
  } catch (error) {
    res.status(500).json({ message: "Translation failed", error: error.message });
  }
};

// GET /api/translate/history
exports.getHistory = async (req, res) => {
  try {
    const history = await Translation.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ history });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history", error: error.message });
  }
};

// File upload route
exports.uploadAndTranslate = async (req, res) => {
  try {
    const file = req.file;
    const { sourceLang, targetLang } = req.body;

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

    // Translate file content
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
        json_content: { text: extractedText },
      }
    });

    const translatedText = response.data.translated_json.text;

    res.json({ translatedText });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "File translation failed", error: err.message });
  }
};
