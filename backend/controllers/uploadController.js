const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

// POST /api/upload/file
exports.uploadAndTranslate = async (req, res) => {
  try {
    const file = req.file;
    const { sourceLang, targetLang } = req.body;

    if (!file || !sourceLang || !targetLang) {
      return res.status(400).json({ message: "Missing file or language fields." });
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

    // ✅ Sanitize base filename (remove extension & spaces)
    const originalName = path.parse(file.originalname).name.replace(/\s+/g, "-");
    const inputPath = path.join(uploadsDir, `${originalName}.pdf`);

    // Write original file
    fs.writeFileSync(inputPath, file.buffer);

    // Output paths
    const layoutJSON = path.join("python", `${originalName}-layout.json`);
    const translatedJSON = path.join(__dirname, "..", "python", `${originalName}-translated.json`);
    const translatedPDF = path.join(uploadsDir, `${originalName}-${targetLang}.pdf`);

    // Commands
    const extractCmd = `python python/extract_pdf.py "${inputPath}" "${layoutJSON}"`;
    const translateCmd = `python python/translate_layout_json.py "${layoutJSON}" "${translatedJSON}" ${sourceLang} ${targetLang}`;
    const buildCmd = `python python/build_pdf.py "${translatedJSON}" "${translatedPDF}" ${targetLang}`;

    exec(extractCmd, (err, stdout, stderr) => {
      if (err) {
        console.error("❌ Layout extraction failed:", stderr);
        return res.status(500).json({ message: "Layout extraction failed." });
      }

      exec(translateCmd, (err2, stdout2, stderr2) => {
        if (err2) {
          console.error("❌ Layout Translation Error:", stderr2);
          return res.status(500).json({ message: "Translation failed." });
        }

        exec(buildCmd, (err3, stdout3, stderr3) => {
          if (err3) {
            console.error("❌ PDF Build Error:", stderr3);
            return res.status(500).json({ message: "PDF generation failed." });
          }

          console.log("✅ Translation completed:", translatedPDF);
          res.json({
            message: "Translation complete",
            pdfUrl: `/uploads/${path.basename(translatedPDF)}`
          });
        });
      });
    });

  } catch (error) {
    console.error("❌ Unexpected error:", error.message);
    res.status(500).json({
      message: "Unexpected server error",
      error: error.message
    });
  }
};
