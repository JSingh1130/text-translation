// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

// Base route
app.get("/", (req, res) => {
    res.send("Text Translation Tool Backend is running");
});

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Translation routes
const translationRoutes = require('./routes/translation');
app.use('/api/translate', translationRoutes);


const uploadRoutes = require('./routes/upload');
app.use('/api/upload', uploadRoutes);




app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
