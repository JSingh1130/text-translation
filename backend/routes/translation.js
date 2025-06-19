const express = require("express");
const router = express.Router();
const multer = require("multer");

const { uploadAndTranslate } = require("../controllers/uploadController");
const authMiddleware = require("../middleware/authMiddleware");

const upload = multer({ storage: multer.memoryStorage() });



// ✅ Layout-preserving translation using existing working controller
router.post("/pdf-layout", authMiddleware, upload.single("file"), uploadAndTranslate);

module.exports = router;
