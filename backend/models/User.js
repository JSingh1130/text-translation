// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
    defaultSourceLanguage: { type: String, default: 'en' },
    defaultTargetLanguage: { type: String, default: 'es' }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
