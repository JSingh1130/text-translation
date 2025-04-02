const express = require("express");
const router = express.Router();
const { translateText, getHistory } = require("../controllers/translationController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, translateText);
router.get("/history", authMiddleware, getHistory); // ✅ This route matters

module.exports = router;
