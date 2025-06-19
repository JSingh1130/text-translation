import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cooldown) {
      alert('Please wait a few seconds before making another request.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('sourceLang', sourceLang);
    formData.append('targetLang', targetLang);

    setLoading(true);
    setCooldown(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/upload/file`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const pdfPath = response.data.pdfUrl;
      setPdfUrl(pdfPath);
    } catch (error) {
      console.error('🚨 Translation error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Translation failed.');
    } finally {
      setLoading(false);
      setTimeout(() => setCooldown(false), 5000);
    }
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
            disabled={loading || cooldown}
            className={`w-full py-2 rounded-lg text-white transition ${
              loading || cooldown
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Translating...' : 'Translate'}
          </button>
        </form>

        {pdfUrl && (
          <div className="mt-6 bg-gray-100 border border-gray-300 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Translated PDF:</h3>
            <a
              href={`http://localhost:5000${pdfUrl}`} 
              download 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Download PDF
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationForm;
