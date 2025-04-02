const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadController = require("../controllers/uploadController");
const auth = require("../middleware/authMiddleware");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/file", auth, upload.single("file"), uploadController.uploadAndTranslate);

module.exports = router;
