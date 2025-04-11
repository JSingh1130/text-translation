import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './spinner.css'; // ✅ Import spinner

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false); // ✅ Spinner control
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start spinner

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, form);
      const token = res.data?.token;

      if (token) {
        localStorage.setItem('token', token);
        toast.success('🎉 Login successful!', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
        });
        onLogin();
        setTimeout(() => navigate('/'), 1500);
      } else {
        toast.error('Invalid response from server.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false); // Stop spinner
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      {/* ✅ Modern Clean Intro Section */}
      <div className="w-full max-w-3xl mb-8 p-6 rounded-lg bg-white shadow-md border border-gray-200 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-3">
          🌐 Welcome to TextFlow Translator
        </h1>
        <p className="text-gray-600 text-base md:text-lg leading-relaxed">
        Translate your documents and messages across 100+ languages — fast, accurate, and easy to use.
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Log In</h2>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex justify-center items-center"
          >
            {loading ? <div className="spinner"></div> : 'Log In'}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
