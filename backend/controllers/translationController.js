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

    // Ensure directories
    const uploadsDir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

    const filename = path.parse(file.originalname).name + "-" + Date.now();
    const inputPath = path.join(uploadsDir, `${filename}.pdf`);
    fs.writeFileSync(inputPath, file.buffer);

    // Prepare output file paths
    const layoutJSON = `python/${filename}-layout.json`;
    const translatedJSON = `python/${filename}-translated.json`;
    const translatedPDF = `uploads/${filename}-${targetLang}.pdf`;

    // Step 1: Extract layout from PDF
    const extractCmd = `python python/extract_pdf.py "${inputPath}" "${layoutJSON}"`;

    // Step 2: Translate extracted layout content
    const translateCmd = `python python/translate_layout_json.py "${layoutJSON}" "${translatedJSON}" ${sourceLang} ${targetLang}`;

    // Step 3: Build translated PDF
    const buildCmd = `python python/build_pdf.py "${translatedJSON}" "${translatedPDF}" ${targetLang}`;

    exec(extractCommand, (err, stdout, stderr) => {
  if (err) {
    console.error("❌ Layout extraction failed:", stderr);
    console.error("Full error object:", err);
    return res.status(500).json({ message: "Layout extraction failed." });
  }


      exec(translateCmd, (err2) => {
        if (err2) {
          console.error("❌ Layout Translation Error:", err2.message);
          return res.status(500).json({ message: "Translation failed." });
        }

        exec(buildCmd, (err3) => {
          if (err3) {
            console.error("❌ PDF Build Error:", err3.message);
            return res.status(500).json({ message: "PDF generation failed." });
          }

          console.log("✅ Translation completed:", translatedPDF);
          res.json({
            message: "Translation complete",
            pdfUrl: `/uploads/${path.basename(translatedPDF)}`,
          });
        });
      });
    });
  } catch (error) {
    console.error("❌ Unexpected error:", error.message);
    res.status(500).json({ message: "Unexpected server error", error: error.message });
  }
};
