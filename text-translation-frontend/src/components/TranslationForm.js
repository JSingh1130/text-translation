import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'gu', name: 'Gujarati' },
];

const TranslationForm = () => {
  const [file, setFile] = useState(null);
  const [sourceLang, setSourceLang] = useState('');
  const [targetLang, setTargetLang] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const navigate = useNavigate();
  const translatedRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Ensures full reload and recheck of token
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('sourceLang', sourceLang);
    formData.append('targetLang', targetLang);

    try {
      const response = await axios.post('http://localhost:5000/api/upload/file', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const text = response.data.translatedText;
      setTranslatedText(text || '');
    } catch (error) {
      console.error('🚨 Translation error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Translation failed.');
    }
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([translatedText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'translated.txt';
    link.click();
  };

  const handleDownloadPDF = () => {
    const element = document.createElement('div');
    element.style.fontFamily = 'Noto Sans Devanagari, Arial, sans-serif';
    element.style.fontSize = '16px';
    element.style.padding = '20px';
    element.innerText = translatedText;

    html2pdf().from(element).set({
      margin: 1,
      filename: 'translated.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).save();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center justify-start p-4">
      <div className="w-full flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Translate Your File
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload File <span className="text-xs text-gray-500">(Only .pdf or .txt)</span>
            </label>
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => setFile(e.target.files[0])}
              required
              className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg shadow-sm px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source Language</label>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select source language</option>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Language</label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select target language</option>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            Translate
          </button>
        </form>

        {translatedText && (
          <div className="mt-6 bg-gray-100 border border-gray-300 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Translated Text:</h3>
            <div ref={translatedRef} className="text-gray-800 whitespace-pre-wrap font-sans">
              {translatedText}
            </div>
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleDownloadTxt}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Download .txt
              </button>
              <button
                onClick={handleDownloadPDF}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Download .pdf
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationForm;
