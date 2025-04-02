const mongoose = require("mongoose");

const translationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  originalText: {
    type: String,
    required: true
  },
  translatedText: {
    type: String,
    required: true
  },
  sourceLang: String,
  targetLang: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Translation", translationSchema);
