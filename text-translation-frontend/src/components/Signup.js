import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './spinner.css'; // ✅ Import spinner styles

const Signup = ({ onLogin }) => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false); // 🌀 Add loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 🌀 Start loading

    console.log("API:", process.env.REACT_APP_API_BASE_URL);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/register`, form);
      const token = res.data?.token;

      if (token) {
        localStorage.setItem('token', token);
        toast.success('🎉 Signup successful!', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          theme: 'light',
        });

        onLogin();
        setTimeout(() => navigate('/'), 1500);
      } else {
        toast.error('Signup succeeded, but no token returned.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false); // 🌀 Stop loading
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="mb-3 input w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="mb-3 input w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="mb-3 input w-full px-4 py-2 border border-gray-300 rounded-md"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 w-full rounded hover:bg-blue-600 flex justify-center items-center"
        >
          {loading ? <div className="spinner"></div> : 'Sign Up'}
        </button>

        <p className="mt-4 text-sm text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
