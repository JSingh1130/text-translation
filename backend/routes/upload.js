const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadController = require("../controllers/uploadController");
const auth = require("../middleware/authMiddleware");

// Use memory storage to access file.buffer
const upload = multer({ storage: multer.memoryStorage() });

// Route to handle file upload and trigger translation pipeline
router.post("/file", auth, upload.single("file"), uploadController.uploadAndTranslate);

module.exports = router;
