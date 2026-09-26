import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@ntos.dev');
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = (demEmail) => {
    setEmail(demEmail);
    setPassword('demo1234');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50 dark:bg-gray-900 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#714B67] text-white shadow-md font-extrabold text-lg">
            OG
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-display">
            Sign in to ODD GEN
          </h1>
          <p className="text-xs text-gray-500">
            Enterprise resource planning & spatial intelligence
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="o-field">
            <label>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@ntos.dev"
            />
          </div>

          <div className="o-field">
            <label>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full o-btn o-btn-primary py-2.5 text-sm font-semibold justify-center"
          >
            <span>{loading ? 'Signing in...' : 'Sign in'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Demo Quick Logins */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
          <div className="text-[11px] text-gray-400 font-semibold text-center uppercase tracking-wider">
            Quick 1-Click Demo Profiles
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setDemoAccount('admin@ntos.dev')}
              className="py-1.5 px-2 rounded-lg bg-gray-50 dark:bg-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 transition border border-gray-200 dark:border-gray-600"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('jasper@ntos.dev')}
              className="py-1.5 px-2 rounded-lg bg-gray-50 dark:bg-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 transition border border-gray-200 dark:border-gray-600"
            >
              Jasper (Sales)
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('mika@ntos.dev')}
              className="py-1.5 px-2 rounded-lg bg-gray-50 dark:bg-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 transition border border-gray-200 dark:border-gray-600"
            >
              Mika (Ops)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
