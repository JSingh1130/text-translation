const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Log absolute path being served for confirmation
const uploadsPath = path.resolve(__dirname, "uploads");
console.log("📂 Serving static files from:", uploadsPath);

// ✅ Serve uploaded PDFs (and JSON if needed)
app.use("/uploads", express.static(uploadsPath));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Text Translation Tool Backend is running");
});

// Routes
const authRoutes = require("./routes/auth");
const translationRoutes = require("./routes/translation");
const uploadRoutes = require("./routes/upload");

app.use("/api/auth", authRoutes);
app.use("/api/translate", translationRoutes);
app.use("/api/upload", uploadRoutes);

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
