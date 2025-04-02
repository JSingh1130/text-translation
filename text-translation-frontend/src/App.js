import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TranslationForm from './components/TranslationForm';
import Login from './components/Login';
import Signup from './components/Signup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isTokenValid } from './utils/auth';

const App = () => {
  const [tokenValid, setTokenValid] = useState(isTokenValid());

  useEffect(() => {
    const syncToken = () => setTokenValid(isTokenValid());
    window.addEventListener('storage', syncToken);
    return () => window.removeEventListener('storage', syncToken);
  }, []);

  return (
    <Router>
      <ToastContainer /> {/* ✅ Add this once here to enable toasts */}
      <Routes>
        <Route
          path="/"
          element={
            tokenValid ? (
              <TranslationForm onLogout={() => {
                localStorage.removeItem('token');
                setTokenValid(false);
              }} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={!tokenValid ? <Login onLogin={() => setTokenValid(true)} /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!tokenValid ? <Signup onLogin={() => setTokenValid(true)} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
