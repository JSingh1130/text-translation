const pdfParse = require("pdf-parse");
const axios = require("axios");
const Translation = require("../models/Translation");

// POST /api/translate
exports.translateText = async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;

    if (!text || !sourceLang || !targetLang) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const makeTranslationRequest = async () => {
      return axios({
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
    };

    let response;
    try {
      response = await makeTranslationRequest();
    } catch (error) {
      if (error.response?.status === 429) {
        console.warn("⚠️ Rate limit hit (429). Retrying after 3 seconds...");
        await new Promise(resolve => setTimeout(resolve, 3000));
        response = await makeTranslationRequest(); // Retry once
      } else {
        throw error;
      }
    }

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
    console.error("❌ Text Translation Error:", error.message);
    const message = error.response?.status === 429
      ? "Too many requests. Please wait and try again."
      : "Text translation failed.";
    res.status(500).json({ message, error: error.message });
  }
};

// GET /api/translate/history
exports.getHistory = async (req, res) => {
  try {
    const history = await Translation.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ history });
  } catch (error) {
    console.error("❌ Fetch History Error:", error.message);
    res.status(500).json({ message: "Failed to fetch history", error: error.message });
  }
};

// POST /api/upload (file translation)
exports.uploadAndTranslate = async (req, res) => {
  try {
    const file = req.file;
    const { sourceLang, targetLang } = req.body;

    if (!file || !sourceLang || !targetLang) {
      return res.status(400).json({ message: "Missing file or languages." });
    }

    let extractedText = "";

    // Extract text from PDF or plain text
    if (file.mimetype === "application/pdf") {
      const data = await pdfParse(file.buffer);
      extractedText = data.text;
    } else if (file.mimetype === "text/plain") {
      extractedText = file.buffer.toString("utf-8");
    } else {
      return res.status(400).json({ message: "Unsupported file type." });
    }

    const makeTranslationRequest = async () => {
      return axios({
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
    };

    let response;
    try {
      response = await makeTranslationRequest();
    } catch (error) {
      if (error.response?.status === 429) {
        console.warn("⚠️ Rate limit hit (429). Retrying after 3 seconds...");
        await new Promise(resolve => setTimeout(resolve, 3000));
        response = await makeTranslationRequest(); // Retry once
      } else {
        throw error;
      }
    }

    const translatedText = response.data.translated_json.text;

    res.json({ translatedText });

  } catch (error) {
    console.error("❌ File Translation Error:", error.message);
    const message = error.response?.status === 429
      ? "Too many requests. Please wait and try again."
      : "File translation failed.";
    res.status(500).json({ message, error: error.message });
  }
};
