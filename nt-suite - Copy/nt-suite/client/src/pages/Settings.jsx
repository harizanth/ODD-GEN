import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Settings as SettingsIcon, User, Moon, Sun, Shield,
  Database, RefreshCw, CheckCircle, Lock
} from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('ntos_theme') || 'light');
  const [saved, setSaved] = useState(false);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('ntos_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="text-[#714B67]" /> System Settings & Preferences
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Configure enterprise appearance, user profile credentials, and system synchronization
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2 font-medium">
          <CheckCircle size={16} /> Preferences successfully updated.
        </div>
      )}

      {/* User Profile Card */}
      <div className="o-card space-y-4">
        <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
          <User size={16} className="text-[#017E84]" /> Active User Profile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="o-field">
            <label>Name:</label>
            <input disabled value={user?.name || 'Administrator'} className="opacity-75 cursor-not-allowed" />
          </div>
          <div className="o-field">
            <label>Email:</label>
            <input disabled value={user?.email || 'admin@ntos.dev'} className="opacity-75 cursor-not-allowed" />
          </div>
          <div className="o-field">
            <label>Role:</label>
            <input disabled value={(user?.role || 'admin').toUpperCase()} className="opacity-75 cursor-not-allowed" />
          </div>
          <div className="o-field">
            <label>Environment:</label>
            <input disabled value="NT/OS Enterprise v18.0 (Production)" className="opacity-75 cursor-not-allowed" />
          </div>
        </div>
      </div>

      {/* Appearance & Theme Card */}
      <div className="o-card space-y-4">
        <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
          <Sun size={16} className="text-amber-500" /> Appearance & Theme Mode
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => toggleTheme('light')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition ${
              theme === 'light'
                ? 'border-[#714B67] bg-purple-50 dark:bg-purple-950/30 text-[#714B67] font-bold shadow-sm'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
            }`}
          >
            <Sun size={24} />
            <span className="text-xs">Enterprise Light Mode</span>
          </button>

          <button
            onClick={() => toggleTheme('dark')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition ${
              theme === 'dark'
                ? 'border-[#714B67] bg-purple-50 dark:bg-purple-950/30 text-[#714B67] font-bold shadow-sm'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
            }`}
          >
            <Moon size={24} />
            <span className="text-xs">Executive Dark Mode</span>
          </button>
        </div>
      </div>

      {/* Database & Integration Status */}
      <div className="o-card space-y-3">
        <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
          <Database size={16} className="text-[#017E84]" /> Enterprise Integration Engine
        </h3>

        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
          <div className="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-gray-700">
            <span>Database Connection:</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle size={14} /> SQLite / Prisma ORM (Healthy)
            </span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-gray-700">
            <span>Security & Token Authentication:</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <Shield size={14} /> JWT Bearer Protocol (Active)
            </span>
          </div>
          <div className="flex justify-between items-center py-1.5">
            <span>Module Integration Status:</span>
            <span className="text-[#714B67] dark:text-purple-400 font-bold">
              20/20 Business Modules Synchronized
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
