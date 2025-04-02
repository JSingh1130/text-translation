import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = ({ onLogin }) => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      const token = res.data?.token;

      if (token) {
        localStorage.setItem('token', token);
        toast.success('🎉 Signup successful!', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          theme: 'light',
        });

        onLogin(); // Notify App.js
        setTimeout(() => navigate('/'), 1500); // Give time for toast to show
      } else {
        toast.error('Signup succeeded, but no token returned.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      toast.error(err.response?.data?.message || 'Signup failed');
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

        <button className="bg-blue-500 text-white py-2 w-full rounded hover:bg-blue-600">
          Sign Up
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
