const express = require("express");
const router = express.Router();
const { translateText, getHistory } = require("../controllers/translationController");
const verifyToken = require("../middleware/authMiddleware");

// POST /api/translate
router.post("/", verifyToken, translateText);

// ✅ NEW: GET /api/translate/history
router.get("/history", verifyToken, getHistory);

module.exports = router;
