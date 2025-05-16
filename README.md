Here's your updated README with the planned enhancement added:

---

# 🌐 Text Translation Web App

A full-stack MERN (MongoDB, Express.js, React, Node.js) application that allows users to translate text documents into different languages with secure login/signup, file uploads, and PDF download support. The app uses a translation API for real-time multilingual document translation.

## 🚀 Live Demo

🔗 [Live Website](https://text-translation-nu.vercel.app/login)

---

## 🛠️ Features

* 🌍 Text translation using Microsoft Translator API (via RapidAPI)
* 📄 Upload plain text files for translation
* 🔐 JWT-based login & signup authentication
* 🧾 Download translated output as PDF (html2pdf.js + Noto Sans Devanagari font)
* 🖥️ Clean and responsive frontend with React
* 📡 Backend hosted on Render, frontend hosted on Vercel
* 🧩 **Planned enhancement**: Preserving original PDF formatting post-translation using structured templates or OCR-based layout reconstruction

---

## 💻 Tech Stack

### Frontend

* React.js
* React Router
* Axios
* html2pdf.js
* Noto Sans fonts
* Toastify

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Multer (for file uploads)

---

## 🔧 Installation & Run Locally

### Backend

```bash
git clone https://github.com/JSingh1130/text-translation.git
cd text-translation/backend
npm install
npm run dev
```

Create a `.env` file in `/backend`:

```
PORT=5000  
MONGO_URI=your_mongo_uri  
JWT_SECRET=your_secret_key  
RAPIDAPI_KEY=your_api_key  
```

### Frontend

```bash
cd ../frontend
npm install
npm start
```

---

## 📡 API Routes

### Auth

* `POST /api/auth/signup`
* `POST /api/auth/login`

### Translation

* `POST /api/translate/text`
* `POST /api/translate/file`
