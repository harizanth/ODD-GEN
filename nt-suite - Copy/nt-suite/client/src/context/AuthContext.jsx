import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('ntos_user');
    if (raw && api.getToken()) {
      try { setUser(JSON.parse(raw)); } catch { /* ignore */ }
    }
    setReady(true);
  }, []);

  async function login(email, password) {
    const data = await api.post('/auth/login', { email, password });
    api.setToken(data.token);
    localStorage.setItem('ntos_user', JSON.stringify(data.user));
    setUser(data.user);
  }

  async function register(name, email, password) {
    const data = await api.post('/auth/register', { name, email, password });
    api.setToken(data.token);
    localStorage.setItem('ntos_user', JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    api.clearToken();
    localStorage.removeItem('ntos_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
